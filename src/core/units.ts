/**
 * Weight unit handling.
 *
 * Everything inside the engine works in kilograms. Conversion happens at the
 * edges so that no model ever has to ask which unit it was handed.
 */

export type WeightUnit = 'kg' | 'lb'

/** Exact, by definition of the international pound. */
export const KG_PER_LB = 0.45359237

export function toKilograms(value: number, unit: WeightUnit): number {
  return unit === 'kg' ? value : value * KG_PER_LB
}

export function fromKilograms(kilograms: number, unit: WeightUnit): number {
  return unit === 'kg' ? kilograms : kilograms / KG_PER_LB
}

/**
 * Formats a weight for display, rounding harder for pounds than kilos because
 * a pound is a finer unit and "12.4 lb" reads as false precision on a scale
 * that most owners eyeball anyway.
 */
export function formatWeight(kilograms: number, unit: WeightUnit): string {
  const value = fromKilograms(kilograms, unit)
  const rounded = unit === 'kg' ? Math.round(value * 10) / 10 : Math.round(value)
  return `${rounded} ${unit}`
}

/** Clamps a value into [min, max]. Used all over the modifier code. */
export function clamp(value: number, min: number, max: number): number {
  return Math.min(Math.max(value, min), max)
}

/** Linear interpolation between a and b at t in [0, 1]. */
export function lerp(a: number, b: number, t: number): number {
  return a + (b - a) * t
}

/** Rounds to a fixed number of decimal places without float noise in the tail. */
export function round(value: number, decimals = 1): number {
  if (!Number.isFinite(value)) return value

  // Shifting the decimal point through the exponent in string form dodges the
  // classic binary-representation bug, where Math.round(1.005 * 100) is 100
  // because 1.005 is really 1.00499999999999989 under the hood.
  const shifted = Number(`${value}e${decimals}`)
  if (!Number.isFinite(shifted)) {
    const factor = 10 ** decimals
    return Math.round(value * factor) / factor
  }
  return Number(`${Math.round(shifted)}e-${decimals}`)
}
