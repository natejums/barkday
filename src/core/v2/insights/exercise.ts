/**
 * Exercise: how much, and — the 2.0 question — what kind.
 */

import type { InsightSpec } from '../context'

export const EXERCISE_INSIGHTS: readonly InsightSpec[] = [
  {
    id: 'exercise-low',
    kind: 'move',
    topic: 'exercise',
    evidence: 'low',
    sources: ['yarborough2022', 'aahaLifeStage2019'],
    priority: (c) => (c.older ? 78 : 72),
    recId: 'activity',
    when: (c) => c.p.activityLevel === 'sedentary' || c.p.activityLevel === 'lightly-active',
    title: (c) =>
      c.older
        ? c.pick('ex-low-older-t', 'Keep moving — gentler, but every day', 'More movement, in smaller doses')
        : c.pick('ex-low-t', `Build ${c.v.name} up to an hour a day`, 'More daily exercise, built up gradually'),
    why: (c) =>
      `In the Dog Aging Project’s survey of 15,019 dogs, the odds of cognitive dysfunction were 6.5 times higher in dogs their owners described as inactive than in very active ones, after accounting for age and breed. It is a snapshot, so some of that is cause running the other way — declining dogs get walked less — but the weight benefit alone makes it worth doing${c.older ? ', and in an older dog movement is what keeps the joints and the mind going' : ''}.`,
    how: (c) =>
      c.older
        ? `Two or three shorter outings rather than one long one, on soft ground where possible, at ${c.v.poss} pace. Slow sniffing walks count. Stop before ${c.v.subj} ${c.v.verb('tire')}, not after.`
        : `Add ten minutes a week until you reach around an hour of real activity a day, split however suits you. Sniffing counts; so does play, training and fetch in moderation. ${c.brachy ? 'Keep it cool and watch the breathing — flat faces overheat fast.' : ''}`,
  },
  {
    id: 'exercise-leash-only',
    kind: 'note',
    topic: 'exercise',
    evidence: 'low',
    sources: ['milgram2005', 'aahaLifeStage2019'],
    priority: 50,
    when: (c) => c.ex('leash-walks') && !c.ex('off-leash') && !c.ex('hiking') && !c.ex('dog-sports') && !c.ex('swimming'),
    title: () => 'Make the lead walks count for more',
    why: () =>
      'A brisk heel on pavement is exercise for the legs but not much for the mind. Sniffing is a dog’s main way of reading the world, and enrichment of that kind measurably slows cognitive ageing. Varying the route does more than lengthening it.',
    how: (c) =>
      `Give ${c.v.obj} one “sniff walk” a day — a long line, no agenda, ${c.v.subj} ${c.v.verb('choose')} the pace — and try a new route each week. If you can find a secure field or enclosed park, a run off the lead now and then is good for both of you.`,
  },
  {
    id: 'exercise-off-leash-recall',
    kind: 'move',
    topic: 'exercise',
    evidence: 'moderate',
    sources: ['boyd2018'],
    priority: (c) => (c.young || c.p.training === 'none' ? 72 : 48),
    when: (c) => c.ex('off-leash') && (c.young || c.p.training === 'none' || c.p.training === undefined),
    title: (c) => c.pick('recall-t', 'A rock-solid recall is a safety device', `Train ${c.v.name}’s recall like it matters — because it does`),
    why: () =>
      'In a study of deaths in dogs under three, a third were linked to behaviour, and road traffic accidents — often a dog that didn’t come back — accounted for 39% of those. Off-lead freedom is wonderful for a dog; a reliable recall is what makes it safe.',
    how: (c) =>
      `Practise on a long line first. Pay the recall every single time with something ${c.v.subj} ${c.v.verb('love')}, never call ${c.v.obj} to end the fun, and keep ${c.v.obj} on the lead near roads until the recall is boring in its reliability.`,
  },
  {
    id: 'exercise-fetch',
    kind: 'note',
    topic: 'exercise',
    evidence: 'low',
    sources: ['acvs', 'levy2009'],
    priority: (c) =>
      (c.young && c.big) || c.older || c.cond.has('cruciate-rupture') || c.cond.has('hip-dysplasia') || c.has('arthritis') ? 66 : 48,
    when: (c) => c.ex('fetch'),
    title: () => 'Go easy on the ball launcher',
    why: (c) =>
      `Repetitive sprint–skid–twist cycles load the knees and shoulders in exactly the way that ruptures cruciate ligaments and wears cartilage, and most dogs will keep going long past the point of sense. ${c.young && c.big ? 'In a big dog whose growth plates have not closed, that matters most.' : c.older || c.has('arthritis') ? 'On joints that are already stiff, it is the fastest route to a bad week.' : 'The evidence is surgeons’ consensus rather than a trial, but the mechanism is not in doubt.'}`,
    how: (c) =>
      `Short sessions, a warm-up walk first, throws rolled along the ground rather than lobbed high, and stop while ${c.v.subj} still ${c.v.verb('want')} more. Swap some fetch for scent games — a hidden ball works the brain and spares the knees.`,
  },
  {
    id: 'exercise-swimming',
    kind: 'win',
    topic: 'exercise',
    evidence: 'moderate',
    sources: ['acvs', 'oneill2021otitis', 'aspcaApcc'],
    priority: 56,
    when: (c) => c.ex('swimming'),
    title: () => 'Swimming is about the best exercise a dog can get',
    why: (c) =>
      `Zero-impact, full-body, and excellent for stiff joints and recovery. The things to watch: ${c.cond.has('otitis') ? `${c.theBreed} is prone to ear infections, so dry the ears after every swim; ` : 'dry floppy ears afterwards; '}avoid still water with any green scum (blue-green algae can kill within hours); and ${c.brachy || c.big ? 'use a life jacket — flat faces and heavy builds tire and sink fast' : 'keep an eye on cold water and fatigue'}.`,
  },
  {
    id: 'exercise-sports',
    kind: 'note',
    topic: 'exercise',
    evidence: 'moderate',
    sources: ['levy2009', 'acvs'],
    priority: 54,
    when: (c) => c.ex('dog-sports'),
    title: () => 'Dog sports: train the athlete, not just the sport',
    why: () =>
      'A survey of 1,627 agility dogs found a third had been injured, most often shoulders, backs and the soft tissue of the forelimbs — and Border Collies out of proportion to their numbers. Sport is brilliant enrichment; the injuries come from doing it on an unconditioned body.',
    how: (c) =>
      `Warm up and cool down every session, build core strength on rest days, keep ${c.v.obj} lean (every extra kilo lands on the joints at every jump), and take a week off after any tweak rather than “working through it”.`,
  },
  {
    id: 'exercise-hiking',
    kind: 'win',
    topic: 'exercise',
    evidence: 'moderate',
    sources: ['hall2020triggers', 'ahsHeartworm'],
    priority: 54,
    when: (c) => c.ex('hiking'),
    title: () => 'Hiking together',
    why: (c) =>
      `Long, varied, sniff-rich exercise is the good stuff. Three practical notes: check paws and coat for ticks and grass seeds afterwards (and keep tick prevention current), carry water, and remember that three-quarters of heatstroke cases are caused by exertion rather than hot cars — on a warm day, turn back earlier than ${c.v.subj} would.`,
  },
  {
    id: 'exercise-very-active',
    kind: 'win',
    topic: 'exercise',
    evidence: 'low',
    sources: ['yarborough2022'],
    priority: 58,
    when: (c) => c.p.activityLevel === 'very-active',
    title: (c) => `${c.v.Name} gets a lot of exercise`,
    why: (c) =>
      `That is one of the clearest associations in the ageing data: very active dogs show a fraction of the cognitive decline of inactive ones, and they are far more likely to stay lean. ${c.older ? 'As an older dog, the trick is to keep the frequency and ease off the intensity.' : 'Keep it varied so the body and the brain both get worked.'}`,
  },
  {
    id: 'exercise-active',
    kind: 'win',
    topic: 'exercise',
    evidence: 'low',
    sources: ['yarborough2022'],
    priority: 52,
    when: (c) => c.p.activityLevel === 'active',
    title: () => 'A properly active dog',
    why: () =>
      'Around an hour of real activity a day is where the health benefits live — weight, joints, behaviour and, later on, the brain. You are there.',
  },
  {
    id: 'exercise-puppy',
    kind: 'note',
    topic: 'exercise',
    evidence: 'low',
    sources: ['merck', 'acvs'],
    priority: 58,
    when: (c) => c.stage === 'puppy',
    title: () => 'Puppy exercise: free play yes, forced miles no',
    why: (c) =>
      `Growth plates stay open until roughly ${c.big ? '14–18' : c.tiny ? '8–10' : '10–12'} months, and repetitive, forced exercise — long lead runs, jogging, endless ball-throwing, stairs by the hundred — loads soft, growing joints in a way that free play on grass does not. The popular “five minutes per month of age” rule has no study behind it, but the principle does.`,
    how: (c) =>
      `Let ${c.v.obj} play, sniff and nap as much as ${c.v.subj} ${c.v.verb('like')}; keep structured walks short and varied; no jogging or repetitive jumping until the growth plates close. Mental work tires a puppy faster than miles do.`,
  },
  {
    id: 'exercise-brachy',
    kind: 'note',
    topic: 'exercise',
    evidence: 'moderate',
    sources: ['cambridgeBoas', 'hall2020incidence'],
    priority: 64,
    when: (c) => c.brachy,
    title: () => 'Exercise with a flat face: cool, short, and watch the breathing',
    why: () =>
      `A shortened airway cannot shed heat by panting the way a long muzzle can, which is why flat-faced breeds have roughly twice the odds of heat-related illness. Noisy breathing, tiring quickly or needing to stop are signs of airway obstruction (BOAS), not personality — and BOAS can be graded and, where needed, treated surgically.`,
    how: (c) =>
      `Walk in the cool of the day in warm weather, keep ${c.v.obj} lean, use a harness rather than a collar, carry water, and ask the vet to grade ${c.v.poss} airway. If ${c.v.subj} ${c.v.verb('snore')} loudly, ${c.v.verb('gag')} or ${c.v.verb('collapse')} after exertion, that is worth a referral.`,
  },
]
