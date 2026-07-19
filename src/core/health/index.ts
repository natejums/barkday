/**
 * Turning a breed's documented predispositions into a health picture for one dog.
 *
 * The breed data carries a hand-written list of risks per breed. This module
 * links each of those to the condition catalogue where it can, so a plain
 * phrase like "bloat (gastric torsion)" gains what an owner actually needs —
 * the signs to watch for, how urgent it is, and what helps — then organises the
 * result by body system, flags what matters around the dog's current age, and
 * adds the cross-references that depend on the profile rather than the breed
 * alone (feeding for a deep-chested dog, heat for a flat-faced one).
 *
 * Two rules hold throughout. The breed's own wording is never rewritten — a
 * matched entry enriches it, it does not replace it. And nothing here is a
 * prediction about the individual dog: these are predispositions to be aware
 * of, framed as "watch for this and raise it with your vet".
 */

import type {
  Breed,
  BreedHealthReport,
  ConditionInfo,
  DogProfile,
  HealthCallout,
  HealthConcern,
  HealthSystemGroup,
  LifeStageId,
  OnsetStage,
  SizeClass,
} from '../types'
import { BODY_SYSTEM_LABELS, BODY_SYSTEM_ORDER, CONDITION_CATALOG } from './catalog'
import { EARLY_NEUTER_MONTHS } from '../constants'

export { CONDITION_CATALOG, BODY_SYSTEM_LABELS, BODY_SYSTEM_ORDER } from './catalog'

/** Lower-case and strip accents, so "Legg-Calvé" matches "legg-calve". */
function normalise(value: string): string {
  return value
    .toLowerCase()
    .normalize('NFD')
    // Drop combining accents so "Legg-Calvé" matches "legg-calve".
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/\s+/g, ' ')
    .trim()
}

/**
 * Link one free-text risk to a catalogue entry, or nothing.
 *
 * Within a tier the longest matching alias wins, so a specific condition beats a
 * general one sharing a word — "hip dysplasia" over a hypothetical bare "hip",
 * "dilated cardiomyopathy" over "heat intolerance" in a phrase mentioning both.
 *
 * Catch-all entries ("heart disease", "inherited eye conditions") sit in a
 * second tier that is only consulted when nothing specific matched. Without
 * that, a long vague alias could out-measure a short precise one — "eye
 * conditions" beating "entropion" — and bury the useful answer.
 */
export function matchCondition(risk: string): ConditionInfo | undefined {
  const hay = normalise(risk)

  let specific: ConditionInfo | undefined
  let specificLen = 0
  let generic: ConditionInfo | undefined
  let genericLen = 0

  for (const condition of CONDITION_CATALOG) {
    for (const alias of condition.aliases) {
      const needle = normalise(alias)
      if (!hay.includes(needle)) continue
      if (condition.generic) {
        if (needle.length > genericLen) {
          generic = condition
          genericLen = needle.length
        }
      } else if (needle.length > specificLen) {
        specific = condition
        specificLen = needle.length
      }
    }
  }

  return specific ?? generic
}

const SEVERITY_RANK = { emergency: 0, serious: 1, monitor: 2 } as const

/** Dog life stages placed on a line; geriatric shares the senior slot for onset maths. */
const STAGE_INDEX: Readonly<Record<LifeStageId, number>> = {
  puppy: 0,
  'young-adult': 1,
  'mature-adult': 2,
  senior: 3,
  geriatric: 3,
}

const ONSET_INDEX: Readonly<Record<Exclude<OnsetStage, 'any'>, number>> = {
  puppy: 0,
  'young-adult': 1,
  'mature-adult': 2,
  senior: 3,
}

/**
 * Whether a concern is worth flagging around the dog's current age.
 *
 * Emergencies (bloat) and conditions that aren't age-linked (a clotting
 * disorder, anaesthetic sensitivity) are always relevant. Everything else is
 * relevant when the dog is within one life stage of the condition's typical
 * onset — the "coming up or just arrived" window — which keeps a senior's list
 * about senior things rather than every developmental problem it outgrew.
 */
function isRelevantNow(condition: ConditionInfo | undefined, dogStageIndex: number): boolean {
  if (!condition) return false
  if (condition.severity === 'emergency') return true
  if (condition.typicalOnset === 'any') return true
  return Math.abs(ONSET_INDEX[condition.typicalOnset] - dogStageIndex) <= 1
}

