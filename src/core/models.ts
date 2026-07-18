/**
 * The three published ways of answering "how old is my dog in human years?",
 * plus the personalised model this app leads with.
 *
 * Keeping all of them is the point. Showing one number invites the reader to
 * trust it; showing four, and where they disagree, is closer to the truth.
 */

import {
  HUMAN_AGE_CHART,
  NAIVE_MULTIPLIER,
  PUPPY_CURVE,
  WANG_COEFFICIENT,
  WANG_INTERCEPT,
  WANG_VALID_RANGE,
} from './constants'
import { clamp, lerp } from './units'
import type { ChartBand } from './types'

/** Bounds-checked read, so an off-by-one surfaces instead of yielding NaN. */
function at(series: readonly number[], index: number): number {
  const value = series[index]
  if (value === undefined) {
    throw new RangeError(`Chart index ${index} is out of bounds (length ${series.length})`)
  }
  return value
}

/**
 * Multiply by seven.
 *
 * Wrong at every age, and wrong in different directions at different ages, but
 * it is the number everybody has in their head, so the app shows it to argue
 * with rather than pretending it doesn't exist.
 */
export function naiveHumanAge(dogYears: number): number {
  return Math.max(0, dogYears) * NAIVE_MULTIPLIER
}

/**
 * Wang et al.'s DNA-methylation clock: 16 × ln(age) + 31.
 *
 * Returns null below one year rather than a number, because the number would be
 * a lie. The curve is a logarithm fitted to data that never included newborns:
 * it crosses zero at about seven and a half weeks and goes negative below that,
 * and even well clear of that singularity it misbehaves — at six months it
 * returns 19.9, which would make a pre-adolescent puppy a twenty-year-old
 * human. Clamping the output to zero would hide that rather than fix it.
 */
export function epigeneticHumanAge(dogYears: number): number | null {
  if (dogYears < WANG_VALID_RANGE[0]) return null
  return WANG_COEFFICIENT * Math.log(dogYears) + WANG_INTERCEPT
}

export interface ChartResult {
  humanYears: number
  /** True when the age ran past where the published chart stops. */
  extrapolated: boolean
}

/**
 * Average step between the last few published rows, used to continue the curve
 * for very old dogs. Averaging over three rows rather than taking the final
 * step keeps a single rounding artefact in the source chart from setting the
 * slope for the whole extrapolation.
 */
function extrapolationSlope(series: readonly number[]): number {
  const n = series.length
  if (n < 2) return 5
  const steps = Math.min(3, n - 1)
  let total = 0
  for (let i = 0; i < steps; i += 1) {
    total += at(series, n - 1 - i) - at(series, n - 2 - i)
  }
  return total / steps
}

/**
 * Size-stratified chart lookup with linear interpolation between whole years.
 *
 * The first year is handled by its own curve: the published charts begin at age
 * one, but a dog packs more development into that first year than any later
 * one, so interpolating linearly from zero would badly understate a puppy.
 */
export function chartHumanAge(dogYears: number, band: ChartBand): ChartResult {
  const series = HUMAN_AGE_CHART[band]
  const yearOne = at(series, 0)

  if (dogYears <= 0) return { humanYears: 0, extrapolated: false }

  if (dogYears < 1) {
    for (let i = 0; i < PUPPY_CURVE.length - 1; i += 1) {
      const current = PUPPY_CURVE[i]
      const next = PUPPY_CURVE[i + 1]
      if (!current || !next) break
      const [startAge, startFraction] = current
      const [endAge, endFraction] = next
      if (dogYears <= endAge) {
        const t = (dogYears - startAge) / (endAge - startAge)
        return { humanYears: lerp(startFraction, endFraction, t) * yearOne, extrapolated: false }
      }
    }
    return { humanYears: yearOne, extrapolated: false }
  }

  const lowerIndex = Math.floor(dogYears) - 1
  const fraction = dogYears - Math.floor(dogYears)
  const lastIndex = series.length - 1

  if (lowerIndex < lastIndex) {
    const lower = at(series, lowerIndex)
    const upper = at(series, lowerIndex + 1)
    return { humanYears: lerp(lower, upper, fraction), extrapolated: false }
  }

  // Landing exactly on the final published row is a lookup, not an extrapolation.
  const yearsPastChart = dogYears - (lastIndex + 1)
  if (yearsPastChart <= 0) {
    return { humanYears: at(series, lastIndex), extrapolated: false }
  }

  return {
    humanYears: at(series, lastIndex) + yearsPastChart * extrapolationSlope(series),
    extrapolated: true,
  }
}

/**
 * How far the personalisation is allowed to stretch the timeline.
 *
 * A dog whose expected lifespan beats its size cohort ages more slowly, but
 * only within reason — the underlying chart was never validated on a dog living
 * half again as long as its breed average.
 */
const LIFESPAN_RATIO_BOUNDS: readonly [number, number] = [0.7, 1.4]

/**
 * The headline model: the size chart, warped by how long *this* dog is actually
 * expected to live.
 *
 * The reasoning is the same one AAHA uses to define life stages. Aging is
 * better described as progress through a lifespan than as elapsed time, so a
 * dog expected to outlive its cohort is correspondingly younger than the
 * calendar says. Scaling the age before the lookup, rather than scaling the
 * result after, keeps the shape of the developmental curve intact — a puppy
 * still races through its first year no matter how healthy it is.
 *
 * Every modifier the engine knows about reaches the headline number through
 * this one channel, which is what stops the app from being a chart with
 * decoration bolted on.
 */
export function personalisedHumanAge(
  dogYears: number,
  band: ChartBand,
  expectedLifespanYears: number,
  cohortLifespanYears: number,
): ChartResult {
  const ratio = clamp(
    cohortLifespanYears / expectedLifespanYears,
    LIFESPAN_RATIO_BOUNDS[0],
    LIFESPAN_RATIO_BOUNDS[1],
  )
  return chartHumanAge(dogYears * ratio, band)
}
