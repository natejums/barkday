/**
 * The 2.0 form: everything the 1.0 form holds, plus the in-depth questions.
 *
 * Same philosophy as `formState.ts` — strings while typing, conversion once in
 * `toDeepProfile`, and "absent" kept distinct from "set to undefined".
 */

import { daysUntilBirthday, yearsBetween } from '../../core'
import type {
  Anxiety,
  CarTravel,
  Climate,
  DeepProfile,
  DogOrigin,
  Enrichment,
  ExerciseType,
  FoodType,
  GrainFree,
  JoinedAt,
  KnownCondition,
  MealsPerDay,
  MicrochipStatus,
  Mobility,
  ParasitePrevention,
  Readiness,
  RecentSign,
  SleepQuality,
  Supplement,
  TimeAlone,
  TrainingApproach,
  TreatShare,
  VaccinationStatus,
  WaterSource,
  WeightTrend,
} from '../../core'
import { DEFAULT_STATE, toProfile, type FormState } from '../formState'

export type YesNo = 'yes' | 'no'

export interface DeepFormState extends FormState {
  origin?: DogOrigin | undefined
  joinedAt?: JoinedAt | undefined
  /** When the dog came home, as a date string. Optional; used for "years together". */
  homecomingDate: string
  foodType?: FoodType | undefined
  grainFree?: GrainFree | undefined
  mealsPerDay?: MealsPerDay | undefined
  treatShare?: TreatShare | undefined
  waterSource?: WaterSource | undefined
  raisedBowls?: YesNo | undefined
  exerciseTypes: readonly ExerciseType[]
  enrichment?: Enrichment | undefined
  sleep?: SleepQuality | undefined
  timeAlone?: TimeAlone | undefined
  otherDogs?: YesNo | undefined
  children?: YesNo | undefined
  anxiety?: Anxiety | undefined
  training?: TrainingApproach | undefined
  vaccination?: VaccinationStatus | undefined
  parasitePrevention?: ParasitePrevention | undefined
  microchip?: MicrochipStatus | undefined
  knownConditions: readonly KnownCondition[]
  /** "None of these" chosen explicitly — an answer, not a blank. */
  knownConditionsNone: boolean
  recentSigns: readonly RecentSign[]
  recentSignsNone: boolean
  weightTrend?: WeightTrend | undefined
  mobility?: Mobility | undefined
  climate?: Climate | undefined
  lawnChemicals?: YesNo | undefined
  carTravel?: CarTravel | undefined
  supplements: readonly Supplement[]
  supplementsNone: boolean
  readiness?: Readiness | undefined
  knowsEmergencyVet?: YesNo | undefined
}

export type DeepFormPatch = Partial<DeepFormState>

export const DEFAULT_DEEP_STATE: DeepFormState = {
  ...DEFAULT_STATE,
  homecomingDate: '',
  exerciseTypes: [],
  knownConditions: [],
  knownConditionsNone: false,
  recentSigns: [],
  recentSignsNone: false,
  supplements: [],
  supplementsNone: false,
}

function parseDate(value: string): Date | null {
  if (!value) return null
  // Accept yyyy-mm as well as yyyy-mm-dd, since a month is as precise as most people remember.
  const normalised = /^\d{4}-\d{2}$/.test(value) ? `${value}-15` : value
  const parsed = new Date(`${normalised}T00:00:00`)
  return Number.isNaN(parsed.getTime()) ? null : parsed
}

/**
 * "Years together", from the homecoming date when given. Clamped to the dog's
 * age — a homecoming before the dog was born is a typo, not a time machine.
 */
function resolveYearsTogether(state: DeepFormState, ageYears: number, now: Date): number | undefined {
  const date = parseDate(state.homecomingDate)
  if (!date) return undefined
  const years = yearsBetween(date, now)
  if (years < 0) return undefined
  return Math.min(years, ageYears)
}

