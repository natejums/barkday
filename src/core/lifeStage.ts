/**
 * Which life stage a dog is in, and what that implies for its care.
 *
 * Follows the AAHA Canine Life Stage Guidelines, whose key insight is that the
 * later stages are proportions of a lifespan rather than fixed ages. A Great
 * Dane is a senior at seven; a Chihuahua isn't until ten. Both are right, and
 * any calculator using one senior age for all dogs is wrong for most of them.
 */

import { GERIATRIC_LIFESPAN_FRACTION, GROWTH_MILESTONES, SENIOR_LIFESPAN_FRACTION } from './constants'
import { clamp, round } from './units'
import type { LifeStageId, LifeStageInfo, SizeClass } from './types'

interface StageDefinition {
  stage: LifeStageId
  label: string
  description: string
  careGuidance: readonly string[]
}

const STAGES: Readonly<Record<LifeStageId, StageDefinition>> = {
  puppy: {
    stage: 'puppy',
    label: 'Puppy',
    description:
      'Rapid growth, and the window where socialisation shapes the adult dog more than anything you will do later.',
    careGuidance: [
      'Vet visits every 3–4 weeks; core vaccinations finish at 16–20 weeks',
      'Socialise deliberately and early — the sensitive period closes around 14 weeks',
      'Growth diet until skeletal maturity: about 12 months for small and medium dogs, 15–16 for large and giant',
      'Deworm from 2 weeks, start heartworm prevention by 8 weeks',
      'Begin handling the mouth now so dental care is uneventful later',
    ],
  },
  'young-adult': {
    stage: 'young-adult',
    label: 'Young adult',
    description:
      'Physically grown but still maturing socially. Habits set here tend to hold for life.',
    careGuidance: [
      'Check-ups every 6–12 months',
      'Set a target weight from body condition score and hold it — appetite outlasts growth',
      'Expect a 25–30% drop in calorie needs after neutering and adjust portions before weight creeps up',
      'Consider a first professional dental cleaning, particularly for small breeds',
      'Annual heartworm and tick-borne disease testing',
    ],
  },
  'mature-adult': {
    stage: 'mature-adult',
    label: 'Mature adult',
    description:
      'The long, steady middle. Most of what determines how the senior years go is decided in this stretch.',
    careGuidance: [
      'Annual exam with bloodwork, chemistry panel and urinalysis',
      'Track body condition every few months — gradual gain is easy to miss on a dog you see daily',
      'Keep dental disease from progressing; ask about full-mouth radiographs',
      'Maintain year-round parasite prevention',
      'Note any change in exercise tolerance; it is often the first sign of cardiac or joint trouble',
    ],
  },
  senior: {
    stage: 'senior',
    label: 'Senior',
    description:
      'The last quarter of expected lifespan. Screening moves from routine to genuinely useful — this is when early detection changes outcomes.',
    careGuidance: [
      'Exams at least every 6 months, not annually',
      'Comprehensive bloodwork every 6–12 months, plus thyroid and blood pressure',
      'Watch for cognitive changes: disorientation, altered sleep, new anxiety at night',
      'Adjust exercise to be gentler and more frequent rather than stopping it',
      'Reassess diet for comorbidities — but there is no need to switch to a "senior" food by default',
      'Make the home easier: traction on slick floors, ramps, raised bowls',
    ],
  },
  geriatric: {
    stage: 'geriatric',
    label: 'Geriatric',
    description:
      'Past 90% of expected lifespan. The goal shifts from extending life to protecting the quality of it.',
    careGuidance: [
      'Exams every 3–6 months, with pain assessment at each one',
      'Treat mobility and pain actively — stoicism in dogs hides a great deal of discomfort',
      'Keep a simple quality-of-life record; trends are easier to read than single days',
      'Expect changes in appetite, sleep and continence, and manage rather than ignore them',
      'Talk to your vet about what end-of-life care will look like before you need to decide anything',
    ],
  },
}

/**
 * Stage boundaries for a given dog, in years.
 *
 * Growth milestones are absolute — bones finish when they finish, regardless of
 * how long the dog will ultimately live — while senior and geriatric are
 * fractions of expected lifespan. Those two schemes can cross for a short-lived
 * giant breed, so the boundaries are forced monotonic afterwards.
 */
export function stageBoundaries(sizeClass: SizeClass, expectedLifespanYears: number) {
  const { puppyEndsYears, youngAdultEndsYears } = GROWTH_MILESTONES[sizeClass]
  const seniorStarts = Math.max(
    youngAdultEndsYears + 0.5,
    expectedLifespanYears * SENIOR_LIFESPAN_FRACTION,
  )
  const geriatricStarts = Math.max(
    seniorStarts + 0.5,
    expectedLifespanYears * GERIATRIC_LIFESPAN_FRACTION,
  )
  return { puppyEndsYears, youngAdultEndsYears, seniorStarts, geriatricStarts }
}

export function classifyLifeStage(
  ageYears: number,
  sizeClass: SizeClass,
  expectedLifespanYears: number,
): LifeStageInfo {
  const bounds = stageBoundaries(sizeClass, expectedLifespanYears)

  const transitions: readonly { stage: LifeStageId; startsAt: number }[] = [
    { stage: 'puppy', startsAt: 0 },
    { stage: 'young-adult', startsAt: bounds.puppyEndsYears },
    { stage: 'mature-adult', startsAt: bounds.youngAdultEndsYears },
    { stage: 'senior', startsAt: bounds.seniorStarts },
    { stage: 'geriatric', startsAt: bounds.geriatricStarts },
  ]

  let index = 0
  for (let i = 0; i < transitions.length; i += 1) {
    const t = transitions[i]
    if (t && ageYears >= t.startsAt) index = i
  }

  const current = transitions[index]
  const upcoming = transitions[index + 1]
  const definition = STAGES[current?.stage ?? 'mature-adult']

  const info: LifeStageInfo = {
    stage: definition.stage,
    label: definition.label,
    description: definition.description,
    progress: round(clamp(ageYears / expectedLifespanYears, 0, 1), 3),
    careGuidance: definition.careGuidance,
  }

  if (!upcoming) return info

  return {
    ...info,
    nextStage: {
      stage: upcoming.stage,
      label: STAGES[upcoming.stage].label,
      atAgeYears: round(upcoming.startsAt, 1),
    },
  }
}

export function lifeStageDefinition(stage: LifeStageId): StageDefinition {
  return STAGES[stage]
}
