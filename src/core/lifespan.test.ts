import { describe, expect, it } from 'vitest'
import { findBreed } from './breeds'
import { MODIFIER_SATURATION_YEARS } from './constants'
import { baselineLifespan, estimateLifespan } from './lifespan'
import type { DogProfile } from './types'

const labrador = findBreed('Labrador Retriever')!
const chihuahua = findBreed('Chihuahua')!
const pug = findBreed('Pug')!

describe('baselineLifespan', () => {
  it('uses the midpoint of the breed range', () => {
    const [low, high] = labrador.lifespanYears
    expect(baselineLifespan(labrador, labrador.sizeClass)).toBeCloseTo((low + high) / 2, 6)
  })

  it('falls back to size-class population data with no breed', () => {
    // Montoya 2023 giant-breed life expectancy.
    expect(baselineLifespan(undefined, 'giant')).toBeCloseTo(9.51, 2)
  })

  it('reproduces the non-monotonic toy/small inversion', () => {
    // Small dogs really do outlive toy dogs. Guards against someone "fixing" it.
    expect(baselineLifespan(undefined, 'small')).toBeGreaterThan(
      baselineLifespan(undefined, 'toy'),
    )
  })
})

describe('body condition', () => {
  const base: DogProfile = { ageYears: 5 }

  it('rewards an ideal score', () => {
    const result = estimateLifespan({ ...base, bodyConditionScore: 5 }, labrador, 'large')
    expect(result.expectedYears).toBeGreaterThan(result.baselineYears)
  })

  it('penalises being overweight', () => {
    const ideal = estimateLifespan({ ...base, bodyConditionScore: 5 }, labrador, 'large')
    const heavy = estimateLifespan({ ...base, bodyConditionScore: 8 }, labrador, 'large')
    expect(heavy.expectedYears).toBeLessThan(ideal.expectedYears)
  })

  it('penalises small dogs more heavily than large ones, as Salt et al. found', () => {
    const smallPenalty =
      estimateLifespan({ ...base, bodyConditionScore: 5 }, chihuahua, 'toy').expectedYears -
      estimateLifespan({ ...base, bodyConditionScore: 8 }, chihuahua, 'toy').expectedYears
    const largePenalty =
      estimateLifespan({ ...base, bodyConditionScore: 5 }, labrador, 'large').expectedYears -
      estimateLifespan({ ...base, bodyConditionScore: 8 }, labrador, 'large').expectedYears
    expect(smallPenalty).toBeGreaterThan(largePenalty)
  })

  it('penalises being underweight too', () => {
    const ideal = estimateLifespan({ ...base, bodyConditionScore: 5 }, labrador, 'large')
    const thin = estimateLifespan({ ...base, bodyConditionScore: 2 }, labrador, 'large')
    expect(thin.expectedYears).toBeLessThan(ideal.expectedYears)
  })
})

describe('breed-driven factors', () => {
  it('applies the brachycephalic penalty', () => {
    const result = estimateLifespan({ ageYears: 5 }, pug, pug.sizeClass)
    expect(result.factors.some((f) => f.id === 'brachycephalic')).toBe(true)
    expect(result.expectedYears).toBeLessThan(result.baselineYears)
  })

  it('does not apply it to a long-muzzled breed', () => {
    const result = estimateLifespan({ ageYears: 5 }, labrador, 'large')
    expect(result.factors.some((f) => f.id === 'brachycephalic')).toBe(false)
  })

  it('gives an unknown-breed dog the mixed-ancestry bonus', () => {
    const result = estimateLifespan({ ageYears: 5 }, undefined, 'medium')
    expect(result.factors.some((f) => f.id === 'mixed-breed')).toBe(true)
  })
})