/** The "how old when they joined you" options that are possible for a dog of this age. */
export function possibleJoinedAt(ageYears: number): readonly JoinedAt[] {
  const all: readonly JoinedAt[] = ['under-6-months', '6-12-months', 'adult', 'senior']
  return all.filter((option) => {
    if (option === '6-12-months') return ageYears >= 0.5
    if (option === 'adult') return ageYears >= 1
    if (option === 'senior') return ageYears >= 6
    return true
  })
}

const yes = (value: YesNo | undefined): boolean | undefined =>
  value === undefined ? undefined : value === 'yes'

/** Returns null when there isn't enough entered yet to calculate anything. */
export function toDeepProfile(state: DeepFormState, now: Date): DeepProfile | null {
  const base = toProfile(state, now)
  if (!base) return null

  const yearsTogether = resolveYearsTogether(state, base.ageYears, now)
  const birth = state.ageMode === 'birthdate' ? parseDate(state.birthDate) : null
  const joinedAt =
    state.joinedAt && possibleJoinedAt(base.ageYears).includes(state.joinedAt) ? state.joinedAt : undefined

  const raisedBowls = yes(state.raisedBowls)
  const otherDogs = yes(state.otherDogs)
  const children = yes(state.children)
  const lawnChemicals = yes(state.lawnChemicals)
  const knowsEmergencyVet = yes(state.knowsEmergencyVet)

  return {
    ...base,
    ...(state.origin ? { origin: state.origin } : {}),
    ...(joinedAt ? { joinedAt } : {}),
    ...(yearsTogether !== undefined ? { yearsTogether } : {}),
    ...(birth ? { daysUntilBirthday: daysUntilBirthday(birth, now) } : {}),
    ...(state.foodType ? { foodType: state.foodType } : {}),
    ...(state.grainFree ? { grainFree: state.grainFree } : {}),
    ...(state.mealsPerDay ? { mealsPerDay: state.mealsPerDay } : {}),
    ...(state.treatShare ? { treatShare: state.treatShare } : {}),
    ...(state.waterSource ? { waterSource: state.waterSource } : {}),
    ...(raisedBowls !== undefined ? { raisedBowls } : {}),
    ...(state.exerciseTypes.length > 0 ? { exerciseTypes: state.exerciseTypes } : {}),
    ...(state.enrichment ? { enrichment: state.enrichment } : {}),
    ...(state.sleep ? { sleep: state.sleep } : {}),
    ...(state.timeAlone ? { timeAlone: state.timeAlone } : {}),
    ...(otherDogs !== undefined ? { otherDogs } : {}),
    ...(children !== undefined ? { children } : {}),
    ...(state.anxiety ? { anxiety: state.anxiety } : {}),
    ...(state.training ? { training: state.training } : {}),
    ...(state.vaccination ? { vaccination: state.vaccination } : {}),
    ...(state.parasitePrevention ? { parasitePrevention: state.parasitePrevention } : {}),
    ...(state.microchip ? { microchip: state.microchip } : {}),
    ...(state.knownConditions.length > 0
      ? { knownConditions: state.knownConditions }
      : state.knownConditionsNone
        ? { knownConditions: [] }
        : {}),
    ...(state.recentSigns.length > 0
      ? { recentSigns: state.recentSigns }
      : state.recentSignsNone
        ? { recentSigns: [] }
        : {}),
    ...(state.weightTrend ? { weightTrend: state.weightTrend } : {}),
    ...(state.mobility ? { mobility: state.mobility } : {}),
    ...(state.climate ? { climate: state.climate } : {}),
    ...(lawnChemicals !== undefined ? { lawnChemicals } : {}),
    ...(state.carTravel ? { carTravel: state.carTravel } : {}),
    ...(state.supplements.length > 0
      ? { supplements: state.supplements }
      : state.supplementsNone
        ? { supplements: [] }
        : {}),
    ...(state.readiness ? { readiness: state.readiness } : {}),
    ...(knowsEmergencyVet !== undefined ? { knowsEmergencyVet } : {}),
  }
}
