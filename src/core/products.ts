/**
 * Gear that tends to help — turned from the model's findings, not from a sponsor.
 *
 * Every suggestion is a generic *category* ("a Y-front harness", "a kitchen
 * scale"), never a brand, and there are no links, prices or affiliate tags. It
 * is triggered by something the model actually found for this dog — a
 * recommendation, a breed health flag that matters at this age, or the life
 * stage — so an owner who lands on it sees things genuinely relevant to their
 * dog rather than a shop. Naming brands or carrying affiliate links would trade
 * the project's credibility for pennies, so it doesn't.
 */

import type {
  BreedHealthReport,
  LifeStageId,
  ProductSuggestion,
  Recommendation,
} from './types'

interface ProductSpec {
  title: string
  detail: string
}

/** The catalogue of generic categories. Keyed by id; ordered by PRODUCT_ORDER below. */
const PRODUCTS: Readonly<Record<string, ProductSpec>> = {
  harness: {
    title: 'A Y-front harness',
    detail:
      'Keeps pressure off the throat and windpipe. Worth it for any dog that pulls, and close to essential for flat-faced breeds and anything with an airway or neck issue.',
  },
  ramp: {
    title: 'A ramp or set of steps',
    detail:
      'Spares the spine and joints the jump on and off the sofa or into the car. It matters most for long-backed breeds prone to disc disease, and for seniors and big dogs generally.',
  },
  'orthopedic-bed': {
    title: 'A supportive orthopaedic bed',
    detail:
      'A firm memory-foam bed takes pressure off aging joints — one of the simplest comfort upgrades for a senior or arthritic dog.',
  },
  traction: {
    title: 'Non-slip rugs or toe grips',
    detail:
      'Slick floors are hard on weak or arthritic legs. Runners, yoga-mat strips or toe-grips give an older dog the traction to get up and move with confidence.',
  },
  'joint-support': {
    title: 'An omega-3 or joint supplement',
    detail:
      'The evidence is modest, so treat it as a helper rather than a fix — but fish-oil omega-3s and joint supplements are low-risk support for aging or large-breed joints. Ask your vet about the right dose.',
  },
  toothbrush: {
    title: 'A dog toothbrush and enzymatic paste',
    detail:
      'Daily brushing is the thing that actually slows periodontal disease. Human toothpaste is not dog-safe — use a canine enzymatic one.',
  },
  'dental-chews': {
    title: 'VOHC-accepted dental chews',
    detail:
      'Look for the Veterinary Oral Health Council seal. Those are the chews with real evidence they cut plaque and tartar, rather than just marketing.',
  },
  'kitchen-scale': {
    title: 'A kitchen or gram scale',
    detail:
      'Weigh meals instead of scooping. Portion control is the best-evidenced way to add healthy years, and an eyeballed scoop is where most of the creep comes from.',
  },
  'weight-diet': {
    title: 'A complete weight-management food',
    detail:
      'A vet-recommended lower-calorie complete diet lets you cut calories without cutting nutrition, so a dog losing weight still gets everything it needs.',
  },
  'slow-feeder': {
    title: 'A slow-feeder or puzzle bowl',
    detail:
      'Ridged bowls and food puzzles make a fast eater work for each mouthful. That paces meals, adds enrichment, and cuts the gulping of air that raises bloat risk in deep-chested breeds.',
  },
  'parasite-prevention': {
    title: 'Year-round parasite prevention',
    detail:
      'Flea, tick and heartworm preventives from your vet stop problems far cheaper to prevent than treat — heartworm damage in particular is permanent.',
  },
  'cooling-mat': {
    title: 'A cooling mat and travel water bowl',
    detail:
      'Flat-faced and thick-coated dogs overheat fast. A cooling mat at home and water on walks lower the risk on warm days.',
  },
  'chew-toys': {
    title: 'Durable puppy chew toys',
    detail:
      'A teething puppy will chew something — appropriate chews save the furniture and give them a safe outlet at the age it matters most.',
  },
  'night-light': {
    title: 'A few low night lights',
    detail:
      'For a dog losing vision or showing cognitive change at night, low night lights around the home help it navigate and settle.',
  },
}

