/**
 * Recent changes an owner has noticed. Each becomes a vet question, and the
 * ones that can't wait become flags.
 */

import type { InsightSpec } from '../context'

export const SIGN_INSIGHTS: readonly InsightSpec[] = [
  {
    id: 'sign-drinking-more',
    kind: 'flag',
    topic: 'signs',
    evidence: 'moderate',
    sources: ['merck'],
    priority: (c) => (c.p.sex === 'female' && c.p.neuterStatus === 'intact' ? 92 : 82),
    when: (c) => c.sign('drinking-more'),
    title: () => 'Drinking more: get bloodwork and a urine test soon',
    why: (c) =>
      `A sustained rise in thirst is one of the most reliable early warnings a dog gives, and the list behind it is short and specific: kidney disease, diabetes, Cushing’s disease, liver disease, a urinary infection${c.p.sex === 'female' && c.p.neuterStatus === 'intact' ? ' — and in an unspayed female, a womb infection (pyometra), which is a same-day emergency if there is also lethargy, discharge or vomiting' : ''}. All of them are far better caught now than later.`,
    how: (c) =>
      `Book an exam this week or next with a blood panel and urinalysis. If you can, measure roughly how much ${c.v.subj} ${c.v.verb('drink')} in 24 hours and bring a fresh urine sample.`,
  },
  {
    id: 'sign-new-lump',
    kind: 'flag',
    topic: 'signs',
    evidence: 'moderate',
    sources: ['merck'],
    priority: 86,
    when: (c) => c.sign('new-lump'),
    title: () => 'A new lump should be sampled, not watched',
    why: () =>
      'Most lumps are benign, but a fatty lipoma and a mast cell tumour can be identical to the eye and the hand, and the second can look like anything at all. A fine-needle aspirate is a quick, cheap, in-clinic test that answers the question; “let’s keep an eye on it” is how small, curable tumours become large ones.',
    how: (c) =>
      `Book it in the next couple of weeks. Measure the lump and photograph it with a coin for scale, so change is obvious. Then start a monthly hands-on check of the whole of ${c.v.obj}.`,
  },
  {
    id: 'sign-night-restless',
    kind: 'question',
    topic: 'signs',
    evidence: 'moderate',
    sources: ['salvin2010', 'merck'],
    priority: (c) => (c.older ? 78 : 60),
    when: (c) => c.sign('night-restless') && c.p.sleep !== 'restless',
    title: (c) =>
      c.older ? 'Ask about cognitive dysfunction and pain for the restless nights' : 'Ask what is behind the restless nights',
    why: (c) =>
      c.older
        ? 'In a dog over eight, night-time pacing and waking is the most commonly noticed sign of cognitive dysfunction — under-diagnosed in nearly all cases — and also of pain and of needing to urinate more often. Each is treatable.'
        : `In a younger dog, restless nights usually mean itch, pain, anxiety, needing to go out, or not enough daytime exercise. Keep a one-week log of when ${c.v.subj} ${c.v.verb('wake')} and what ${c.v.subj} ${c.v.verb('do')}.`,
  },
  {
    id: 'sign-coughing',
    kind: 'flag',
    topic: 'signs',
    evidence: 'moderate',
    sources: ['merck', 'acvim2019mvd', 'ahsHeartworm'],
    priority: (c) =>
      c.cond.has('mitral-valve-disease') || c.cond.has('dilated-cardiomyopathy') || c.has('heart')
        ? 88
        : c.p.parasitePrevention === 'none'
          ? 88
          : 76,
    when: (c) => c.sign('coughing'),
    title: (c) =>
      c.cond.has('mitral-valve-disease') || c.cond.has('dilated-cardiomyopathy') || c.has('heart')
        ? 'A cough in a dog with a heart risk needs a heart check'
        : 'A cough that lasts more than a few days needs a look',
    why: (c) =>
      `A brief cough after excitement or a drink is nothing. One that persists points at kennel cough, ${c.tiny ? 'a collapsing windpipe (common in small breeds and worse on a collar), ' : ''}${c.older && c.big ? 'laryngeal paralysis, ' : ''}heart disease${c.cond.has('mitral-valve-disease') || c.cond.has('dilated-cardiomyopathy') ? ` — to which ${c.theBreed} is predisposed` : ''}${c.p.parasitePrevention === 'none' || c.p.parasitePrevention === 'not-sure' ? ', or heartworm, which a dog without prevention is exposed to' : ''}. Counting breaths while asleep is the single most useful thing you can do at home: over about 30 a minute at rest is a reason to be seen promptly.`,
    how: (c) =>
      `Book an exam; mention when the cough happens (night, after exercise, on the lead) and bring a sleeping breathing rate. Switch to a harness in the meantime if ${c.v.subj} ${c.v.verb('wear')} a collar on walks.`,
  },
  {
    id: 'sign-accidents',
    kind: 'question',
    topic: 'signs',
    evidence: 'moderate',
    sources: ['merck'],
    priority: 70,
    when: (c) => c.sign('accidents'),
    title: () => 'Ask about the indoor accidents — assume medical before behavioural',
    why: (c) =>
      `A house-trained dog that starts having accidents almost always has a reason: a urinary infection or stones, kidney disease, diabetes, ${c.older ? 'cognitive dysfunction, ' : ''}${c.p.sex === 'female' && c.p.neuterStatus === 'neutered' ? 'the hormone-responsive leakage that affects some spayed females, ' : ''}or pain that makes getting outside slow. Punishing it helps nothing; a urine test usually explains it.`,
  },
  {
    id: 'sign-stiffness',
    kind: 'question',
    topic: 'signs',
    evidence: 'moderate',
    sources: ['merck', 'marshall2010'],
    priority: 66,
    when: (c) => c.sign('stiffness') && (c.p.mobility === undefined || c.p.mobility === 'fine'),
    title: () => 'Ask for a pain and mobility assessment for the stiffness',
    why: () =>
      'New stiffness is almost always joint pain, most often arthritis, and it responds well to a plan — weight, omega-3s, controlled exercise, modern pain relief, home traction. Dogs hide it; ask the vet to score it.',
  },
  {
    id: 'sign-weight-change',
    kind: 'question',
    topic: 'signs',
    evidence: 'moderate',
    sources: ['merck', 'aahaSenior2023'],
    priority: 72,
    when: (c) => c.sign('weight-change') && c.p.weightTrend === undefined,
    title: () => 'Ask about the weight change',
    why: (c) =>
      `Unplanned weight change in either direction is a symptom until proven otherwise — loss points at dental pain, kidneys, diabetes, gut disease or cancer; gain with a normal diet points at thyroid or Cushing’s. Bring ${c.v.poss} recent weights if you have them; the trend is the useful part.`,
  },
  {
    id: 'sign-bad-breath',
    kind: 'question',
    topic: 'signs',
    evidence: 'high',
    sources: ['oneill2021perio', 'glickman2011'],
    priority: 68,
    when: (c) => c.sign('bad-breath'),
    title: () => 'Ask for a proper look in the mouth — bad breath is disease, not “dog breath”',
    why: (c) =>
      `Halitosis is periodontal disease until proven otherwise: infected gums, which one in eight dogs is diagnosed with each year and which raises the risk of kidney disease downstream. ${c.older ? 'In an older dog a sweet or ammonia smell can also be kidney disease itself. ' : ''}Ask whether a cleaning under anaesthesia with radiographs is due, and start brushing now.`,
  },
  {
    id: 'sign-appetite',
    kind: 'flag',
    topic: 'signs',
    evidence: 'moderate',
    sources: ['merck'],
    priority: 74,
    when: (c) => c.sign('appetite-change'),
    title: () => 'An appetite change that lasts more than a couple of days needs a vet',
    why: (c) =>
      `Dogs skip the odd meal. A dog that is off food for more than 48 hours, or picking at it for a week, is telling you about nausea, pain (often dental), fever or something in the gut. A dog that is suddenly ravenous without gaining weight is a different list — diabetes, Cushing’s, gut malabsorption. ${c.p.mealsPerDay === 'free-fed' ? 'Free-feeding makes this harder to spot, which is one more reason for measured meals.' : ''}`,
    how: (c) =>
      `Book an exam; note anything else — vomiting, drinking, energy, stools. Don’t keep tempting ${c.v.obj} with richer food, which can hide the problem and trigger pancreatitis.`,
  },
  {
    id: 'sign-confusion',
    kind: 'flag',
    topic: 'signs',
    evidence: 'moderate',
    sources: ['salvin2010', 'aahaSenior2023', 'merck'],
    priority: (c) => (c.older ? 84 : 80),
    when: (c) => c.sign('confusion'),
    title: (c) =>
      c.older ? 'Confusion or disorientation: ask about cognitive dysfunction now' : 'Confusion in a younger dog needs a prompt neurological look',
    why: (c) =>
      c.older
        ? 'Getting stuck in corners, staring at walls, not recognising people, forgetting house-training: these are the signs of canine cognitive dysfunction, which affects around one in seven dogs over eight and is diagnosed in almost none of them. It is not reversible, but diet, enrichment, routine and medication slow it — and they work best started early.'
        : `Disorientation in a dog that isn’t old is not normal ageing; it needs a prompt exam to rule out seizures, liver problems, toxins or a neurological cause.`,
    how: (c) =>
      c.older
        ? `Ask for a cognitive screen (the DISHAA checklist) and a blood panel to rule out look-alikes. Keep ${c.v.poss} routine fixed, the home layout unchanged, and ${c.v.poss} days full of gentle walks and sniffing.`
        : 'Book an exam this week; video an episode if you can.',
  },
  {
    id: 'sign-scratching',
    kind: 'question',
    topic: 'signs',
    evidence: 'moderate',
    sources: ['merck', 'oneill2021otitis'],
    priority: 60,
    when: (c) => c.sign('scratching'),
    title: () => 'Ask about the itching — and check the ears',
    why: (c) =>
      `Persistent scratching, licking or chewing is fleas until proven otherwise (${c.p.parasitePrevention === 'year-round' ? 'even on prevention, check' : 'especially without year-round prevention'}), then allergy — environmental or food — and ear infections, which affect about 7% of dogs a year${c.cond.has('otitis') ? ` and to which ${c.theBreed} is predisposed` : ''}. Modern itch treatments are very good; the misery is optional.`,
  },
  {
    id: 'sign-tiring',
    kind: 'flag',
    topic: 'signs',
    evidence: 'moderate',
    sources: ['merck', 'cambridgeBoas', 'acvim2019mvd'],
    priority: (c) => (c.brachy ? 86 : 76),
    when: (c) => c.sign('tiring'),
    title: (c) => (c.brachy ? 'Tiring easily with a flat face: have the airway graded' : 'Tiring easily is a symptom, not a mood'),
    why: (c) =>
      c.brachy
        ? `In a flat-faced breed, slowing down on walks, noisy breathing and needing to stop are the signs of airway obstruction (BOAS), which can be graded in a short clinic test and treated. It is also the breed group most at risk of heat-related illness.`
        : `Exercise intolerance is how dogs show heart disease, anaemia, low thyroid, pain and respiratory problems. ${c.older ? 'In an older dog it is often pain, and often treatable.' : 'In a younger dog it deserves a heart check and bloodwork.'} Count breaths while asleep: over about 30 a minute is a reason to be seen promptly.`,
    how: () =>
      'Book an exam and describe exactly what changed — distance, recovery time, breathing. Bring a short video from a walk if you can.',
  },
]
