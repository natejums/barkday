/**
 * Mapping a weight onto the two different size taxonomies the engine uses.
 *
 * There are two on purpose. The lifespan model uses the five Montoya bands
 * because that is the stratification its life expectancy figures were measured
 * against. The conversion charts use four coarser bands, drawn at different
 * cutoffs, and don't distinguish toy from small at all. Forcing either source
 * onto the other's bands would mean inventing numbers, so each model keeps the
 * bands its own data came from.
 */

import { CHART_BAND_CUTOFFS_KG, SIZE_BANDS } from './constants'
import type { ChartBand, SizeClass } from './types'

/** Five-band Montoya classification, used for life expectancy. */
export function sizeClassFromWeight(weightKg: number): SizeClass {
  const band = SIZE_BANDS.find((b) => weightKg >= b.minKg && weightKg < b.maxKg)
  return band?.sizeClass ?? 'medium'
}

/** Four-band chart classification, used for human-age conversion. */
export function chartBandFromWeight(weightKg: number): ChartBand {
  const band = CHART_BAND_CUTOFFS_KG.find((b) => weightKg < b.maxKg)
  return band?.band ?? 'giant'
}

/**
 * The chart bands don't separate toy from small, so toy dogs ride in the small
 * column. Everything else lines up one-to-one.
 */
export function chartBandFromSizeClass(sizeClass: SizeClass): ChartBand {
  return sizeClass === 'toy' ? 'small' : sizeClass
}

export function lifeExpectancyForSizeClass(sizeClass: SizeClass): number {
  const band = SIZE_BANDS.find((b) => b.sizeClass === sizeClass)
  return band?.lifeExpectancyYears ?? 12.69
}

export function sizeClassLabel(sizeClass: SizeClass): string {
  return SIZE_BANDS.find((b) => b.sizeClass === sizeClass)?.label ?? 'Medium'
}