function toConcern(label: string, dogStageIndex: number): HealthConcern {
  const condition = matchCondition(label)
  return {
    label,
    ...(condition ? { condition } : {}),
    system: condition?.system ?? 'other',
    severity: condition?.severity ?? 'monitor',
    relevantNow: isRelevantNow(condition, dogStageIndex),
  }
}

function bySeverityThenName(a: HealthConcern, b: HealthConcern): number {
  return SEVERITY_RANK[a.severity] - SEVERITY_RANK[b.severity] || a.label.localeCompare(b.label)
}

/**
 * Profile-aware callouts — the advice that depends on this dog, not just its breed.
 *
 * These deliberately overlap with nothing the breed list or the recommendations
 * already say; each one is triggered by a matched condition plus a fact about
 * the dog or its breed, and turns it into something to do. (The brachycephalic
 * airway callout is the single home for that advice now — it used to be
 * duplicated as a recommendation.)
 */
function buildCallouts(
  breed: Breed,
  sizeClass: SizeClass,
  profile: DogProfile,
  matchedIds: ReadonlySet<string>,
): HealthCallout[] {
  const callouts: HealthCallout[] = []

  if (matchedIds.has('gdv-bloat')) {
    callouts.push({
      id: 'bloat-feeding',
      title: 'Guard against bloat at mealtimes',
      detail:
        'This is a deep-chested, bloat-prone breed, and bloat kills within hours. Feed two or three smaller meals rather than one big one, avoid hard exercise for an hour either side of eating, and learn the signs — a swollen hard belly and unproductive retching mean go to a vet immediately. Ask whether a preventive gastropexy is worth it.',
      severity: 'emergency',
    })
  }

  if (breed.brachycephalic) {
    callouts.push({
      id: 'brachycephalic-airway',
      title: 'Respect the flat-faced airway',
      detail:
        'Walk in the cool part of the day, use a harness rather than a collar, keep them lean, and never leave them anywhere warm — heat is genuinely dangerous for a shortened airway. Loud breathing, snoring and tiring quickly are signs of obstruction worth raising with a vet, not just breed character.',
      severity: 'serious',
    })
  }

  if (matchedIds.has('anaesthetic-sensitivity')) {
    callouts.push({
      id: 'anaesthetic-sensitivity',
      title: 'Flag the anaesthetic sensitivity before any procedure',
      detail:
        'Lean, sighthound-type breeds process some anaesthetics slowly. Make sure any vet knows the breed before a dental or surgery so they can pick suitable drugs and protocols — it makes anaesthesia safe, and is no reason to skip needed treatment.',
      severity: 'serious',
    })
  }

  if (
    (sizeClass === 'large' || sizeClass === 'giant') &&
    profile.neuterStatus === 'neutered' &&
    profile.neuterAgeMonths !== undefined &&
    profile.neuterAgeMonths < EARLY_NEUTER_MONTHS
  ) {
    callouts.push({
      id: 'early-neuter-joints',
      title: 'Keep an eye on the joints',
      detail:
        'This is a large breed neutered before a year old, which Hart et al. (2020) link to a higher rate of joint disorders and some cancers in bigger dogs. It is done and not a mistake — just a reason to keep them lean, keep exercise low-impact while growing, and mention any early lameness to your vet.',
      severity: 'monitor',
    })
  }

  return callouts
}

/**
 * The whole breed-health picture for one dog.
 *
 * Pure and clock-free like the rest of the engine: age enters as a resolved
 * life stage, everything else comes from the breed and profile passed in.
 */
export function buildBreedHealth(
  breed: Breed,
  stage: LifeStageId,
  sizeClass: SizeClass,
  profile: DogProfile,
): BreedHealthReport {
  const dogStageIndex = STAGE_INDEX[stage]
  const risks = breed.healthRisks ?? []

  const concerns = risks.map((risk) => toConcern(risk, dogStageIndex))

  const matchedIds = new Set<string>()
  for (const concern of concerns) {
    if (concern.condition) matchedIds.add(concern.condition.id)
  }

  const bySystem: HealthSystemGroup[] = BODY_SYSTEM_ORDER.map((system) => ({
    system,
    label: BODY_SYSTEM_LABELS[system],
    concerns: concerns.filter((c) => c.system === system).sort(bySeverityThenName),
  })).filter((group) => group.concerns.length > 0)

  const priorityNow = concerns.filter((c) => c.relevantNow).sort(bySeverityThenName)

  const callouts = buildCallouts(breed, sizeClass, profile, matchedIds)

  return {
    breedName: breed.name,
    concerns,
    bySystem,
    priorityNow,
    callouts,
    screeningMatters: stage === 'senior' || stage === 'geriatric',
  }
}
