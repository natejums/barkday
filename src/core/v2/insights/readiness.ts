/**
 * Being ready for the bad day. Practical rather than evidential, and the
 * sources are honest about that.
 */

import type { InsightSpec } from '../context'

export const READINESS_INSIGHTS: readonly InsightSpec[] = [
  {
    id: 'readiness-neither',
    kind: 'move',
    topic: 'readiness',
    evidence: 'low',
    sources: ['merck', 'glickman2000'],
    priority: (c) => (c.cond.has('gdv-bloat') || c.cond.has('intervertebral-disc-disease') || c.young ? 70 : 62),
    when: (c) => c.p.readiness === 'neither',
    title: (c) => c.pick('ready-t', 'Decide now how you’d pay for an emergency', `Have a plan for ${c.v.name}’s bad day`),
    why: (c) =>
      `Emergency surgery — bloat, a swallowed sock, a slipped disc, a torn cruciate — runs to thousands, and the decisions that get made at 2 a.m. without a plan are the ones people regret. ${c.cond.has('gdv-bloat') ? 'For a bloat-prone breed this is not hypothetical. ' : ''}${c.young ? 'Insurance taken out while a dog is young and healthy is cheapest and has no pre-existing exclusions yet.' : 'Insurance taken out later excludes anything already on the record, so a dedicated savings pot may suit better.'}`,
    how: () =>
      'Either take out a policy that covers chronic conditions and dental, or open a separate account and feed it monthly. Then decide, calmly and in advance, what you would and wouldn’t want done — and write it down.',
  },
  {
    id: 'readiness-insured',
    kind: 'win',
    topic: 'readiness',
    evidence: 'low',
    sources: ['merck'],
    priority: 50,
    when: (c) => c.p.readiness === 'insured',
    title: () => 'Insured against the big bills',
    why: () =>
      'The thing that turns a 2 a.m. decision into a medical one rather than a financial one. Check once that the policy covers chronic and recurring conditions, dental disease and behaviour, and that the annual limit would actually cover an orthopaedic surgery.',
  },
  {
    id: 'readiness-savings',
    kind: 'win',
    topic: 'readiness',
    evidence: 'low',
    sources: ['merck'],
    priority: 48,
    when: (c) => c.p.readiness === 'savings',
    title: () => 'An emergency fund',
    why: () =>
      'A good plan, as long as it is genuinely ring-fenced and large enough for a surgery, not just a consultation. Top it up as the dog ages; the expensive years come late.',
  },
  {
    id: 'readiness-both',
    kind: 'win',
    topic: 'readiness',
    evidence: 'low',
    sources: ['merck'],
    priority: 52,
    when: (c) => c.p.readiness === 'both',
    title: () => 'Insured, with savings behind it',
    why: () =>
      'Belt and braces, and the right way round: insurance for the catastrophic, savings for the excess, the exclusions and the things policies quibble over.',
  },
  {
    id: 'emergency-vet-unknown',
    kind: 'move',
    topic: 'readiness',
    evidence: 'low',
    sources: ['glickman2000', 'aspcaApcc'],
    priority: (c) => (c.cond.has('gdv-bloat') || c.brachy || c.has('epilepsy') || c.has('heart') ? 84 : 72),
    when: (c) => c.p.knowsEmergencyVet === false,
    title: (c) => c.pick('ervet-t', 'Find your 24-hour emergency vet tonight', 'Know where the emergency vet is before you need it'),
    why: (c) =>
      `${c.cond.has('gdv-bloat') ? 'Bloat, ' : ''}${c.brachy ? 'heatstroke, ' : ''}poisoning, a road accident, a seizure that won’t stop: the emergencies that kill dogs are the ones where minutes count, and “where do we go?” is the wrong question to be answering in the car. Most practices close at night and refer to an emergency hospital that may be a long drive away.`,
    how: () =>
      'Look up the nearest 24-hour emergency hospital now, save its number and address in your phone, and drive the route once in daylight. Add an animal poison line number while you are there.',
  },
  {
    id: 'emergency-vet-known',
    kind: 'win',
    topic: 'readiness',
    evidence: 'low',
    sources: ['merck'],
    priority: 44,
    when: (c) => c.p.knowsEmergencyVet === true,
    title: () => 'You know where the emergency vet is',
    why: () =>
      'The single most useful piece of preparation there is, and the one most owners discover they lack at the worst moment.',
  },
  {
    id: 'first-aid-kit',
    kind: 'note',
    topic: 'readiness',
    evidence: 'low',
    sources: ['merck', 'aspcaApcc'],
    priority: 38,
    when: (c) => c.p.readiness !== undefined || c.p.knowsEmergencyVet !== undefined,
    title: () => 'A small first-aid kit',
    why: () =>
      'Not for treating anything serious — for getting safely to someone who can. A muzzle or a soft lead that can be used as one (hurt dogs bite), self-adhesive bandage, saline, a tick hook, a towel, and the emergency and poison-line numbers written inside the lid. Keep a copy in the car.',
  },
]
