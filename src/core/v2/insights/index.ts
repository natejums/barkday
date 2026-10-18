/**
 * The whole 2.0 insight library, in evaluation order.
 *
 * Order matters only for tie-breaking: within a kind, insights are ranked by
 * priority, and equal priorities keep the order below.
 */

import type { InsightSpec } from '../context'
import { BODY_INSIGHTS } from './body'
import { BREED_INSIGHTS } from './breed'
import { CONDITION_INSIGHTS } from './conditions'
import { DENTAL_INSIGHTS } from './dental'
import { EXERCISE_INSIGHTS } from './exercise'
import { FOOD_INSIGHTS } from './food'
import { HOME_INSIGHTS } from './home'
import { MIND_INSIGHTS } from './mind'
import { PREVENTION_INSIGHTS } from './prevention'
import { READINESS_INSIGHTS } from './readiness'
import { SIGN_INSIGHTS } from './signs'
import { SOCIAL_INSIGHTS } from './social'
import { STAGE_INSIGHTS } from './stage'
import { STORY_INSIGHTS } from './story'
import { WATER_INSIGHTS } from './water'

export const INSIGHT_LIBRARY: readonly InsightSpec[] = [
  ...BREED_INSIGHTS,
  ...SIGN_INSIGHTS,
  ...BODY_INSIGHTS,
  ...DENTAL_INSIGHTS,
  ...FOOD_INSIGHTS,
  ...WATER_INSIGHTS,
  ...EXERCISE_INSIGHTS,
  ...MIND_INSIGHTS,
  ...SOCIAL_INSIGHTS,
  ...PREVENTION_INSIGHTS,
  ...HOME_INSIGHTS,
  ...STAGE_INSIGHTS,
  ...STORY_INSIGHTS,
  ...CONDITION_INSIGHTS,
  ...READINESS_INSIGHTS,
]
