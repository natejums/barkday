/**
 * Breed-driven insights, keyed off the conditions the breed data documents.
 * These enrich the 1.0 health panel with what to *do*; they never invent a
 * predisposition the breed data doesn't state.
 */

import type { InsightSpec } from '../context'

export const BREED_INSIGHTS: readonly InsightSpec[] = [
  {
    id: 'breed-bloat',
    kind: 'flag',
    topic: 'breed',
    evidence: 'high',
    sources: ['glickman2000', 'raghavan2004', 'merck'],
    priority: 95,
    when: (c) => c.cond.has('gdv-bloat'),
    title: (c) => `Know the signs of bloat — ${c.v.name}’s breed is prone to it, and it kills in hours`,
    why: (c) =>
      `Gastric dilatation-volvulus — the stomach filling with gas and twisting — is the emergency of deep-chested breeds, and survival depends almost entirely on how fast the dog reaches surgery. The signs: a swollen, tight belly, unproductive retching, restlessness and pacing, drooling, then collapse. The risk factors you control: one large meal a day, fast eating, raised bowls, and hard exercise around mealtimes${c.p.mealsPerDay === 'one' ? ' — and the single daily meal is one to change' : ''}.`,
    how: (c) =>
      `If you ever see those signs, go to the emergency vet immediately — not in the morning, not after a call. Ask whether a preventive gastropexy (tacking the stomach, often done during neutering) makes sense for ${c.v.obj}; for the highest-risk breeds many surgeons recommend it.`,
  },
  {
    id: 'breed-brachy',
    kind: 'flag',
    topic: 'breed',
    evidence: 'high',
    sources: ['cambridgeBoas', 'hall2020incidence', 'oneill2021perio'],
    priority: 88,
    when: (c) => c.brachy,
    title: (c) => `A flat face changes the rules for ${c.v.name}`,
    why: () =>
      'Brachycephalic airway syndrome is the defining health issue of flat-faced breeds: a shortened skull with the same amount of soft tissue inside it. The consequences are heat intolerance (about twice the odds of heat-related illness), noisy and laboured breathing, poor sleep, reflux, and higher anaesthetic risk — plus crowded teeth that get periodontal disease sooner. Much of it is manageable, and the airway can be graded in a short clinic test and, where needed, surgically improved.',
    how: (c) =>
      `Harness, never a collar. Lean weight — every extra kilo narrows the airway. Walks in the cool part of the day, never left anywhere warm, water always to hand. Ask the vet to grade ${c.v.poss} airway (BOAS functional grading) and to use brachycephalic-aware protocols for any anaesthetic. Loud snoring, gagging or collapse after exertion are not “normal for the breed”; they are the disease.`,
  },
  {
    id: 'breed-cardiac-mvd',
    kind: 'move',
    topic: 'breed',
    evidence: 'moderate',
    sources: ['acvim2019mvd', 'merck'],
    priority: (c) => (c.stage === 'mature-adult' || c.older ? 70 : 52),
    when: (c) => c.cond.has('mitral-valve-disease') && !c.has('heart'),
    title: () => 'An annual listen to the heart, and a plan if there’s a murmur',
    why: (c) =>
      `${c.TheBreed} is predisposed to mitral valve disease, the most common heart disease of dogs, which announces itself as a murmur years before any symptom. The cardiology consensus is that starting medication at the right pre-symptomatic stage — judged by echocardiogram — delays heart failure by many months.`,
    how: (c) =>
      `Make sure every exam includes a careful auscultation. If a murmur is heard, ask for an echocardiogram to stage it rather than waiting for symptoms, and start counting ${c.v.poss} sleeping breathing rate as a baseline.`,
  },
  {
    id: 'breed-cardiac-dcm',
    kind: 'move',
    topic: 'breed',
    evidence: 'moderate',
    sources: ['fdaDcm2019', 'freeman2018', 'merck'],
    priority: (c) => (c.p.grainFree === 'yes' ? 86 : 62),
    when: (c) => c.cond.has('dilated-cardiomyopathy') && !c.has('heart'),
    title: (c) => c.pick('dcm-t', 'Regular heart screening for a DCM-prone breed', `Keep an eye on ${c.v.name}’s heart`),
    why: (c) =>
      `Dilated cardiomyopathy — a weakening of the heart muscle — runs in ${c.theBreed} and often shows nothing until it is advanced; some breeds have a known genetic form that screening catches early.${c.p.grainFree === 'yes' ? ' On top of the inherited risk, the diet is grain-free and legume-rich, the pattern the FDA has linked to hundreds of DCM reports; in a predisposed breed that is a combination to end.' : ' Diet matters too: legume-rich, grain-free foods have been linked to DCM in hundreds of FDA reports.'}`,
    how: (c) =>
      `Ask about breed-appropriate screening (an echocardiogram and, for some breeds, a 24-hour Holter monitor or a genetic test) from early adulthood, keep ${c.v.obj} on a conventional diet from a maker that meets the WSAVA criteria, and see the vet promptly for any cough, tiring or fast breathing at rest.`,
  },
  {
    id: 'breed-cancer-prone',
    kind: 'note',
    topic: 'breed',
    evidence: 'moderate',
    sources: ['merck', 'takashima2012'],
    priority: 66,
    when: (c) =>
      (c.cond.has('hemangiosarcoma') || c.cond.has('lymphoma') || c.cond.has('osteosarcoma') || c.cond.has('mast-cell-tumour')) &&
      (c.stage === 'mature-adult' || c.older),
    title: (c) => `What a cancer-prone breed asks of you at ${c.v.poss} age`,
    why: (c) =>
      `${c.TheBreed} carries a documented predisposition to ${[
        c.cond.has('hemangiosarcoma') ? 'hemangiosarcoma' : '',
        c.cond.has('lymphoma') ? 'lymphoma' : '',
        c.cond.has('osteosarcoma') ? 'bone cancer' : '',
        c.cond.has('mast-cell-tumour') ? 'mast cell tumours' : '',
      ]
        .filter(Boolean)
        .join(', ')
        .replace(/, ([^,]*)$/, ' and $1')}. None is certain; all are more treatable early. The signs worth knowing: ${c.cond.has('hemangiosarcoma') ? 'sudden weakness, pale gums or a swollen belly (hemangiosarcoma can bleed internally without warning); ' : ''}${c.cond.has('lymphoma') ? 'enlarged lymph nodes under the jaw, in front of the shoulders or behind the knees; ' : ''}${c.cond.has('osteosarcoma') ? 'a limp that doesn’t resolve, especially in a leg; ' : ''}${c.cond.has('mast-cell-tumour') ? 'any skin lump, since mast cell tumours can look like anything; ' : ''}and unexplained weight loss or lethargy.`,
    how: (c) =>
      `A monthly hands-on check of ${c.v.poss} whole body and lymph nodes, a needle sample of any new lump, prompt attention to any of the signs above, and keeping ${c.v.obj} off chemically treated lawns, which carry a repeated lymphoma signal.`,
  },
  {
    id: 'breed-joints-young-big',
    kind: 'move',
    topic: 'breed',
    evidence: 'high',
    sources: ['kealy1997', 'ofa', 'hart2020'],
    priority: 72,
    when: (c) => c.big && c.young && (c.cond.has('hip-dysplasia') || c.cond.has('elbow-dysplasia')),
    title: (c) => `Protect ${c.v.name}’s hips and elbows while ${c.v.subj} ${c.v.verb('grow')}`,
    why: (c) =>
      `${c.TheBreed} is predisposed to hip or elbow dysplasia, and the two levers with real evidence are both in your hands: body weight (lean-fed Labradors in a five-year study developed markedly less hip arthritis than their heavier littermates) and the age of neutering (early neutering raised joint-disorder rates in larger breeds). Repetitive high-impact exercise before the growth plates close is the third.`,
    how: (c) =>
      `Keep ${c.v.obj} lean on a large-breed growth diet, avoid forced running, stairs by the hundred and ball-launcher sessions until 14–18 months, and ${c.p.neuterStatus === 'intact' ? 'discuss waiting until after a year to neuter' : 'ask about the breed-specific joint screening (OFA or PennHIP) if you want a baseline'}. Any limp or bunny-hopping at this age is worth an orthopaedic exam.`,
  },
  {
    id: 'breed-ivdd',
    kind: 'note',
    topic: 'breed',
    evidence: 'moderate',
    sources: ['acvs', 'merck'],
    priority: 68,
    when: (c) => c.cond.has('intervertebral-disc-disease') && !c.has('back'),
    title: () => `A long back needs looking after`,
    why: (c) =>
      `${c.TheBreed} is predisposed to disc disease, where a disc in the spine bulges or ruptures and presses on the cord. The prevention is mechanical: a lean weight above all, ramps rather than jumps, no stairs where avoidable, a harness rather than a collar. The emergency to recognise is sudden hind-leg weakness, wobbliness or dragging — that is a go-now situation, because the surgical window is hours.`,
    how: (c) =>
      `Ramp the sofa, bed and car now, while ${c.v.subj} ${c.be} well; block the stairs; keep ${c.v.obj} lean and fit with lead walks rather than leaping play. Know where the emergency vet is.`,
  },
  {
    id: 'breed-eyes',
    kind: 'note',
    topic: 'breed',
    evidence: 'moderate',
    sources: ['ofa', 'merck'],
    priority: 56,
    when: (c) =>
      (c.cond.has('progressive-retinal-atrophy') || c.cond.has('cataracts') || c.cond.has('glaucoma') || c.cond.has('lens-luxation')) &&
      !c.has('eyes'),
    title: () => 'Inherited eye conditions: screen, and know the emergency',
    why: (c) =>
      `${c.TheBreed} carries inherited eye risks${c.cond.has('glaucoma') || c.cond.has('lens-luxation') ? ', including one that is an emergency: a suddenly red, painful, squinting or cloudy eye can lose sight in hours' : ''}. Progressive retinal atrophy shows first as night-blindness and bumping into things in the dark; cataracts as a cloudy lens. An annual eye exam, ideally by a veterinary ophthalmologist, catches each early.`,
    how: (c) =>
      `Ask for an eye check at each exam and a referral if anything looks off. If ${c.v.subj} ${c.v.verb('hesitate')} in dim light, that is the time to ask about PRA, not later.`,
  },
  {
    id: 'breed-epilepsy',
    kind: 'note',
    topic: 'breed',
    evidence: 'moderate',
    sources: ['acvim2016seizures', 'merck'],
    priority: 52,
    when: (c) => c.cond.has('epilepsy') && c.young && !c.has('epilepsy'),
    title: () => 'Know what a seizure looks like, just in case',
    why: (c) =>
      `${c.TheBreed} has a higher rate of idiopathic epilepsy, which typically first appears between one and five years. Most dogs with it live full lives on medication; what helps most at the start is a clear description of the first episode.`,
    how: () =>
      'If it ever happens: clear the space, don’t touch the mouth, time it, video it if you safely can, and keep things dark and quiet afterwards. One seizure under five minutes is a prompt vet visit; longer, or several in a day, is an emergency.',
  },
  {
    id: 'breed-mdr1',
    kind: 'move',
    topic: 'breed',
    evidence: 'high',
    sources: ['wsuMdr1', 'merck'],
    priority: 76,
    when: (c) => c.cond.has('mdr1'),
    title: (c) => `Test ${c.v.name} for the MDR1 drug-sensitivity gene`,
    why: (c) =>
      `${c.TheBreed} commonly carries a mutation in the MDR1 (ABCB1) gene that lets certain ordinary drugs — some wormers and antiparasitics, loperamide, several chemotherapy and sedation drugs — build up in the brain to dangerous levels. A one-off cheek-swab test settles it for life.`,
    how: () =>
      'Order the test (Washington State University’s lab or a reputable equivalent), put the result on the front of the vet file, and tell every vet and groomer. Until it is back, treat the dog as affected.',
  },
  {
    id: 'breed-deafness',
    kind: 'note',
    topic: 'breed',
    evidence: 'moderate',
    sources: ['ofa', 'merck'],
    priority: 58,
    when: (c) => c.cond.has('deafness') && c.stage === 'puppy',
    title: () => 'A hearing test is worth doing in puppyhood',
    why: (c) =>
      `${c.TheBreed} has a higher rate of congenital deafness, often in one ear only, which is easy to miss and easy to confirm with a BAER hearing test. Knowing changes how you train and keep ${c.v.obj} safe; it changes nothing about how good a dog ${c.v.subj} will be.`,
  },
  {
    id: 'breed-otitis',
    kind: 'note',
    topic: 'breed',
    evidence: 'moderate',
    sources: ['oneill2021otitis'],
    priority: 50,
    when: (c) => c.cond.has('otitis'),
    title: (c) => `Weekly ear checks for ${c.v.name}`,
    why: (c) =>
      `Ear infections affect about 7% of dogs a year and ${c.theBreed} is among the more prone, usually because of ear shape or allergy. Caught at the waxy, slightly smelly stage they are a cleaning; caught at the head-shaking stage they are a course of treatment and a sore dog.`,
    how: () =>
      `Look and sniff once a week, clean with a vet-recommended cleaner when they look waxy, and dry them after swimming or baths. Recurring infections mean an underlying allergy to chase, not just more drops.`,
  },
  {
    id: 'breed-tracheal-collapse',
    kind: 'note',
    topic: 'breed',
    evidence: 'moderate',
    sources: ['merck'],
    priority: 56,
    when: (c) => c.cond.has('tracheal-collapse'),
    title: () => 'Harness, not collar — the windpipe is the weak point',
    why: (c) =>
      `${c.TheBreed} is prone to a softening windpipe that flattens under pressure, producing a honking cough. Collar pressure, excess weight, heat, excitement and smoke all make it worse; most dogs are managed well without surgery if those are controlled.`,
    how: (c) =>
      `A Y-front harness for every walk, a lean weight, a smoke-free home, and a cool room in summer. If ${c.v.subj} ${c.v.verb('start')} honking or tiring, ask about medication before it progresses.`,
  },
  {
    id: 'breed-hypothyroid',
    kind: 'note',
    topic: 'breed',
    evidence: 'moderate',
    sources: ['merck'],
    priority: 44,
    when: (c) => c.cond.has('hypothyroidism') && (c.stage === 'mature-adult' || c.older) && !c.has('thyroid'),
    title: () => 'Add a thyroid test to the annual bloodwork',
    why: (c) =>
      `${c.TheBreed} is prone to an underactive thyroid in middle age, which creeps in as weight gain, lethargy and a thinning coat and is easily mistaken for ageing. It is cheap to test and very easy to treat.`,
  },
  {
    id: 'breed-giant',
    kind: 'note',
    topic: 'breed',
    evidence: 'high',
    sources: ['montoya2023', 'aahaLifeStage2019'],
    priority: 50,
    when: (c) => c.size === 'giant',
    title: () => 'Giant breeds age on a faster clock',
    why: () =>
      `A dog this size reaches “senior” at around seven, not ten, because the life stages are proportions of an expected span that is simply shorter — about 9.5 years on average for giants against 13.5 for small dogs. That isn’t a reason for gloom; it is a reason to start the senior rhythm (six-monthly exams, pain scoring, home adaptations) earlier than you would think, and to treat any limp or sudden weakness seriously.`,
  },
  {
    id: 'breed-tiny',
    kind: 'note',
    topic: 'breed',
    evidence: 'moderate',
    sources: ['montoya2023', 'oneill2021perio', 'merck'],
    priority: 48,
    when: (c) => c.size === 'toy',
    title: () => 'The small-dog list',
    why: (c) =>
      `Toy breeds live long but carry their own set: crowded teeth and early periodontal disease, slipping kneecaps, a windpipe that dislikes collars, low blood sugar in tiny puppies, and a tendency to be overfed by hand. ${c.stage === 'puppy' ? 'For a tiny puppy, frequent small meals and a watch for wobbliness or lethargy (low blood sugar) matter in the first months.' : 'Daily brushing and a harness cover most of it.'}`,
  },
  {
    id: 'breed-unknown',
    kind: 'note',
    topic: 'breed',
    evidence: 'low',
    sources: ['wsuMdr1', 'merck'],
    priority: 42,
    when: (c) => c.breedName === undefined,
    title: () => 'A DNA test can fill in the breed-specific advice',
    why: () =>
      'Without a breed, this report can’t point at breed-specific conditions. A commercial DNA test gives a mix estimate (reasonably good for the major components, hazy for the minor ones) and, more usefully, tests a panel of genetic health markers — the MDR1 drug-sensitivity mutation among them. If you run one, enter the result on the left as a mix and the breed-health section will fill in.',
  },
]
