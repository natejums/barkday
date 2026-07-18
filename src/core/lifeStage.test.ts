import { describe, expect, it } from 'vitest'
import { classifyLifeStage, stageBoundaries } from './lifeStage'
import type { SizeClass } from './types'

const SIZES: SizeClass[] = ['toy', 'small', 'medium', 'large', 'giant']

describe('stageBoundaries', () => {
  it('always produces strictly increasing boundaries', () => {
    for (const size of SIZES) {
      // Include a deliberately short lifespan, where the absolute growth
      // milestones would otherwise overtake the proportional senior threshold.
      for (const lifespan of [5, 8, 9.5, 12.7, 16, 20]) {
        const b = stageBoundaries(size, lifespan)
        const label = `${size} @ ${lifespan}y`
        expect(b.puppyEndsYears, label).toBeLessThan(b.youngAdultEndsYears)
        expect(b.youngAdultEndsYears, label).toBeLessThan(b.seniorStarts)
        expect(b.seniorStarts, label).toBeLessThan(b.geriatricStarts)
      }
    }
  })

  it('places senior at three quarters of expected lifespan', () => {
    expect(stageBoundaries('medium', 12).seniorStarts).toBeCloseTo(9, 6)
  })

  it('lets bigger dogs finish growing later', () => {
    expect(stageBoundaries('giant', 12).puppyEndsYears).toBeGreaterThan(
      stageBoundaries('toy', 12).puppyEndsYears,
    )
  })
})

describe('classifyLifeStage', () => {
  it('walks a medium dog through every stage in order', () => {
    const lifespan = 12.7
    expect(classifyLifeStage(0.5, 'medium', lifespan).stage).toBe('puppy')
    expect(classifyLifeStage(2, 'medium', lifespan).stage).toBe('young-adult')
    expect(classifyLifeStage(6, 'medium', lifespan).stage).toBe('mature-adult')
    expect(classifyLifeStage(10, 'medium', lifespan).stage).toBe('senior')
    expect(classifyLifeStage(12, 'medium', lifespan).stage).toBe('geriatric')
  })

  it('makes a giant breed senior years before a toy breed', () => {
    // The central claim of a size-aware calculator.
    const dane = classifyLifeStage(7.5, 'giant', 9.5)
    const chihuahua = classifyLifeStage(7.5, 'toy', 13.4)
    expect(dane.stage).toBe('senior')
    expect(chihuahua.stage).toBe('mature-adult')
  })

  it('reports progress through expected lifespan, clamped to 0..1', () => {
    expect(classifyLifeStage(6, 'medium', 12).progress).toBeCloseTo(0.5, 2)
    expect(classifyLifeStage(0, 'medium', 12).progress).toBe(0)
    expect(classifyLifeStage(40, 'medium', 12).progress).toBe(1)
  })

  it('names the next stage and when it starts, except at the last one', () => {
    const adult = classifyLifeStage(6, 'medium', 12.7)
    expect(adult.nextStage?.stage).toBe('senior')
    expect(adult.nextStage?.atAgeYears).toBeGreaterThan(6)

    expect(classifyLifeStage(20, 'medium', 12.7).nextStage).toBeUndefined()
  })

  it('carries care guidance for every stage', () => {
    for (const age of [0.3, 2, 6, 10, 13]) {
      const info = classifyLifeStage(age, 'medium', 12.7)
      expect(info.careGuidance.length, `age ${age}`).toBeGreaterThan(2)
      expect(info.description.length).toBeGreaterThan(20)
    }
  })

  it('never regresses to an earlier stage as the dog ages', () => {
    const order = ['puppy', 'young-adult', 'mature-adult', 'senior', 'geriatric']
    for (const size of SIZES) {
      let previous = -1
      for (let age = 0; age <= 20; age += 0.1) {
        const index = order.indexOf(classifyLifeStage(age, size, 12).stage)
        expect(index, `${size} @ ${age.toFixed(1)}`).toBeGreaterThanOrEqual(previous)
        previous = index
      }
    }
  })
})
