/**
 * Assembling a 2.0 report from the insight library.
 *
 * Pure and deterministic. The same dog always gets the same report; nothing
 * here reads the clock or the network.
 */

import { calculateDogAge } from '../calculate'
import type { DogAgeResult } from '../types'
import { buildCalendar } from './calendar'
import { buildContext, profileSignature, TOPIC_LABELS, TOPIC_ORDER } from './context'
import type { InsightContext } from './context'
import { INSIGHT_LIBRARY } from './insights'
import { buildDeepGear } from './products'
import { SOURCES } from './sources'
import type { SourceId } from './sources'
import { composeStory } from './story'
import type {
  DeepProfile,
  DeepReport,
  DeepResult,
  ReportInsight,
  ReportSource,
  Topic,
  TopicGroup,
} from './types'

/** How many ranked moves lead the report. The rest fall through to their topic panels. */
const MAX_MOVES = 6
const MAX_WINS = 6
const MAX_QUESTIONS = 8

/**
 * The optional questions 2.0 asks, for the completeness count. The 1.0 ten,
 * plus smoke, plus everything new.
 */
export const DEEP_QUESTION_KEYS: readonly (keyof DeepProfile)[] = [
  'breedName',
  'weightKg',
  'sex',
  'neuterStatus',
  'bodyConditionScore',
  'activityLevel',
  'dietQuality',
  'dentalCare',
  'vetCare',
  'environment',
  'secondhandSmoke',
  'origin',
  'joinedAt',
  'foodType',
  'grainFree',
  'mealsPerDay',
  'treatShare',
  'waterSource',
  'raisedBowls',
  'exerciseTypes',
  'enrichment',
  'sleep',
  'timeAlone',
  'otherDogs',
  'children',
  'anxiety',
  'training',
  'vaccination',
  'parasitePrevention',
  'microchip',
  'knownConditions',
  'recentSigns',
  'weightTrend',
  'mobility',
  'climate',
  'lawnChemicals',
  'carTravel',
  'supplements',
  'readiness',
  'knowsEmergencyVet',
]

export const DEEP_QUESTION_TOTAL = DEEP_QUESTION_KEYS.length

function answered(p: DeepProfile): number {
  let count = 0
  for (const key of DEEP_QUESTION_KEYS) {
    if (key === 'breedName') {
      if (p.breedName !== undefined || (p.breedComposition !== undefined && p.breedComposition.length > 0)) count += 1
      continue
    }
    if (p[key] !== undefined) count += 1
  }
  return count
}

function render(c: InsightContext): ReportInsight[] {
  const out: ReportInsight[] = []
  for (const spec of INSIGHT_LIBRARY) {
    if (!spec.when(c)) continue
    const priority = typeof spec.priority === 'function' ? spec.priority(c) : spec.priority
    const rec = spec.recId ? c.recs.get(spec.recId) : undefined
    const how = spec.how?.(c)
    out.push({
      id: spec.id,
      kind: spec.kind,
      topic: spec.topic,
      title: spec.title(c),
      why: spec.why(c),
      ...(how ? { how } : {}),
      evidence: spec.evidence,
      sources: spec.sources,
      priority,
      ...(rec && rec.potentialYears > 0 ? { potentialYears: rec.potentialYears } : {}),
    })
  }
  return out
}

const byPriority = (a: ReportInsight, b: ReportInsight) => b.priority - a.priority

/** Moves are ranked by priority plus the years the lifespan model gives back. */
function moveScore(i: ReportInsight): number {
  return i.priority + (i.potentialYears ?? 0) * 20
}

function groupByTopic(insights: readonly ReportInsight[]): TopicGroup[] {
  const groups = new Map<Topic, ReportInsight[]>()
  for (const insight of insights) {
    const list = groups.get(insight.topic) ?? []
    list.push(insight)
    groups.set(insight.topic, list)
  }
  return TOPIC_ORDER.filter((topic) => groups.has(topic)).map((topic) => ({
    topic,
    label: TOPIC_LABELS[topic],
    insights: [...(groups.get(topic) ?? [])].sort(byPriority),
  }))
}

function collectSources(lists: readonly (readonly { sources: readonly SourceId[] }[])[]): ReportSource[] {
  const seen = new Set<SourceId>()
  const out: ReportSource[] = []
  for (const list of lists) {
    for (const item of list) {
      for (const id of item.sources) {
        if (seen.has(id)) continue
        seen.add(id)
        const entry = SOURCES[id]
        out.push({ id, short: entry.short, citation: entry.citation, ...('url' in entry && entry.url ? { url: entry.url } : {}) })
      }
    }
  }
  return out
}

export function composeDeepReport(profile: DeepProfile, base: DogAgeResult): DeepReport {
  const c = buildContext(profile, base)
  const fired = render(c)

  const movesAll = fired.filter((i) => i.kind === 'move').sort((a, b) => moveScore(b) - moveScore(a))
  const moves = movesAll.slice(0, MAX_MOVES)
  const moveOverflow = movesAll.slice(MAX_MOVES)

  const winsAll = fired.filter((i) => i.kind === 'win').sort(byPriority)
  const wins = winsAll.slice(0, MAX_WINS)
  const winOverflow = winsAll.slice(MAX_WINS)

  const flags = fired.filter((i) => i.kind === 'flag').sort(byPriority)
  const questionsAll = fired.filter((i) => i.kind === 'question').sort(byPriority)
  const vetQuestions = questionsAll.slice(0, MAX_QUESTIONS)
  const questionOverflow = questionsAll.slice(MAX_QUESTIONS)
  const notes = fired.filter((i) => i.kind === 'note')

  const topics = groupByTopic([...notes, ...moveOverflow, ...winOverflow, ...questionOverflow])
  const calendar = buildCalendar(c)
  const gear = buildDeepGear(c, base.productSuggestions)
  const story = composeStory(c, moves, wins)

  const sources = collectSources([
    moves,
    flags,
    wins,
    vetQuestions,
    topics.flatMap((t) => t.insights),
    calendar,
  ])

  return {
    story,
    moves,
    wins,
    flags,
    topics,
    calendar,
    vetQuestions,
    gear,
    sources,
    completeness: { answered: answered(profile), total: DEEP_QUESTION_TOTAL },
    signature: profileSignature(profile),
    insightCount: fired.length,
    stage: c.stage,
  }
}

/** One dog in, the 1.0 result and the 2.0 report out. */
export function calculateDeep(profile: DeepProfile): DeepResult {
  const base = calculateDogAge(profile)
  return { base, report: composeDeepReport(profile, base) }
}
