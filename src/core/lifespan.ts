/**
 * Expected lifespan for one specific dog.
 *
 * Start from a population baseline, then apply what we know about this
 * individual. The interesting engineering problem here is not the individual
 * adjustments — it is refusing to add them up naively.
 */

import {
  BCS_PENALTY_PER_POINT,
  FEMALE_LIFESPAN_BONUS,
  IDEAL_BCS_RANGE,
  MIXED_BREED_BONUS,
  MODIFIER_SATURATION_YEARS,
  NEUTER_BONUS,
  UNDERWEIGHT_PENALTY_PER_POINT,
} from './constants'
import { lifeExpectancyForSizeClass } from './size'
import { clamp, round } from './units'
import type {
  Breed,
  Confidence,
  DogProfile,
  LifespanEstimate,
  LifespanFactor,
  SizeClass,
} from './types'

/**
 * Diminishing returns on stacked modifiers.
 *
 * `tanh` is close to linear for small inputs and flattens as the total grows,
 * so one good habit counts almost fully while six of them stop short of six
 * times the benefit. That is the behaviour the literature demands: caloric
 * restriction, body condition, diet quality and exercise are four measurements
 * of largely one causal pathway, and dental care, vet visits and parasite
 * compliance are all partly proxies for having an attentive owner. Adding them
 * straight would let a well-cared-for dog claim seven bonus years that no study
 * has ever observed.
 */
function saturate(total: number, limit = MODIFIER_SATURATION_YEARS): number {
  return limit * Math.tanh(total / limit)
}

interface FactorSpec {
  id: string
  label: string
  deltaYears: number
  confidence: Confidence
  explanation: string
}

function bodyConditionFactor(bcs: number, sizeClass: SizeClass): FactorSpec | null {
  const [idealLow, idealHigh] = IDEAL_BCS_RANGE

  if (bcs > idealHigh) {
    const pointsOver = bcs - idealHigh
    const perPoint = BCS_PENALTY_PER_POINT[sizeClass]
    return {
      id: 'body-condition',
      label: 'Carrying extra weight',
      deltaYears: -pointsOver * perPoint,
      confidence: 'low',
      explanation:
        `${pointsOver} point${pointsOver === 1 ? '' : 's'} above ideal body condition. ` +
        `In a study of 50,787 dogs, overweight dogs lost between 5 months and 2 years ` +
        `6 months of median lifespan depending on breed and sex. Smaller dogs are penalised ` +
        `far more heavily — larger breeds tend to be claimed by cancer or heart disease ` +
        `before excess weight collects its full cost. That study compared overweight against ` +
        `ideal as two groups; scaling it to a per-point cost is our own extrapolation, so ` +
        `treat the exact figure loosely and the direction as solid.`,
    }
  }

  if (bcs < idealLow) {
    const pointsUnder = idealLow - bcs
    return {
      id: 'body-condition',
      label: 'Underweight',
      deltaYears: -pointsUnder * UNDERWEIGHT_PENALTY_PER_POINT,
      confidence: 'low',
      explanation:
        `${pointsUnder} point${pointsUnder === 1 ? '' : 's'} below ideal body condition. ` +
        `Being underweight is usually a signal of an underlying problem rather than a cause ` +
        `of one, so this is a modest adjustment — but it is worth a conversation with a vet.`,
    }
  }

  return {
    id: 'body-condition',
    label: 'Ideal body condition',
    deltaYears: 0.4,
    confidence: 'moderate',
    explanation:
      `Sitting in the ideal 4–5 range. The Purina Life Span Study followed 48 Labradors for ` +
      `14 years and found the lean-fed group lived a median 13.0 years against 11.2 for the ` +
      `control group — the single best-evidenced lifespan intervention there is.`,
  }
}

