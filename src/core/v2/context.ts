/**
 * The context every 2.0 insight is evaluated against, plus the deterministic
 * phrase picker that keeps a thousand reports from reading alike.
 */

import { voiceFor } from '../narrative'
import type { Voice } from '../narrative'
import type { Confidence, DogAgeResult, LifeStageId, Recommendation, SizeClass } from '../types'
import type { SourceId } from './sources'
import type {
  DeepProfile,
  ExerciseType,
  InsightKind,
  KnownCondition,
  RecentSign,
  Supplement,
  Topic,
} from './types'

export interface InsightContext {
  p: DeepProfile
  r: DogAgeResult
  v: Voice
  stage: LifeStageId
  size: SizeClass
  ageYears: number
  /** Large or giant. */
  big: boolean
  /** Toy or small. */
  tiny: boolean
  brachy: boolean
  /** Puppy or young adult. */
  young: boolean
  /** Senior or geriatric. */
  older: boolean
  breedName: string | undefined
  /** "the Labrador Retriever" / "this mix" / "this breed", for use as a sentence subject. */
  theBreed: string
  /** The same, sentence-initial. */
  TheBreed: string
  /** Condition ids matched from the breed's documented predispositions. */
  cond: ReadonlySet<string>
  /** The subset of those flagged as relevant around this age. */
  now: ReadonlySet<string>
  /** 1.0 recommendations by id, with their priced years. */
  recs: ReadonlyMap<string, Recommendation>
  has: (c: KnownCondition) => boolean
  sign: (s: RecentSign) => boolean
  ex: (e: ExerciseType) => boolean
  supp: (s: Supplement) => boolean
  /** "is"/"are" and "has"/"have" for a pronoun subject. Name subjects are always singular. */
  be: string
  have: string
  /**
   * Pick one of several phrasings, deterministically for this dog and this
   * key. The same dog always gets the same words; a different dog, different
   * ones. Keyed per call so changing one answer never reshuffles the rest.
   */
  pick: <T>(key: string, ...variants: readonly [T, ...T[]]) => T
}

export interface InsightSpec {
  id: string
  kind: InsightKind
  topic: Topic
  evidence: Confidence
  sources: readonly SourceId[]
  /** 0–100. A function when the urgency depends on the dog. */
  priority: number | ((c: InsightContext) => number)
  when: (c: InsightContext) => boolean
  title: (c: InsightContext) => string
  why: (c: InsightContext) => string
  how?: (c: InsightContext) => string
  /** Ties a move to the 1.0 recommendation that prices it in years. */
  recId?: string
}

/** FNV-1a, 32-bit. Small, fast, and plenty for seeding phrase choices. */
export function fnv1a(text: string): number {
  let hash = 0x811c9dc5
  for (let i = 0; i < text.length; i += 1) {
    hash ^= text.charCodeAt(i)
    hash = Math.imul(hash, 0x01000193) >>> 0
  }
  return hash >>> 0
}

/**
 * The seed for a dog: the things that make them *them*. Age is rounded to a
 * tenth so a birthday-mode profile doesn't reseed itself at midnight.
 */
export function profileSeed(p: DeepProfile): string {
  const breed =
    p.breedComposition && p.breedComposition.length > 0
      ? p.breedComposition.map((c) => `${c.breedName}:${c.fraction}`).join('+')
      : (p.breedName ?? '')
  return [
    (p.name ?? '').trim().toLowerCase(),
    Math.round(p.ageYears * 10) / 10,
    breed.toLowerCase(),
    p.sex ?? '',
    p.origin ?? '',
    p.joinedAt ?? '',
  ].join('|')
}

/** The report's reference number: eight hex characters of the seed's hash. */
export function profileSignature(p: DeepProfile): string {
  return fnv1a(profileSeed(p)).toString(16).padStart(8, '0').toUpperCase()
}

export function buildContext(p: DeepProfile, r: DogAgeResult): InsightContext {
  const v = voiceFor(p.name, p.sex)
  const stage = r.lifeStage.stage
  const size = r.sizeClass
  const cond = new Set<string>()
  const now = new Set<string>()
  for (const concern of r.breedHealth?.concerns ?? []) {
    if (!concern.condition) continue
    cond.add(concern.condition.id)
    if (concern.relevantNow) now.add(concern.condition.id)
  }
  const recs = new Map(r.recommendations.map((rec) => [rec.id, rec]))
  const seed = profileSeed(p)
  const they = v.subj === 'they'
  const breedName = r.breed?.name
  const theBreed = breedName === undefined ? 'this breed' : breedName.includes('%') ? 'this mix' : `the ${breedName}`

  const knownConditions = new Set(p.knownConditions ?? [])
  const recentSigns = new Set(p.recentSigns ?? [])
  const exercise = new Set(p.exerciseTypes ?? [])
  const supplements = new Set(p.supplements ?? [])

  return {
    p,
    r,
    v,
    stage,
    size,
    ageYears: r.profile.ageYears,
    big: size === 'large' || size === 'giant',
    tiny: size === 'toy' || size === 'small',
    brachy: r.breed?.brachycephalic === true,
    young: stage === 'puppy' || stage === 'young-adult',
    older: stage === 'senior' || stage === 'geriatric',
    breedName,
    theBreed,
    TheBreed: theBreed.charAt(0).toUpperCase() + theBreed.slice(1),
    cond,
    now,
    recs,
    has: (c) => knownConditions.has(c),
    sign: (s) => recentSigns.has(s),
    ex: (e) => exercise.has(e),
    supp: (s) => supplements.has(s),
    be: they ? 'are' : 'is',
    have: they ? 'have' : 'has',
    pick: (key, ...variants) => {
      const index = fnv1a(`${seed}#${key}`) % variants.length
      return variants[index] ?? variants[0]
    },
  }
}

/** Human-readable topic names, in display order. */
export const TOPIC_LABELS: Readonly<Record<Topic, string>> = {
  stage: 'This life stage',
  story: 'Their story',
  weight: 'Weight & body',
  food: 'Food',
  water: 'Water',
  dental: 'Teeth & gums',
  exercise: 'Exercise & movement',
  mind: 'Mind & sleep',
  social: 'Company & time alone',
  behaviour: 'Behaviour & training',
  prevention: 'Prevention & vet care',
  breed: 'Breed-specific',
  conditions: 'Known conditions',
  signs: 'Recent changes',
  home: 'Home & environment',
  safety: 'Safety',
  readiness: 'Being ready',
}

export const TOPIC_ORDER: readonly Topic[] = [
  'stage',
  'story',
  'weight',
  'food',
  'water',
  'dental',
  'exercise',
  'mind',
  'social',
  'behaviour',
  'prevention',
  'breed',
  'conditions',
  'signs',
  'home',
  'safety',
  'readiness',
]
