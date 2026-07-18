import { describe, expect, it } from 'vitest'
import { daysUntilBirthday, describeYears, nextBirthday, yearsBetween } from './age'

describe('yearsBetween', () => {
  it('measures a whole year', () => {
    const from = new Date(2020, 0, 1)
    const to = new Date(2021, 0, 1)
    expect(yearsBetween(from, to)).toBeCloseTo(1, 2)
  })

  it('measures fractional years', () => {
    const from = new Date(2020, 0, 1)
    const to = new Date(2020, 6, 1)
    expect(yearsBetween(from, to)).toBeCloseTo(0.5, 2)
  })

  it('goes negative when the dates are the wrong way round', () => {
    expect(yearsBetween(new Date(2021, 0, 1), new Date(2020, 0, 1))).toBeLessThan(0)
  })

  it('does not drift across a leap year', () => {
    // 2024 is a leap year; four calendar years should still read as ~4.
    expect(yearsBetween(new Date(2022, 0, 1), new Date(2026, 0, 1))).toBeCloseTo(4, 2)
  })
})

describe('describeYears', () => {
  it('renders years and months', () => {
    expect(describeYears(2.25).label).toBe('2 years, 3 months')
  })

  it('drops the year part for young puppies', () => {
    expect(describeYears(0.5)).toMatchObject({ years: 0, months: 6, label: '6 months' })
  })

  it('singularises', () => {
    expect(describeYears(1).label).toBe('1 year')
    expect(describeYears(1 + 1 / 12).label).toBe('1 year, 1 month')
  })

  it('handles a brand new puppy', () => {
    expect(describeYears(0.02).label).toBe('under a month')
  })

  it('is not tripped up by float drift', () => {
    // 24 months of accumulated float error must still read as a clean 2 years.
    expect(describeYears(1.9999999999).label).toBe('2 years')
  })

  it('clamps negatives rather than rendering nonsense', () => {
    expect(describeYears(-3).label).toBe('under a month')
  })
})

describe('nextBirthday', () => {
  it('finds the birthday later this year', () => {
    const birth = new Date(2020, 8, 15)
    expect(nextBirthday(birth, new Date(2026, 0, 10))).toEqual(new Date(2026, 8, 15))
  })

  it('rolls into next year once the birthday has passed', () => {
    const birth = new Date(2020, 0, 5)
    expect(nextBirthday(birth, new Date(2026, 6, 1))).toEqual(new Date(2027, 0, 5))
  })

  it('counts today as the birthday', () => {
    const birth = new Date(2020, 3, 20)
    const today = new Date(2026, 3, 20, 14, 30)
    expect(daysUntilBirthday(birth, today)).toBe(0)
  })

  it('rolls a Feb 29 birthday to Mar 1 in a common year', () => {
    const birth = new Date(2020, 1, 29)
    expect(nextBirthday(birth, new Date(2026, 0, 1))).toEqual(new Date(2026, 2, 1))
  })
})

describe('daysUntilBirthday', () => {
  it('counts the days', () => {
    const birth = new Date(2020, 0, 11)
    expect(daysUntilBirthday(birth, new Date(2026, 0, 1))).toBe(10)
  })

  it('never exceeds a year', () => {
    const birth = new Date(2020, 0, 1)
    expect(daysUntilBirthday(birth, new Date(2026, 0, 2))).toBeLessThanOrEqual(366)
  })
})
