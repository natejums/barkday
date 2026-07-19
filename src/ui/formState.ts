import { toKilograms, yearsBetween } from '../core'
import type {
  ActivityLevel,
  DentalCare,
  DietQuality,
  DogProfile,
  LivingEnvironment,
  NeuterStatus,
  Sex,
  VetCare,
  WeightUnit,
} from '../core'

/**
 * What the form holds, which is not quite what the engine wants.
 *
 * Numeric fields live here as strings because a half-typed number is a normal
 * state for an input to be in, and coercing on every keystroke fights the user.
 * Conversion and validation happen once, in `toProfile`.
 */
export interface FormState {
  name: string
  ageMode: 'age' | 'birthdate'
  ageValue: string
  ageUnit: 'years' | 'months'
  birthDate: string
  breedName: string
  /** When true, the breed picker becomes a mix of up to three breeds. */
  isMixed: boolean
  /** Component breeds and their percentages, held as strings while typing. */
  mix: readonly { breedName: string; percent: string }[]
  weight: string
  weightUnit: WeightUnit
  // These carry `| undefined` explicitly: under exactOptionalPropertyTypes,
  // "absent" and "set to undefined" are different, and clearing a control does
  // the latter. Saying so here is better than turning the check off.
  sex?: Sex | undefined
  neuterStatus?: NeuterStatus | undefined
  /**
   * When the dog was neutered, coarsened to the only distinction the model
   * makes: before a year old versus at a year or later. Offering an exact month
   * would imply a precision the model doesn't have — it only reacts to the
   * 12-month line, and only for large breeds.
   */
  neuterTiming?: 'early' | 'adult' | undefined
  bodyConditionScore?: number | undefined
  activityLevel?: ActivityLevel | undefined
  dietQuality?: DietQuality | undefined
  dentalCare?: DentalCare | undefined
  vetCare?: VetCare | undefined
  environment?: LivingEnvironment | undefined
  secondhandSmoke?: 'yes' | 'no' | undefined
}

/**
 * A partial update. Clearing an answer means passing undefined, which works
 * because the clearable fields above admit it — the always-present fields
 * deliberately don't, so a patch can never blank out the dog's age.
 */
export type FormPatch = Partial<FormState>

/**
 * Opens on a plausible dog rather than an empty form, so the first thing a
 * visitor sees is a working result instead of a blank slate.
 */
export const DEFAULT_STATE: FormState = {
  name: '',
  ageMode: 'age',
  ageValue: '3',
  ageUnit: 'years',
  birthDate: '',
  breedName: '',
  isMixed: false,
  mix: [
    { breedName: '', percent: '' },
    { breedName: '', percent: '' },
  ],
  weight: '',
  weightUnit: 'lb',
}

/** The most breeds a single mix can name. */
export const MAX_MIX_BREEDS = 3

function resolveAgeYears(state: FormState, now: Date): number | null {
  if (state.ageMode === 'birthdate') {
    if (!state.birthDate) return null
    const parsed = new Date(`${state.birthDate}T00:00:00`)
    if (Number.isNaN(parsed.getTime())) return null
    const years = yearsBetween(parsed, now)
    // A date in the future is a typo, not a dog.
    return years < 0 ? null : years
  }

  const raw = Number.parseFloat(state.ageValue)
  if (!Number.isFinite(raw) || raw < 0) return null
  return state.ageUnit === 'months' ? raw / 12 : raw
}

/**
 * The breed part of the profile: a mix composition when the box is ticked and at
 * least one component breed is named, otherwise the single breed name.
 *
 * Percentages are used as entered. If none are filled the components split
 * evenly; if some are filled, the blanks drop out (the engine normalises what
 * remains). This keeps a half-finished form from guessing wildly.
 */
function breedFields(state: FormState): Pick<DogProfile, 'breedName' | 'breedComposition'> {
  if (state.isMixed) {
    const named = state.mix.filter((m) => m.breedName.trim() !== '')
    if (named.length === 0) return {}

    const parsed = named.map((m) => ({ name: m.breedName.trim(), pct: Number.parseFloat(m.percent) }))
    const anyPct = parsed.some((p) => Number.isFinite(p.pct) && p.pct > 0)

    const composition = parsed
      .map((p) => ({
        breedName: p.name,
        fraction: anyPct ? (Number.isFinite(p.pct) && p.pct > 0 ? p.pct : 0) : 1,
      }))
      .filter((c) => c.fraction > 0)

    return composition.length > 0 ? { breedComposition: composition } : {}
  }

  return state.breedName.trim() ? { breedName: state.breedName.trim() } : {}
}

/** Returns null when there isn't enough entered yet to calculate anything. */
export function toProfile(state: FormState, now: Date): DogProfile | null {
  const ageYears = resolveAgeYears(state, now)
  if (ageYears === null) return null

  const weightValue = Number.parseFloat(state.weight)
  const hasWeight = Number.isFinite(weightValue) && weightValue > 0

  // Optional properties are spread in conditionally rather than set to
  // undefined, because the engine's types distinguish "absent" from "unknown".
  return {
    ageYears,
    ...(state.name.trim() ? { name: state.name.trim() } : {}),
    ...breedFields(state),
    ...(hasWeight ? { weightKg: toKilograms(weightValue, state.weightUnit) } : {}),
    ...(state.sex ? { sex: state.sex } : {}),
    ...(state.neuterStatus ? { neuterStatus: state.neuterStatus } : {}),
    // Map the two-way timing choice onto a representative month value the engine
    // can read. Only meaningful alongside a 'neutered' status, so gated on it.
    ...(state.neuterStatus === 'neutered' && state.neuterTiming
      ? { neuterAgeMonths: state.neuterTiming === 'early' ? 6 : 18 }
      : {}),
    ...(state.bodyConditionScore !== undefined
      ? { bodyConditionScore: state.bodyConditionScore }
      : {}),
    ...(state.activityLevel ? { activityLevel: state.activityLevel } : {}),
    ...(state.dietQuality ? { dietQuality: state.dietQuality } : {}),
    ...(state.dentalCare ? { dentalCare: state.dentalCare } : {}),
    ...(state.vetCare ? { vetCare: state.vetCare } : {}),
    ...(state.environment ? { environment: state.environment } : {}),
    ...(state.secondhandSmoke ? { secondhandSmoke: state.secondhandSmoke === 'yes' } : {}),
  }
}

/** How much of the optional detail has been filled in, for the progress hint. */
export function completeness(state: FormState): { filled: number; total: number } {
  const optional = [
    state.isMixed
      ? state.mix.some((m) => m.breedName.trim() !== '')
      : state.breedName.trim() !== '',
    state.weight.trim() !== '',
    state.sex !== undefined,
    state.neuterStatus !== undefined,
    state.bodyConditionScore !== undefined,
    state.activityLevel !== undefined,
    state.dietQuality !== undefined,
    state.dentalCare !== undefined,
    state.vetCare !== undefined,
    state.environment !== undefined,
  ]
  return { filled: optional.filter(Boolean).length, total: optional.length }
}
