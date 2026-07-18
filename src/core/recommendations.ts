/**
 * Turning the model into advice.
 *
 * The years-gained figure attached to each suggestion is not the raw size of
 * the penalty being removed. It is the difference between running the lifespan
 * model on this dog as it is and running it again on a version of this dog with
 * that one thing improved — so the number already accounts for saturation, and
 * for the fact that the fifth good habit is worth less than the first.
 */

import { estimateLifespan } from './lifespan'
import { round } from './units'
import type { Breed, DogProfile, LifeStageId, Recommendation, SizeClass } from './types'

interface Improvement {
  id: string
  title: string
  detail: string
  /** Returns null when this dog is already at or above the target. */
  apply: (profile: DogProfile) => DogProfile | null
}

const IMPROVEMENTS: readonly Improvement[] = [
  {
    id: 'body-condition',
    title: 'Get to an ideal body condition',
    detail:
      'Aim for a body condition score of 4–5: ribs easy to feel under a thin layer, a visible waist from above, and a tucked belly from the side. Reduce portions by 10% and reassess in a month rather than cutting sharply.',
    apply: (p) =>
      p.bodyConditionScore !== undefined && (p.bodyConditionScore > 5 || p.bodyConditionScore < 4)
        ? { ...p, bodyConditionScore: 5 }
        : null,
  },
  {
    id: 'dental',
    title: 'Start a daily dental routine',
    detail:
      'Brush most days with a dog-specific paste. Periodontal disease is not confined to the mouth — it raises the hazard of chronic kidney disease by up to 2.7×, because oral bacteria seed the bloodstream continuously.',
    apply: (p) =>
      p.dentalCare === 'none' || p.dentalCare === 'occasional'
        ? { ...p, dentalCare: 'regular' }
        : null,
  },
  {
    id: 'vet-care',
    title: 'Get on a regular veterinary schedule',
    detail:
      'An annual exam with bloodwork catches kidney, liver and thyroid problems while they are still cheap and treatable. Keep year-round parasite prevention going.',
    apply: (p) =>
      p.vetCare === 'none' || p.vetCare === 'reactive' ? { ...p, vetCare: 'annual' } : null,
  },
  {
    id: 'activity',
    title: 'Build up daily exercise',
    detail:
      'Work toward an hour of real activity a day, adjusted for breed and joints. Beyond the weight benefit, higher activity tracks with substantially lower odds of canine cognitive dysfunction later on.',
    apply: (p) =>
      p.activityLevel === 'sedentary' || p.activityLevel === 'lightly-active'
        ? { ...p, activityLevel: 'active' }
        : null,
  },
  {
    id: 'diet',
    title: 'Switch to measured portions',
    detail:
      'Weigh meals rather than free-feeding or eyeballing a scoop. The Purina Life Span Study got 1.8 extra years out of portion control alone — it is the best-evidenced intervention in the whole field.',
    apply: (p) => (p.dietQuality === 'poor' || p.dietQuality === 'average' ? { ...p, dietQuality: 'good' } : null),
  },
  {
    id: 'environment',
    title: 'Move more of their life indoors',
    detail:
      'Dogs living mainly outdoors meet more trauma, infectious disease and temperature extremes. Most of that gap closes with supervision rather than with the walls themselves.',
    apply: (p) => (p.environment === 'outdoor' ? { ...p, environment: 'indoor' } : null),
  },
  {
    id: 'smoke',
    title: 'Keep smoke out of the house',
    detail:
      'Dogs in smoking households show more respiratory disease and certain cancers. Long-muzzled breeds absorb the most, since their nasal passages filter more of what they breathe.',
    apply: (p) => (p.secondhandSmoke ? { ...p, secondhandSmoke: false } : null),
  },
]

function priorityFor(years: number): Recommendation['priority'] {
  if (years >= 0.5) return 'high'
  if (years >= 0.2) return 'medium'
  return 'low'
}

export function buildRecommendations(
  profile: DogProfile,
  breed: Breed | undefined,
  sizeClass: SizeClass,
  stage: LifeStageId,
): Recommendation[] {
  const current = estimateLifespan(profile, breed, sizeClass).expectedYears

  const results: Recommendation[] = []

  for (const improvement of IMPROVEMENTS) {
    const improved = improvement.apply(profile)
    if (!improved) continue

    const gain = estimateLifespan(improved, breed, sizeClass).expectedYears - current
    if (gain <= 0.01) continue

    results.push({
      id: improvement.id,
      title: improvement.title,
      detail: improvement.detail,
      potentialYears: round(gain, 2),
      priority: priorityFor(gain),
    })
  }

  results.sort((a, b) => b.potentialYears - a.potentialYears)

  // Advice that isn't a lifespan lever but still changes what an owner should
  // do today. These carry no years figure because inventing one would be dishonest.
  if (breed?.brachycephalic) {
    results.push({
      id: 'brachycephalic-care',
      title: 'Manage the flat face carefully',
      detail:
        'Walk in the cool part of the day, use a harness rather than a collar, and never leave them anywhere warm. Loud breathing, snoring and tiring quickly are not just breed character — they are signs of airway obstruction worth raising with a vet.',
      potentialYears: 0,
      priority: 'medium',
    })
  }

  if (stage === 'senior' || stage === 'geriatric') {
    results.push({
      id: 'senior-screening',
      title: 'Move to twice-yearly check-ups',
      detail:
        'Six-month exams with comprehensive bloodwork, blood pressure and thyroid testing. At this stage screening genuinely changes outcomes rather than just producing reassurance.',
      potentialYears: 0,
      priority: 'high',
    })
  }

  if (stage === 'puppy') {
    results.push({
      id: 'puppy-socialisation',
      title: 'Prioritise socialisation now',
      detail:
        'The sensitive period for socialisation closes at around 14 weeks. Careful, positive exposure to people, dogs, surfaces and sounds during this window does more for lifelong behaviour than any training later.',
      potentialYears: 0,
      priority: 'high',
    })
  }

  return results
}