function collectFactors(profile: DogProfile, breed: Breed | undefined, sizeClass: SizeClass) {
  const factors: FactorSpec[] = []

  if (profile.bodyConditionScore !== undefined) {
    const factor = bodyConditionFactor(profile.bodyConditionScore, sizeClass)
    if (factor) factors.push(factor)
  }

  // Deliberately no brachycephaly penalty here.
  //
  // It would double-count. The breed lifespan figures this baseline is drawn
  // from are observed lifespans, and flat-faced breeds already sit ~1.9 years
  // below the rest of the dataset precisely because of their skull shape.
  // Subtracting McMillan's 1.6-year effect on top would charge a Pug twice for
  // one airway. Brachycephaly instead reaches the result the honest way — the
  // breed's own short baseline — and shows up as care guidance rather than
  // arithmetic. This project spends a lot of words insisting that overlapping
  // factors must not be summed; that has to apply to its own model too.

  if (breed?.group === 'Mixed & Designer' || !breed) {
    factors.push({
      id: 'mixed-breed',
      label: 'Mixed ancestry',
      deltaYears: MIXED_BREED_BONUS,
      confidence: 'low',
      explanation:
        `Genetic diversity tracks with lifespan at the breed level, so a small advantage is ` +
        `defensible. It is much smaller than folklore suggests, though: the largest study on ` +
        `record puts mixed breeds at 12.71 years against 12.69 for all dogs — statistically a tie.`,
    })
  }

  if (profile.sex === 'female') {
    factors.push({
      id: 'sex',
      label: 'Female',
      deltaYears: FEMALE_LIFESPAN_BONUS,
      confidence: 'high',
      explanation:
        `Females average 12.76 years against 12.63 for males. Small, but it holds up ` +
        `consistently across very large datasets.`,
    })
  }

  if (profile.neuterStatus === 'neutered') {
    factors.push({
      id: 'neuter',
      label: 'Neutered',
      deltaYears: NEUTER_BONUS,
      confidence: 'moderate',
      explanation:
        `Neutered dogs outlive intact ones in essentially every population dataset, partly ` +
        `through removing reproductive cancers and roaming behaviour. The effect is entangled ` +
        `with the kind of household that neuters its dogs. Note that neutering large breeds ` +
        `before 12 months does raise joint disorder risk — timing matters more than the ` +
        `decision itself.`,
    })
  }

  const activityDeltas: Record<NonNullable<DogProfile['activityLevel']>, number> = {
    sedentary: -0.5,
    'lightly-active': -0.15,
    active: 0.3,
    'very-active': 0.4,
  }
  if (profile.activityLevel) {
    factors.push({
      id: 'activity',
      label: `Activity: ${profile.activityLevel.replace('-', ' ')}`,
      deltaYears: activityDeltas[profile.activityLevel],
      confidence: 'low',
      explanation:
        `Dog Aging Project data links higher physical activity with markedly lower odds of ` +
        `cognitive dysfunction. The honest caveat is that causation likely runs both ways — ` +
        `dogs already declining get walked less — so this is deliberately weighted lightly.`,
    })
  }

  const dietDeltas: Record<NonNullable<DogProfile['dietQuality']>, number> = {
    poor: -0.6,
    average: 0,
    good: 0.4,
    excellent: 0.7,
  }
  if (profile.dietQuality && dietDeltas[profile.dietQuality] !== 0) {
    factors.push({
      id: 'diet',
      label: `Diet: ${profile.dietQuality}`,
      deltaYears: dietDeltas[profile.dietQuality],
      confidence: 'moderate',
      explanation:
        `Measured portions of a complete diet is the lever the Purina study actually pulled. ` +
        `What matters is consistent portion control rather than the price of the food.`,
    })
  }

  const dentalDeltas: Record<NonNullable<DogProfile['dentalCare']>, number> = {
    none: -0.8,
    occasional: -0.2,
    regular: 0.3,
    professional: 0.5,
  }
  if (profile.dentalCare) {
    factors.push({
      id: 'dental',
      label: `Dental care: ${profile.dentalCare}`,
      deltaYears: dentalDeltas[profile.dentalCare],
      confidence: 'moderate',
      explanation:
        `Across 164,706 dogs, periodontal disease raised the hazard of chronic kidney disease ` +
        `by 1.8× at stage 1 and 2.7× by stage 3. Mouth bacteria enter the bloodstream ` +
        `continuously, which is why dental disease shows up as kidney and heart damage.`,
    })
  }

  const vetDeltas: Record<NonNullable<DogProfile['vetCare']>, number> = {
    none: -1,
    reactive: -0.3,
    annual: 0.3,
    proactive: 0.5,
  }
  if (profile.vetCare) {
    factors.push({
      id: 'vet-care',
      label: `Veterinary care: ${profile.vetCare}`,
      deltaYears: vetDeltas[profile.vetCare],
      confidence: 'moderate',
      explanation:
        `Routine care catches the treatable things early and keeps parasite prevention ` +
        `current. Dogs without heartworm prevention test positive at several times the rate ` +
        `of those on it, and the cardiac damage that follows is permanent.`,
    })
  }

  const environmentDeltas: Record<NonNullable<DogProfile['environment']>, number> = {
    indoor: 0.2,
    mixed: 0,
    outdoor: -0.4,
  }
  if (profile.environment && environmentDeltas[profile.environment] !== 0) {
    factors.push({
      id: 'environment',
      label: `Lives ${profile.environment === 'indoor' ? 'indoors' : 'mainly outdoors'}`,
      deltaYears: environmentDeltas[profile.environment],
      confidence: 'low',
      explanation:
        `Dogs living primarily outdoors face more trauma, infectious disease, parasites and ` +
        `temperature extremes. Much of this gap is really about supervision rather than the ` +
        `outdoors itself.`,
    })
  }

  if (profile.secondhandSmoke) {
    factors.push({
      id: 'smoke',
      label: 'Household smoke exposure',
      deltaYears: -0.3,
      confidence: 'low',
      explanation:
        `Dogs in smoking households show higher rates of respiratory disease and certain ` +
        `cancers, with long-muzzled breeds most affected — their nasal passages filter more ` +
        `of what they breathe.`,
    })
  }

  return factors
}

