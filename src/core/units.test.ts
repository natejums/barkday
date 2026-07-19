import { describe, expect, it } from 'vitest'
import { clamp, formatWeight, fromKilograms, lerp, round, toKilograms } from './units'

describe('weight conversion', () => {
  it('passes kilograms through untouched', () => {
    expect(toKilograms(12.5, 'kg')).toBe(12.5)
  })

  it('converts pounds to kilograms', () => {
    expect(toKilograms(100, 'lb')).toBeCloseTo(45.359, 3)
  })

  it('round-trips', () => {
    const kg = 27.3
    expect(toKilograms(fromKilograms(kg, 'lb'), 'lb')).toBeCloseTo(kg, 6)
  })
})

describe('formatWeight', () => {
  it('keeps one decimal for kilograms', () => {
    expect(formatWeight(27.34, 'kg')).toBe('27.3 kg')
  })

  it('rounds pounds to whole numbers', () => {
    expect(formatWeight(27.34, 'lb')).toBe('60 lbs')
  })
})

describe('numeric helpers', () => {
  it('clamps', () => {
    expect(clamp(5, 0, 10)).toBe(5)
    expect(clamp(-1, 0, 10)).toBe(0)
    expect(clamp(99, 0, 10)).toBe(10)
  })

  it('interpolates', () => {
    expect(lerp(10, 20, 0)).toBe(10)
    expect(lerp(10, 20, 1)).toBe(20)
    expect(lerp(10, 20, 0.5)).toBe(15)
  })

  it('rounds without float noise', () => {
    expect(round(1.005, 2)).toBe(1.01)
    expect(round(2.34567)).toBe(2.3)
  })
})
