/**
 * Barkday 2.0 — the in-depth engine. Pure, dependency-free, offline.
 */

export { calculateDeep, composeDeepReport, DEEP_QUESTION_KEYS, DEEP_QUESTION_TOTAL } from './compose'
export { buildContext, profileSignature, TOPIC_LABELS, TOPIC_ORDER } from './context'
export type { InsightContext, InsightSpec } from './context'
export { INSIGHT_LIBRARY } from './insights'
export { SOURCES, SOURCE_IDS, sourceEntry } from './sources'
export type { SourceEntry, SourceId } from './sources'
export { buildCalendar, CALENDAR_WHEN_LABELS } from './calendar'
export { buildDeepGear } from './products'
export { composeStory } from './story'
export type {
  CalendarItem,
  CalendarWhen,
  CarTravel,
  Climate,
  DeepProfile,
  DeepReport,
  DeepResult,
  DogOrigin,
  Enrichment,
  ExerciseType,
  FoodType,
  GrainFree,
  InsightKind,
  JoinedAt,
  KnownCondition,
  MealsPerDay,
  MicrochipStatus,
  Mobility,
  ParasitePrevention,
  Readiness,
  RecentSign,
  ReportInsight,
  ReportSource,
  SleepQuality,
  Supplement,
  TimeAlone,
  Topic,
  TopicGroup,
  TrainingApproach,
  TreatShare,
  VaccinationStatus,
  WaterSource,
  WeightTrend,
} from './types'