/** Population baseline before anything is known about the individual dog. */
export function baselineLifespan(breed: Breed | undefined, sizeClass: SizeClass): number {
  if (breed) {
    const [low, high] = breed.lifespanYears
    return (low + high) / 2
  }
  return lifeExpectancyForSizeClass(sizeClass)
}

export function estimateLifespan(
  profile: DogProfile,
  breed: Breed | undefined,
  sizeClass: SizeClass,
): LifespanEstimate {
  const baseline = baselineLifespan(breed, sizeClass)
  const specs = collectFactors(profile, breed, sizeClass).filter((f) => f.deltaYears !== 0)

  let positives = 0
  let negatives = 0
  for (const spec of specs) {
    if (spec.deltaYears > 0) positives += spec.deltaYears
    else negatives += spec.deltaYears
  }

  const rawDelta = positives + negatives
  // Saturate each direction independently, so a long list of small penalties
  // can't be cancelled out by a long list of small bonuses.
  const appliedDelta = saturate(positives) + saturate(negatives)

  // Never let modifiers push a dog below a floor that no real breed sits under.
  const expected = clamp(baseline + appliedDelta, 5, 20)

  const spread = breed ? (breed.lifespanYears[1] - breed.lifespanYears[0]) / 2 : 1.8
  const halfWidth = Math.max(1, spread)

  const factors: LifespanFactor[] = specs
    .map((spec) => ({
      id: spec.id,
      label: spec.label,
      deltaYears: round(spec.deltaYears, 2),
      confidence: spec.confidence,
      explanation: spec.explanation,
    }))
    .sort((a, b) => Math.abs(b.deltaYears) - Math.abs(a.deltaYears))

  return {
    baselineYears: round(baseline, 1),
    expectedYears: round(expected, 1),
    rangeYears: [round(Math.max(4, expected - halfWidth), 1), round(expected + halfWidth, 1)],
    factors,
    rawDeltaYears: round(rawDelta, 2),
    appliedDeltaYears: round(appliedDelta, 2),
  }
}
