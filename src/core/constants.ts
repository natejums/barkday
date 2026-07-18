/**
 * Published figures the models are built on.
 *
 * Everything here is traceable to a source. Where a number is a derivation
 * rather than something an author printed, the comment says so — that
 * distinction matters more than the number itself.
 */

import type { ChartBand, SizeClass } from './types'

// ---------------------------------------------------------------------------
// Size classification
// ---------------------------------------------------------------------------

/**
 * Adult-bodyweight bands and life expectancy at birth, from Montoya et al.
 * (2023), Frontiers in Veterinary Science — 13,292,929 dogs across 1,000+
 * Banfield hospitals.
 *
 * Note toy < small. That inversion is real and reproducible, not a typo: very
 * small dogs carry congenital and dental burdens that cost them the advantage
 * their size would otherwise buy.
 */
export const SIZE_BANDS: readonly {
  sizeClass: SizeClass
  label: string
  /** Lower bound in kg, inclusive. */
  minKg: number
  /** Upper bound in kg, exclusive. Infinity for the top band. */
  maxKg: number
  lifeExpectancyYears: number
}[] = [
  { sizeClass: 'toy', label: 'Toy', minKg: 0, maxKg: 5.5, lifeExpectancyYears: 13.36 },
  { sizeClass: 'small', label: 'Small', minKg: 5.5, maxKg: 11, lifeExpectancyYears: 13.53 },
  { sizeClass: 'medium', label: 'Medium', minKg: 11, maxKg: 26, lifeExpectancyYears: 12.7 },
  { sizeClass: 'large', label: 'Large', minKg: 26, maxKg: 45, lifeExpectancyYears: 11.51 },
  { sizeClass: 'giant', label: 'Giant', minKg: 45, maxKg: Infinity, lifeExpectancyYears: 9.51 },
]

/** Population life expectancy across all dogs — the fallback of last resort. */
export const ALL_DOGS_LIFE_EXPECTANCY = 12.69

/**
 * The conversion charts use their own, coarser weight cutoffs (in lb: 20 / 50 /
 * 90-100). These are those cutoffs in kg.
 */
export const CHART_BAND_CUTOFFS_KG: readonly { band: ChartBand; maxKg: number }[] = [
  { band: 'small', maxKg: 9.1 },
  { band: 'medium', maxKg: 22.7 },
  { band: 'large', maxKg: 45.4 },
  { band: 'giant', maxKg: Infinity },
]

// ---------------------------------------------------------------------------
// Human-age conversion chart
// ---------------------------------------------------------------------------

/**
 * Human-age equivalents by dog age and size band. Index `i` is dog age `i + 1`.
 *
 * Ages 1–16 follow the official AKC chart. Ages 17–25 continue with the
 * Metzger / IDEXX chart, which extends further. The two agree exactly from age
 * 6 to 16 (bar a year or two of rounding in the giant column), so the seam is
 * invisible. Below age 6 they diverge sharply and the AKC values are the
 * defensible ones — Metzger has a one-year-old dog at 7 human years, which
 * contradicts the basic fact that a yearling dog is already sexually mature.
 *
 * The bands run short where the source charts stop. The model extrapolates past
 * the end and flags it rather than pretending the data goes on forever.
 *
 * Sources — note the AKC citation is the published chart itself, not the
 * article that accompanies it. The article text gives only a single
 * non-stratified rule (year one ≈ 15, year two ≈ +9, then ≈ +5 a year); the
 * size-stratified numbers below come from the chart artwork:
 *   AKC     — https://www.akc.org/wp-content/uploads/2015/11/Dog_Age_Chart_Proof_01Blue.jpg
 *   Metzger — https://www.idexx.com/files/preventive-brochures-age-chart.pdf
 */
