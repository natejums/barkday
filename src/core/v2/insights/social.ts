/**
 * Company, time alone, fear, and how the dog is trained.
 */

import type { InsightSpec } from '../context'

export const SOCIAL_INSIGHTS: readonly InsightSpec[] = [
  {
    id: 'other-dogs-yes',
    kind: 'win',
    topic: 'social',
    evidence: 'moderate',
    sources: ['mccoy2023'],
    priority: 62,
    when: (c) => c.p.otherDogs === true,
    title: () => 'Canine company at home',
    why: (c) =>
      `When the Dog Aging Project looked at 21,410 dogs, social companionship — living with other dogs and people — was the strongest positive factor in their health and mobility, about five times the size of the household’s financial situation. ${c.v.Name} has that built in.`,
  },
  {
    id: 'other-dogs-no',
    kind: 'move',
    topic: 'social',
    evidence: 'moderate',
    sources: ['mccoy2023'],
    priority: (c) => (c.p.anxiety === 'a-lot' ? 36 : 52),
    when: (c) => c.p.otherDogs === false,
    title: (c) =>
      c.p.anxiety === 'a-lot'
        ? 'Company on their own terms'
        : c.pick('dogs-no-t', `Find ${c.v.name} some regular dog friends`, 'Arrange some canine company'),
    why: (c) =>
      `Social companionship was the strongest positive predictor of health in the largest study of dog ageing to date — stronger than income, stronger than neighbourhood. ${c.p.anxiety === 'a-lot' ? `For an anxious dog that does not mean a busy dog park; it means one or two calm, familiar dogs, and only if ${c.v.subj} genuinely ${c.v.verb('enjoy')} them.` : 'A single-dog household can get the same benefit from regular play with familiar dogs.'}`,
    how: (c) =>
      c.p.anxiety === 'a-lot'
        ? `Quality over quantity: a weekly parallel walk with one steady dog, at a distance ${c.v.subj} ${c.v.verb('find')} comfortable, is worth more than any park. If ${c.v.subj} would rather just have you, that is fine too.`
        : `A weekly walk with a friend’s dog, a well-run daycare day, or a regular meet-up with a compatible dog all count. Watch ${c.v.poss} body language and let ${c.v.obj} choose ${c.v.poss} friends.`,
  },
  {
    id: 'children-yes',
    kind: 'note',
    topic: 'social',
    evidence: 'low',
    sources: ['mccoy2023', 'avsabSocialization'],
    priority: (c) => (c.p.anxiety === 'a-lot' ? 72 : 54),
    when: (c) => c.p.children === true,
    title: (c) => c.pick('kids-t', 'Kids and dogs: protect the dog’s downtime', 'A dog in a house with children'),
    why: (c) =>
      `An unexpected finding from the Dog Aging Project: the more children in a household, the worse the dogs’ reported health — which the authors read as an attention budget, not harm. Time spent on children is time not spent noticing the dog’s weight creeping up or the walk getting shorter.${c.p.anxiety === 'a-lot' ? ' For an anxious dog, unpredictable noise and handling is also genuinely hard, and most bites to children come from a dog that has run out of ways to say “enough”.' : ''}`,
    how: (c) =>
      `Give ${c.v.obj} a bed or crate that is off-limits to the kids and let ${c.v.obj} retreat there; teach the children to leave a dog that is eating, sleeping or walking away; and put ${c.v.poss} walk and weigh-in on the family calendar so they don’t quietly disappear.`,
  },
  {
    id: 'time-alone-long',
    kind: 'move',
    topic: 'social',
    evidence: 'low',
    sources: ['mccoy2023', 'dreschel2010', 'merck'],
    priority: (c) => (c.stage === 'puppy' || c.older ? 76 : 66),
    when: (c) => c.p.timeAlone === 'over-8h',
    title: (c) => c.pick('alone-t', 'Break up the long days alone', 'Eight-plus hours alone is a long day for a dog'),
    why: (c) =>
      `${c.stage === 'puppy' ? 'A puppy cannot physically hold their bladder that long and will not learn house-training without a midday break.' : c.older ? 'An older dog needs to urinate more often and is more prone to anxiety when routines shift.' : 'Eight hours is near the limit for an adult bladder, and it is a long stretch without company for an animal whose health tracks so closely with social contact.'} Separation-related distress also showed up as more skin disease in the one study that measured fear against health.`,
    how: (c) =>
      `A midday walker, a neighbour, a daycare day or two, or a shifted schedule all work. Leave something to do — a frozen stuffed toy, a puzzle feeder — and ${c.p.otherDogs ? 'the company of your other dog helps a great deal' : 'consider whether a calm companion dog would suit the household'}.`,
  },
  {
    id: 'time-alone-moderate',
    kind: 'note',
    topic: 'social',
    evidence: 'low',
    sources: ['merck'],
    priority: (c) => (c.stage === 'puppy' ? 60 : 40),
    when: (c) => c.p.timeAlone === '4-8h',
    title: () => 'A normal working day',
    why: (c) =>
      c.stage === 'puppy'
        ? 'Fine for an adult; for a puppy it is too long between toilet breaks until about six months, so arrange a midday visit while house-training is being learned.'
        : `Most adult dogs handle this well, as long as the time around it is good. Leave ${c.v.obj} something to do — a stuffed toy, a puzzle — and make the walk before you leave a proper one.`,
  },
  {
    id: 'time-alone-short',
    kind: 'win',
    topic: 'social',
    evidence: 'moderate',
    sources: ['mccoy2023'],
    priority: 46,
    when: (c) => c.p.timeAlone === 'under-4h',
    title: () => 'Rarely left alone for long',
    why: (c) =>
      `Company is the thing the health data keeps pointing at. One small suggestion: make sure ${c.v.subj} ${c.v.verb('practise')} being alone sometimes, so a day when you have to be out isn’t a crisis.`,
  },
  {
    id: 'anxiety-a-lot',
    kind: 'move',
    topic: 'behaviour',
    evidence: 'low',
    sources: ['dreschel2010', 'vieiradecastro2020', 'avsabSocialization'],
    priority: 80,
    recId: 'anxiety',
    when: (c) => c.p.anxiety === 'a-lot',
    title: (c) => c.pick('anx-t', `Get ${c.v.name} real help with the fear`, 'Treat the anxiety like the health problem it is'),
    why: () =>
      'In the one study to measure it, dogs with extreme fear of strangers lived about six months less than calm dogs, and fearful and separation-anxious dogs had more skin disease — owner-reported, so weak evidence, but chronic stress is physiologically real. The more important point is that fear is treatable, and that punishment-based handling makes it worse: aversively trained dogs show more stress behaviours, higher cortisol and a more pessimistic outlook.',
    how: (c) =>
      `See a veterinary behaviourist or a certified reward-based trainer who works with fear (look for CCPDT, IAABC or KPA credentials). Desensitisation and counter-conditioning work; medication is a legitimate tool, not a last resort. In the meantime, manage ${c.v.poss} exposure — distance from triggers, a safe room, no forcing — and never punish fearful behaviour.`,
  },
  {
    id: 'anxiety-some',
    kind: 'move',
    topic: 'behaviour',
    evidence: 'low',
    sources: ['dreschel2010', 'avsabSocialization'],
    priority: 54,
    when: (c) => c.p.anxiety === 'some',
    title: (c) => c.pick('anx-some-t', 'Work on the worries while they’re small', `Help ${c.v.name} with the things that worry ${c.v.obj}`),
    why: () =>
      'Mild fears tend to grow if they are rehearsed and shrink if they are worked on — and the health data, such as it is, suggests chronic fear has a cost. Fireworks, the vet, strangers, being alone: each has a well-understood programme.',
    how: (c) =>
      `Identify the two or three specific triggers, then pair each with distance and something ${c.v.subj} ${c.v.verb('love')}, gradually closing the gap. For noise fears, start sound desensitisation months before fireworks season. A reward-based trainer can map it out in one session.`,
  },
  {
    id: 'anxiety-none',
    kind: 'win',
    topic: 'behaviour',
    evidence: 'low',
    sources: ['dreschel2010', 'mccoy2023'],
    priority: 50,
    when: (c) => c.p.anxiety === 'none',
    title: () => 'A confident, settled dog',
    why: (c) =>
      `Fearfulness is one of the quieter things that chips at a dog’s health and lifespan, and ${c.v.name} doesn’t carry it. Keep socialising ${c.v.obj} gently through life — confidence is maintained, not just built.`,
  },
  {
    id: 'training-none-young',
    kind: 'move',
    topic: 'behaviour',
    evidence: 'moderate',
    sources: ['boyd2018', 'avsabSocialization'],
    priority: (c) => (c.young ? 84 : 58),
    when: (c) => c.p.training === 'none',
    title: (c) =>
      c.young
        ? c.pick('train-none-t', 'Training is a safety issue at this age, not a nicety', `Start reward-based training with ${c.v.name} now`)
        : 'Some basic training is never wasted',
    why: (c) =>
      `Among dogs that died before the age of three in one large study, a third of the deaths were linked to behaviour — aggression above all, and road accidents close behind — and in most of those cases no referral or treatment had ever been offered. ${c.young ? `That is the age ${c.v.name} is at. ` : ''}A dog with a recall, a settle and some manners is a dog that keeps ${c.v.poss} home and stays out of the road.`,
    how: (c) =>
      `Find a reward-based class (CCPDT, IAABC or KPA credentials are the markers), and practise for five minutes a day. Recall and a reliable “leave it” come first; they are the ones that save lives. ${c.young ? 'Positive exposure to people, dogs and places matters as much as the commands.' : ''}`,
  },
  {
    id: 'training-correction',
    kind: 'move',
    topic: 'behaviour',
    evidence: 'moderate',
    sources: ['vieiradecastro2020', 'avsabSocialization'],
    priority: (c) => (c.p.anxiety === 'a-lot' || c.p.anxiety === 'some' ? 80 : 68),
    when: (c) => c.p.training === 'correction-based',
    title: (c) => c.pick('train-corr-t', 'Switch to reward-based training', 'Drop the corrections — the evidence is clear'),
    why: (c) =>
      `In a study that filmed 92 dogs in reward-based and aversive-based training schools, the aversively trained dogs showed more stress behaviours and higher cortisol during training, and were more pessimistic in a cognitive bias test afterwards — outside the training context, in their general outlook.${c.p.anxiety !== 'none' && c.p.anxiety !== undefined ? ' For a dog that is already anxious, that is the worst possible combination.' : ''} Reward-based methods get the same obedience without the cost, which is why the veterinary behaviour society now recommends them outright.`,
    how: (c) =>
      `Retire the prong, choke or shock collar and the leash pops; replace them with a front-clip harness and a trainer who uses rewards (CCPDT, IAABC or KPA credentials). Teach ${c.v.obj} what to do instead of punishing what not to do. The results are usually faster than you expect.`,
  },
  {
    id: 'training-mixed',
    kind: 'note',
    topic: 'behaviour',
    evidence: 'moderate',
    sources: ['vieiradecastro2020'],
    priority: 50,
    when: (c) => c.p.training === 'mixed',
    title: () => 'Shift the balance toward rewards',
    why: () =>
      'The welfare cost of aversive methods scales with how much they are used — dogs in mostly-aversive programmes fared worst, mixed programmes sat in between. Every correction you replace with a reward moves the needle the right way.',
  },
  {
    id: 'training-reward',
    kind: 'win',
    topic: 'behaviour',
    evidence: 'moderate',
    sources: ['vieiradecastro2020', 'avsabSocialization'],
    priority: 56,
    when: (c) => c.p.training === 'reward-based',
    title: () => 'Reward-based training',
    why: (c) =>
      `The method with the best welfare evidence behind it, and the one the behaviour specialists recommend. It also happens to be excellent enrichment, so ${c.v.poss} training sessions are doing two jobs at once.`,
  },
  {
    id: 'puppy-socialisation',
    kind: 'move',
    topic: 'behaviour',
    evidence: 'high',
    sources: ['avsabSocialization', 'boyd2018'],
    priority: (c) => (c.ageYears < 0.3 ? 92 : 72),
    when: (c) => c.stage === 'puppy',
    title: (c) =>
      c.ageYears < 0.3
        ? 'The socialisation window is open right now — use it'
        : 'Keep socialising, carefully and positively',
    why: (c) =>
      `The sensitive period for socialisation closes at roughly 12–16 weeks${c.ageYears < 0.3 ? `, and ${c.v.name} is inside it` : ', and what came after it still matters'}. The veterinary behaviour society’s position is that the risk of a poorly socialised dog — fear, aggression, the leading causes of death in young dogs — outweighs the small infection risk of careful outings before the vaccine course is complete.`,
    how: (c) =>
      `Positive, controlled exposure to people of all kinds, calm vaccinated dogs, surfaces, sounds, traffic and handling — a few new things a day, always at a pace where ${c.v.subj} ${c.v.verb('stay')} relaxed. A well-run puppy class is ideal. Avoid dog parks and ground where unknown dogs toilet until the vaccines are done.`,
  },
  {
    id: 'adult-adopted-socialisation',
    kind: 'note',
    topic: 'behaviour',
    evidence: 'low',
    sources: ['avsabSocialization'],
    priority: 46,
    when: (c) =>
      (c.p.joinedAt === 'adult' || c.p.joinedAt === 'senior') &&
      (c.p.origin === 'shelter-rescue' || c.p.origin === 'found-stray' || c.p.origin === 'rehomed'),
    title: () => 'You may not know what the early years taught them',
    why: (c) =>
      `A dog that joined you as an adult arrived with a socialisation history you can only infer. That is not a problem — it is a reason to go at ${c.v.poss} pace, let ${c.v.obj} opt in to new things, and read a flinch as information rather than disobedience.`,
    how: (c) =>
      `Build positive associations one trigger at a time, keep greetings low-key, and if something specific frightens ${c.v.obj}, a reward-based trainer can map a plan in a single session.`,
  },
]
