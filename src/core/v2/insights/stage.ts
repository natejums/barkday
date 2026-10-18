/**
 * What this life stage asks for, beyond what the other topics already cover.
 */

import type { InsightSpec } from '../context'

export const STAGE_INSIGHTS: readonly InsightSpec[] = [
  {
    id: 'puppy-vaccines',
    kind: 'move',
    topic: 'stage',
    evidence: 'high',
    sources: ['aahaVaccination2022'],
    priority: 88,
    when: (c) => c.stage === 'puppy' && c.p.vaccination !== 'up-to-date',
    title: () => 'Finish the puppy vaccine course on schedule',
    why: () =>
      'Maternal antibodies fade unpredictably between six and sixteen weeks, which is why the core course is a series rather than a single shot — a puppy is only reliably protected after the final dose at 16–20 weeks. Parvovirus in particular is still common, still kills, and lives in soil for months.',
    how: (c) =>
      `Distemper, adenovirus and parvovirus every 3–4 weeks until at least 16 weeks, leptospirosis (now core) as a two-dose course from 12 weeks, and rabies as your law requires. Keep ${c.v.obj} off ground used by unknown dogs until a week after the last dose, but do socialise in safe settings meanwhile.`,
  },
  {
    id: 'puppy-neuter-timing',
    kind: 'note',
    topic: 'stage',
    evidence: 'moderate',
    sources: ['hart2020'],
    priority: 56,
    when: (c) => c.stage === 'puppy' && c.p.neuterStatus !== 'neutered',
    title: () => 'Decide on neutering with the breed in mind',
    why: (c) =>
      c.big
        ? `For large and giant breeds the evidence now favours waiting until the growth plates close — at least 12 months, longer for some breeds — because early neutering raised the rate of joint disorders and some cancers in a 35-breed study${c.breedName ? `. Ask what the data show for the ${c.breedName} specifically` : ''}.`
        : 'For small and medium breeds the 35-breed neutering study found no joint or cancer penalty for early neutering, so the timing is mostly about convenience, behaviour and, for a female, whether to allow a first season.',
  },
  {
    id: 'puppy-alone-training',
    kind: 'note',
    topic: 'stage',
    evidence: 'low',
    sources: ['avsabSocialization', 'merck'],
    priority: 50,
    when: (c) => c.stage === 'puppy',
    title: () => 'Teach being alone before it’s needed',
    why: () =>
      'Separation distress is far easier to prevent than to treat. A puppy that learns, in minutes and then hours, that being alone is boring rather than frightening is a dog that can be left for a working day later without a problem.',
    how: (c) =>
      `Short, planned absences from the first week — a few minutes, then longer — with something to chew, no fuss on leaving or returning. Build it up before ${c.v.subj} ever ${c.v.verb('have')} to cope with a full day.`,
  },
  {
    id: 'young-weight-set',
    kind: 'move',
    topic: 'stage',
    evidence: 'moderate',
    sources: ['aahaLifeStage2019', 'salt2019'],
    priority: 58,
    when: (c) => c.stage === 'young-adult' && c.p.bodyConditionScore === undefined,
    title: (c) => `Set ${c.v.name}’s target weight now and hold it`,
    why: (c) =>
      `Growth has finished; appetite hasn’t. ${c.p.neuterStatus === 'neutered' ? 'Neutering drops calorie needs by 10–20% without reducing hunger, and the year after it is when most dogs gain the weight they then carry for life.' : 'This is the year the weight that gets carried for life is usually put on.'} The dogs that stay lean through middle age are mostly the ones whose owners picked a number early and weighed against it.`,
    how: (c) =>
      `Ask the vet for a target weight at the next visit, weigh ${c.v.obj} monthly, and adjust the ration by 10% whenever the trend drifts. Score the body condition with your hands every few weeks — ribs easy to feel, waist from above.`,
  },
  {
    id: 'mature-weight-creep',
    kind: 'note',
    topic: 'stage',
    evidence: 'high',
    sources: ['salt2019', 'apop2022'],
    priority: 50,
    when: (c) => c.stage === 'mature-adult' && (c.p.bodyConditionScore === undefined || c.p.bodyConditionScore <= 5),
    title: () => 'Middle age is when the weight creeps',
    why: () =>
      'The lifespan cost of being overweight was measured specifically in middle-aged dogs, and middle age is when it happens — calorie needs fall, routines settle, and a kilo a year goes unnoticed on a dog you see every day. A quarterly hands-on body-condition check is the whole defence.',
  },
  {
    id: 'mature-lump-check',
    kind: 'move',
    topic: 'stage',
    evidence: 'moderate',
    sources: ['merck'],
    priority: (c) =>
      c.cond.has('mast-cell-tumour') || c.cond.has('hemangiosarcoma') || c.cond.has('lymphoma') || c.cond.has('osteosarcoma')
        ? 76
        : 56,
    when: (c) => c.stage === 'mature-adult' || c.older,
    title: (c) => c.pick('lump-t', 'Do a monthly hands-on lump check', `Check ${c.v.name} over for lumps once a month`),
    why: (c) =>
      `Most lumps on a dog are harmless fatty growths. Some are not, and the two look identical from the outside — mast cell tumours in particular can look like anything. ${c.cond.has('mast-cell-tumour') || c.cond.has('lymphoma') || c.cond.has('hemangiosarcoma') ? `${c.TheBreed} has a documented predisposition to cancer, which makes this a habit worth keeping. ` : ''}A lump found at pea size has far better options than one found at plum size.`,
    how: (c) =>
      `Once a month, run your hands over every inch of ${c.v.obj}, including armpits, groin, between the toes and inside the lips. Anything new, anything growing, anything that changes: have it sampled with a needle (a quick, cheap, in-clinic test) rather than “keeping an eye on it”.`,
  },
  {
    id: 'senior-pain',
    kind: 'move',
    topic: 'stage',
    evidence: 'moderate',
    sources: ['aahaSenior2023', 'merck'],
    priority: 64,
    when: (c) => c.older && (c.p.mobility === undefined || c.p.mobility === 'fine'),
    title: (c) => c.pick('senior-pain-t', 'Ask for a pain assessment at every visit', `Assume ${c.v.name} hides pain, because ${c.v.subj} ${c.v.verb('do')}`),
    why: () =>
      'Dogs are stoic by design, and the behaviours owners read as “slowing down” — sleeping more, shorter walks, hesitating at stairs — are very often untreated pain, usually from arthritis, which affects most senior dogs. The senior guidelines ask for a formal pain score at every visit precisely because it is missed so often.',
    how: (c) =>
      `Ask the vet to score ${c.v.poss} pain and mobility, and if there is any, for an actual plan: weight, omega-3s, controlled exercise, and modern pain relief. Watch for the quiet signs at home — slower to rise, licking a joint, less keen on the car.`,
  },
  {
    id: 'geriatric-qol',
    kind: 'move',
    topic: 'stage',
    evidence: 'moderate',
    sources: ['villalobosQol', 'aahaSenior2023'],
    priority: 70,
    when: (c) => c.stage === 'geriatric',
    title: (c) => c.pick('geri-qol-t', 'Keep a simple quality-of-life record', `Track ${c.v.name}’s good days and hard days`),
    why: () =>
      'At this stage the question shifts from how long to how well, and the honest answer comes from trends rather than single days. The HHHHHMM scale — hurt, hunger, hydration, hygiene, happiness, mobility, and more good days than bad — gives you seven things to score out of ten; a total over 35 is the usual marker that life is still good. Having a record also makes the hardest conversation clearer and kinder when it comes.',
    how: (c) =>
      `Score the seven once a week on a note on the fridge. Talk to the vet about what ${c.v.poss} end-of-life care should look like — at home, in the clinic, what the signs will be — long before you need to decide anything. It is far easier to plan for than to improvise.`,
  },
  {
    id: 'geriatric-comfort',
    kind: 'note',
    topic: 'stage',
    evidence: 'moderate',
    sources: ['aahaSenior2023'],
    priority: 56,
    when: (c) => c.stage === 'geriatric',
    title: () => 'Comfort is the care plan now',
    why: (c) =>
      `Warm, soft, supportive bedding; water within a few steps; smaller, more frequent meals; more toilet breaks; traction everywhere ${c.v.subj} ${c.v.verb('walk')}; and a predictable routine. Expect appetite, sleep and continence to change, and manage them rather than being surprised by them. ${c.v.Name} has given you a whole life; the rest is gentle days.`,
  },
  {
    id: 'geriatric-visits',
    kind: 'note',
    topic: 'stage',
    evidence: 'moderate',
    sources: ['aahaSenior2023'],
    priority: 58,
    when: (c) => c.stage === 'geriatric' && c.p.vetCare !== 'proactive',
    title: () => 'Visits every three to six months',
    why: () =>
      'Not because more can always be done, but because the things that make these months good — pain control, appetite, hydration, continence — are adjustable, and they drift faster now. Each visit should include a pain score and a weight.',
  },
]
