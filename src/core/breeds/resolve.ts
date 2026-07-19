/**
 * The exact breed lookup, factored out so both the search index and the
 * mix-blending code can share it without importing each other in a circle.
 */

import type { Breed } from '../types'
import { BREEDS } from './data'

/** Lowercase, strip punctuation and accents, collapse whitespace. */
export function normalise(value: string): string {
  return value
    .toLowerCase()
    .normalize('NFD')
    // Drop combining accents so "Lowchen" finds "Löwchen".
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/[^a-z0-9\s]/g, ' ')
    .replace(/\s+/g, ' ')
    .trim()
}

const exactIndex = new Map<string, Breed>()
for (const breed of BREEDS) {
  exactIndex.set(normalise(breed.name), breed)
  for (const alias of breed.aliases ?? []) {
    const key = normalise(alias)
    // Canonical names win; an alias never displaces one.
    if (!exactIndex.has(key)) exactIndex.set(key, breed)
  }
}

/** Exact match on a canonical name or a known alias. */
export function findBreed(nameOrAlias: string): Breed | undefined {
  return exactIndex.get(normalise(nameOrAlias))
}
