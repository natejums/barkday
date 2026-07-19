/**
 * Barkday's calculation engine.
 *
 * Pure, dependency-free and framework-agnostic — the React app in `src/ui` is
 * just one consumer. Nothing in here touches the DOM or reads the clock.
 */

export { calculateDogAge, calculateFromBirthDate, isSupportedAge, MAX_SUPPORTED_AGE } from './calculate'

export {
  BREEDS,
  BREED_GROUPS,
  breedsInGroup,
  findBreed,
  popularBreeds,
  searchBreeds,
} from './breeds'

export {
  chartHumanAge,
  epigeneticHumanAge,
  naiveHumanAge,
  personalisedHumanAge,
} from './models'

export { baselineLifespan, estimateLifespan } from './lifespan'
export { classifyLifeStage, lifeStageDefinition, stageBoundaries } from './lifeStage'
export { buildRecommendations } from './recommendations'

export {
  buildBreedHealth,
  matchCondition,
  CONDITION_CATALOG,
  BODY_SYSTEM_LABELS,
  BODY_SYSTEM_ORDER,
} from './health'

export {
  chartBandFromSizeClass,
  chartBandFromWeight,
  isUsableWeight,
  lifeExpectancyForSizeClass,
  sizeClassFromWeight,
  sizeClassLabel,
} from './size'

export {
  DAYS_PER_YEAR,
  daysUntilBirthday,
  describeYears,
  nextBirthday,
  yearsBetween,
} from './age'

export { clamp, formatWeight, fromKilograms, KG_PER_LB, round, toKilograms } from './units'
export type { WeightUnit } from './units'

export { ALL_DOGS_LIFE_EXPECTANCY, SIZE_BANDS } from './constants'

export type {
  ActivityLevel,
  BodySystem,
  Breed,
  BreedHealthReport,
  ChartBand,
  ConditionInfo,
  ConditionSeverity,
  Confidence,
  DentalCare,
  DietQuality,
  DogAgeResult,
  DogProfile,
  HealthCallout,
  HealthConcern,
  HealthSystemGroup,
  LifeStageId,
  LifeStageInfo,
  LifespanEstimate,
  LifespanFactor,
  LivingEnvironment,
  ModelEstimate,
  NeuterStatus,
  OnsetStage,
  Recommendation,
  Sex,
  SizeClass,
  VetCare,
} from './types'
