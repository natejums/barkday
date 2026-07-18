import { describe, expect, it } from 'vitest'
import { HUMAN_AGE_CHART, WANG_SINGULARITY_YEARS } from './constants'
import { chartHumanAge, epigeneticHumanAge, naiveHumanAge, personalisedHumanAge } from './models'
import type { ChartBand } from './types'

const BANDS: ChartBand[] = ['small', 'medium', 'large', 'giant']

describe('naiveHumanAge', () => {
  it('multiplies by seven', () => {
    expect(naiveHumanAge(5)).toBe(35)
  })

  it('floors at zero', () => {
    expect(naiveHumanAge(-2)).toBe(0)
  })
})

describe('epigeneticHumanAge', () => {
  it('matches the published formula at e years', () => {
    // 16 * ln(e) + 31 = 47
    expect(epigeneticHumanAge(Math.E)).toBeCloseTo(47, 6)
  })

  it('puts a one-year-old dog at 31 — the known flaw in this model', () => {
    expect(epigeneticHumanAge(1)).toBeCloseTo(31, 6)
  })

  it('clamps at the singularity instead of returning negatives', () => {
    expect(epigeneticHumanAge(WANG_SINGULARITY_YEARS)).toBe(0)
    expect(epigeneticHumanAge(0.05)).toBe(0)
    expect(epigeneticHumanAge(0)).toBe(0)
  })

  it('is monotonically increasing above the singularity', () => {
    let previous = -Infinity
    for (let age = 0.2; age <= 20; age += 0.1) {
      const value = epigeneticHumanAge(age)
      expect(value).toBeGreaterThan(previous)
      previous = value
    }
  })
})

describe('chartHumanAge', () => {
  it('reproduces the published chart at whole years', () => {
    for (const band of BANDS) {
      const series = HUMAN_AGE_CHART[band]
      series.forEach((expected, index) => {
        expect(chartHumanAge(index + 1, band).humanYears).toBeCloseTo(expected, 6)
      })
    }
  })

  it('puts a yearling at 15 human years, and a giant yearling at 12', () => {
    expect(chartHumanAge(1, 'small').humanYears).toBe(15)
    expect(chartHumanAge(1, 'medium').humanYears).toBe(15)
    expect(chartHumanAge(1, 'giant').humanYears).toBe(12)
  })

  it('interpolates linearly between whole years', () => {
    // Small: 15 at year 1, 24 at year 2.
    expect(chartHumanAge(1.5, 'small').humanYears).toBeCloseTo(19.5, 6)
  })

  it('uses the developmental curve for puppies', () => {
    expect(chartHumanAge(0.5, 'small').humanYears).toBeCloseTo(10, 6)
    // The giant band scales the same curve to its lower year-one value.
    expect(chartHumanAge(0.5, 'giant').humanYears).toBeCloseTo(8, 6)
    expect(chartHumanAge(0, 'small').humanYears).toBe(0)
  })

  it('does not flag the final published row as extrapolated', () => {
    for (const band of BANDS) {
      const lastAge = HUMAN_AGE_CHART[band].length
      expect(chartHumanAge(lastAge, band).extrapolated).toBe(false)
    }
  })

  it('flags extrapolation past the end of each chart', () => {
    for (const band of BANDS) {
      const past = HUMAN_AGE_CHART[band].length + 1
      const result = chartHumanAge(past, band)
      expect(result.extrapolated).toBe(true)
      expect(result.humanYears).toBeGreaterThan(0)
    }
  })

  it('is monotonically increasing across the whole supported range', () => {
    for (const band of BANDS) {
      let previous = -Infinity
      for (let age = 0; age <= 30; age += 0.05) {
        const { humanYears } = chartHumanAge(age, band)
        expect(humanYears).toBeGreaterThanOrEqual(previous)
        previous = humanYears
      }
    }
  })

  it('ages larger dogs faster from age six onward', () => {
    for (let age = 6; age <= 16; age += 1) {
      const small = chartHumanAge(age, 'small').humanYears
      const medium = chartHumanAge(age, 'medium').humanYears
      const large = chartHumanAge(age, 'large').humanYears
      const giant = chartHumanAge(age, 'giant').humanYears
      expect(medium).toBeGreaterThan(small)
      expect(large).toBeGreaterThan(medium)
      expect(giant).toBeGreaterThan(large)
    }
  })
})

describe('personalisedHumanAge', () => {
  const band: ChartBand = 'large'

  it('matches the plain chart when the dog is exactly average for its cohort', () => {
    const expected = chartHumanAge(8, band).humanYears
    expect(personalisedHumanAge(8, band, 12, 12).humanYears).toBeCloseTo(expected, 6)
  })

  it('reads younger when the dog is expected to outlive its cohort', () => {
    const average = personalisedHumanAge(8, band, 12, 12).humanYears
    const healthier = personalisedHumanAge(8, band, 14, 12).humanYears
    expect(healthier).toBeLessThan(average)
  })

  it('reads older when the dog is expected to fall short of its cohort', () => {
    const average = personalisedHumanAge(8, band, 12, 12).humanYears
    const unhealthier = personalisedHumanAge(8, band, 10, 12).humanYears
    expect(unhealthier).toBeGreaterThan(average)
  })

  it('refuses to stretch the timeline beyond the clamp', () => {
    // An absurd expected lifespan must not translate into an absurd age.
    const extreme = personalisedHumanAge(8, band, 100, 12).humanYears
    const atClamp = personalisedHumanAge(8, band, 12 / 0.7, 12).humanYears
    expect(extreme).toBeCloseTo(atClamp, 6)
  })

  it('keeps the first-year curve intact regardless of personalisation', () => {
    // A puppy still races through its first year however healthy it is.
    const healthy = personalisedHumanAge(0.5, band, 14, 12).humanYears
    expect(healthy).toBeGreaterThan(5)
    expect(healthy).toBeLessThan(15)
  })
})