describe('modifier saturation', () => {
  const everythingGood: DogProfile = {
    ageYears: 5,
    bodyConditionScore: 5,
    sex: 'female',
    neuterStatus: 'neutered',
    activityLevel: 'very-active',
    dietQuality: 'excellent',
    dentalCare: 'professional',
    vetCare: 'proactive',
    environment: 'indoor',
  }

  const everythingBad: DogProfile = {
    ageYears: 5,
    bodyConditionScore: 9,
    activityLevel: 'sedentary',
    dietQuality: 'poor',
    dentalCare: 'none',
    vetCare: 'none',
    environment: 'outdoor',
    secondhandSmoke: true,
  }

  it('applies less than the naive sum when bonuses stack', () => {
    const result = estimateLifespan(everythingGood, labrador, 'large')
    expect(result.rawDeltaYears).toBeGreaterThan(0)
    expect(result.appliedDeltaYears).toBeLessThan(result.rawDeltaYears)
  })

  it('applies less than the naive sum when penalties stack', () => {
    const result = estimateLifespan(everythingBad, labrador, 'large')
    expect(result.rawDeltaYears).toBeLessThan(0)
    expect(result.appliedDeltaYears).toBeGreaterThan(result.rawDeltaYears)
  })

  it('never exceeds the saturation limit in either direction', () => {
    for (const profile of [everythingGood, everythingBad]) {
      const result = estimateLifespan(profile, labrador, 'large')
      expect(Math.abs(result.appliedDeltaYears)).toBeLessThanOrEqual(MODIFIER_SATURATION_YEARS)
    }
  })

  it('stays near-linear for a single modest factor', () => {
    const result = estimateLifespan({ ageYears: 5, sex: 'female' }, labrador, 'large')
    expect(result.appliedDeltaYears).toBeCloseTo(result.rawDeltaYears, 1)
  })

  it('keeps a long list of small penalties from being erased by a long list of bonuses', () => {
    // Saturating each direction separately is what makes this hold.
    const mixed = estimateLifespan(
      { ...everythingGood, dentalCare: 'none', vetCare: 'none', environment: 'outdoor' },
      labrador,
      'large',
    )
    expect(mixed.expectedYears).toBeLessThan(
      estimateLifespan(everythingGood, labrador, 'large').expectedYears,
    )
  })
})

describe('output shape', () => {
  it('clamps expected lifespan into a plausible band', () => {
    const grim = estimateLifespan(
      {
        ageYears: 5,
        bodyConditionScore: 9,
        activityLevel: 'sedentary',
        dietQuality: 'poor',
        dentalCare: 'none',
        vetCare: 'none',
        environment: 'outdoor',
        secondhandSmoke: true,
      },
      findBreed('Great Dane'),
      'giant',
    )
    expect(grim.expectedYears).toBeGreaterThanOrEqual(5)
    expect(grim.expectedYears).toBeLessThanOrEqual(20)
  })

  it('orders factors by magnitude', () => {
    const result = estimateLifespan(
      { ageYears: 5, bodyConditionScore: 9, sex: 'female', dentalCare: 'none' },
      labrador,
      'large',
    )
    const magnitudes = result.factors.map((f) => Math.abs(f.deltaYears))
    expect([...magnitudes].sort((a, b) => b - a)).toEqual(magnitudes)
  })

  it('omits factors with no effect', () => {
    const result = estimateLifespan({ ageYears: 5, dietQuality: 'average' }, labrador, 'large')
    expect(result.factors.some((f) => f.id === 'diet')).toBe(false)
  })

  it('produces a range that brackets the expected value', () => {
    const result = estimateLifespan({ ageYears: 5 }, labrador, 'large')
    const [low, high] = result.rangeYears
    expect(low).toBeLessThanOrEqual(result.expectedYears)
    expect(high).toBeGreaterThanOrEqual(result.expectedYears)
  })

  it('gives every factor an explanation and a confidence rating', () => {
    const result = estimateLifespan(
      { ageYears: 5, bodyConditionScore: 8, dentalCare: 'none', sex: 'female' },
      pug,
      'small',
    )
    expect(result.factors.length).toBeGreaterThan(2)
    for (const factor of result.factors) {
      expect(factor.explanation.length).toBeGreaterThan(20)
      expect(['high', 'moderate', 'low']).toContain(factor.confidence)
    }
  })
})