/** Display order — safety and comfort essentials first, nice-to-haves last. */
const PRODUCT_ORDER: readonly string[] = [
  'harness',
  'ramp',
  'orthopedic-bed',
  'traction',
  'joint-support',
  'toothbrush',
  'dental-chews',
  'kitchen-scale',
  'weight-diet',
  'slow-feeder',
  'parasite-prevention',
  'cooling-mat',
  'chew-toys',
  'night-light',
]

/** How many to show. Enough to be useful, few enough not to read as a catalogue. */
const MAX_SUGGESTIONS = 6

const RECOMMENDATION_PRODUCTS: Readonly<Record<string, readonly string[]>> = {
  'body-condition': ['kitchen-scale', 'weight-diet', 'slow-feeder'],
  diet: ['kitchen-scale'],
  dental: ['toothbrush', 'dental-chews'],
  'vet-care': ['parasite-prevention'],
}

const CALLOUT_PRODUCTS: Readonly<Record<string, readonly string[]>> = {
  'bloat-feeding': ['slow-feeder'],
  'brachycephalic-airway': ['harness', 'cooling-mat'],
  'early-neuter-joints': ['joint-support', 'ramp'],
}

const CONDITION_PRODUCTS: Readonly<Record<string, readonly string[]>> = {
  'intervertebral-disc-disease': ['ramp'],
  osteoarthritis: ['orthopedic-bed', 'traction', 'joint-support'],
  'hip-dysplasia': ['joint-support'],
  'elbow-dysplasia': ['joint-support'],
  'cruciate-rupture': ['joint-support'],
}

const STAGE_PRODUCTS: Readonly<Partial<Record<LifeStageId, readonly string[]>>> = {
  senior: ['orthopedic-bed', 'traction', 'ramp'],
  geriatric: ['orthopedic-bed', 'traction', 'ramp', 'night-light'],
  puppy: ['chew-toys'],
}

/**
 * Collect the gear worth mentioning for this dog.
 *
 * Everything is keyed off findings that are already on the page — the same
 * recommendations, health flags and life stage the owner is reading — with the
 * first thing that triggered each kept as its reason. Health-driven items are
 * gated on the concern mattering *now*, so a young dog with a breed
 * predisposition isn't sold an orthopaedic bed a decade early.
 */
export function buildProductSuggestions(
  recommendations: readonly Recommendation[],
  breedHealth: BreedHealthReport | undefined,
  stage: LifeStageId,
): ProductSuggestion[] {
  const reasonById = new Map<string, string>()

  const add = (productId: string, reason: string) => {
    if (PRODUCTS[productId] && !reasonById.has(productId)) reasonById.set(productId, reason)
  }

  for (const rec of recommendations) {
    for (const productId of RECOMMENDATION_PRODUCTS[rec.id] ?? []) add(productId, rec.id)
  }

  if (breedHealth) {
    for (const callout of breedHealth.callouts) {
      for (const productId of CALLOUT_PRODUCTS[callout.id] ?? []) add(productId, callout.id)
    }
    for (const concern of breedHealth.concerns) {
      if (!concern.relevantNow || !concern.condition) continue
      for (const productId of CONDITION_PRODUCTS[concern.condition.id] ?? [])
        add(productId, concern.condition.id)
    }
  }

  for (const productId of STAGE_PRODUCTS[stage] ?? []) add(productId, stage)

  return PRODUCT_ORDER.filter((id) => reasonById.has(id))
    .slice(0, MAX_SUGGESTIONS)
    .map((id) => ({
      id,
      title: PRODUCTS[id]!.title,
      detail: PRODUCTS[id]!.detail,
      triggeredBy: reasonById.get(id)!,
    }))
}
