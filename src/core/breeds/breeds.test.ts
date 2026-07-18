import { describe, expect, it } from 'vitest'
import { SIZE_BANDS } from '../constants'
import { sizeClassFromWeight } from '../size'
import { BREEDS, BREED_GROUPS, breedsInGroup, findBreed, popularBreeds, searchBreeds } from './index'

describe('breed dataset integrity', () => {
  it('has a substantial number of breeds', () => {
    expect(BREEDS.length).toBeGreaterThan(200)
  })

  it('has no duplicate names', () => {
    const names = BREEDS.map((b) => b.name.toLowerCase())
    expect(new Set(names).size).toBe(names.length)
  })

  it('has no alias colliding with a canonical name or another alias', () => {
    const canonical = new Set(BREEDS.map((b) => b.name.toLowerCase()))
    const seen = new Set<string>()
    for (const breed of BREEDS) {
      for (const alias of breed.aliases ?? []) {
        const key = alias.toLowerCase()
        expect(canonical.has(key)).toBe(false)
        expect(seen.has(key)).toBe(false)
        seen.add(key)
      }
    }
  })

  it('has coherent weight and lifespan ranges for every breed', () => {
    for (const breed of BREEDS) {
      const [wLow, wHigh] = breed.weightKg
      const [lLow, lHigh] = breed.lifespanYears

      expect(wLow, breed.name).toBeGreaterThan(0)
      expect(wHigh, breed.name).toBeGreaterThanOrEqual(wLow)
      expect(wHigh, breed.name).toBeLessThan(120)

      expect(lLow, breed.name).toBeGreaterThanOrEqual(3)
      expect(lHigh, breed.name).toBeGreaterThanOrEqual(lLow)
      expect(lHigh, breed.name).toBeLessThanOrEqual(22)
    }
  })

  it('assigns every breed a size class consistent with its weight midpoint', () => {
    for (const breed of BREEDS) {
      const [low, high] = breed.weightKg
      const midpoint = (low + high) / 2
      expect(breed.sizeClass, `${breed.name} (${midpoint} kg)`).toBe(sizeClassFromWeight(midpoint))
    }
  })

  it('uses only known size classes and non-empty groups', () => {
    const validClasses = new Set(SIZE_BANDS.map((b) => b.sizeClass))
    for (const breed of BREEDS) {
      expect(validClasses.has(breed.sizeClass), breed.name).toBe(true)
      expect(breed.group.length, breed.name).toBeGreaterThan(0)
    }
  })

  it('gives every breed at least one documented health risk', () => {
    for (const breed of BREEDS) {
      expect(breed.healthRisks?.length ?? 0, breed.name).toBeGreaterThan(0)
    }
  })

  it('flags a plausible number of brachycephalic breeds', () => {
    const flat = BREEDS.filter((b) => b.brachycephalic)
    expect(flat.length).toBeGreaterThan(8)
    expect(flat.length).toBeLessThan(40)
    // Spot-check the ones nobody could get wrong. Resolving the breed is part
    // of the assertion: `if (breed) expect(...)` would skip silently on a
    // rename, which is the exact regression this guards against.
    for (const name of ['Pug', 'French Bulldog', 'Bulldog', 'Boxer']) {
      const breed = findBreed(name)
      expect(breed, name).toBeDefined()
      expect(breed!.brachycephalic, name).toBe(true)
    }
  })

  it('does not flag obviously long-muzzled breeds as brachycephalic', () => {
    for (const name of ['Border Collie', 'Greyhound', 'Labrador Retriever', 'German Shepherd Dog']) {
      const breed = findBreed(name)
      expect(breed, name).toBeDefined()
      expect(breed!.brachycephalic ?? false, name).toBe(false)
    }
  })
})

describe('findBreed', () => {
  it('finds a breed by its canonical name', () => {
    expect(findBreed('Labrador Retriever')?.name).toBe('Labrador Retriever')
  })

  it('is case and punctuation insensitive', () => {
    expect(findBreed('labrador retriever')?.name).toBe('Labrador Retriever')
    expect(findBreed('  LABRADOR   RETRIEVER  ')?.name).toBe('Labrador Retriever')
  })

  it('resolves aliases', () => {
    expect(findBreed('Lab')?.name).toBe('Labrador Retriever')
  })

  it('returns undefined for nonsense', () => {
    expect(findBreed('Velociraptor')).toBeUndefined()
    expect(findBreed('')).toBeUndefined()
  })
})

describe('searchBreeds', () => {
  it('ranks an exact name first', () => {
    expect(searchBreeds('Beagle')[0]?.name).toBe('Beagle')
  })

  it('finds breeds by prefix', () => {
    const names = searchBreeds('golden').map((b) => b.name)
    expect(names).toContain('Golden Retriever')
  })

  it('matches on an interior word', () => {
    const names = searchBreeds('retriever').map((b) => b.name)
    expect(names.length).toBeGreaterThan(2)
    expect(names.some((n) => n.includes('Retriever'))).toBe(true)
  })

  it('respects the limit', () => {
    expect(searchBreeds('e', 5).length).toBeLessThanOrEqual(5)
  })

  it('falls back to popular breeds for an empty query', () => {
    expect(searchBreeds('').length).toBeGreaterThan(0)
    expect(searchBreeds('   ')[0]?.name).toBe('Labrador Retriever')
  })

  it('returns nothing for a query that matches nothing', () => {
    expect(searchBreeds('zzzzqqqq')).toEqual([])
  })

  it('does not let a two-letter query subsequence-match everything', () => {
    // Short queries should only match by prefix or substring, never subsequence.
    const results = searchBreeds('xq', 50)
    expect(results).toEqual([])
  })
})

describe('popularBreeds', () => {
  it('resolves every name in the curated list', () => {
    // Guards against the dataset being regenerated with different names.
    expect(popularBreeds().length).toBe(10)
  })
})

describe('groups', () => {
  it('exposes the AKC groups plus mixed breeds', () => {
    expect(BREED_GROUPS).toContain('Sporting')
    expect(BREED_GROUPS).toContain('Non-Sporting')
    expect(BREED_GROUPS).toContain('Mixed & Designer')
  })

  it('sorts every breed into one of the known groups', () => {
    // Summing breedsInGroup over BREED_GROUPS and comparing to BREEDS.length
    // proves nothing: BREED_GROUPS is derived from BREEDS, so the two agree by
    // construction for any dataset, correct or not. Pinning the expected set is
    // what actually catches a regression — an earlier version of the data
    // generator matched "sporting" inside "non-sporting" and silently collapsed
    // two groups into one, which this would have failed on and that would not.
    expect([...BREED_GROUPS].sort()).toEqual([
      'Herding',
      'Hound',
      'Mixed & Designer',
      'Non-Sporting',
      'Sporting',
      'Terrier',
      'Toy',
      'Working',
    ])

    // "Other" is the generator's fallback for an unrecognised group; none should survive.
    expect(breedsInGroup('Other')).toEqual([])

    const total = BREED_GROUPS.reduce((sum, group) => sum + breedsInGroup(group).length, 0)
    expect(total).toBe(BREEDS.length)

    // No group should be a near-empty rump, which is what a bad match produces.
    for (const group of BREED_GROUPS) {
      expect(breedsInGroup(group).length, group).toBeGreaterThan(15)
    }
  })
})
