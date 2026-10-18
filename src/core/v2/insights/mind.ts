/**
 * Enrichment, sleep and the ageing brain.
 */

import type { InsightSpec } from '../context'

export const MIND_INSIGHTS: readonly InsightSpec[] = [
  {
    id: 'enrichment-rarely',
    kind: 'move',
    topic: 'mind',
    evidence: 'moderate',
    sources: ['milgram2005', 'yarborough2022'],
    priority: (c) => (c.older ? 68 : 62),
    when: (c) => c.p.enrichment === 'rarely',
    title: (c) => c.pick('enrich-t', `Give ${c.v.name}’s brain a job every day`, 'Add daily mental work — it’s cheaper than you’d think'),
    why: () =>
      'In a two-year controlled study of ageing beagles, dogs given behavioural enrichment — new toys, problem-solving tasks, more social contact — kept their learning ability where unenriched dogs lost it, and the effect was strongest combined with an antioxidant-rich diet. Mental work is also the fastest way to tire a dog without loading the joints.',
    how: (c) =>
      `Feed one meal a day from a puzzle or snuffle mat, hide treats around a room for ${c.v.obj} to find, teach one small new trick a week, and rotate toys so there is always something slightly novel. Ten minutes of this tires most dogs more than a half-hour walk.`,
  },
  {
    id: 'enrichment-sometimes',
    kind: 'note',
    topic: 'mind',
    evidence: 'moderate',
    sources: ['milgram2005'],
    priority: 44,
    when: (c) => c.p.enrichment === 'sometimes',
    title: () => 'Make the enrichment daily',
    why: () =>
      'The benefit in the controlled studies came from regular, varied mental work — not an occasional puzzle. Little and often beats a big session at the weekend.',
    how: (c) =>
      `The easiest habit: one of ${c.v.poss} daily meals always comes from a puzzle feeder or a scatter on the lawn. Zero extra time, and it turns into a routine.`,
  },
  {
    id: 'enrichment-daily',
    kind: 'win',
    topic: 'mind',
    evidence: 'moderate',
    sources: ['milgram2005'],
    priority: 60,
    when: (c) => c.p.enrichment === 'daily',
    title: () => 'Daily mental enrichment',
    why: (c) =>
      `That is the thing the ageing-brain research keeps coming back to: dogs kept mentally busy hold onto their learning ability for years longer. ${c.older ? 'Keep it going; it matters most now.' : 'It also makes for a calmer, better-behaved dog.'}`,
  },
  {
    id: 'sleep-restless-older',
    kind: 'flag',
    topic: 'mind',
    evidence: 'moderate',
    sources: ['salvin2010', 'aahaSenior2023', 'merck'],
    priority: 80,
    when: (c) => c.p.sleep === 'restless' && c.older,
    title: () => `Restless nights in an older dog are a symptom worth naming`,
    why: () =>
      'Night-time pacing, waking, vocalising or confusion is one of the cardinal signs of canine cognitive dysfunction — which affects about 14% of dogs over eight, yet under 2% ever get diagnosed, because owners assume it is just age. It can also be pain, or needing to urinate more. All three are treatable, and all three get worse if ignored.',
    how: (c) =>
      `Keep a one-week log of what ${c.v.subj} ${c.v.verb('do')} at night, then book a visit and ask specifically about cognitive dysfunction (the DISHAA checklist), a pain assessment and a urine test. A night light, a predictable evening routine and a last toilet trip before bed help in the meantime.`,
  },
  {
    id: 'sleep-restless-adult',
    kind: 'move',
    topic: 'mind',
    evidence: 'low',
    sources: ['merck', 'dreschel2010'],
    priority: 58,
    when: (c) => c.p.sleep === 'restless' && !c.older,
    title: () => 'Work out why the nights are restless',
    why: (c) =>
      `A younger dog that doesn’t settle at night is usually telling you something specific: pain or itch, needing to go out, noise or anxiety, too little daytime exercise, or a sleeping spot that is too warm or too exposed. Chronic anxiety in particular has measurable health costs, so it is worth getting to the bottom of${c.stage === 'puppy' ? '. In a puppy, it is most often simply a bladder that can’t last the night yet.' : '.'}`,
    how: (c) =>
      `Note when ${c.v.subj} ${c.v.verb('wake')} and what ${c.v.subj} ${c.v.verb('do')} for a week. Try more daytime exercise and a final toilet break before bed; if ${c.v.subj} ${c.v.verb('scratch')}, ${c.v.verb('pace')} or ${c.v.verb('seem')} uncomfortable, that is a vet question rather than a training one.`,
  },
  {
    id: 'sleep-sound',
    kind: 'win',
    topic: 'mind',
    evidence: 'low',
    sources: ['merck'],
    priority: 44,
    when: (c) => c.p.sleep === 'sound',
    title: () => 'Sleeping soundly',
    why: (c) =>
      `A dog that settles and sleeps through is, by and large, a comfortable dog. ${c.older ? 'Any change to that pattern in an older dog — pacing, waking, confusion — is one of the earliest signs of cognitive decline and worth mentioning early.' : 'Enjoy it.'}`,
  },
  {
    id: 'sleep-not-sure',
    kind: 'note',
    topic: 'mind',
    evidence: 'moderate',
    sources: ['salvin2010'],
    priority: (c) => (c.older ? 48 : 30),
    when: (c) => c.p.sleep === 'not-sure' && c.older,
    title: () => 'Worth watching the nights',
    why: () =>
      'In dogs over eight, disturbed sleep is often the first sign of cognitive dysfunction that owners notice — and it is badly under-diagnosed. If you can, notice over the next week whether there is pacing, waking or confusion after dark.',
  },
  {
    id: 'cognition-senior',
    kind: 'move',
    topic: 'mind',
    evidence: 'moderate',
    sources: ['salvin2010', 'milgram2005', 'yarborough2022', 'aahaSenior2023'],
    priority: 58,
    when: (c) => c.older && c.p.sleep !== 'restless' && !c.sign('confusion'),
    title: (c) => c.pick('cog-t', `Protect ${c.v.name}’s mind on purpose`, 'Brain health is a thing you can act on'),
    why: () =>
      'Cognitive dysfunction touches about one in seven dogs over eight and most of them are never diagnosed. The things that slow it are known: daily physical activity, daily mental enrichment, a stable routine, and — in controlled trials — antioxidant-enriched diets. Started early, they make a real difference; started after the signs appear, less so.',
    how: (c) =>
      `Keep ${c.v.obj} walking and problem-solving every day, keep the routine predictable, and ask the vet to screen for cognitive change at each visit (a two-minute questionnaire). If signs appear — disorientation, staring at walls, forgetting house-training, night pacing — there are diets and medications that help, and they work best early.`,
  },
  {
    id: 'mind-training-games',
    kind: 'note',
    topic: 'mind',
    evidence: 'low',
    sources: ['avsabSocialization', 'milgram2005'],
    priority: 40,
    when: (c) => c.young && c.p.enrichment !== 'daily',
    title: () => 'Training is enrichment',
    why: (c) =>
      `Five minutes of reward-based training a day does double duty: it builds the habits that make the next decade easy, and it is exactly the kind of problem-solving that keeps a dog’s brain sharp. ${c.stage === 'puppy' ? 'Short, playful and frequent beats long sessions at this age.' : 'A young adult with energy to spare usually needs a job more than a longer walk.'}`,
  },
]
