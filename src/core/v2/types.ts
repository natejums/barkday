/**
 * Barkday 2.0: the in-depth profile and the report it produces.
 *
 * 2.0 asks a great deal more about the dog — where they came from, what and
 * how they eat and drink, how they spend their days, who they live with, what
 * is already known about their health — and turns it into a report that is
 * long on specifics and short on reading. Almost none of it changes the
 * headline number, and that is deliberate: the 1.0 engine already models every
 * factor with a defensible published effect on lifespan, and the honest thing
 * to do with the rest is change the *advice*, not the arithmetic. Exactly one
 * 2.0 question reaches the number (marked fear; see `DogProfile.anxiety`).
 */

import type {
  Anxiety,
  Confidence,
  DogAgeResult,
  DogProfile,
  LifeStageId,
  ProductSuggestion,
} from '../types'
import type { SourceId } from './sources'

export type { Anxiety }

/** How the dog came into the household. */
export type DogOrigin =
  | 'breeder'
  | 'shelter-rescue'
  | 'rehomed'
  | 'born-at-home'
  | 'found-stray'
  | 'other'

/** How old the dog was when they joined the household. */
export type JoinedAt = 'under-6-months' | '6-12-months' | 'adult' | 'senior'

export type FoodType =
  | 'dry'
  | 'wet'
  | 'mixed'
  | 'fresh-commercial'
  | 'home-cooked'
  | 'raw'
  | 'table-food'

export type GrainFree = 'yes' | 'no' | 'not-sure'
export type MealsPerDay = 'free-fed' | 'one' | 'two' | 'three-plus'
export type TreatShare = 'rarely' | 'some' | 'a-lot'
export type WaterSource = 'bowl-refreshed-daily' | 'bowl-topped-up' | 'fountain' | 'outdoor-sources'
export type ExerciseType = 'leash-walks' | 'off-leash' | 'fetch' | 'swimming' | 'dog-sports' | 'hiking'
export type Enrichment = 'rarely' | 'sometimes' | 'daily'
export type SleepQuality = 'sound' | 'restless' | 'not-sure'
export type TimeAlone = 'under-4h' | '4-8h' | 'over-8h'
export type TrainingApproach = 'reward-based' | 'mixed' | 'correction-based' | 'none'
export type VaccinationStatus = 'up-to-date' | 'overdue' | 'not-sure'
export type ParasitePrevention = 'year-round' | 'seasonal' | 'none' | 'not-sure'
export type MicrochipStatus = 'registered' | 'chipped-unsure' | 'none' | 'not-sure'
export type WeightTrend = 'gaining' | 'stable' | 'losing' | 'not-sure'
export type Mobility = 'fine' | 'stiff-after-rest' | 'avoids-stairs' | 'limping'
export type Climate = 'hot' | 'cold' | 'temperate' | 'both'
export type CarTravel = 'restrained' | 'loose' | 'rarely'
export type Supplement = 'omega-3' | 'joint' | 'probiotic' | 'multivitamin' | 'other'
export type Readiness = 'insured' | 'savings' | 'both' | 'neither'

/** Conditions an owner may already know their dog has. Diagnoses, not guesses. */
export type KnownCondition =
  | 'arthritis'
  | 'heart'
  | 'allergies'
  | 'dental'
  | 'overweight'
  | 'diabetes'
  | 'epilepsy'
  | 'thyroid'
  | 'kidney'
  | 'cancer'
  | 'anxiety'
  | 'digestive'
  | 'eyes'
  | 'back'
  | 'other'

/** Changes an owner may have noticed recently. Each one earns a vet question. */
export type RecentSign =
  | 'drinking-more'
  | 'new-lump'
  | 'night-restless'
  | 'coughing'
  | 'accidents'
  | 'stiffness'
  | 'weight-change'
  | 'bad-breath'
  | 'appetite-change'
  | 'confusion'
  | 'scratching'
  | 'tiring'

/**
 * Everything 2.0 knows about one dog. Extends the 1.0 profile, so a
 * `DeepProfile` can be handed straight to `calculateDogAge`.
 *
 * Every field is optional. Nothing here is required to produce a report, and
 * every answer that is given makes the report more specific to this dog.
 */
