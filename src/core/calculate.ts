/**
 * The public entry point: one dog in, a full picture out.
 */

import { findBreed } from './breeds'
import { WANG_VALID_RANGE } from './constants'
import { classifyLifeStage } from './lifeStage'
import { estimateLifespan } from './lifespan'
import { chartHumanAge, epigeneticHumanAge, naiveHumanAge, personalisedHumanAge } from './models'
import { buildRecommendations } from './recommendations'
import { chartBandFromSizeClass, chartBandFromWeight, sizeClassFromWeight } from './size'
import { describeYears } from './age'
import { round } from './units'
import type { DogAgeResult, DogProfile, ModelEstimate } from './types'

/** Past this the charts have nothing to say and neither, honestly, do we. */
const MAX_SUPPORTED_AGE = 30

export function calculateDogAge(profile: DogProfile): DogAgeResult {
  const warnings: string[] = []

  const rawAge = profile.ageYears
  if (!Number.isFinite(rawAge)) {
    throw new TypeError('ageYears must be a finite number')
  }

  let ageYears = rawAge
  if (ageYears < 0) {
    warnings.push('A negative age was given, so it has been treated as a newborn.')
    ageYears = 0
  }
  if (ageYears > MAX_SUPPORTED_AGE) {
    warnings.push(
      `An age of ${round(ageYears, 1)} years is beyond any published data — the oldest verified dog reached 29. Results are capped at ${MAX_SUPPORTED_AGE}.`,
    )
    ageYears = MAX_SUPPORTED_AGE
  }

  const breed = profile.breedName ? findBreed(profile.breedName) : undefined
  if (profile.breedName && !breed) {
    warnings.push(
      `"${profile.breedName}" isn't in the breed list, so size-based population figures were used instead.`,
    )
  }

  /**
   * Breed standard beats measured weight for sizing, when a breed is known.
   *
   * Size class is meant to capture skeletal frame, and an overweight Labrador
   * is not a giant breed. Letting the scale decide would quietly charge that
   * dog twice — once for being "giant" and again for its body condition score.
   * Weight only decides the class when there's no breed to go on.
   */
  const sizeClass = breed
    ? breed.sizeClass
    : profile.weightKg !== undefined
      ? sizeClassFromWeight(profile.weightKg)
      : 'medium'

  if (!breed && profile.weightKg === undefined) {
    warnings.push(
      'With no breed or weight given, medium-dog population averages were assumed. Adding either will sharpen the estimate considerably.',
    )
  }

  const chartBand = breed
    ? chartBandFromSizeClass(breed.sizeClass)
    : profile.weightKg !== undefined
      ? chartBandFromWeight(profile.weightKg)
      : 'medium'

  if (breed && profile.weightKg !== undefined) {
    const [low, high] = breed.weightKg
    if (profile.weightKg > high * 1.25) {
      warnings.push(
        `At ${round(profile.weightKg, 1)} kg this dog is well above the typical range for a ${breed.name} (${low}–${high} kg). Worth confirming the body condition score.`,
      )
    } else if (profile.weightKg < low * 0.75) {
      warnings.push(
        `At ${round(profile.weightKg, 1)} kg this dog is well below the typical range for a ${breed.name} (${low}–${high} kg).`,
      )
    }
  }

  const lifespan = estimateLifespan(profile, breed, sizeClass)

  const headline = personalisedHumanAge(
    ageYears,
    chartBand,
    lifespan.expectedYears,
    lifespan.baselineYears,
  )
  if (headline.extrapolated) {
    warnings.push(
      'This dog is older than the published conversion charts go, so the human-age figure is extrapolated from the trend.',
    )
  }

  // The interval comes from the lifespan interval: a dog that turns out to be
  // on the short-lived end of its range is effectively older today.
  const [lifespanLow, lifespanHigh] = lifespan.rangeYears
  const upperHumanAge = personalisedHumanAge(ageYears, chartBand, lifespanLow, lifespan.baselineYears)
  const lowerHumanAge = personalisedHumanAge(ageYears, chartBand, lifespanHigh, lifespan.baselineYears)

  const rawChart = chartHumanAge(ageYears, chartBand)
  const epigenetic = epigeneticHumanAge(ageYears)
  const wangInRange = ageYears >= WANG_VALID_RANGE[0] && ageYears <= WANG_VALID_RANGE[1]

  const models: ModelEstimate[] = [
    {
      id: 'personalised',
      label: 'Barkday estimate',
      humanYears: round(headline.humanYears),
      description:
        'The size-stratified veterinary chart, adjusted for how long this particular dog is expected to live. Every detail you provide reaches the headline number through this model.',
      confidence: breed ? 'high' : 'moderate',
      headline: true,
    },
    {
      id: 'chart',
      label: 'Veterinary chart',
      humanYears: round(rawChart.humanYears),
      description:
        'The AKC size-stratified chart on its own, with no personalisation. This is what a vet clinic poster would tell you.',
      confidence: 'high',
    },
    {
      id: 'epigenetic',
      label: 'Epigenetic clock',
      humanYears: epigenetic === null ? null : round(epigenetic),
      description:
        epigenetic === null
          ? 'Wang et al. (2020), from DNA methylation. It has nothing to say about puppies: the formula is a logarithm fitted to data that never included newborns, and below a year it returns figures like 19.9 human years for a six-month-old. Reporting a number here would be worse than reporting none.'
          : wangInRange
            ? 'Wang et al. (2020), from DNA methylation patterns shared between dogs and humans. The only genuinely molecular model here — but it was built on 104 Labradors, so it carries no size information at all.'
            : 'Wang et al. (2020), from DNA methylation. Past the 16-year upper edge of its training data here, where the curve flattens out and the estimate should be read loosely.',
      confidence: wangInRange ? 'moderate' : 'low',
    },
    {
      id: 'naive',
      label: 'The "times seven" myth',
      humanYears: round(naiveHumanAge(ageYears)),
      description:
        'Multiply by seven. It has no scientific basis, and it is wrong in opposite directions at different ages — badly understating puppies and overstating small elderly dogs. Shown for comparison only.',
      confidence: 'low',
    },
  ]

  const lifeStage = classifyLifeStage(ageYears, sizeClass, lifespan.expectedYears)

  const remainingYears = Math.max(0, lifespan.expectedYears - ageYears)
  const remainingLow = Math.max(0, lifespanLow - ageYears)
  const remainingHigh = Math.max(0, lifespanHigh - ageYears)

  const recommendations = buildRecommendations(profile, breed, sizeClass, lifeStage.stage)

  return {
    profile,
    ...(breed ? { breed } : {}),
    sizeClass,
    chartBand,
    humanAge: {
      years: round(headline.humanYears),
      rangeYears: [round(lowerHumanAge.humanYears), round(upperHumanAge.humanYears)],
      modelId: 'personalised',
    },
    models,
    lifespan,
    lifeStage,
    remaining: {
      years: round(remainingYears, 1),
      rangeYears: [round(remainingLow, 1), round(remainingHigh, 1)],
      label: describeYears(remainingYears).label,
    },
    recommendations,
    warnings,
  }
}

/** Convenience wrapper for callers holding a date of birth rather than an age. */
export function calculateFromBirthDate(
  profile: Omit<DogProfile, 'ageYears'>,
  birthDate: Date,
  asOf: Date,
): DogAgeResult {
  const ageYears = (asOf.getTime() - birthDate.getTime()) / (365.2425 * 86_400_000)
  return calculateDogAge({ ...profile, ageYears })
}

/** Guard against a UI clamping a slider to something the model can't use. */
export function isSupportedAge(ageYears: number): boolean {
  return Number.isFinite(ageYears) && ageYears >= 0 && ageYears <= MAX_SUPPORTED_AGE
}

export { MAX_SUPPORTED_AGE }
