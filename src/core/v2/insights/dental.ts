/**
 * Teeth. The second-best-evidenced lever after weight, and the most neglected.
 */

import type { InsightSpec } from '../context'

export const DENTAL_INSIGHTS: readonly InsightSpec[] = [
  {
    id: 'dental-none',
    kind: 'move',
    topic: 'dental',
    evidence: 'high',
    sources: ['glickman2011', 'oneill2021perio', 'harvey2015', 'vohc'],
    priority: 86,
    recId: 'dental',
    when: (c) => c.p.dentalCare === 'none',
    title: (c) => c.pick('dental-none-t', 'Start brushing — daily, not “sometimes”', `Give ${c.v.name}’s teeth thirty seconds a day`),
    why: (c) =>
      `One in eight dogs is diagnosed with periodontal disease every year${c.tiny ? ', small breeds and flat faces more often still' : ''}, and it does not stay in the mouth: across 164,706 dogs, periodontal disease raised the hazard of chronic kidney disease by 1.8× at its mildest and 2.7× at its worst, because oral bacteria seed the bloodstream continuously. In a controlled trial, daily brushing cut gingivitis by about 60%; weekly brushing did almost nothing for it.`,
    how: (c) =>
      `Start with a finger brush and a canine enzymatic paste (never human toothpaste), thirty seconds on the outside surfaces after the evening meal, and build from there. ${c.stage === 'puppy' ? 'A puppy who has their mouth handled daily will accept this for life.' : 'It takes most dogs two or three weeks to accept it.'} VOHC-sealed chews help a little on top; they do not replace the brush.`,
  },
  {
    id: 'dental-occasional',
    kind: 'move',
    topic: 'dental',
    evidence: 'high',
    sources: ['harvey2015', 'glickman2011'],
    priority: 70,
    recId: 'dental',
    when: (c) => c.p.dentalCare === 'occasional',
    title: (c) => c.pick('dental-occ-t', 'Make the brushing daily — occasional doesn’t work', 'Now-and-then brushing isn’t enough to count'),
    why: () =>
      'When brushing frequency was tested head to head, daily and every-other-day brushing reduced plaque and gingivitis; weekly brushing reduced only tartar, and every-other-week did essentially nothing. Plaque re-forms in about 24 hours, so the benefit lives in the routine, not the effort.',
    how: (c) =>
      `Anchor it to something that already happens every day — ${c.v.poss} evening meal, your own toothbrush. Thirty seconds, outside surfaces, enzymatic paste. Every other day is the minimum that shows a result.`,
  },
  {
    id: 'dental-regular',
    kind: 'win',
    topic: 'dental',
    evidence: 'high',
    sources: ['harvey2015', 'glickman2011'],
    priority: 66,
    when: (c) => c.p.dentalCare === 'regular',
    title: () => 'Regular brushing — the thing most owners skip',
    why: (c) =>
      `That is the single most effective dental intervention there is, and it protects the kidneys and heart, not just the mouth. Add VOHC-sealed chews if you like, and ask at ${c.v.poss} next exam whether there is tartar that brushing can no longer shift — that part needs a professional cleaning under anaesthesia.`,
  },
  {
    id: 'dental-professional',
    kind: 'win',
    topic: 'dental',
    evidence: 'high',
    sources: ['avdc', 'glickman2011'],
    priority: 68,
    when: (c) => c.p.dentalCare === 'professional',
    title: () => 'Professional dental care',
    why: () =>
      'Cleaning under anaesthesia, with dental radiographs, is the gold standard — it reaches below the gumline, where the disease actually lives. Keep up the daily brushing between cleanings; it roughly doubles the time each one lasts. (“Anaesthesia-free” cleanings are cosmetic only and the dental college advises against them.)',
  },
  {
    id: 'dental-small-breed',
    kind: 'note',
    topic: 'dental',
    evidence: 'moderate',
    sources: ['oneill2021perio', 'merck'],
    priority: (c) => (c.p.dentalCare === 'none' || c.p.dentalCare === undefined ? 62 : 50),
    when: (c) => c.tiny && c.ageYears >= 2,
    title: (c) => `Small dogs like ${c.v.name} get periodontal disease early`,
    why: (c) =>
      `The same 42 teeth are crowded into a much smaller jaw, so plaque has more places to hide and the bone around the roots is thinner. ${c.brachy ? 'Flat-faced breeds have 1.25× the odds of periodontal disease on top of that.' : 'Spaniel types and toy breeds show up disproportionately in the dental statistics.'} Most small dogs have measurable disease by three.`,
    how: () =>
      'Ask for an oral exam at every visit and expect a first professional cleaning with radiographs by around three to five. Daily brushing from now buys years.',
  },
  {
    id: 'dental-puppy',
    kind: 'note',
    topic: 'dental',
    evidence: 'moderate',
    sources: ['merck'],
    priority: 48,
    when: (c) => c.stage === 'puppy',
    title: () => 'Teeth in puppyhood: handle the mouth now',
    why: (c) =>
      `Baby teeth fall out between about four and six months; a puppy that has ${c.v.poss} mouth gently handled every day now will accept brushing, exams and anaesthesia-free checks for the rest of ${c.v.poss} life. Watch for a baby tooth that doesn’t fall out when its adult replacement arrives${c.tiny ? ' — common in small breeds' : ''}; retained teeth trap plaque and should be removed.`,
    how: (c) =>
      `Lift ${c.v.poss} lip and touch the teeth for a few seconds daily, then introduce a finger brush with canine paste. Keep appropriate chews around; a teething puppy will chew something.`,
  },
]
