import { describe, expect, it } from 'vitest'
import { calculateDogAge } from './calculate'
import { buildProductSuggestions } from './products'
import type { Recommendation } from './types'

const rec = (id: string): Recommendation => ({
  id,
  title: id,
  detail: 'x'.repeat(50),
  potentialYears: 0.5,
  priority: 'high',
})

describe('buildProductSuggestions', () => {
  it('suggests nothing when nothing triggered it', () => {
    expect(buildProductSuggestions([], undefined, 'mature-adult')).toEqual([])
  })

  it('maps recommendations to the gear that serves them', () => {
    const ids = buildProductSuggestions([rec('body-condition'), rec('dental')], undefined, 'young-adult').map(
      (p) => p.id,
    )
    expect(ids).toEqual(expect.arrayContaining(['kitchen-scale', 'weight-diet', 'toothbrush', 'dental-chews']))
  })

  it('adds comfort gear for a senior by life stage', () => {
    const ids = buildProductSuggestions([], undefined, 'senior').map((p) => p.id)
    expect(ids).toEqual(expect.arrayContaining(['orthopedic-bed', 'traction', 'ramp']))
  })

  it('deduplicates when two findings point at the same thing', () => {
    // body-condition and diet both want a kitchen scale.
    const suggestions = buildProductSuggestions([rec('body-condition'), rec('diet')], undefined, 'mature-adult')
    expect(suggestions.filter((p) => p.id === 'kitchen-scale')).toHaveLength(1)
  })

  it('caps the list so it never reads as a catalogue', () => {
    const suggestions = buildProductSuggestions(
      [rec('body-condition'), rec('dental'), rec('vet-care')],
      undefined,
      'geriatric',
    )
    expect(suggestions.length).toBeLessThanOrEqual(6)
  })

  it('names categories only — never a brand or a link', () => {
    const suggestions = buildProductSuggestions(
      [rec('body-condition'), rec('dental'), rec('vet-care')],
      undefined,
      'senior',
    )
    expect(suggestions.length).toBeGreaterThan(0)
    for (const product of suggestions) {
      expect(product.detail, product.id).not.toMatch(/https?:\/\//)
      expect(product.title.length, product.id).toBeGreaterThan(3)
      expect(product.triggeredBy.length, product.id).toBeGreaterThan(0)
    }
  })
})

describe('calculateDogAge — product suggestions', () => {
  it('always returns an array, even with nothing to say', () => {
    expect(calculateDogAge({ ageYears: 3 }).productSuggestions).toEqual([])
  })

  it('suggests airway gear for a flat-faced breed', () => {
    const result = calculateDogAge({ ageYears: 4, breedName: 'Pug' })
    expect(result.productSuggestions.map((p) => p.id)).toContain('harness')
  })

  it('suggests a slow feeder for a bloat-prone breed', () => {
    const result = calculateDogAge({ ageYears: 5, breedName: 'Great Dane' })
    expect(result.productSuggestions.map((p) => p.id)).toContain('slow-feeder')
  })

  it('does not push senior gear at a young dog with a late-onset predisposition', () => {
    // A young Rottweiler is predisposed to arthritis, but an orthopaedic bed is a
    // decade early — condition-driven gear is gated on the concern mattering now.
    const young = calculateDogAge({ ageYears: 1.5, breedName: 'Rottweiler' })
    expect(young.productSuggestions.map((p) => p.id)).not.toContain('orthopedic-bed')
  })
})
