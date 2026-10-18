/**
 * Conditions the owner already knows about. Management notes and the question
 * to bring to the vet — never a diagnosis, never a treatment plan.
 */

import type { InsightSpec } from '../context'

export const CONDITION_INSIGHTS: readonly InsightSpec[] = [
  {
    id: 'known-arthritis',
    kind: 'note',
    topic: 'conditions',
    evidence: 'moderate',
    sources: ['marshall2010', 'roush2010', 'vandeweerd2012', 'aahaSenior2023'],
    priority: 72,
    when: (c) => c.has('arthritis'),
    title: () => `Living well with arthritis`,
    why: () =>
      'The four things with evidence, in order: a lean body weight (losing 6% of body weight measurably improved lameness in obese arthritic dogs), fish-oil omega-3s at a vet-set dose (improved weight-bearing in a controlled trial), daily controlled low-impact exercise, and modern pain relief — which is safe, effective and under-used because owners fear it more than they fear the pain. Glucosamine and most other supplements have poor evidence; they are not the plan.',
    how: (c) =>
      `At home: non-slip rugs, a ramp for the car and sofa, a supportive bed, shorter and more frequent walks, warmth in winter. Ask the vet to score ${c.v.poss} pain at every visit and adjust the plan rather than waiting for ${c.v.obj} to complain — ${c.v.subj} won’t.`,
  },
  {
    id: 'known-arthritis-q',
    kind: 'question',
    topic: 'conditions',
    evidence: 'moderate',
    sources: ['aahaSenior2023'],
    priority: 66,
    when: (c) => c.has('arthritis'),
    title: () => 'Is the arthritis plan multimodal — weight, omega-3s, exercise and pain relief together?',
    why: () => 'Single-pronged plans fail. Ask what the pain score is today, what the target weight is, and which pain medication is appropriate long term.',
  },
  {
    id: 'known-heart',
    kind: 'note',
    topic: 'conditions',
    evidence: 'moderate',
    sources: ['acvim2019mvd', 'fdaDcm2019', 'merck'],
    priority: 74,
    when: (c) => c.has('heart'),
    title: () => 'Monitoring a heart condition at home',
    why: (c) =>
      `The most useful thing an owner can do for a dog with heart disease is count breaths while ${c.v.subj} ${c.v.verb('sleep')}: a sleeping rate creeping above about 30 a minute is the earliest sign of fluid building up, often days before a cough. Staged medication started at the right moment — guided by echocardiogram, per the cardiology consensus — delays heart failure substantially.${c.p.grainFree === 'yes' ? ' And with a heart diagnosis, a grain-free, legume-rich diet is a question to settle with the vet urgently.' : ''}`,
    how: (c) =>
      `Count the sleeping breathing rate a few times a week and write it down; agree the number that means “call us”. Keep ${c.v.obj} lean, exercise gently and consistently, and keep every recheck — medication doses change as the heart does.`,
  },
  {
    id: 'known-heart-q',
    kind: 'question',
    topic: 'conditions',
    evidence: 'moderate',
    sources: ['acvim2019mvd'],
    priority: 70,
    when: (c) => c.has('heart'),
    title: () => 'What stage is the heart disease, when is the next echo due, and what sleeping breathing rate should trigger a call?',
    why: () => 'Staging decides when medication starts, and the breathing-rate threshold turns home monitoring into something actionable.',
  },
  {
    id: 'known-allergies',
    kind: 'note',
    topic: 'conditions',
    evidence: 'moderate',
    sources: ['merck', 'oneill2021otitis'],
    priority: 62,
    when: (c) => c.has('allergies'),
    title: () => 'Managing the allergies',
    why: () =>
      'Allergic skin disease is lifelong and manageable, not curable. The parts owners control: strict year-round flea prevention (flea allergy makes everything worse), regular bathing to wash allergens off the coat, omega-3s, ear checks (allergic dogs get most of the ear infections), and a properly run elimination diet trial if food is suspected — eight weeks of a single prescription diet, nothing else, which is the only test that works.',
    how: (c) =>
      `Keep a flare diary (season, places, foods) and bring it to the vet; modern itch medications are excellent and much safer than long-term steroids. Check ${c.v.poss} ears weekly and clean them when they look waxy, before they become infected.`,
  },
  {
    id: 'known-dental',
    kind: 'note',
    topic: 'conditions',
    evidence: 'high',
    sources: ['glickman2011', 'avdc', 'harvey2015'],
    priority: 68,
    when: (c) => c.has('dental'),
    title: () => 'Dental disease is a whole-body problem',
    why: () =>
      'Infected gums seed bacteria into the bloodstream continuously, which is why periodontal disease tracks with kidney and heart disease. The treatment that works is a cleaning under anaesthesia with dental radiographs (most of the disease is below the gumline, invisible without them), followed by daily brushing to slow it coming back. Anaesthesia-free cleanings polish the visible tooth and leave the disease where it is.',
    how: (c) =>
      `Ask when ${c.v.poss} next cleaning with radiographs is due and whether any teeth need extracting — dogs do far better with fewer, healthy teeth than with more, diseased ones. Brush daily between cleanings; it roughly doubles the interval.`,
  },
  {
    id: 'known-overweight',
    kind: 'note',
    topic: 'conditions',
    evidence: 'high',
    sources: ['aahaWeight2014', 'salt2019', 'marshall2010'],
    priority: 70,
    when: (c) => c.has('overweight'),
    title: () => 'A weight-loss plan that actually works',
    why: () =>
      'Dogs lose weight the way people do: fewer calories, measured honestly, over months. The weight-management guidelines aim for 1–2% of body weight a week at most, with a therapeutic weight-loss diet when the deficit would otherwise mean cutting nutrients, and a weigh-in every two to four weeks to adjust. Treats are where most plans fail.',
    how: (c) =>
      `Get a target weight and a daily calorie figure from the vet, weigh every meal, move all treats inside that figure, and book the weigh-ins now. Add walking as ${c.v.subj} ${c.v.verb('lose')} weight — ${c.v.poss} joints will thank you twice.`,
  },
  {
    id: 'known-diabetes',
    kind: 'note',
    topic: 'conditions',
    evidence: 'moderate',
    sources: ['merck'],
    priority: 74,
    when: (c) => c.has('diabetes'),
    title: () => 'Keeping diabetes steady',
    why: () =>
      'Diabetic dogs do well on routine: insulin at the same times, the same measured meals, the same exercise, every day. Most develop cataracts eventually, which are treatable; many owners now monitor glucose at home, which makes dose adjustments safer. The emergency to know is low blood sugar — wobbliness, weakness, collapse — treated with honey or syrup on the gums and a call to the vet.',
    how: (c) =>
      `Keep a log of insulin, meals, water intake and energy; a rising thirst usually means the dose needs reviewing. Ask about home glucose monitoring and have ${c.v.poss} eyes checked at each visit.`,
  },
  {
    id: 'known-epilepsy',
    kind: 'note',
    topic: 'conditions',
    evidence: 'moderate',
    sources: ['acvim2016seizures', 'merck'],
    priority: 72,
    when: (c) => c.has('epilepsy'),
    title: () => 'Living with epilepsy',
    why: () =>
      'The consensus guidelines are clear on the essentials: medication given consistently (missed doses are the most common cause of breakthrough seizures), a seizure diary with date, length and recovery, drug levels checked when the vet asks, and a plan for clusters — a seizure over five minutes, or several in a day, is an emergency, and many owners keep a vet-prescribed rescue medication at home for it.',
    how: (c) =>
      `During a seizure: clear the space, don’t touch ${c.v.poss} mouth, time it, keep the lights and noise down afterwards. Video one if you safely can; it helps the vet enormously. Avoid things known to lower the seizure threshold that your vet flags.`,
  },
  {
    id: 'known-thyroid',
    kind: 'note',
    topic: 'conditions',
    evidence: 'moderate',
    sources: ['merck'],
    priority: 58,
    when: (c) => c.has('thyroid'),
    title: () => 'Thyroid disease is easy to manage, and easy to drift',
    why: () =>
      'Hypothyroidism responds very well to daily medication — energy, coat and weight all recover — but the dose needs rechecking every six to twelve months because requirements change. Weight gain, lethargy or a thinning coat returning usually means the dose has drifted, not that the disease has worsened.',
    how: () =>
      'Give the tablet at the same time each day relative to meals, and keep the recheck blood tests in the diary.',
  },
  {
    id: 'known-kidney',
    kind: 'note',
    topic: 'conditions',
    evidence: 'high',
    sources: ['jacob2002', 'merck', 'glickman2011'],
    priority: 78,
    when: (c) => c.has('kidney'),
    title: () => 'Kidney disease: the diet is the treatment',
    why: () =>
      'In the controlled trial that settled the question, dogs with chronic kidney disease fed a therapeutic renal diet lived more than twice as long as those on a maintenance diet — it is the single most effective intervention there is. Alongside it: water always available, blood pressure checked and treated, phosphorus managed, dental disease kept down (gum infection drives kidney damage), and no NSAIDs without the vet’s say-so.',
    how: (c) =>
      `Ask for ${c.v.poss} IRIS stage and a recheck schedule (usually every three to six months), feed the renal diet exclusively, and put water bowls on every floor. Appetite is the thing to watch; nausea is treatable and should be treated.`,
  },
  {
    id: 'known-cancer',
    kind: 'note',
    topic: 'conditions',
    evidence: 'moderate',
    sources: ['merck', 'villalobosQol'],
    priority: 76,
    when: (c) => c.has('cancer'),
    title: () => 'Through a cancer diagnosis, or after one',
    why: (c) =>
      `Veterinary oncology has moved a long way: many cancers are now managed for good quality of life for months or years, and dogs tolerate chemotherapy far better than people do because the goal and the doses are different. ${c.stage === 'geriatric' ? 'The quality-of-life record matters most now.' : 'A monthly hands-on check for new lumps, and rechecks on the oncologist’s schedule, are the routine.'}`,
    how: (c) =>
      `Ask what signs would mean the disease is active again, keep ${c.v.obj} eating (appetite is quality of life), and use the HHHHHMM scale weekly so decisions rest on trends rather than one bad day.`,
  },
  {
    id: 'known-anxiety',
    kind: 'note',
    topic: 'conditions',
    evidence: 'moderate',
    sources: ['vieiradecastro2020', 'dreschel2010', 'avsabSocialization'],
    priority: 70,
    when: (c) => c.has('anxiety'),
    title: () => 'Treating diagnosed anxiety',
    why: () =>
      'Diagnosed anxiety is a medical condition with a medical toolkit: behaviour modification designed by a veterinary behaviourist, management of triggers, and — for most moderate-to-severe cases — medication, which is not sedation and not a failure. Aversive handling makes anxious dogs measurably worse; chronic fear has health costs of its own.',
    how: (c) =>
      `Work the plan consistently, keep a trigger diary, and review medication with the vet every few months. Protect ${c.v.poss} safe space and ${c.v.poss} predictability; both are treatment.`,
  },
  {
    id: 'known-digestive',
    kind: 'note',
    topic: 'conditions',
    evidence: 'moderate',
    sources: ['merck', 'wsavaNutrition'],
    priority: 60,
    when: (c) => c.has('digestive'),
    title: () => 'Managing a sensitive gut',
    why: () =>
      'Chronic gut trouble usually comes down to diet and is managed by it: a consistent, complete food (changed only over a week), no table scraps, measured meals, and for a dog with a history of pancreatitis a genuinely low-fat diet with no exceptions. A properly run elimination trial finds food sensitivities; probiotics with trial evidence help during flares.',
    how: (c) =>
      `Keep ${c.v.poss} diet boring and consistent, log any flares against what changed, and act on vomiting or diarrhoea that lasts more than a day or two rather than waiting it out.`,
  },
  {
    id: 'known-eyes',
    kind: 'note',
    topic: 'conditions',
    evidence: 'moderate',
    sources: ['merck'],
    priority: 60,
    when: (c) => c.has('eyes'),
    title: () => 'Looking after the eyes',
    why: () =>
      'Most eye conditions in dogs are monitored and managed rather than cured, and the two rules are: keep the rechecks, and treat any sudden change — a red, painful, squinting or cloudy eye — as same-day urgent, because glaucoma and ulcers can take sight in hours. A dog losing vision copes remarkably well if the furniture stays where it is.',
    how: (c) =>
      `Give drops on schedule, keep the home layout stable, add a night light, and ask whether a referral to a veterinary ophthalmologist is worthwhile for ${c.v.poss} particular condition.`,
  },
  {
    id: 'known-back',
    kind: 'note',
    topic: 'conditions',
    evidence: 'moderate',
    sources: ['acvs', 'merck'],
    priority: 72,
    when: (c) => c.has('back'),
    title: () => 'Protecting a vulnerable back',
    why: () =>
      'Disc disease is managed by taking load off the spine: a lean weight above everything, ramps instead of jumps, no stairs where avoidable, a harness instead of a collar, and controlled lead exercise rather than wild play. The emergency to know cold is sudden hind-leg weakness or wobbliness — that is a same-day, go-now situation, because the window for surgery is measured in hours.',
    how: (c) =>
      `Ramp the sofa, bed and car; block the stairs; keep ${c.v.obj} lean and gently fit. Save the emergency vet’s number where you can find it in the dark.`,
  },
  {
    id: 'known-other',
    kind: 'question',
    topic: 'conditions',
    evidence: 'low',
    sources: ['merck'],
    priority: 50,
    when: (c) => c.has('other'),
    title: () => 'How does the existing diagnosis change the plan in this report?',
    why: () =>
      'Bring this report to the vet and ask what to keep, what to adjust and what to skip given the condition they are already managing. General advice yields to specific medicine.',
  },
]
