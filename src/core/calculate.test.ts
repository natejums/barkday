import { describe, expect, it } from 'vitest'
import { BREEDS } from './breeds'
import { calculateDogAge, calculateFromBirthDate, isSupportedAge, MAX_SUPPORTED_AGE } from './calculate'
import type { DogProfile } from './types'

describe('calculateDogAge — input handling', () => {
  it('rejects a non-finite age', () => {
    expect(() => calculateDogAge({ ageYears: Number.NaN })).toThrow(TypeError)
    expect(() => calculateDogAge({ ageYears: Infinity })).toThrow(TypeError)
  })

  it('treats a negative age as a newborn and says so', () => {
    const result = calculateDogAge({ ageYears: -5 })
    expect(result.humanAge.years).toBe(0)
    expect(result.warnings.join(' ')).toMatch(/negative/i)
  })

  it('caps absurd ages and says so', () => {
    const result = calculateDogAge({ ageYears: 200 })
    expect(result.warnings.join(' ')).toMatch(/beyond any published data/i)
    expect(result.lifeStage.progress).toBe(1)
  })

  it('warns when the breed is not recognised', () => {
    const result = calculateDogAge({ ageYears: 5, breedName: 'Direwolf' })
    expect(result.breed).toBeUndefined()
    expect(result.warnings.join(' ')).toMatch(/isn't in the breed list/i)
  })

  it('warns when it has nothing to go on', () => {
    const result = calculateDogAge({ ageYears: 5 })
    expect(result.warnings.join(' ')).toMatch(/no breed or weight/i)
  })

  it('warns when weight is wildly off the breed standard', () => {
    const result = calculateDogAge({ ageYears: 5, breedName: 'Chihuahua', weightKg: 20 })
    expect(result.warnings.join(' ')).toMatch(/above the typical range/i)
  })

  it('resolves breeds through aliases', () => {
    expect(calculateDogAge({ ageYears: 5, breedName: 'lab' }).breed?.name).toBe('Labrador Retriever')
  })
})

describe('calculateDogAge — sizing', () => {
  it('sizes from the breed standard rather than the scale when a breed is known', () => {
    // An overweight Labrador is not a giant breed — otherwise the dog would be
    // charged twice, once for size and again for body condition.
    const heavy = calculateDogAge({
      ageYears: 5,
      breedName: 'Labrador Retriever',
      weightKg: 55,
      bodyConditionScore: 8,
    })
    expect(heavy.sizeClass).toBe('large')
  })

  it('falls back to weight when the breed is unknown', () => {
    expect(calculateDogAge({ ageYears: 5, weightKg: 3 }).sizeClass).toBe('toy')
    expect(calculateDogAge({ ageYears: 5, weightKg: 50 }).sizeClass).toBe('giant')
  })

  it('assumes a medium dog when given nothing', () => {
    expect(calculateDogAge({ ageYears: 5 }).sizeClass).toBe('medium')
  })

  it('ignores an unusable weight instead of reading it as a giant dog', () => {
    // Every comparison against NaN is false, so the two size taxonomies used to
    // fall out of their lookups in opposite directions — 'medium' from one and
    // 'giant' from the other — and a dog with a typo'd weight aged nine human
    // years overnight with nothing said about it.
    const sane = calculateDogAge({ ageYears: 5 })

    for (const weightKg of [NaN, Infinity, -Infinity, -5, 0]) {
      const result = calculateDogAge({ ageYears: 5, weightKg })

      expect(result.sizeClass, `weightKg = ${weightKg}`).toBe('medium')
      expect(result.chartBand, `weightKg = ${weightKg}`).toBe('medium')
      expect(result.humanAge.years, `weightKg = ${weightKg}`).toBe(sane.humanAge.years)
      expect(
        result.warnings.some((w) => w.includes('not a usable positive number')),
        `weightKg = ${weightKg} should be reported, not silently dropped`,
      ).toBe(true)
    }
  })

  it('does not complain about a weight that was never given', () => {
    expect(calculateDogAge({ ageYears: 5 }).warnings.join(' ')).not.toContain(
      'not a usable positive number',
    )
  })

  it('does not measure an unusable weight against the breed standard', () => {
    const result = calculateDogAge({ ageYears: 5, breedName: 'Chihuahua', weightKg: NaN })

    // The over/underweight checks compare against NaN too, so they used to be
    // skipped in silence rather than reporting that the weight was unusable.
    expect(result.warnings.join(' ')).not.toContain('typical range')
    expect(result.warnings.join(' ')).toContain('not a usable positive number')
    expect(result.sizeClass).toBe('toy')
  })
})

describe('calculateDogAge — results', () => {
  const labrador: DogProfile = { ageYears: 8, breedName: 'Labrador Retriever' }

  it('returns all four models with exactly one headline', () => {
    const result = calculateDogAge(labrador)
    expect(result.models).toHaveLength(4)
    expect(result.models.filter((m) => m.headline)).toHaveLength(1)
    expect(result.models.find((m) => m.headline)?.id).toBe(result.humanAge.modelId)
  })

  it('brackets the headline figure with its range', () => {
    const result = calculateDogAge(labrador)
    const [low, high] = result.humanAge.rangeYears
    expect(low).toBeLessThanOrEqual(result.humanAge.years)
    expect(high).toBeGreaterThanOrEqual(result.humanAge.years)
  })

  it('ages a well-cared-for dog more slowly than a neglected one', () => {
    const cared = calculateDogAge({
      ...labrador,
      bodyConditionScore: 5,
      dentalCare: 'regular',
      vetCare: 'annual',
      activityLevel: 'active',
    })
    const neglected = calculateDogAge({
      ...labrador,
      bodyConditionScore: 9,
      dentalCare: 'none',
      vetCare: 'none',
      activityLevel: 'sedentary',
      secondhandSmoke: true,
    })

    expect(cared.humanAge.years).toBeLessThan(neglected.humanAge.years)
    expect(cared.lifespan.expectedYears).toBeGreaterThan(neglected.lifespan.expectedYears)
    expect(cared.remaining.years).toBeGreaterThan(neglected.remaining.years)
  })

  it('ages a short-lived breed faster than the plain chart says', () => {
    const pug = calculateDogAge({ ageYears: 6, breedName: 'Pug' })
    const chart = pug.models.find((m) => m.id === 'chart')!
    expect(pug.humanAge.years).toBeGreaterThan(chart.humanYears!)
  })

  it('judges a breed by its lifespan, not by its face', () => {
    // Pug and Shih Tzu are both brachycephalic and both in the small chart
    // band, but the Shih Tzu lives ~14 years and the Pug ~11. A model keyed on
    // skull shape would age them alike; one keyed on observed lifespan must not.
    const pug = calculateDogAge({ ageYears: 6, breedName: 'Pug' })
    const shihTzu = calculateDogAge({ ageYears: 6, breedName: 'Shih Tzu' })

    expect(pug.chartBand).toBe(shihTzu.chartBand)
    expect(pug.breed?.brachycephalic).toBe(true)
    expect(shihTzu.breed?.brachycephalic).toBe(true)

    expect(pug.humanAge.years).toBeGreaterThan(shihTzu.humanAge.years + 5)

    // And the long-lived one is not dragged above the plain chart at all.
    const chart = shihTzu.models.find((m) => m.id === 'chart')!
    expect(shihTzu.humanAge.years).toBeLessThanOrEqual(chart.humanYears!)
  })

  it('reads a breed that matches its size cohort straight off the chart', () => {
    // Great Dane baseline (9.5) equals the giant-class life expectancy (9.51),
    // so there is nothing to adjust and the headline should be the chart value.
    const dane = calculateDogAge({ ageYears: 6, breedName: 'Great Dane' })
    const chart = dane.models.find((m) => m.id === 'chart')!
    expect(dane.humanAge.years).toBeCloseTo(chart.humanYears!, 0)
  })

  it('never reports negative remaining time for a dog past its life expectancy', () => {
    const ancient = calculateDogAge({ ageYears: 20, breedName: 'Great Dane' })
    expect(ancient.remaining.years).toBe(0)
    expect(ancient.remaining.rangeYears[0]).toBeGreaterThanOrEqual(0)
  })

  it('is monotonic — an older dog is never younger in human years', () => {
    let previous = -Infinity
    for (let age = 0; age <= MAX_SUPPORTED_AGE; age += 0.25) {
      const { years } = calculateDogAge({ ageYears: age, breedName: 'Beagle' }).humanAge
      expect(years, `age ${age}`).toBeGreaterThanOrEqual(previous)
      previous = years
    }
  })

  it('produces recommendations that are actually achievable', () => {
    const result = calculateDogAge({
      ageYears: 6,
      breedName: 'Labrador Retriever',
      bodyConditionScore: 8,
      dentalCare: 'none',
      vetCare: 'none',
      activityLevel: 'sedentary',
    })
    expect(result.recommendations.length).toBeGreaterThan(2)

    const withYears = result.recommendations.filter((r) => r.potentialYears > 0)
    expect(withYears.length).toBeGreaterThan(0)
    // Sorted by impact, and no single change may claim more than saturation allows.
    for (const rec of withYears) {
      expect(rec.potentialYears).toBeLessThan(3)
      expect(rec.detail.length).toBeGreaterThan(40)
    }
    expect(withYears[0]!.potentialYears).toBeGreaterThanOrEqual(withYears.at(-1)!.potentialYears)
  })

  it('has nothing to suggest for a dog already doing everything right', () => {
    const result = calculateDogAge({
      ageYears: 4,
      breedName: 'Border Collie',
      bodyConditionScore: 5,
      dentalCare: 'professional',
      vetCare: 'proactive',
      activityLevel: 'very-active',
      dietQuality: 'excellent',
      environment: 'indoor',
    })
    expect(result.recommendations.filter((r) => r.potentialYears > 0)).toHaveLength(0)
  })

  it('holds together across every breed in the dataset', () => {
    // A cheap fuzz over the real data — every breed, at several ages.
    for (const breed of BREEDS) {
      for (const age of [0.25, 1, 5, 10, 15]) {
        const result = calculateDogAge({ ageYears: age, breedName: breed.name })
        const label = `${breed.name} @ ${age}`

        expect(Number.isFinite(result.humanAge.years), label).toBe(true)
        expect(result.humanAge.years, label).toBeGreaterThanOrEqual(0)
        expect(result.lifespan.expectedYears, label).toBeGreaterThanOrEqual(5)
        expect(result.lifespan.expectedYears, label).toBeLessThanOrEqual(20)
        expect(result.lifeStage.progress, label).toBeGreaterThanOrEqual(0)
        expect(result.lifeStage.progress, label).toBeLessThanOrEqual(1)
        expect(Math.abs(result.lifespan.appliedDeltaYears), label).toBeLessThanOrEqual(
          Math.abs(result.lifespan.rawDeltaYears) + 1e-9,
        )
      }
    }
  })
})

describe('the worked example in the README', () => {
  // Pinned so the documented output can't quietly drift away from the code.
  it('still produces the numbers the README quotes', () => {
    const result = calculateDogAge({
      name: 'Rufus',
      ageYears: 9,
      breedName: 'Lab',
      bodyConditionScore: 7,
      dentalCare: 'none',
      activityLevel: 'sedentary',
    })

    expect(result.breed?.name).toBe('Labrador Retriever')
    expect(result.humanAge.years).toBe(65.3)
    expect(result.lifeStage.stage).toBe('senior')
    expect(result.lifespan.expectedYears).toBe(10.5)
    expect(result.lifespan.rawDeltaYears).toBe(-1.98)
    expect(result.lifespan.appliedDeltaYears).toBe(-1.74)
    expect(result.recommendations[0]).toMatchObject({
      title: 'Get to an ideal body condition',
      potentialYears: 0.9,
    })
  })
})

describe('calculateFromBirthDate', () => {
  it('derives age from a date of birth', () => {
    const result = calculateFromBirthDate(
      { breedName: 'Beagle' },
      new Date(2020, 0, 1),
      new Date(2026, 0, 1),
    )
    expect(result.profile.ageYears).toBeCloseTo(6, 1)
  })
})

describe('isSupportedAge', () => {
  it('accepts the supported band and rejects everything else', () => {
    expect(isSupportedAge(0)).toBe(true)
    expect(isSupportedAge(MAX_SUPPORTED_AGE)).toBe(true)
    expect(isSupportedAge(-1)).toBe(false)
    expect(isSupportedAge(MAX_SUPPORTED_AGE + 1)).toBe(false)
    expect(isSupportedAge(Number.NaN)).toBe(false)
  })
})