export interface DeepProfile extends DogProfile {
  origin?: DogOrigin
  joinedAt?: JoinedAt
  /** Years the dog has lived with this household, when known. */
  yearsTogether?: number
  /** Days until the next birthday, when the birthday is known. Resolved by the caller. */
  daysUntilBirthday?: number
  foodType?: FoodType
  grainFree?: GrainFree
  mealsPerDay?: MealsPerDay
  treatShare?: TreatShare
  waterSource?: WaterSource
  raisedBowls?: boolean
  exerciseTypes?: readonly ExerciseType[]
  enrichment?: Enrichment
  sleep?: SleepQuality
  timeAlone?: TimeAlone
  otherDogs?: boolean
  children?: boolean
  training?: TrainingApproach
  vaccination?: VaccinationStatus
  parasitePrevention?: ParasitePrevention
  microchip?: MicrochipStatus
  knownConditions?: readonly KnownCondition[]
  recentSigns?: readonly RecentSign[]
  weightTrend?: WeightTrend
  mobility?: Mobility
  climate?: Climate
  /** Whether the garden or lawn is treated with herbicides or pesticides. */
  lawnChemicals?: boolean
  carTravel?: CarTravel
  supplements?: readonly Supplement[]
  readiness?: Readiness
  knowsEmergencyVet?: boolean
}

/**
 * What kind of thing an insight is:
 *  - `move`     something to do, ranked by impact
 *  - `win`      something already going right, worth saying so
 *  - `flag`     something to know about now — an emergency sign, a real risk
 *  - `question` something to raise at the next vet visit
 *  - `note`     context that explains a choice, shown in the topic panels
 */
export type InsightKind = 'move' | 'win' | 'flag' | 'question' | 'note'

export type Topic =
  | 'weight'
  | 'food'
  | 'water'
  | 'dental'
  | 'exercise'
  | 'mind'
  | 'social'
  | 'behaviour'
  | 'prevention'
  | 'home'
  | 'safety'
  | 'stage'
  | 'breed'
  | 'story'
  | 'readiness'
  | 'signs'
  | 'conditions'

/** One piece of the report, fully rendered for this dog. */
export interface ReportInsight {
  id: string
  kind: InsightKind
  topic: Topic
  title: string
  /** The evidence, in a sentence or two. Always cites something in `sources`. */
  why: string
  /** The concrete thing to do. Moves always have one. */
  how?: string
  evidence: Confidence
  sources: readonly SourceId[]
  /** 0–100. Used for ordering within a kind. */
  priority: number
  /** Years the 1.0 lifespan model gives back for this move, when it is priced. */
  potentialYears?: number
}

export type CalendarWhen =
  | 'this-week'
  | 'this-month'
  | 'next-3-months'
  | 'next-6-months'
  | 'this-year'
  | 'monthly'
  | 'every-6-months'

export interface CalendarItem {
  id: string
  when: CalendarWhen
  title: string
  detail: string
  sources: readonly SourceId[]
}

export interface TopicGroup {
  topic: Topic
  label: string
  insights: readonly ReportInsight[]
}

export interface ReportSource {
  id: SourceId
  /** Short label used inline, e.g. "Salt et al. 2019". */
  short: string
  citation: string
  url?: string
}

/**
 * The 2.0 report. Everything is composed offline from the structured result —
 * no language model, nothing sent anywhere — so it is private, free, and
 * cannot invent a finding. Every sentence traces to an input and a source.
 */
export interface DeepReport {
  /** The opening note: a few short paragraphs about this dog, in this household. */
  story: readonly string[]
  /** The ranked proactive moves. Priced in years where the lifespan model can price them. */
  moves: readonly ReportInsight[]
  /** What is already going right. */
  wins: readonly ReportInsight[]
  /** Things to know about now. */
  flags: readonly ReportInsight[]
  /** Everything else, grouped by topic. */
  topics: readonly TopicGroup[]
  /** The next twelve months, as a proactive plan. */
  calendar: readonly CalendarItem[]
  /** Questions to bring to the next vet visit. */
  vetQuestions: readonly ReportInsight[]
  /** Brand-free gear tied to the findings, 1.0's list plus 2.0's additions. */
  gear: readonly ProductSuggestion[]
  /** Every source this particular report drew on, in order of first use. */
  sources: readonly ReportSource[]
  /** How many of the optional questions were answered. */
  completeness: { answered: number; total: number }
  /** A short, stable fingerprint of the profile — the report's reference number. */
  signature: string
  /** How many distinct insights fired for this dog. */
  insightCount: number
  /** The dog's life stage, repeated here so the report stands alone. */
  stage: LifeStageId
}

export interface DeepResult {
  base: DogAgeResult
  report: DeepReport
}
