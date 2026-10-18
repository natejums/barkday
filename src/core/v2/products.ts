/**
 * The 2.0 additions to the brand-free gear list.
 *
 * Same rules as 1.0: generic categories only, no brands, no links, nothing
 * sponsored, and each item is tied to something the report actually found.
 */

import { PRODUCT_CATALOG } from '../products'
import type { ProductSuggestion } from '../types'
import type { InsightContext } from './context'

const DEEP_PRODUCTS: Readonly<Record<string, { title: string; detail: string }>> = {
  'car-restraint': {
    title: 'A crash-tested car harness or travel crate',
    detail:
      'Clips into the rear seat-belt or sits secured in the boot. Protects the dog in a collision and keeps the driver’s attention where it belongs.',
  },
  'puzzle-feeder': {
    title: 'A puzzle feeder or snuffle mat',
    detail:
      'Turns one meal a day into ten minutes of problem-solving. The cheapest daily enrichment there is, and it slows fast eaters too.',
  },
  'stainless-bowls': {
    title: 'Stainless-steel food and water bowls',
    detail:
      'Scratch-resistant and dishwasher-safe, so they actually get clean. Plastic scratches and harbours bacteria; a non-slip mat underneath stops the sliding.',
  },
  'long-line': {
    title: 'A long training line',
    detail:
      'Ten metres of freedom with a safety net, for teaching a recall that works before it is tested near a road.',
  },
  'dog-coat': {
    title: 'A fitted winter coat',
    detail:
      'For a small, thin-coated or older dog on the coldest days. Fit matters more than fashion: free shoulders, covered belly.',
  },
  'first-aid-kit': {
    title: 'A pet first-aid kit',
    detail:
      'Self-adhesive bandage, saline, a tick hook, a towel, a soft muzzle, and the emergency and poison-line numbers written inside the lid.',
  },
  'ear-cleaner': {
    title: 'A vet-recommended ear cleaner',
    detail:
      'For weekly checks and after swimming in a dog prone to ear infections. Catch wax before it becomes an infection.',
  },
  'bathroom-scale': {
    title: 'A way to weigh them monthly',
    detail:
      'The vet’s walk-on scale is free; for a small dog, a bathroom scale and some subtraction works. The trend is what matters.',
  },
  'water-bottle': {
    title: 'A travel water bottle or collapsible bowl',
    detail: 'So there is always a better option than the puddle, and water on hand in the heat.',
  },
}

/**
 * The 1.0 list first, then 2.0's additions, deduplicated, capped so it never
 * reads as a shop.
 */
export function buildDeepGear(
  c: InsightContext,
  base: readonly ProductSuggestion[],
): ProductSuggestion[] {
  const { p } = c
  const extras: { id: string; reason: string }[] = []
  const want = (id: string, reason: string) => extras.push({ id, reason })

  if (p.carTravel === 'loose') want('car-restraint', 'car-loose')
  if (p.enrichment === 'rarely' || p.enrichment === 'sometimes') want('puzzle-feeder', 'enrichment')
  if (p.mealsPerDay === 'free-fed' && !base.some((b) => b.id === 'slow-feeder')) want('puzzle-feeder', 'meals-free-fed')
  if (p.waterSource === 'bowl-topped-up') want('stainless-bowls', 'water-topped-up')
  if (c.ex('off-leash') && (c.young || p.training === 'none' || p.training === undefined)) want('long-line', 'exercise-off-leash-recall')
  if ((p.climate === 'cold' || p.climate === 'both') && (c.tiny || c.older)) want('dog-coat', 'climate-cold')
  if (p.readiness !== undefined || p.knowsEmergencyVet !== undefined) want('first-aid-kit', 'readiness')
  if (c.cond.has('otitis') && (c.ex('swimming') || c.has('allergies'))) want('ear-cleaner', 'breed-otitis')
  if (p.weightTrend === 'gaining' || (p.bodyConditionScore ?? 5) > 5) want('bathroom-scale', 'weight')
  if (p.waterSource === 'outdoor-sources' || c.ex('hiking') || p.climate === 'hot' || p.climate === 'both') want('water-bottle', 'water-outdoor')
  if ((p.climate === 'hot' || p.climate === 'both') && (c.brachy || c.size === 'giant')) want('cooling-mat', 'climate-hot')
  if (c.older && (p.sleep === 'restless' || c.sign('night-restless') || c.sign('confusion'))) want('night-light', 'sleep-restless-older')
  if (c.has('back') || c.has('arthritis') || p.mobility === 'avoids-stairs') {
    want('ramp', 'mobility')
    want('traction', 'mobility')
    want('orthopedic-bed', 'mobility')
  }
  if (c.cond.has('tracheal-collapse') || c.has('back')) want('harness', 'airway-or-back')

  const result: ProductSuggestion[] = [...base]
  for (const extra of extras) {
    if (result.some((r) => r.id === extra.id)) continue
    const spec = DEEP_PRODUCTS[extra.id] ?? PRODUCT_CATALOG[extra.id]
    if (!spec) continue
    result.push({ id: extra.id, title: spec.title, detail: spec.detail, triggeredBy: extra.reason })
  }
  return result.slice(0, 9)
}
