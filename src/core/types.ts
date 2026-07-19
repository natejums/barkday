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
  /**
   * For a known mix: the component breeds and their fractions. Fractions need
   * not sum to 1 — they are normalised. Takes precedence over `breedName`. The
   * engine blends the components' size and lifespan by fraction and pools their
   * health risks; it does not add any mixed-breed longevity bonus or penalty,
   * because the evidence for one points both ways.
   */
  breedComposition?: readonly { breedName: string; fraction: number }[]
  /** Current weight in kg. Refines size class when the breed is unknown. */
  weightKg?: number
  sex?: Sex
  neuterStatus?: NeuterStatus
  /**
   * Age in months at which the dog was neutered or spayed. Only refines the
   * estimate for large and giant breeds, where the timing genuinely matters —
   * Hart et al. (2020) found early neutering raises joint-disorder and some
   * cancer risk in bigger dogs. Ignored when neuterStatus isn't 'neutered'.
   */
  neuterAgeMonths?: number
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

// ---------------------------------------------------------------------------
// Breed health
// ---------------------------------------------------------------------------

/**
 * The body system a condition primarily affects. Used to group a breed's
 * concerns into something scannable rather than a flat wall of pills.
 */
export type BodySystem =
  | 'orthopedic'
  | 'cardiac'
  | 'ocular'
  | 'neurological'
  | 'cancer'
  | 'endocrine'
  | 'respiratory'
  | 'dermatological'
  | 'gastrointestinal'
  | 'urinary'
  | 'hepatic'
  | 'haematological'
  | 'dental'
  | 'aural'
  | 'immune'
  | 'other'

/**
 * How urgently a condition tends to matter. `emergency` is reserved for things
 * that kill within hours if ignored — bloat, not arthritis — so the label
 * carries real information rather than blanket alarm.
 */
export type ConditionSeverity = 'monitor' | 'serious' | 'emergency'

/** The life stage a condition typically first appears in. `any` when it isn't age-linked. */
export type OnsetStage = 'puppy' | 'young-adult' | 'mature-adult' | 'senior' | 'any'

/**
 * One entry in the condition catalogue: general, well-established veterinary
 * knowledge about a named canine condition. This is educational reference
 * material, deliberately breed-agnostic — the breed-specific claim is which
 * conditions a breed is predisposed to, which lives in the breed data.
 */
export interface ConditionInfo {
  id: string
  name: string
  /**
   * Lower-case fragments used to link a breed's free-text risk phrasing to this
   * entry. Longest match wins, so "hip dysplasia" beats a bare "hip".
   */
  aliases: readonly string[]
  system: BodySystem
  severity: ConditionSeverity
  typicalOnset: OnsetStage
  /**
   * A catch-all entry (e.g. "heart disease", "inherited eye conditions"). These
   * only match when nothing more specific does, so a phrase that names an actual
   * condition never gets swallowed by a vaguer one that happens to be longer.
   */
  generic?: boolean
  /** Cardinal signs an owner can actually notice, in plain language. */
  signs: string
  /** What genuinely helps: screening, prevention or management. */
  action: string
  /** General veterinary references. Not breed-specific statistics. */
  references: readonly string[]
}

/**
 * One health concern as surfaced for a specific dog. The breed's own wording is
 * always preserved; the catalogue entry, when one matched, enriches it.
 */
export interface HealthConcern {
  /** The breed data's own phrasing, verbatim. Never rewritten. */
  label: string
  /** Enriched catalogue detail, present only when the label matched an entry. */
  condition?: ConditionInfo
  system: BodySystem
  severity: ConditionSeverity
  /** True when this concern is one to watch for around the dog's current age. */
  relevantNow: boolean
}

/** A profile-aware, actionable health note — the cross-references, not the list. */
export interface HealthCallout {
  id: string
  title: string
  detail: string
  severity: ConditionSeverity
}

export interface HealthSystemGroup {
  system: BodySystem
  label: string
  concerns: readonly HealthConcern[]
}

/**
 * A breed's health picture, personalised to one dog's age and profile.
 *
 * Nothing here is a diagnosis or a prediction. It is the breed's documented
 * predispositions, organised, prioritised for the dog's life stage, and
 * cross-referenced against the profile — so an owner knows what to watch for
 * and what to raise with a vet, not what their dog has.
 */
export interface BreedHealthReport {
  breedName: string
  /** Every documented concern for the breed, enriched where possible. */
  concerns: readonly HealthConcern[]
  /** Concerns grouped by body system, each group ordered by severity. */
  bySystem: readonly HealthSystemGroup[]
  /** What to watch for around this age, most severe first. May be empty. */
  priorityNow: readonly HealthConcern[]
  /** Profile-specific callouts: feeding for bloat-prone breeds, heat for flat faces, and so on. */
  callouts: readonly HealthCallout[]
  /** True once the dog reaches a stage where screening genuinely changes outcomes. */
  screeningMatters: boolean
}

/**
 * A generic category of gear that tends to help, tied to something the model
 * actually found — a recommendation, a breed health flag, or the life stage.
 *
 * Deliberately brand-free and link-free. It names a *kind* of product and why it
 * helps, and leaves the choosing (and any buying) to the owner. Naming brands or
 * carrying affiliate links would trade the project's credibility for pennies.
 */
export interface ProductSuggestion {
  id: string
  title: string
  detail: string
  /** What surfaced it — a recommendation id, condition id, callout id or life stage. */
  triggeredBy: string
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
  /**
   * The breed's health picture, personalised to this dog's age and profile.
   * Present only when the breed was recognised — health predispositions are
   * breed-specific, and a size band has none to report.
   */
  breedHealth?: BreedHealthReport
  /** Generic, brand-free gear that tends to help, tied to this dog's results. */
  productSuggestions: readonly ProductSuggestion[]
  /** Anything the caller should know about the quality of this answer. */
  warnings: readonly string[]
}
