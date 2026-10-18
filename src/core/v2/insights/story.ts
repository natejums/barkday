/**
 * Where the dog came from, and what that means for their care.
 */

import type { InsightSpec } from '../context'

const unknownHistory = (c: { p: { origin?: string | undefined; joinedAt?: string | undefined } }) =>
  (c.p.origin === 'shelter-rescue' || c.p.origin === 'found-stray' || c.p.origin === 'rehomed') &&
  (c.p.joinedAt === 'adult' || c.p.joinedAt === 'senior')

export const STORY_INSIGHTS: readonly InsightSpec[] = [
  {
    id: 'origin-shelter',
    kind: 'note',
    topic: 'story',
    evidence: 'moderate',
    sources: ['aahaVaccination2022', 'ahsHeartworm', 'lord2009'],
    priority: (c) => (unknownHistory(c) ? 66 : 54),
    when: (c) => c.p.origin === 'shelter-rescue',
    title: (c) => c.pick('origin-shelter-t', 'A rescue dog’s first year is a year of discovery', `What a shelter dog’s history asks of you`),
    why: (c) =>
      `${c.v.Name} arrived with a medical history you mostly can’t see: vaccine status, parasite exposure, past injuries, whether the age on the paperwork was measured or guessed from the teeth (which is accurate to a year or two at best). None of that is a problem, but each is a reason the first check-ups matter more than they would for a dog you have known from birth.`,
    how: (c) =>
      `If it hasn’t been done: a full exam with bloodwork, a heartworm test, a faecal test, a vaccine course if records are missing, and — crucially — the microchip transferred into your name, because the most common reason a chipped dog isn’t returned is a registry pointing at a previous owner. ${c.p.yearsTogether !== undefined && c.p.yearsTogether >= 1 ? `After ${c.v.poss} time with you, most of that will already be in hand; the chip registration is the one worth double-checking.` : ''}`,
  },
  {
    id: 'origin-stray',
    kind: 'note',
    topic: 'story',
    evidence: 'moderate',
    sources: ['aahaVaccination2022', 'ahsHeartworm', 'merck'],
    priority: 64,
    when: (c) => c.p.origin === 'found-stray',
    title: (c) => `${c.v.Name} found ${c.v.poss} way to you`,
    why: () =>
      'A found dog is an unknown quantity in the best way and the medical way at once. Time on the streets means parasite exposure, possibly leptospirosis, possibly an old injury, and an age that is an estimate. It also means somebody may once have been looking.',
    how: (c) =>
      `If it hasn’t already been done: a scan for a microchip (then register it to you), a full exam with bloodwork, a heartworm and faecal test, and the core vaccines including leptospirosis. Then treat ${c.v.poss} first year with you as the year you learn ${c.v.poss} normal.`,
  },
  {
    id: 'origin-rehomed',
    kind: 'note',
    topic: 'story',
    evidence: 'low',
    sources: ['merck', 'lord2009'],
    priority: 50,
    when: (c) => c.p.origin === 'rehomed',
    title: () => 'Collect the history from the previous home',
    why: () =>
      'A rehomed dog often comes with a complete medical record that simply never gets transferred — vaccine dates, past surgeries, medications, the food they were on, and the microchip registration, which stays in the previous owner’s name unless someone changes it.',
    how: (c) =>
      `Ask the previous family or their vet for the records and have them sent to your practice. Transfer the chip registration to you. Keep ${c.v.obj} on the same food for the first couple of weeks and change over 7–10 days if you want to switch.`,
  },
  {
    id: 'origin-breeder',
    kind: 'note',
    topic: 'story',
    evidence: 'moderate',
    sources: ['ofa', 'merck'],
    priority: (c) => (c.stage === 'puppy' ? 56 : 44),
    when: (c) => c.p.origin === 'breeder',
    title: () => 'Ask the breeder for the health testing',
    why: (c) =>
      `A responsible breeder screens the parents for the breed’s known conditions${c.cond.size > 0 ? ` — for a ${c.breedName ?? 'dog like this'} that typically means ${[...c.cond].slice(0, 3).map((id) => id.replace(/-/g, ' ')).join(', ')} and similar` : ''} — and the results (OFA, CHIC, BVA or equivalent) are the best preview of what to watch for. They also establish what is and isn’t a surprise later.`,
    how: () =>
      'Ask for the parents’ test results and keep copies in the dog’s file; share them with your vet. If the breeder can’t produce any, that is itself useful information about what to screen for yourself.',
  },
  {
    id: 'origin-born-at-home',
    kind: 'note',
    topic: 'story',
    evidence: 'low',
    sources: ['merck'],
    priority: 40,
    when: (c) => c.p.origin === 'born-at-home',
    title: () => 'You know the whole story',
    why: (c) =>
      `Which is rarer than it sounds and genuinely useful: the mother’s health, the litter, the first weeks. Keep notes on anything that turns up in ${c.v.poss} relatives — breed conditions run in families, and a cousin’s diagnosis is a reason to screen early.`,
  },
  {
    id: 'joined-senior',
    kind: 'win',
    topic: 'story',
    evidence: 'moderate',
    sources: ['aahaSenior2023'],
    priority: 70,
    when: (c) => c.p.joinedAt === 'senior',
    title: (c) => c.pick('joined-senior-t', 'You took on a senior — that’s a generous thing', `Adopting ${c.v.name} as a senior`),
    why: (c) =>
      `Older dogs wait longest and are chosen least, and they tend to repay it with an easy, grateful companionship. What ${c.v.subj} ${c.v.verb('need')} from you is the senior-care rhythm from the start: exams every six months with bloodwork, a pain assessment each time, and a home made easy on an older body.`,
  },
  {
    id: 'joined-adult',
    kind: 'note',
    topic: 'story',
    evidence: 'low',
    sources: ['merck'],
    priority: 44,
    when: (c) => c.p.joinedAt === 'adult' && c.p.origin !== 'shelter-rescue' && c.p.origin !== 'found-stray',
    title: () => 'Joining as an adult',
    why: (c) =>
      `${c.v.Name} came to you with habits, preferences and a medical past already in place. Spend the first year learning ${c.v.poss} normal — how much ${c.v.subj} ${c.v.verb('drink')}, how ${c.v.subj} ${c.v.verb('move')} after rest, what a good day looks like — so that a change later is obvious.`,
  },
  {
    id: 'story-age-estimate',
    kind: 'note',
    topic: 'story',
    evidence: 'moderate',
    sources: ['merck'],
    priority: 46,
    when: (c) =>
      (c.p.origin === 'shelter-rescue' || c.p.origin === 'found-stray') &&
      (c.p.joinedAt === 'adult' || c.p.joinedAt === 'senior'),
    title: () => 'If the age is an estimate, so is this report',
    why: () =>
      'Age guessed from teeth and eyes is good to within a year or two in young adults and worse in seniors. Every figure here — the human age, the life stage, the time ahead — moves with it, so hold the numbers a little loosely and lean on the advice, which is right either way.',
  },
  {
    id: 'years-together',
    kind: 'win',
    topic: 'story',
    evidence: 'moderate',
    sources: ['mccoy2023'],
    priority: 48,
    when: (c) => c.p.yearsTogether !== undefined && c.p.yearsTogether >= 5,
    title: (c) => `${Math.floor(c.p.yearsTogether ?? 0)} years together`,
    why: (c) =>
      `That is the bond the ageing research keeps finding at the centre of a dog’s health: stable company, a stable home. ${c.v.Name} has had ${c.v.poss} share of it. Keep taking the pictures.`,
  },
]