export const HUMAN_AGE_CHART: Readonly<Record<ChartBand, readonly number[]>> = {
  //      1   2   3   4   5   6   7   8   9  10  11  12  13  14  15  16 | 17   18   19   20   21   22   23   24   25
  small: [15, 24, 28, 32, 36, 40, 44, 48, 52, 56, 60, 64, 68, 72, 76, 80, 84, 88, 92, 96, 100, 104, 108, 112, 116],
  medium: [15, 24, 28, 32, 36, 42, 47, 51, 56, 60, 65, 69, 74, 78, 83, 87, 92, 96, 101, 105, 109, 113, 117, 120, 124],
  large: [15, 24, 28, 32, 36, 45, 50, 55, 61, 66, 72, 77, 82, 88, 93, 99, 104, 109, 115, 120, 126, 130],
  giant: [12, 22, 31, 38, 45, 49, 56, 64, 71, 79, 86, 93, 100, 107, 114, 121, 131, 139],
}

/**
 * The first year, as a fraction of the year-one human equivalent.
 *
 * The published charts start at age 1, but most people asking about a dog's age
 * are asking about a puppy. These anchors interpolate that first year against
 * the developmental milestones vets describe — a 6-month puppy is roughly a
 * 10-year-old child, not a 6-month-old baby. Expressing them as fractions lets
 * the same curve serve every size band, since giant breeds reach a lower
 * year-one equivalent (12) than everyone else (15).
 *
 * These are interpolated developmental anchors, not published data.
 */
export const PUPPY_CURVE: readonly (readonly [dogYears: number, fractionOfYearOne: number])[] = [
  [0, 0],
  [1 / 12, 1 / 15],
  [2 / 12, 2.5 / 15],
  [3 / 12, 4 / 15],
  [6 / 12, 10 / 15],
  [9 / 12, 13 / 15],
  [1, 1],
]

// ---------------------------------------------------------------------------
// Epigenetic clock
// ---------------------------------------------------------------------------

/**
 * Wang et al. (2020), Cell Systems: human_age = 16 × ln(dog_age) + 31, from
 * DNA methylation in 104 Labrador Retrievers.
 *
 * Included because it is the only genuinely molecular model here, but it is not
 * the headline. It is single-breed, so it has no size term at all, and it
 * misbehaves at both ends: it puts a one-year-old dog at 31 human years, and it
 * returns zero at ~7.5 weeks and goes negative below that.
 *
 * https://www.cell.com/cell-systems/fulltext/S2405-4712(20)30203-9
 */
export const WANG_COEFFICIENT = 16
export const WANG_INTERCEPT = 31
/** Below this age the formula returns zero or negative human years. */
export const WANG_SINGULARITY_YEARS = Math.exp(-WANG_INTERCEPT / WANG_COEFFICIENT)
/** The range the paper's training data actually covers. */
export const WANG_VALID_RANGE: readonly [number, number] = [1, 16]

/** The folk rule. Kept only so the app can show why it is wrong. */
export const NAIVE_MULTIPLIER = 7

// ---------------------------------------------------------------------------
// Life stages
// ---------------------------------------------------------------------------

/**
 * AAHA Canine Life Stage Guidelines define senior as "the last 25% of estimated
 * lifespan" — a proportion, not an age. That is what makes the stage boundaries
 * personalisable: a Great Dane hits senior at 7 while a Chihuahua doesn't until
 * 10, and both are correct.
 *
 * AAHA stops at senior. Geriatric is added here at 90% of expected lifespan to
 * match the band the Metzger chart draws, because owners find the distinction
 * useful and care recommendations genuinely change.
 *
 * https://www.aaha.org/resources/life-stage-canine-2019/
 */
export const SENIOR_LIFESPAN_FRACTION = 0.75
export const GERIATRIC_LIFESPAN_FRACTION = 0.9

/**
 * Puppyhood and adolescence run on absolute time, not on a fraction of
 * lifespan: growth plates close when they close. Bigger dogs take longer to
 * finish both growing and maturing.
 */
export const GROWTH_MILESTONES: Readonly<
  Record<SizeClass, { puppyEndsYears: number; youngAdultEndsYears: number }>
> = {
  toy: { puppyEndsYears: 0.75, youngAdultEndsYears: 3 },
  small: { puppyEndsYears: 0.75, youngAdultEndsYears: 3 },
  medium: { puppyEndsYears: 1, youngAdultEndsYears: 3 },
  large: { puppyEndsYears: 1.25, youngAdultEndsYears: 3.5 },
  giant: { puppyEndsYears: 1.5, youngAdultEndsYears: 4 },
}

