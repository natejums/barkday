/**
 * Water: the question most calculators never think to ask.
 */

import { formatWeight } from '../../units'
import type { InsightSpec } from '../context'

/** Rough daily water need at ~50–60 ml per kg, as a readable range. */
function dailyWater(weightKg: number | undefined): string | null {
  if (weightKg === undefined || !Number.isFinite(weightKg) || weightKg <= 0) return null
  const low = Math.round((weightKg * 50) / 50) * 50
  const high = Math.round((weightKg * 60) / 50) * 50
  if (high < 1000) return `${low}–${high} ml`
  return `${(low / 1000).toFixed(1)}–${(high / 1000).toFixed(1)} litres`
}

export const WATER_INSIGHTS: readonly InsightSpec[] = [
  {
    id: 'water-topped-up',
    kind: 'move',
    topic: 'water',
    evidence: 'low',
    sources: ['nsf2011', 'merck'],
    priority: 56,
    when: (c) => c.p.waterSource === 'bowl-topped-up',
    title: (c) => c.pick('water-topped-t', 'Wash the water bowl, don’t just top it up', 'The water bowl needs washing daily'),
    why: () =>
      'A topped-up bowl grows a slimy biofilm within a day or two — when NSF International swabbed household objects, pet bowls ranked among the most bacteria-laden items in the home, ahead of most kitchen surfaces. It is rarely dangerous, but it is the reason some dogs drink less than they should.',
    how: (c) =>
      `Empty, hot-soapy-wash and refill ${c.v.poss} bowl every day; stainless steel or ceramic cleans up better than plastic, which scratches and harbours bacteria. Run it through the dishwasher once a week.`,
  },
  {
    id: 'water-refreshed',
    kind: 'win',
    topic: 'water',
    evidence: 'low',
    sources: ['nsf2011'],
    priority: 46,
    when: (c) => c.p.waterSource === 'bowl-refreshed-daily',
    title: () => 'Fresh water every day',
    why: () =>
      'A clean bowl is one of those small, unglamorous things that keeps a dog drinking properly. Stainless steel or ceramic, washed rather than rinsed, and you are doing it right.',
  },
  {
    id: 'water-fountain',
    kind: 'note',
    topic: 'water',
    evidence: 'low',
    sources: ['merck'],
    priority: 40,
    when: (c) => c.p.waterSource === 'fountain',
    title: () => 'About the fountain',
    why: () =>
      'Fountains are fine, and some dogs clearly prefer moving water. There is no good evidence that they make dogs drink more — that claim comes from cat studies, and even those are mixed. What a fountain does need is maintenance, because the pump and filter are a warm, wet place for things to grow.',
    how: () =>
      'Strip and wash the whole unit weekly, change the filter on the maker’s schedule, and keep a plain bowl available too in case the pump fails while you’re out.',
  },
  {
    id: 'water-outdoor',
    kind: 'flag',
    topic: 'water',
    evidence: 'moderate',
    sources: ['aahaVaccination2022', 'merck', 'aspcaApcc'],
    priority: 76,
    when: (c) => c.p.waterSource === 'outdoor-sources',
    title: () => 'Standing water is where leptospirosis and algae live',
    why: (c) =>
      `Puddles, ponds and troughs are the main route for leptospirosis — a bacterial infection carried in wildlife urine that damages the kidneys and liver and can pass to people — which is why the AAHA guidelines now treat the lepto vaccine as core for every dog. Still water in warm weather can also carry blue-green algae, which can kill a dog within hours of a drink${c.ex('swimming') ? ', and that applies to swimming spots too' : ''}.`,
    how: (c) =>
      `Make sure ${c.v.name}’s leptospirosis vaccine is current, carry water on walks so ${c.v.subj} ${c.v.verb('have')} an alternative, and keep ${c.v.obj} away from any water with a green scum or a bad smell. A clean indoor bowl should be the main source, not the backup.`,
  },
  {
    id: 'water-intake',
    kind: 'note',
    topic: 'water',
    evidence: 'moderate',
    sources: ['merck'],
    priority: 38,
    when: (c) => c.p.waterSource !== undefined,
    title: () => 'How much drinking is normal',
    why: (c) => {
      const amount = dailyWater(c.p.weightKg)
      const base =
        'A healthy dog drinks roughly 50–60 ml per kilogram a day, less on wet food and more in heat or after exercise.'
      const personal =
        amount && c.p.weightKg !== undefined
          ? ` At ${formatWeight(c.p.weightKg, 'kg')} that is about ${amount} a day.`
          : ''
      return `${base}${personal} A clear, sustained rise in drinking — more than about 100 ml per kilogram — is one of the most useful early warnings a dog gives, pointing at kidneys, diabetes or Cushing’s long before anything else shows.`
    },
    how: (c) =>
      `You don’t need to measure it daily. Just notice if ${c.v.subj} ${c.v.verb('start')} emptying the bowl, waking you to drink, or drinking from odd places — and mention it to the vet if it lasts more than a few days.`,
  },
]
