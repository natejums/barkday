/**
 * Weight, body condition, weight trend and mobility.
 */

import type { InsightSpec } from '../context'

const bcs = (c: { p: { bodyConditionScore?: number | undefined } }) => c.p.bodyConditionScore

export const BODY_INSIGHTS: readonly InsightSpec[] = [
  {
    id: 'weight-over',
    kind: 'move',
    topic: 'weight',
    evidence: 'high',
    sources: ['salt2019', 'kealy2002', 'apop2022', 'marshall2010'],
    priority: 88,
    recId: 'body-condition',
    when: (c) => (bcs(c) ?? 5) > 5,
    title: (c) =>
      (bcs(c) ?? 5) >= 7
        ? c.pick('weight-over-t7', `Get ${c.v.name} to a lean weight — it’s the biggest lever there is`, `Weight is the single biggest thing you can change for ${c.v.name}`)
        : c.pick('weight-over-t6', 'Trim the extra weight while it’s still a little', 'A little lean goes a long way'),
    why: (c) =>
      `Across 50,787 dogs, those overweight in middle age lost between 5 months and 2½ years of median lifespan depending on breed — and ${c.tiny ? 'small dogs were hit hardest, losing up to 2½ years' : c.big ? 'in bigger breeds the cost is smaller per point but arrives as joint disease and heat intolerance instead' : 'medium breeds sat in the middle of that range'}. In the Purina study, lean-fed Labradors lived 1.8 years longer and developed arthritis years later. Nearly six in ten dogs are now overweight, so this is the most common fixable thing on the whole form.${c.has('arthritis') || c.p.mobility === 'stiff-after-rest' || c.p.mobility === 'avoids-stairs' ? ' With stiff joints, losing just 6% of body weight measurably improves lameness.' : ''}`,
    how: (c) =>
      `Cut ${c.v.poss} measured ration by 10% and treats to almost nothing, then re-weigh in four weeks; aim for 1–2% of body weight a month, not a crash. Ask the vet for a target weight and, if ${c.v.subj} ${c.v.verb('have')} a lot to lose, a therapeutic weight-loss food so ${c.v.subj} ${c.v.verb('stay')} full and nourished on fewer calories.`,
  },
  {
    id: 'weight-ideal',
    kind: 'win',
    topic: 'weight',
    evidence: 'high',
    sources: ['kealy2002', 'salt2019'],
    priority: 72,
    when: (c) => bcs(c) === 4 || bcs(c) === 5,
    title: (c) => c.pick('weight-ideal-t', 'Lean, and that matters more than anything else here', 'An ideal body condition'),
    why: (c) =>
      `Keeping a dog lean is the best-evidenced lifespan intervention in veterinary medicine — worth a median 1.8 years in the only controlled lifetime study ever done. ${c.v.Name} is already there. Protect it: it gets harder after neutering and in middle age, when calorie needs quietly fall.`,
  },
  {
    id: 'weight-under',
    kind: 'flag',
    topic: 'weight',
    evidence: 'moderate',
    sources: ['merck'],
    priority: (c) => ((bcs(c) ?? 4) <= 2 ? 82 : 66),
    when: (c) => (bcs(c) ?? 4) < 4 && !c.cond.has('anaesthetic-sensitivity'),
    title: () => 'Underweight is usually a symptom, not a lifestyle',
    why: (c) =>
      `A dog below a 4 on the body-condition scale, with ribs and hips visible, is rarely just “a picky eater”. Dental pain, parasites, gut disease, kidney disease, diabetes and cancer all show up first as weight that will not stay on${c.older ? ', and in an older dog muscle loss over the spine and hips deserves its own look' : ''}.`,
    how: (c) =>
      `Book a check-up with a faecal test and bloodwork rather than just adding food. If everything comes back clean, then it’s a feeding problem and ${c.v.subj} ${c.v.verb('need')} more calories in a more digestible form.`,
  },
  {
    id: 'weight-under-sighthound',
    kind: 'note',
    topic: 'weight',
    evidence: 'moderate',
    sources: ['merck'],
    priority: 40,
    when: (c) => (bcs(c) ?? 4) === 3 && c.cond.has('anaesthetic-sensitivity'),
    title: () => 'Lean is normal for a sighthound',
    why: (c) =>
      `Sighthound-type breeds carry visible ribs and hips as a matter of course; a 3 that would worry a vet in a Labrador is often simply a fit ${c.breedName ?? 'sighthound'}. Judge by energy, coat and appetite rather than the silhouette.`,
  },
  {
    id: 'weight-gaining',
    kind: 'move',
    topic: 'weight',
    evidence: 'high',
    sources: ['salt2019', 'aahaWeight2014'],
    priority: (c) => ((bcs(c) ?? 5) > 5 ? 80 : 64),
    when: (c) => c.p.weightTrend === 'gaining',
    title: (c) =>
      (bcs(c) ?? 5) > 5
        ? 'The weight is still climbing — change course now'
        : c.pick('weight-gain-t', 'Catch the weight gain early', 'Gaining weight is easiest to fix right now'),
    why: (c) =>
      `Weight that is trending up is the easiest version of this problem to solve, because the gap is small. ${c.p.neuterStatus === 'neutered' ? 'Neutering drops calorie needs by roughly 10–20% without reducing appetite, which is why so many dogs gain in the year after.' : 'Calorie needs fall through middle age while appetite does not.'} Every point of body condition above ideal costs months of healthy life.`,
    how: (c) =>
      `Weigh ${c.v.obj} monthly — the vet’s walk-on scale is free — and trim the ration by 10% the moment the trend shows. ${c.p.treatShare === 'a-lot' ? 'Treats are the obvious first cut.' : 'Measure the food by weight, not scoop.'}`,
  },
  {
    id: 'weight-losing',
    kind: 'flag',
    topic: 'weight',
    evidence: 'moderate',
    sources: ['merck', 'aahaSenior2023'],
    priority: (c) => ((bcs(c) ?? 5) <= 5 ? 86 : 50),
    when: (c) => c.p.weightTrend === 'losing',
    title: (c) =>
      (bcs(c) ?? 5) > 5
        ? 'Losing weight — make sure it’s the kind you intended'
        : 'Unexplained weight loss needs a vet within a week or two',
    why: (c) =>
      (bcs(c) ?? 5) > 5
        ? `If you are dieting ${c.v.obj} on purpose, this is good news; aim for 1–2% of body weight a month and keep the muscle by keeping ${c.v.obj} active. If you are not, treat it as the next paragraph says.`
        : `A dog losing weight without a diet is one of the clearest signals in veterinary medicine that something is wrong — dental pain, kidney disease, diabetes, gut disease, cancer${c.older ? ', and in a senior it is never “just age”' : ''}. The earlier the cause is found, the more that can be done.`,
    how: (c) =>
      (bcs(c) ?? 5) > 5
        ? 'Weigh monthly and stop at a 4–5 body condition. If the loss is faster than you planned, or appetite has dropped, have it checked.'
        : `Book an exam with bloodwork, urinalysis and a look in the mouth. Note ${c.v.poss} appetite and drinking for the vet — eating well while losing weight points one way, going off food points another.`,
  },
  {
    id: 'weight-stable',
    kind: 'win',
    topic: 'weight',
    evidence: 'moderate',
    sources: ['salt2019'],
    priority: 44,
    when: (c) => c.p.weightTrend === 'stable' && (bcs(c) === 4 || bcs(c) === 5),
    title: () => 'Holding steady at a good weight',
    why: () =>
      'Stable and lean is exactly where you want a dog through middle age. A monthly weigh-in is enough to keep it that way.',
  },
  {
    id: 'mobility-stiff',
    kind: 'move',
    topic: 'weight',
    evidence: 'moderate',
    sources: ['marshall2010', 'roush2010', 'aahaSenior2023', 'merck'],
    priority: (c) => (c.young && c.big ? 74 : 72),
    when: (c) => c.p.mobility === 'stiff-after-rest',
    title: (c) =>
      c.young && c.big
        ? 'Stiffness in a young big dog deserves a proper look'
        : c.pick('stiff-t', 'Stiffness after rest is arthritis talking — and it’s treatable', 'Take the stiffness seriously; there’s a lot that helps'),
    why: (c) =>
      c.young && c.big
        ? `A young ${c.breedName ?? 'large-breed dog'} that is stiff after rest is more likely to have a developmental joint problem — hip or elbow dysplasia, panosteitis — than ordinary arthritis. Caught early, the options are far better.`
        : `Stiff getting up, loosening after a few minutes: that is the textbook early sign of osteoarthritis, which affects a large share of adult dogs and the majority of seniors, and is badly under-treated because dogs hide pain. The good news is that it responds to things you control. In obese arthritic dogs, losing just 6% of body weight produced a measurable improvement in lameness; fish-oil omega-3s improved weight-bearing in a controlled trial; and regular gentle exercise keeps joints moving.`,
    how: (c) =>
      c.young && c.big
        ? 'Ask for an orthopaedic exam and, if indicated, hip and elbow radiographs. Keep exercise low-impact and the body lean while it is being worked out.'
        : `Ask the vet for a pain assessment and an actual plan — weight, a vet-dosed omega-3, controlled daily exercise, and modern pain relief when needed. At home: non-slip rugs on hard floors, a ramp for the car or sofa, and a firm supportive bed. Don’t wait for ${c.v.obj} to cry out; ${c.v.subj} won’t.`,
  },
  {
    id: 'mobility-avoids-stairs',
    kind: 'move',
    topic: 'weight',
    evidence: 'moderate',
    sources: ['marshall2010', 'aahaSenior2023', 'merck'],
    priority: 76,
    when: (c) => c.p.mobility === 'avoids-stairs',
    title: (c) => `${c.v.Name} is avoiding stairs or jumps — that’s pain, not laziness`,
    why: (c) =>
      `Dogs don’t decline a sofa they used to leap onto out of preference. Hesitating at stairs, bunny-hopping, or needing a run-up to the car are classic signs of joint or back pain${c.cond.has('intervertebral-disc-disease') ? `, and in a ${c.breedName ?? 'long-backed breed'} back pain in particular needs ruling out` : ''}. It is under-recognised precisely because it is quiet.`,
    how: (c) =>
      `Book an exam and ask specifically about pain scoring and whether radiographs are warranted. Meanwhile make the home easy — ramps or steps instead of jumps, rugs on slick floors, a bed ${c.v.subj} ${c.v.verb('do')}n’t have to climb into. If ${c.v.subj} ${c.v.verb('carry')} extra weight, losing it is the most effective treatment there is.`,
  },
  {
    id: 'mobility-limping',
    kind: 'flag',
    topic: 'weight',
    evidence: 'moderate',
    sources: ['merck', 'acvs'],
    priority: (c) => (c.size === 'giant' && !c.young ? 92 : 86),
    when: (c) => c.p.mobility === 'limping',
    title: () => 'A limp that lasts more than a few days needs a vet',
    why: (c) =>
      `Most limps are sprains and settle in days with rest. One that persists, worsens, or comes and goes for weeks is a cruciate ligament, a joint problem or${c.size === 'giant' && !c.young ? ', in a giant breed, something that must be ruled out early: bone cancer, which first appears as an ordinary-looking limp' : ', occasionally, something more serious'}. Waiting rarely improves the options.`,
    how: (c) =>
      `Rest ${c.v.obj} for 48 hours; if the limp is still there, book an exam. Note which leg, whether it’s worse after rest or after exercise, and take a short video on your phone — limps vanish in consulting rooms.`,
  },
  {
    id: 'mobility-fine-older',
    kind: 'win',
    topic: 'weight',
    evidence: 'moderate',
    sources: ['aahaSenior2023', 'yarborough2022'],
    priority: 52,
    when: (c) => c.p.mobility === 'fine' && c.older,
    title: (c) => `Moving well at ${c.v.poss} age`,
    why: (c) =>
      `That is worth protecting rather than taking for granted. Regular, moderate daily exercise and a lean weight are the two things that keep an older dog mobile — and physical activity tracks with sharply lower odds of cognitive decline too. Keep ${c.v.obj} moving.`,
  },
  {
    id: 'mobility-fine-young',
    kind: 'win',
    topic: 'weight',
    evidence: 'moderate',
    sources: ['kealy1997'],
    priority: 36,
    when: (c) => c.p.mobility === 'fine' && !c.older && (bcs(c) === 4 || bcs(c) === 5),
    title: () => 'Sound joints and a lean frame',
    why: () =>
      'The combination that matters most for the joints later on. Lean dogs develop far less hip arthritis over a lifetime than heavier ones, so you are already doing the main thing.',
  },
]
