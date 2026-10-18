/**
 * Home, climate, chemicals, the car, and the household toxins.
 */

import type { InsightSpec } from '../context'

export const HOME_INSIGHTS: readonly InsightSpec[] = [
  {
    id: 'climate-hot',
    kind: 'move',
    topic: 'home',
    evidence: 'high',
    sources: ['hall2020incidence', 'hall2020triggers'],
    priority: (c) => (c.brachy || c.size === 'giant' || (c.p.bodyConditionScore ?? 5) > 6 ? 84 : 66),
    when: (c) => c.p.climate === 'hot' || c.p.climate === 'both',
    title: (c) =>
      c.brachy
        ? `Heat is the biggest everyday danger for ${c.v.name}`
        : c.pick('heat-t', 'Have a hot-weather plan before you need it', 'Heat kills more dogs on walks than in cars'),
    why: (c) =>
      `In the largest study of heat-related illness in dogs, three-quarters of cases were triggered by exercise — mostly ordinary walks — and only 5% by a hot car. One in seven cases was fatal. The dogs most at risk: ${c.brachy ? 'flat-faced breeds, with roughly double the odds' : 'flat-faced breeds'}, dogs over 50 kg, ${(c.p.bodyConditionScore ?? 5) > 6 ? 'and overweight dogs — which applies here' : 'overweight dogs'}, and dogs over two.`,
    how: (c) =>
      `In warm weather, walk early or late, test the pavement with the back of your hand, carry water, and shorten or skip the walk rather than push through. Learn the signs — heavy panting that won’t settle, drooling, a wobbly gait, collapse — and if you see them, cool ${c.v.obj} with cool (not iced) water immediately and go to the vet on the way, not after. ${c.brachy ? 'For a flat face, a cooling mat and a harness are everyday gear, not extras.' : ''}`,
  },
  {
    id: 'climate-cold',
    kind: 'note',
    topic: 'home',
    evidence: 'moderate',
    sources: ['merck', 'aspcaApcc'],
    priority: (c) => (c.tiny || c.older || c.has('arthritis') ? 64 : 50),
    when: (c) => c.p.climate === 'cold' || c.p.climate === 'both',
    title: () => 'Cold-weather care',
    why: (c) =>
      `${c.tiny ? 'Small dogs lose heat fast and genuinely need a coat below freezing. ' : ''}${c.older || c.has('arthritis') ? 'Cold stiffens arthritic joints, so warm bedding off the floor and a warm-up before walks matter more in winter. ' : ''}The two winter hazards that catch owners out are ice-melt salts, which burn paws and cause vomiting when licked off, and antifreeze — ethylene glycol is sweet, a few mouthfuls are fatal, and the window for treatment is hours.`,
    how: (c) =>
      `Rinse or wipe ${c.v.poss} paws after salted pavements, store antifreeze and screenwash where ${c.v.subj} cannot reach, and clean up any garage spills at once. ${c.tiny || c.older ? 'A well-fitted coat and shorter, more frequent walks on the coldest days.' : 'Watch for shivering and lifted paws as the signal to head home.'}`,
  },
  {
    id: 'lawn-chemicals-yes',
    kind: 'move',
    topic: 'home',
    evidence: 'moderate',
    sources: ['glickman2004', 'takashima2012'],
    priority: (c) => (c.cond.has('lymphoma') || c.has('cancer') ? 84 : 72),
    when: (c) => c.p.lawnChemicals === true,
    title: (c) => c.pick('lawn-t', 'Keep them off chemically treated lawns', 'Rethink the lawn chemicals'),
    why: () =>
      'Scottish Terriers exposed to lawn herbicides had four to seven times the risk of bladder cancer in a case-control study, and in a separate study dogs in homes using professionally applied lawn pesticides had a 70% higher risk of lymphoma. Neither proves cause, and the chemicals were not identified — but dogs walk on, roll in and lick off whatever is on the grass, and the signal has turned up more than once.',
    how: (c) =>
      `Keep ${c.v.obj} off treated grass for at least 48 hours and until it has been watered or rained on, wipe ${c.v.poss} paws and belly after walks on treated areas, store granules and concentrates out of reach, and where you can, switch to pet-safe products or skip the treatment.`,
  },
  {
    id: 'lawn-chemicals-no',
    kind: 'win',
    topic: 'home',
    evidence: 'moderate',
    sources: ['takashima2012'],
    priority: 44,
    when: (c) => c.p.lawnChemicals === false,
    title: () => 'No lawn chemicals',
    why: () =>
      'That removes one of the few environmental exposures with a repeated cancer signal in dogs. Worth remembering on walks past treated parks and verges too — the little warning flags mean something.',
  },
  {
    id: 'car-loose',
    kind: 'move',
    topic: 'safety',
    evidence: 'low',
    sources: ['avmaTravel'],
    priority: 68,
    when: (c) => c.p.carTravel === 'loose',
    title: (c) => c.pick('car-t', `Restrain ${c.v.name} in the car`, 'A loose dog in the car is a projectile'),
    why: () =>
      `In even a modest collision an unrestrained dog is thrown with enormous force — into the windscreen, into a passenger, or out of the car and onto the road, where many are then hit. A loose dog is also the single most common driver distraction involving pets. No lifespan study exists for this; it does not need one.`,
    how: (c) =>
      `A crash-tested harness clipped to the seat-belt in the back, or a secured crate in the boot. Never the front seat (airbags), never loose in the back of a pickup, and never left in the car in warm weather${c.brachy ? ' — for a flat face, not even for minutes' : ''}.`,
  },
  {
    id: 'car-restrained',
    kind: 'win',
    topic: 'safety',
    evidence: 'low',
    sources: ['avmaTravel'],
    priority: 48,
    when: (c) => c.p.carTravel === 'restrained',
    title: () => 'Restrained in the car',
    why: () =>
      'The thing most owners skip. A crash-tested harness or a secured crate protects the dog, the passengers and the driver’s attention all at once.',
  },
  {
    id: 'smoke-yes',
    kind: 'move',
    topic: 'home',
    evidence: 'moderate',
    sources: ['reif1998', 'reif1992'],
    priority: 74,
    recId: 'smoke',
    when: (c) => c.p.secondhandSmoke === true,
    title: (c) => c.pick('smoke-t', 'Take the smoke outside', `Keep ${c.v.name}’s air clean`),
    why: (c) =>
      `Dogs in smoking homes get the cancers you would expect, and which cancer depends on the nose: ${c.brachy ? 'short-nosed dogs like yours have about double the risk of lung cancer, because the short airway filters less and the lungs take the hit' : 'long-nosed breeds have about two and a half times the risk of nasal cancer, because the nose filters the smoke and absorbs the toxins — short-nosed dogs get lung cancer instead'}. The effect rose with the number of smokers and the years of exposure.`,
    how: (c) =>
      `Smoke outside, away from the door, and wash your hands before handling ${c.v.obj}; third-hand residue on coats and furniture is part of the dose. If you have been thinking about quitting, ${c.v.name} is one more reason.`,
  },
  {
    id: 'environment-outdoor',
    kind: 'move',
    topic: 'home',
    evidence: 'low',
    sources: ['merck', 'hall2020incidence'],
    priority: 70,
    recId: 'environment',
    when: (c) => c.p.environment === 'outdoor',
    title: (c) => c.pick('outdoor-t', 'Bring more of their life indoors', `Give ${c.v.name} a place inside`),
    why: (c) =>
      `Dogs that live mainly outdoors meet more of everything that shortens lives — trauma, parasites, infectious disease, heat and cold${c.p.climate === 'hot' || c.p.climate === 'both' ? ' (and heat-related illness in particular)' : ''} — and their illnesses are noticed later, because nobody is watching them sleep or eat. Most of the gap closes with supervision rather than with walls.`,
    how: (c) =>
      `Even a utility room with a bed, where ${c.v.subj} ${c.v.verb('sleep')} and ${c.v.verb('eat')} where you can see ${c.v.obj}, changes how early you notice a problem. Shade, shelter, and water that can’t be tipped over for the hours ${c.v.subj} ${c.be} out.`,
  },
  {
    id: 'environment-indoor',
    kind: 'win',
    topic: 'home',
    evidence: 'low',
    sources: ['merck'],
    priority: 42,
    when: (c) => c.p.environment === 'indoor',
    title: () => 'An indoor dog',
    why: () =>
      'Which mostly means a watched dog: changes in appetite, drinking, sleep and movement get noticed in days rather than weeks. That is worth more than it sounds.',
  },
  {
    id: 'toxins',
    kind: 'note',
    topic: 'safety',
    evidence: 'moderate',
    sources: ['aspcaApcc', 'merck'],
    priority: (c) => (c.stage === 'puppy' || c.p.children ? 56 : 42),
    when: (c) =>
      c.p.climate !== undefined ||
      c.p.carTravel !== undefined ||
      c.p.lawnChemicals !== undefined ||
      c.p.readiness !== undefined,
    title: () => 'The household poisons worth knowing by heart',
    why: (c) =>
      `The poison-control lines’ most common dog calls: xylitol (sugar-free gum, some peanut butters — causes a crash in blood sugar within an hour), grapes and raisins (kidney failure, no known safe dose), chocolate, onions and garlic, human painkillers (ibuprofen and paracetamol are both toxic), rodent bait, and antifreeze. ${c.stage === 'puppy' ? 'Puppies eat everything, which is why this list matters most now.' : c.p.children ? 'Children’s snacks and dropped medication are a common route in.' : 'Most poisonings are ordinary food left within reach.'}`,
    how: () =>
      'Save your nearest animal poison line and your emergency vet’s number in your phone now. If something is swallowed, call before doing anything — the right first response depends entirely on what it was.',
  },
  {
    id: 'home-senior-modifications',
    kind: 'move',
    topic: 'home',
    evidence: 'moderate',
    sources: ['aahaSenior2023'],
    priority: (c) => (c.p.mobility === 'fine' ? 52 : 64),
    when: (c) => c.older && c.p.environment !== 'outdoor',
    title: (c) => c.pick('home-senior-t', 'Make the house easy on an older body', `Senior-proof the home for ${c.v.name}`),
    why: () =>
      'Slick floors, jumps onto furniture and into cars, and dark hallways at night are where older dogs lose confidence and get hurt — and the senior-care guidelines list home adaptation alongside medication as part of treating age-related decline.',
    how: (c) =>
      `Runners or yoga-mat strips on hard floors, a ramp or steps for the sofa and car, a firm supportive bed that ${c.v.subj} ${c.v.verb('do')}n’t have to climb into, water bowls on each floor, and a night light or two for ${c.v.poss} evening wanderings.`,
  },
]
