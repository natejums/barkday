import { describe, expect, it } from 'vitest'
import { sizeClassFromWeight } from '../size'
import { blendBreeds, findBreed } from './index'

const dane = findBreed('Great Dane')!
const chihuahua = findBreed('Chihuahua')!
const lab = findBreed('Labrador Retriever')!
const golden = findBreed('Golden Retriever')!

describe('blendBreeds', () => {
  it('returns undefined when nothing resolves', () => {
    expect(blendBreeds([])).toBeUndefined()
    expect(blendBreeds([{ breedName: 'Direwolf', fraction: 1 }])).toBeUndefined()
    expect(blendBreeds([{ breedName: 'Lab', fraction: 0 }])).toBeUndefined()
  })

  it('returns the breed itself for a single resolved component', () => {
    expect(blendBreeds([{ breedName: 'Labrador Retriever', fraction: 100 }])).toBe(lab)
    // Even if other components are unrecognised or zero-weight.
    expect(blendBreeds([{ breedName: 'lab', fraction: 80 }, { breedName: 'Nessie', fraction: 20 }])).toBe(
      lab,
    )
  })

  it('blends weight and lifespan by fraction', () => {
    const blend = blendBreeds([
      { breedName: 'Great Dane', fraction: 50 },
      { breedName: 'Chihuahua', fraction: 50 },
    ])!
    // The blend rounds to a tenth, so compare at whole-unit tolerance.
    expect(blend.weightKg[0]).toBeCloseTo((dane.weightKg[0] + chihuahua.weightKg[0]) / 2, 0)
    expect(blend.weightKg[1]).toBeCloseTo((dane.weightKg[1] + chihuahua.weightKg[1]) / 2, 0)
    expect(blend.lifespanYears[0]).toBeCloseTo((dane.lifespanYears[0] + chihuahua.lifespanYears[0]) / 2, 0)
  })

  it('normalises fractions that do not sum to one', () => {
    // 3:1 by any scale is the same blend.
    const a = blendBreeds([
      { breedName: 'Great Dane', fraction: 75 },
      { breedName: 'Chihuahua', fraction: 25 },
    ])!
    const b = blendBreeds([
      { breedName: 'Great Dane', fraction: 3 },
      { breedName: 'Chihuahua', fraction: 1 },
    ])!
    expect(a.weightKg).toEqual(b.weightKg)
    expect(a.lifespanYears).toEqual(b.lifespanYears)
  })

  it('derives size class from the blended weight midpoint', () => {
    const blend = blendBreeds([
      { breedName: 'Great Dane', fraction: 50 },
      { breedName: 'Chihuahua', fraction: 50 },
    ])!
    const midpoint = (blend.weightKg[0] + blend.weightKg[1]) / 2
    expect(blend.sizeClass).toBe(sizeClassFromWeight(midpoint))
  })

  it('pools and deduplicates health risks across components', () => {
    const blend = blendBreeds([
      { breedName: 'Labrador Retriever', fraction: 50 },
      { breedName: 'Golden Retriever', fraction: 50 },
    ])!
    // Union, but no condition should appear twice even though both breeds share
    // several (hip dysplasia, ear infections, cancers).
    const ids = (blend.healthRisks ?? []).map((r) => r.toLowerCase())
    expect(ids.length).toBeGreaterThan(0)
    expect(new Set(ids).size).toBe(ids.length)
    // It should carry risks that only one parent has.
    const combined = [...(lab.healthRisks ?? []), ...(golden.healthRisks ?? [])]
    expect(combined.length).toBeGreaterThan(blend.healthRisks!.length)
  })

  it('only calls a cross flat-faced when the flat-faced side is the majority', () => {
    const pug = findBreed('Pug')!
    expect(pug.brachycephalic).toBe(true)

    const mostlyPug = blendBreeds([
      { breedName: 'Pug', fraction: 70 },
      { breedName: 'Beagle', fraction: 30 },
    ])!
    expect(mostlyPug.brachycephalic).toBe(true)

    const mostlyBeagle = blendBreeds([
      { breedName: 'Pug', fraction: 30 },
      { breedName: 'Beagle', fraction: 70 },
    ])!
    expect(mostlyBeagle.brachycephalic ?? false).toBe(false)
  })

  it('names the mix by its rounded percentages', () => {
    const blend = blendBreeds([
      { breedName: 'Labrador Retriever', fraction: 60 },
      { breedName: 'Poodle (Standard)', fraction: 40 },
    ])!
    expect(blend.name).toContain('60% Labrador Retriever')
    expect(blend.name).toContain('40% Poodle (Standard)')
  })
})