// ---------------------------------------------------------------------------
// Lifespan modifiers
// ---------------------------------------------------------------------------

/**
 * Years of median lifespan lost per point of body condition score above ideal.
 *
 * Read the provenance carefully, because it matters. Salt et al. (2019),
 * n = 50,787 across 12 breeds, supports a *binary* claim only: dogs overweight
 * in middle age had shorter median lifespans than matched normal-condition
 * dogs, by 5 months to 2 years 6 months depending on breed and sex. The authors
 * published no per-point figure and no continuous dose-response.
 *
 * The per-point numbers below are this project's derivation — the observed
 * whole-category difference divided by the roughly two 9-point BCS units that
 * Salt's "overweight" category spans. A calculator needs a continuous response
 * to a slider, but that is our engineering requirement, not the study's finding,
 * which is why these ship as low confidence.
 *
 * The counterintuitive part is real and reproducible: the penalty for small
 * dogs is roughly 2.5× that for large ones (Yorkshire Terrier 2.5 years,
 * Chihuahua ~2.1, against German Shepherd ~5 months). The likely explanation is
 * competing mortality rather than small dogs being more sensitive to fat —
 * large breeds tend to die of cancer and cardiac disease before adiposity has
 * time to collect its full bill.
 *
 * https://pmc.ncbi.nlm.nih.gov/articles/PMC6335446/
 */
export const BCS_PENALTY_PER_POINT: Readonly<Record<SizeClass, number>> = {
  toy: 0.9,
  small: 0.9,
  medium: 0.88,
  large: 0.34,
  giant: 0.34,
}

/** Ideal body condition on the 9-point scale is 4–5. */
export const IDEAL_BCS_RANGE: readonly [number, number] = [4, 5]

/** Being underweight carries its own risk, usually as a marker of illness. */
export const UNDERWEIGHT_PENALTY_PER_POINT = 0.3

/*
 * There is deliberately no brachycephaly constant here.
 *
 * McMillan et al. (2024), n = 584,734, puts brachycephalic median lifespan at
 * 11.2 years against 12.8 for mesocephalic breeds, and an earlier version of
 * this model applied that as a −1.6 year modifier. It was double-counting: the
 * breed baselines are observed lifespans, and flat-faced breeds already sit
 * ~1.9 years below the rest of the dataset because of the airway.
 *
 * It also flattened breeds that contradict the average — a Shih Tzu is
 * brachycephalic and lives ~14 years, and the penalty docked it regardless.
 * The breed's own baseline is the better signal, so brachycephaly reaches the
 * user as health risks and care guidance rather than as arithmetic.
 *
 * https://www.nature.com/articles/s41598-023-50458-w
 */

/**
 * Mixed-breed advantage. Popular wisdom says mutts live much longer; the
 * largest dataset says otherwise — Montoya found 12.71 years for mixed breeds
 * against 12.69 for all dogs, essentially a tie.
 *
 * Breed-level heterozygosity does track lifespan (+0.084 yr per percentage
 * point, Kraus et al. 2023), so a small positive is defensible. Anything larger
 * is folklore.
 */
export const MIXED_BREED_BONUS = 0.3

/** Montoya 2023: females 12.76 years, males 12.63. Small, consistent, real. */
export const FEMALE_LIFESPAN_BONUS = 0.13

/**
 * Neutered dogs live longer in essentially every population dataset, though the
 * effect is tangled up with the kind of household that neuters its dogs.
 * Meanwhile Hart et al. (2020) found early neutering raises joint disorder and
 * some cancer risks specifically in larger breeds.
 */
export const NEUTER_BONUS = 0.5

/**
 * Saturation limit for stacked modifiers, in years, applied separately to the
 * positive and negative side.
 *
 * This exists because the research is emphatic that these factors are not
 * independent: caloric restriction, body condition, diet quality and exercise
 * are largely four windows onto one causal pathway, and "attentive owner" is a
 * latent variable behind dental care, preventive vet visits and parasite
 * compliance alike. Summing them straight would let a fully-optimised profile
 * claim six or seven extra years, which no study supports.
 */
export const MODIFIER_SATURATION_YEARS = 3
