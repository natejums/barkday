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
  weight: string
  weightUnit: WeightUnit
  // These carry `| undefined` explicitly: under exactOptionalPropertyTypes,
  // "absent" and "set to undefined" are different, and clearing a control does
  // the latter. Saying so here is better than turning the check off.
  sex?: Sex | undefined
  neuterStatus?: NeuterStatus | undefined
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
  weight: '',
  weightUnit: 'kg',
}

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
    ...(state.breedName.trim() ? { breedName: state.breedName.trim() } : {}),
    ...(hasWeight ? { weightKg: toKilograms(weightValue, state.weightUnit) } : {}),
    ...(state.sex ? { sex: state.sex } : {}),
    ...(state.neuterStatus ? { neuterStatus: state.neuterStatus } : {}),
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
    state.breedName.trim() !== '',
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
