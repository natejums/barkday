/**
 * Vet care, vaccines, parasites, identification and supplements.
 */

import type { InsightSpec } from '../context'

export const PREVENTION_INSIGHTS: readonly InsightSpec[] = [
  {
    id: 'vet-none',
    kind: 'move',
    topic: 'prevention',
    evidence: 'moderate',
    sources: ['aahaLifeStage2019', 'ahsHeartworm'],
    priority: 84,
    recId: 'vet-care',
    when: (c) => c.p.vetCare === 'none',
    title: (c) => c.pick('vet-none-t', 'Book a baseline exam — it’s the foundation for everything else', `Get ${c.v.name} a vet`),
    why: () =>
      'An annual exam with bloodwork is where kidney, liver and thyroid disease, heart murmurs, dental disease and lumps get found while they are cheap and treatable. A dog that only sees a vet when visibly ill is a dog whose problems are found late, and most of what this report recommends depends on someone being able to examine the animal.',
    how: (c) =>
      `Register with a practice and book a full exam with bloodwork, urinalysis${c.p.parasitePrevention === 'none' || c.p.parasitePrevention === undefined ? ', a heartworm test' : ''} and a weight check. Take this report. From there, ${c.older ? 'every six months' : 'once a year'} is the rhythm.`,
  },
  {
    id: 'vet-reactive',
    kind: 'move',
    topic: 'prevention',
    evidence: 'moderate',
    sources: ['aahaLifeStage2019', 'aahaSenior2023'],
    priority: 70,
    recId: 'vet-care',
    when: (c) => c.p.vetCare === 'reactive',
    title: (c) => c.pick('vet-react-t', 'Move from “when ill” to a yearly check-up', 'Get ahead of problems with a routine exam'),
    why: (c) =>
      `Dogs hide illness well, so “when ill” usually means “when it is advanced”. The diseases that shorten lives most — kidney disease, dental disease, heart disease, cancer — all have a long quiet phase where a routine exam and a blood panel catch them${c.older ? ', and at this age the guidelines say that exam should be every six months' : ''}.`,
    how: () =>
      `Book one now with bloodwork and urinalysis as a baseline, then put the next one in the diary. Ask the practice to remind you — most will.`,
  },
  {
    id: 'vet-annual',
    kind: 'win',
    topic: 'prevention',
    evidence: 'moderate',
    sources: ['aahaLifeStage2019'],
    priority: 54,
    when: (c) => c.p.vetCare === 'annual' && !c.older,
    title: () => 'A yearly check-up',
    why: () =>
      'The right rhythm for a healthy adult. Make sure it includes a weigh-in, a look in the mouth and — from middle age — a blood and urine panel, so there is a baseline to compare against later.',
  },
  {
    id: 'vet-annual-senior',
    kind: 'move',
    topic: 'prevention',
    evidence: 'moderate',
    sources: ['aahaSenior2023'],
    priority: 64,
    when: (c) => c.p.vetCare === 'annual' && c.older,
    title: (c) => c.pick('vet-senior-t', 'Make it twice a year now', `Six-monthly visits for ${c.v.name} from here on`),
    why: (c) =>
      `A year is a long time at ${c.v.poss} stage of life — the equivalent of several human years — and the senior-care guidelines recommend an exam every six months with bloodwork, urinalysis, blood pressure and a thyroid check. This is the stage where screening actually changes outcomes rather than just producing reassurance.`,
    how: () =>
      'Ask the practice for a senior wellness package and book the next two visits now. Bring a short list of anything that has changed: drinking, sleep, stairs, appetite.',
  },
  {
    id: 'vet-proactive',
    kind: 'win',
    topic: 'prevention',
    evidence: 'moderate',
    sources: ['aahaSenior2023', 'aahaLifeStage2019'],
    priority: 60,
    when: (c) => c.p.vetCare === 'proactive',
    title: () => 'Twice-yearly veterinary care',
    why: (c) =>
      `${c.older ? 'Exactly what the senior guidelines call for' : 'More than the guidelines ask of a healthy adult, and no harm in it'} — it is how the quiet diseases get caught in their quiet phase. Keep the bloodwork results; the trend over years is more useful than any single panel.`,
  },
  {
    id: 'vaccination-overdue',
    kind: 'move',
    topic: 'prevention',
    evidence: 'high',
    sources: ['aahaVaccination2022'],
    priority: 82,
    when: (c) => c.p.vaccination === 'overdue',
    title: (c) => c.pick('vacc-over-t', 'Bring the vaccines up to date', `${c.v.Name}’s vaccines are overdue`),
    why: () =>
      'The core vaccines — distemper, parvovirus, adenovirus, rabies, and now leptospirosis, which the AAHA guidelines added as core for all dogs in 2024 — protect against diseases that are still common, still killing dogs, and in the case of lepto and rabies can pass to people. Lapsed protection is lapsed protection; the diseases don’t wait.',
    how: () =>
      `Book it this month. If you are unsure which are due, the practice will have the record. For distemper and parvo, a titre test is a legitimate alternative to re-vaccinating if you prefer; for rabies and lepto, it isn’t.`,
  },
  {
    id: 'vaccination-not-sure',
    kind: 'move',
    topic: 'prevention',
    evidence: 'high',
    sources: ['aahaVaccination2022'],
    priority: 72,
    when: (c) => c.p.vaccination === 'not-sure',
    title: () => 'Find out where the vaccines stand',
    why: (c) =>
      `${c.p.origin === 'shelter-rescue' || c.p.origin === 'found-stray' ? 'A dog with an unknown history is treated as unvaccinated by the guidelines — one course, then boosters on the normal schedule.' : 'Most practices send reminders, but they lapse when a dog changes vets or a card gets lost.'} The core vaccines are the cheapest protection ${c.v.subj} will ever get.`,
    how: () =>
      'Ask your vet for the record, or ask the previous owner, shelter or breeder. If nobody can produce one, start the core course; there is no harm in a vaccine given to an already-immune dog.',
  },
  {
    id: 'vaccination-current',
    kind: 'win',
    topic: 'prevention',
    evidence: 'high',
    sources: ['aahaVaccination2022'],
    priority: 54,
    when: (c) => c.p.vaccination === 'up-to-date',
    title: () => 'Vaccines up to date',
    why: () =>
      'Including, one hopes, leptospirosis — now classed as core for every dog. If it isn’t on the record, ask at the next visit; it is the one most often missing.',
  },
  {
    id: 'parasite-none',
    kind: 'move',
    topic: 'prevention',
    evidence: 'high',
    sources: ['ahsHeartworm', 'merck'],
    priority: 84,
    when: (c) => c.p.parasitePrevention === 'none',
    title: (c) => c.pick('para-none-t', 'Start year-round parasite prevention', `Put ${c.v.name} on parasite prevention`),
    why: () =>
      'Heartworm is spread by a single mosquito bite, is found in every US state and much of the world, and the damage it does to the heart and lungs is permanent even when the worms are killed — the American Heartworm Society recommends year-round prevention with an annual test for exactly that reason. Ticks carry Lyme, ehrlichiosis and anaplasmosis; fleas carry tapeworm and trigger most skin allergy flares. All of it is far cheaper to prevent than to treat.',
    how: (c) =>
      `Ask the vet for a combined heartworm, flea and tick preventive suited to ${c.v.poss} weight and your area, given on schedule all year, plus an annual heartworm test. Mark the dose dates on the calendar — the dose that gets forgotten is the one that matters.`,
  },
  {
    id: 'parasite-seasonal',
    kind: 'note',
    topic: 'prevention',
    evidence: 'moderate',
    sources: ['ahsHeartworm'],
    priority: 60,
    when: (c) => c.p.parasitePrevention === 'seasonal',
    title: () => 'Seasonal prevention leaves a gap',
    why: () =>
      'The heartworm society moved to a year-round recommendation because “mosquito season” is longer than people think, warm spells happen in winter, and ticks are active whenever the ground is above freezing. The lapse is usually the shoulder months — exactly when owners stop and start.',
    how: () =>
      'Switch to continuous dosing; it is the same product, just without the gap. Keep the annual heartworm test either way.',
  },
  {
    id: 'parasite-year-round',
    kind: 'win',
    topic: 'prevention',
    evidence: 'high',
    sources: ['ahsHeartworm'],
    priority: 58,
    when: (c) => c.p.parasitePrevention === 'year-round',
    title: () => 'Year-round parasite prevention',
    why: () =>
      'The recommended approach, and the one that actually works. An annual heartworm test alongside it catches the rare breakthrough early, while treatment is still straightforward.',
  },
  {
    id: 'parasite-not-sure',
    kind: 'move',
    topic: 'prevention',
    evidence: 'high',
    sources: ['ahsHeartworm'],
    priority: 62,
    when: (c) => c.p.parasitePrevention === 'not-sure',
    title: () => 'Check what parasite prevention is actually in place',
    why: () =>
      'Heartworm, flea and tick products come as chews, spot-ons and injections on different schedules, and “I think the vet does something” often turns out to mean a lapsed prescription. Heartworm damage is permanent, so this is worth two minutes of certainty.',
    how: () =>
      'Ask the practice what is on file and when the last dose was. If there is a gap of more than a month or two, restart with a heartworm test first.',
  },
  {
    id: 'microchip-none',
    kind: 'move',
    topic: 'safety',
    evidence: 'high',
    sources: ['lord2009'],
    priority: 78,
    when: (c) => c.p.microchip === 'none',
    title: (c) => c.pick('chip-none-t', `Microchip ${c.v.name} — it’s the difference between lost and found`, 'Get a microchip, and register it'),
    why: () =>
      'When 53 US shelters tracked what happened to the animals that came in, microchipped dogs went home 52% of the time against 22% for dogs without a chip. It is a ten-minute, one-off procedure, and in many places a legal requirement.',
    how: (c) =>
      `Have it implanted at the next vet visit, register it to your current phone number and address the same day, and put a tag with your number on ${c.v.poss} collar as well — a tag is faster than a scanner.`,
  },
  {
    id: 'microchip-unsure-registered',
    kind: 'move',
    topic: 'safety',
    evidence: 'high',
    sources: ['lord2009'],
    priority: 74,
    when: (c) => c.p.microchip === 'chipped-unsure' || c.p.microchip === 'not-sure',
    title: (c) => c.pick('chip-unsure-t', 'Check the microchip is registered to you', 'Make sure the chip actually leads back to you'),
    why: (c) =>
      `In the shelter study, the single most common reason a chipped dog was *not* reunited was a wrong or disconnected phone number in the registry — more than any other cause. ${c.p.origin === 'shelter-rescue' || c.p.origin === 'rehomed' || c.p.origin === 'found-stray' ? `A dog that came from a shelter or a previous home is especially likely to be registered to someone else.` : 'A chip registered to an old address is a chip that does not work.'}`,
    how: (c) =>
      `Ask any vet to scan ${c.v.obj} and read the number, then look it up through a chip-registry lookup service and update the contact details — or register it if nobody has. Takes ten minutes, and then set a reminder to check it whenever you move.`,
  },
  {
    id: 'microchip-registered',
    kind: 'win',
    topic: 'safety',
    evidence: 'high',
    sources: ['lord2009'],
    priority: 54,
    when: (c) => c.p.microchip === 'registered',
    title: () => 'Microchipped and registered',
    why: () =>
      'The thing that gets lost dogs home — chipped dogs are reunited more than twice as often. Update the registry whenever your number or address changes; stale contact details are the most common point of failure.',
  },
  {
    id: 'supplement-joint',
    kind: 'note',
    topic: 'prevention',
    evidence: 'moderate',
    sources: ['vandeweerd2012', 'marshall2010'],
    priority: 46,
    when: (c) => c.supp('joint'),
    title: () => 'About the joint supplement',
    why: () =>
      'A systematic review of every controlled trial found the evidence for glucosamine, chondroitin and most other joint nutraceuticals to be poor — with one exception, omega-3 fatty acids from fish oil, which did show a real effect in dogs. Joint supplements are rarely harmful; the risk is that they stand in for the thing that works, which is a lean body weight.',
    how: () =>
      'Keep it if you like, but put the money into fish-oil omega-3s at a vet-advised dose, and the effort into weight. If the supplement contains fish oil already, check the EPA/DHA amount — many contain a token quantity.',
  },
  {
    id: 'supplement-omega3',
    kind: 'win',
    topic: 'prevention',
    evidence: 'moderate',
    sources: ['roush2010', 'vandeweerd2012'],
    priority: 52,
    when: (c) => c.supp('omega-3'),
    title: () => 'Fish-oil omega-3s',
    why: () =>
      'The one supplement with decent evidence in dogs: in a controlled trial, dogs with arthritis fed a diet high in fish-oil omega-3s put measurably more weight on their sore legs. The dose that worked is higher than most capsules supply, so ask the vet to set it by weight — and use fish oil rather than flaxseed, which dogs convert poorly.',
  },
  {
    id: 'supplement-multivitamin',
    kind: 'note',
    topic: 'prevention',
    evidence: 'moderate',
    sources: ['wsavaNutrition', 'stockman2013', 'merck'],
    priority: (c) => (c.p.foodType === 'home-cooked' ? 66 : 44),
    when: (c) => c.supp('multivitamin'),
    title: (c) =>
      c.p.foodType === 'home-cooked'
        ? 'The vitamin supplement has to match the recipe'
        : 'A multivitamin on a complete diet is usually redundant',
    why: (c) =>
      c.p.foodType === 'home-cooked'
        ? 'A home-cooked diet almost always needs a supplement — but a generic one doesn’t fill the specific gaps in a specific recipe, and over-supplementing calcium and vitamin D causes its own problems. A nutritionist formulates the two together.'
        : `A food labelled complete and balanced already contains every vitamin and mineral a dog needs, so a multivitamin on top adds nothing and${c.stage === 'puppy' && c.big ? ', in a growing large-breed puppy, extra calcium and vitamin D can actively harm the skeleton' : ' occasionally tips a fat-soluble vitamin into excess'}.`,
  },
  {
    id: 'supplement-probiotic',
    kind: 'note',
    topic: 'prevention',
    evidence: 'low',
    sources: ['merck'],
    priority: 40,
    when: (c) => c.supp('probiotic'),
    title: () => 'About the probiotic',
    why: () =>
      'There is modest evidence that specific, tested strains shorten bouts of acute diarrhoea and help during antibiotic courses; there is little evidence for everyday use in a healthy dog. Many products also don’t contain what the label says.',
    how: () =>
      'Choose a veterinary product with a named strain and a trial behind it, and use it when there is a reason — a stomach upset, a course of antibiotics, a stressful trip.',
  },
  {
    id: 'mature-baseline-bloodwork',
    kind: 'note',
    topic: 'prevention',
    evidence: 'moderate',
    sources: ['aahaLifeStage2019'],
    priority: 50,
    when: (c) => c.stage === 'mature-adult' && (c.p.vetCare === 'annual' || c.p.vetCare === 'proactive'),
    title: () => 'Get a baseline blood and urine panel while everything is normal',
    why: () =>
      'Reference ranges are wide; a dog’s own numbers are narrow. A panel taken in healthy middle age makes a later shift — kidney values creeping up, a thyroid drifting down — visible years earlier than a single abnormal result ever would.',
  },
  {
    id: 'neuter-timing-large-young',
    kind: 'note',
    topic: 'prevention',
    evidence: 'moderate',
    sources: ['hart2020'],
    priority: 62,
    when: (c) => c.young && c.big && c.p.neuterStatus === 'intact',
    title: () => 'If you’re planning to neuter, timing matters for a big dog',
    why: (c) =>
      `Across 35 breeds, neutering before the growth plates close — roughly the first year — raised the rate of joint disorders and, in some breeds, certain cancers in larger dogs; small breeds showed no such effect. The pattern is breed-specific${c.breedName ? `, so ask what the data say for the ${c.breedName} in particular` : ''}.`,
    how: (c) =>
      `For most large and giant breeds the current advice is to wait until at least 12 months, and for some breeds longer. Discuss ${c.v.poss} breed, sex and your situation with the vet rather than defaulting to six months.`,
  },
]
