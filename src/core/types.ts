/**
 * The domain vocabulary. Everything the engine takes in and hands back.
 */

/**
 * Adult-bodyweight size bands from Montoya et al. (2023), the largest life
 * expectancy study to date (n ≈ 13.3M dogs).
 *
 * Worth knowing: the size/lifespan relationship is not monotonic at the small
 * end — small dogs actually outlive toy dogs by a couple of months.
 */
export type SizeClass = 'toy' | 'small' | 'medium' | 'large' | 'giant'

/**
 * The published human-age conversion charts use four coarser weight bands than
 * the five-way size classification above, and they don't separate toy from
 * small at all. Rather than invent a toy column, the chart model keeps the
 * bands its source data actually used.
 */
export type ChartBand = 'small' | 'medium' | 'large' | 'giant'

export type Sex = 'male' | 'female' | 'unknown'
export type NeuterStatus = 'intact' | 'neutered' | 'unknown'
export type ActivityLevel = 'sedentary' | 'lightly-active' | 'active' | 'very-active'
export type DietQuality = 'poor' | 'average' | 'good' | 'excellent'
export type DentalCare = 'none' | 'occasional' | 'regular' | 'professional'
export type VetCare = 'none' | 'reactive' | 'annual' | 'proactive'
export type LivingEnvironment = 'indoor' | 'mixed' | 'outdoor'

/** How much weight to put on a given number. Surfaced in the UI, not hidden. */
export type Confidence = 'high' | 'moderate' | 'low'

export interface Breed {
  name: string
  aliases?: readonly string[]
  /** AKC-style grouping, plus "Mixed & Designer" for crosses. */
  group: string
  sizeClass: SizeClass
  /** Typical healthy adult weight range in kg, spanning both sexes. */
  weightKg: readonly [number, number]
  /** Population lifespan range in years — not a prediction for one dog. */
  lifespanYears: readonly [number, number]
  brachycephalic?: boolean
  healthRisks?: readonly string[]
  notes?: string
}

/**
 * Everything the engine knows about one dog.
 *
 * Only `ageYears` is required. Every other field narrows the estimate; leaving
 * one out falls back to a population default rather than failing.
 */
export interface DogProfile {
  name?: string
  /** Chronological age in years. Callers resolve dates before calling in. */
  ageYears: number
  /** Canonical breed name or a known alias. Omit for unknown/mixed. */
  breedName?: string
  /** Current weight in kg. Refines size class when the breed is unknown. */
  weightKg?: number
  sex?: Sex
  neuterStatus?: NeuterStatus
  /** Body condition on the 9-point WSAVA scale, where 4–5 is ideal. */
  bodyConditionScore?: number
  activityLevel?: ActivityLevel
  dietQuality?: DietQuality
  dentalCare?: DentalCare
  vetCare?: VetCare
  environment?: LivingEnvironment
  secondhandSmoke?: boolean
}

/** One way of answering "how old is that in human years?". */
export interface ModelEstimate {
  id: string
  label: string
  /** Null when the model is outside the range it can honestly speak to. */
  humanYears: number | null
  /** Why this model says what it says, and where it is weak. */
  description: string
  confidence: Confidence
  /** True for the model driving the headline number. */
  headline?: boolean
}

/** A single named influence on expected lifespan. */
export interface LifespanFactor {
  id: string
  label: string
  /** Signed years, before saturation. Positive extends life. */
  deltaYears: number
  confidence: Confidence
  explanation: string
}

export interface LifespanEstimate {
  /** Breed or size-class population baseline, before any personalisation. */
  baselineYears: number
  expectedYears: number
  rangeYears: readonly [number, number]
  factors: readonly LifespanFactor[]
  /** Naive sum of all factor deltas. */
  rawDeltaYears: number
  /** What actually got applied after saturation. Always |applied| <= |raw|. */
  appliedDeltaYears: number
}

export type LifeStageId = 'puppy' | 'young-adult' | 'mature-adult' | 'senior' | 'geriatric'

export interface LifeStageInfo {
  stage: LifeStageId
  label: string
  description: string
  /** Fraction of expected lifespan elapsed, clamped to [0, 1]. */
  progress: number
  nextStage?: {
    stage: LifeStageId
    label: string
    atAgeYears: number
  }
  careGuidance: readonly string[]
}

export interface Recommendation {
  id: string
  title: string
  detail: string
  /** Years plausibly recoverable by acting on this. */
  potentialYears: number
  priority: 'high' | 'medium' | 'low'
}

export interface DogAgeResult {
  profile: DogProfile
  breed?: Breed
  sizeClass: SizeClass
  chartBand: ChartBand
  /** The headline answer, with an honest interval around it. */
  humanAge: {
    years: number
    rangeYears: readonly [number, number]
    modelId: string
  }
  /** Every model that was run, including the ones not driving the headline. */
  models: readonly ModelEstimate[]
  lifespan: LifespanEstimate
  lifeStage: LifeStageInfo
  remaining: {
    years: number
    rangeYears: readonly [number, number]
    label: string
  }
  recommendations: readonly Recommendation[]
  /** Anything the caller should know about the quality of this answer. */
  warnings: readonly string[]
}
