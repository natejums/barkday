/**
 * Blending a known mix into a single synthetic breed.
 *
 * When an owner knows their dog is, say, 60% Labrador and 40% Poodle, that is
 * real information the engine can use: the dog's expected size and lifespan are
 * genuinely a weighted blend of its components, and it can inherit health risks
 * from any of them. Blending the observed breed baselines is *not* the "mutts
 * are healthier" bonus this project deliberately refuses to model — it adds no
 * heterozygosity credit and no crossbreed penalty. It only uses the composition
 * the owner supplied, and where the evidence is a coin-flip (Montoya calls mixed
 * vs all-dogs a tie; McMillan has crossbreeds shorter-lived) it stays silent.
 */

import { matchCondition } from '../health'
import { sizeClassFromWeight } from '../size'
import type { Breed } from '../types'
import { round } from '../units'
import { findBreed } from './resolve'

/**
 * Fold component breeds, resolved and weighted, into one synthetic `Breed`.
 *
 * Returns undefined when nothing resolves. A single resolved component is
 * returned as itself rather than dressed up as a "mix of one".
 */
export function blendBreeds(
  components: readonly { breedName: string; fraction: number }[],
): Breed | undefined {
  const resolved = components
    .map((c) => ({ breed: findBreed(c.breedName), fraction: c.fraction }))
    .filter(
      (c): c is { breed: Breed; fraction: number } =>
        c.breed !== undefined && Number.isFinite(c.fraction) && c.fraction > 0,
    )

  if (resolved.length === 0) return undefined

  const total = resolved.reduce((sum, c) => sum + c.fraction, 0)
  const parts = resolved.map((c) => ({ breed: c.breed, weight: c.fraction / total }))

  // A "mix" of one known breed is just that breed.
  if (parts.length === 1) return parts[0]!.breed

  const weighted = (pick: (b: Breed) => number) =>
    parts.reduce((sum, p) => sum + pick(p.breed) * p.weight, 0)

  const weightLow = weighted((b) => b.weightKg[0])
  const weightHigh = weighted((b) => b.weightKg[1])
  const lifeLow = weighted((b) => b.lifespanYears[0])
  const lifeHigh = weighted((b) => b.lifespanYears[1])

  const midpoint = (weightLow + weightHigh) / 2
  const brachyFraction = parts.reduce((sum, p) => sum + (p.breed.brachycephalic ? p.weight : 0), 0)

  const name = parts.map((p) => `${Math.round(p.weight * 100)}% ${p.breed.name}`).join(' · ')

  return {
    name,
    group: 'Mixed & Designer',
    sizeClass: sizeClassFromWeight(midpoint),
    weightKg: [round(weightLow, 1), round(weightHigh, 1)],
    lifespanYears: [round(lifeLow, 1), round(lifeHigh, 1)],
    // A cross is called flat-faced only when the flat-faced side is the majority
    // — brachycephaly in an individual cross is genuinely unpredictable, so this
    // stays conservative rather than docking every part-Pug for an airway it may
    // not have inherited.
    ...(brachyFraction >= 0.5 ? { brachycephalic: true } : {}),
    healthRisks: poolHealthRisks(parts),
    notes:
      'A known mix. Its expected size and lifespan are blended from its component breeds by the ' +
      'percentages given, and the health notes are pooled from all of them — an individual dog ' +
      'inherits some of each and none is a certainty. No mixed-breed longevity bonus or penalty is ' +
      'applied: the largest studies disagree on whether crossbreeds live longer or shorter, so the ' +
      'honest move is to model neither.',
  }
}

/**
 * Pool the components' risks into one deduplicated list.
 *
 * The same predisposition written two different ways by two breeds ("Hip
 * dysplasia" and "Hip dysplasia and elbow dysplasia") would otherwise show
 * twice. Keying on the matched condition — falling back to the raw phrase when
 * nothing matches — collapses those, keeping the higher-fraction component's
 * wording since it is seen first.
 */
function poolHealthRisks(parts: readonly { breed: Breed; weight: number }[]): string[] {
  const ordered = [...parts].sort((a, b) => b.weight - a.weight)
  const seen = new Set<string>()
  const pooled: string[] = []

  for (const part of ordered) {
    for (const risk of part.breed.healthRisks ?? []) {
      const key = matchCondition(risk)?.id ?? risk.trim().toLowerCase()
      if (seen.has(key)) continue
      seen.add(key)
      pooled.push(risk)
    }
  }

  return pooled
}
