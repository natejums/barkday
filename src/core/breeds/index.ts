/**
 * Breed lookup and search.
 *
 * People type "lab", "alsatian", "german shepard" and "Golden". The lookup has
 * to absorb all of that without a dependency on a fuzzy-search library.
 */

import type { Breed } from '../types'
import { BREEDS } from './data'
import { findBreed, normalise } from './resolve'

export { BREEDS }
export { findBreed } from './resolve'
export { blendBreeds } from './blend'

/** True when every character of `query` appears in `text`, in order. */
function isSubsequence(query: string, text: string): boolean {
  let qi = 0
  for (let ti = 0; ti < text.length && qi < query.length; ti += 1) {
    if (text[ti] === query[qi]) qi += 1
  }
  return qi === query.length
}

function scoreBreed(breed: Breed, query: string): number {
  const name = normalise(breed.name)
  const aliases = (breed.aliases ?? []).map(normalise)

  if (name === query) return 1000
  if (aliases.includes(query)) return 950

  // Shorter names rank above longer ones on the same prefix, so "Poodle" beats
  // "Poodle (Standard)" when someone types "poo".
  if (name.startsWith(query)) return 800 - Math.min(name.length, 60)
  if (aliases.some((a) => a.startsWith(query))) return 700

  if (name.split(' ').some((word) => word.startsWith(query))) return 650
  if (aliases.some((a) => a.split(' ').some((word) => word.startsWith(query)))) return 600

  if (name.includes(query)) return 500
  if (aliases.some((a) => a.includes(query))) return 450

  // Last resort, and only for queries long enough that a subsequence match
  // means something — with 2 characters nearly everything matches.
  if (query.length >= 4 && isSubsequence(query, name)) return 200

  return 0
}

/** Breeds people actually own, shown before anything has been typed. */
const POPULAR = [
  'Labrador Retriever',
  'French Bulldog',
  'Golden Retriever',
  'German Shepherd Dog',
  'Poodle (Standard)',
  'Dachshund',
  'Beagle',
  'Border Collie',
  'Chihuahua',
  'Mixed Breed Medium',
]

export function popularBreeds(limit = 10): Breed[] {
  return POPULAR.map((name) => findBreed(name)).filter((b): b is Breed => b !== undefined).slice(0, limit)
}

/**
 * Ranked search. An empty query returns popular breeds rather than the first
 * few alphabetically, which would open on a wall of Affenpinschers.
 */
export function searchBreeds(query: string, limit = 12): Breed[] {
  const normalised = normalise(query)
  if (!normalised) return popularBreeds(limit)

  return BREEDS.map((breed) => ({ breed, score: scoreBreed(breed, normalised) }))
    .filter((entry) => entry.score > 0)
    .sort((a, b) => b.score - a.score || a.breed.name.localeCompare(b.breed.name))
    .slice(0, limit)
    .map((entry) => entry.breed)
}

export const BREED_GROUPS: readonly string[] = [...new Set(BREEDS.map((b) => b.group))].sort()

export function breedsInGroup(group: string): Breed[] {
  return BREEDS.filter((b) => b.group === group)
}
