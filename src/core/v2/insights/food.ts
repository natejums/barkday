/**
 * Food: what they eat, how often, and how much of it is treats.
 */

import type { InsightSpec } from '../context'

const deepChested = (c: { cond: ReadonlySet<string> }) => c.cond.has('gdv-bloat')

export const FOOD_INSIGHTS: readonly InsightSpec[] = [
  {
    id: 'food-dry',
    kind: 'note',
    topic: 'food',
    evidence: 'moderate',
    sources: ['wsavaNutrition', 'harvey2015', 'vohc'],
    priority: 45,
    when: (c) => c.p.foodType === 'dry',
    title: (c) => c.pick('food-dry-t', 'Kibble is fine — just not a toothbrush', 'About the kibble'),
    why: () =>
      'Ordinary dry food does little for teeth; the idea that crunching cleans them is mostly marketing. Only specific dental diets with a VOHC seal have evidence behind them, and brushing beats all of them. What matters with kibble is that the bag states it is complete and balanced for the dog’s life stage, and that the portion is measured.',
    how: (c) =>
      `Weigh ${c.v.poss} daily ration once with a kitchen scale and mark the cup; the “scoop” is where most weight creep starts. If you want to compare brands, use the WSAVA’s questions — does the company employ a nutritionist, run feeding trials, and do its own quality control?`,
  },
  {
    id: 'food-wet',
    kind: 'note',
    topic: 'food',
    evidence: 'moderate',
    sources: ['wsavaNutrition', 'merck'],
    priority: 45,
    when: (c) => c.p.foodType === 'wet',
    title: () => 'Wet food, done well',
    why: () =>
      'Wet food is roughly three-quarters water, which makes it far less calorie-dense than kibble — a genuine help for weight control and for a dog that doesn’t drink much. It is no better or worse for teeth than dry food, so dental care has to come from brushing either way.',
    how: (c) =>
      `Check the can says complete and balanced for ${c.v.poss} life stage, not “for intermittent or supplemental feeding”. Refrigerate opened tins and throw out what sits in the bowl for more than a couple of hours.`,
  },
  {
    id: 'food-mixed',
    kind: 'note',
    topic: 'food',
    evidence: 'moderate',
    sources: ['wsavaNutrition'],
    priority: 40,
    when: (c) => c.p.foodType === 'mixed',
    title: () => 'Mixing wet and dry',
    why: () =>
      'A perfectly good way to feed a dog. The one trap is that the two halves get measured against two different ideas of a full meal, and the calories quietly add up.',
    how: (c) =>
      `Work out ${c.v.poss} daily calorie target once (the bag and the can both state calories), then split it — a wet “topper” should replace some kibble, not sit on top of a full bowl of it.`,
  },
  {
    id: 'food-fresh',
    kind: 'note',
    topic: 'food',
    evidence: 'low',
    sources: ['wsavaNutrition'],
    priority: 45,
    when: (c) => c.p.foodType === 'fresh-commercial',
    title: () => 'Fresh-cooked commercial food',
    why: () =>
      'Lightly cooked, refrigerated or frozen diets are nutritionally sound when they are formulated properly, and plenty are. There is no good evidence yet that they beat a quality conventional diet on health or lifespan — the honest position is “fine, if complete”.',
    how: () =>
      'Look for an AAFCO (or FEDIAF) “complete and balanced” statement for the right life stage, and ask whether a board-certified veterinary nutritionist formulates the recipes. Store and handle it like the perishable food it is.',
  },
  {
    id: 'food-home-cooked',
    kind: 'move',
    topic: 'food',
    evidence: 'moderate',
    sources: ['stockman2013', 'wsavaNutrition'],
    priority: 78,
    when: (c) => c.p.foodType === 'home-cooked',
    title: (c) => c.pick('food-home-t', 'Get the home-cooked recipe formulated properly', 'Home cooking needs a nutritionist’s recipe'),
    why: () =>
      'When UC Davis analysed 200 home-prepared dog food recipes from books, websites and vets, only 9 met minimum nutrient standards. The 4 written by board-certified veterinary nutritionists all did; almost everything else was short on at least one essential nutrient, usually several.',
    how: (c) =>
      `Keep cooking if you love it — just have the recipe built or checked by a board-certified veterinary nutritionist (ACVIM Nutrition or ECVCN), including the specific supplement it depends on. Then re-check it yearly, and sooner if ${c.v.name}’s health changes.`,
  },
  {
    id: 'food-raw',
    kind: 'flag',
    topic: 'food',
    evidence: 'moderate',
    sources: ['vanbree2018', 'avmaRaw'],
    priority: (c) => (c.p.children || c.older || c.stage === 'puppy' ? 86 : 76),
    when: (c) => c.p.foodType === 'raw',
    title: () => 'Raw feeding carries a real contamination risk',
    why: (c) =>
      `When 35 commercial raw diets were tested, 23% carried E. coli O157, 20% Salmonella and 54% Listeria monocytogenes — and freezing does not reliably kill them. The risk falls mostly on the people in the house${c.p.children ? ', and especially on children' : ''}, which is why the AVMA and most veterinary bodies advise against it. Claims of better coats or health have not held up in controlled studies.`,
    how: (c) =>
      `If you keep feeding raw: separate boards and bowls, hot-wash everything, hand-washing after every meal, no raw for ${c.v.obj} if anyone at home is pregnant, very young, elderly or immunocompromised, and no face-licking after meals. A gently cooked version of the same recipe loses almost nothing nutritionally and nearly all of the risk.`,
  },
  {
    id: 'food-table',
    kind: 'move',
    topic: 'food',
    evidence: 'moderate',
    sources: ['wsavaNutrition', 'merck', 'stockman2013'],
    priority: 74,
    when: (c) => c.p.foodType === 'table-food',
    title: () => 'Move to a complete diet — the family’s dinner isn’t one',
    why: () =>
      'Human meals are almost never balanced for a dog: typically too much fat and salt, short on calcium and several vitamins, and fatty scraps are the classic trigger for pancreatitis, which is painful and can be fatal. Even carefully built home recipes fail nutrient standards most of the time.',
    how: (c) =>
      `Switch over 7–10 days to a complete commercial food (or a properly formulated home recipe), and keep people-food to under a tenth of ${c.v.poss} calories. Plain cooked chicken, carrot and green beans are fine as the occasional extra; the roast fat and the cheese board are not.`,
  },
  {
    id: 'food-grain-free',
    kind: 'flag',
    topic: 'food',
    evidence: 'moderate',
    sources: ['fdaDcm2019', 'freeman2018'],
    priority: (c) => (c.cond.has('dilated-cardiomyopathy') || c.has('heart') ? 88 : 72),
    when: (c) => c.p.grainFree === 'yes',
    title: (c) =>
      c.cond.has('dilated-cardiomyopathy')
        ? `A grain-free diet in a breed already prone to heart disease`
        : 'The grain-free question is worth taking seriously',
    why: (c) =>
      `Between 2014 and 2019 the FDA logged 524 reports of dilated cardiomyopathy in dogs; 93% were eating foods heavy in peas or lentils and 90% were labelled grain-free. It is a signal, not proof — the mechanism is still unclear — but the cardiologists who first raised it have seen hearts recover after a diet change.${c.cond.has('dilated-cardiomyopathy') ? ` ${c.TheBreed} already carries a documented predisposition to this disease, so the margin for error is smaller.` : ''}`,
    how: (c) =>
      `Unless a vet has diagnosed a true grain allergy (rare), switch to a diet where legumes and potatoes are not among the first ingredients, from a maker that meets the WSAVA criteria. Mention it at the next visit, and if ${c.v.name} tires easily, coughs or breathes fast at rest, ask for a heart check rather than waiting.`,
  },
  {
    id: 'food-grain-unsure',
    kind: 'note',
    topic: 'food',
    evidence: 'moderate',
    sources: ['fdaDcm2019'],
    priority: 50,
    when: (c) => c.p.grainFree === 'not-sure',
    title: () => 'Check the bag for peas, lentils and potatoes',
    why: () =>
      'The diets linked to the FDA’s heart-disease reports share a pattern: legumes or potatoes high in the ingredient list, usually marketed as grain-free. Knowing which side of that line the food sits on is a two-minute job.',
    how: () =>
      'Read the first five ingredients. If peas, lentils, chickpeas or potato appear there, treat the diet as legume-heavy and talk to your vet about an alternative. If grains like rice or oats are there instead, there is nothing to do.',
  },
  {
    id: 'food-grain-inclusive',
    kind: 'win',
    topic: 'food',
    evidence: 'moderate',
    sources: ['fdaDcm2019'],
    priority: 40,
    when: (c) =>
      c.p.grainFree === 'no' && (c.p.foodType === 'dry' || c.p.foodType === 'wet' || c.p.foodType === 'mixed'),
    title: () => 'A conventional, grain-inclusive diet',
    why: () =>
      'That sidesteps the whole diet-linked heart-disease question. Grains are not a problem for dogs; the “ancestral diet” pitch was never backed by evidence.',
  },
  {
    id: 'diet-quality-low',
    kind: 'move',
    topic: 'food',
    evidence: 'moderate',
    sources: ['kealy2002', 'wsavaNutrition'],
    priority: (c) => (c.p.dietQuality === 'poor' ? 76 : 60),
    recId: 'diet',
    when: (c) => c.p.dietQuality === 'poor' || c.p.dietQuality === 'average',
    title: (c) => c.pick('diet-q-t', 'Measured portions of a complete food, every day', 'Tighten up the diet — measured, complete, consistent'),
    why: () =>
      'The lever the Purina lifespan study actually pulled was not an expensive food; it was a complete diet in measured, consistent amounts. The dogs fed that way lived a median 1.8 years longer. What matters is that the food is complete and balanced for the life stage and that the portion is weighed, not that it costs more.',
    how: (c) =>
      `Pick a complete food from a maker that meets the WSAVA criteria, weigh ${c.v.poss} ration once and mark the measure, feed it at the same times each day, and treat from inside that ration rather than on top of it.`,
  },
  {
    id: 'meals-free-fed',
    kind: 'move',
    topic: 'food',
    evidence: 'high',
    sources: ['kealy2002', 'aahaWeight2014'],
    priority: (c) => ((c.p.bodyConditionScore ?? 5) > 5 ? 82 : 70),
    when: (c) => c.p.mealsPerDay === 'free-fed',
    title: (c) => c.pick('meals-free-t', 'Retire the always-full bowl', 'Switch from free-feeding to measured meals'),
    why: () =>
      'Portion control is the single best-evidenced way to add healthy years: in the Purina Life Span Study, Labradors fed 25% less than their free-fed littermates lived a median 1.8 years longer and developed arthritis years later. A bowl that is never empty makes measuring impossible and hides the first signs of a dog going off food.',
    how: (c) =>
      `Weigh ${c.v.poss} daily ration, split it into two meals, and lift whatever isn’t eaten within twenty minutes. Most dogs adjust within a week. A slow-feeder or puzzle bowl makes the smaller meal feel like more.`,
  },
  {
    id: 'meals-once-deep-chested',
    kind: 'move',
    topic: 'food',
    evidence: 'moderate',
    sources: ['raghavan2004', 'glickman2000'],
    priority: 84,
    when: (c) => c.p.mealsPerDay === 'one' && deepChested(c),
    title: () => 'Split the one big meal into two or three',
    why: (c) =>
      `For deep-chested breeds like the ${c.breedName ?? 'one in this mix'}, a single large daily meal is a documented risk factor for bloat (GDV) — a stomach twist that kills within hours — alongside fast eating and a large meal volume. Smaller, more frequent meals lower that risk.`,
    how: (c) =>
      `Same daily amount, two or three sittings, from a slow-feeder if ${c.v.subj} ${c.v.verb('gulp')}. Keep hard exercise an hour either side of eating, and feed from the floor rather than a raised stand.`,
  },
  {
    id: 'meals-once',
    kind: 'note',
    topic: 'food',
    evidence: 'low',
    sources: ['bray2022'],
    priority: 52,
    when: (c) => c.p.mealsPerDay === 'one' && !deepChested(c),
    title: () => 'One meal a day: the evidence is more interesting than you’d think',
    why: () =>
      'In the Dog Aging Project’s survey of over 24,000 dogs, those fed once a day had lower odds of gut, dental, joint, kidney and liver disorders and better cognitive scores. It is a cross-sectional association — nobody has shown that switching causes those benefits — so the honest read is: no reason to change if it suits you both.',
    how: (c) =>
      `Keep the portion measured and watch ${c.v.poss} body condition. If ${c.v.subj} ${c.v.verb('seem')} ravenous or ${c.v.verb('vomit')} bile in the mornings, two smaller meals usually fixes it.`,
  },
  {
    id: 'meals-two',
    kind: 'win',
    topic: 'food',
    evidence: 'moderate',
    sources: ['aahaWeight2014', 'raghavan2004'],
    priority: 44,
    when: (c) => c.p.mealsPerDay === 'two',
    title: () => 'Two measured meals a day',
    why: (c) =>
      `The sensible default for most adult dogs${deepChested(c) ? ', and the right call for a bloat-prone breed, where one large meal raises the risk' : ''}. It keeps portions honest and makes an off day obvious the moment a meal is refused.`,
  },
  {
    id: 'meals-three-plus',
    kind: 'note',
    topic: 'food',
    evidence: 'moderate',
    sources: ['aahaWeight2014', 'raghavan2004'],
    priority: 42,
    when: (c) => c.p.mealsPerDay === 'three-plus',
    title: () => 'Several small meals',
    why: (c) =>
      c.stage === 'puppy'
        ? 'Exactly right for a puppy, whose small stomach and fast metabolism need three or four meals until around six months.'
        : deepChested(c)
          ? 'A good pattern for a deep-chested breed: smaller meals mean a smaller, lighter stomach, and that lowers bloat risk.'
          : 'Fine, as long as the day’s total is measured once and then divided. Three “small” meals that are each eyeballed tend to add up to more than two measured ones.',
  },
  {
    id: 'treats-a-lot',
    kind: 'move',
    topic: 'food',
    evidence: 'moderate',
    sources: ['wsavaNutrition', 'apop2022', 'salt2019'],
    priority: (c) => ((c.p.bodyConditionScore ?? 5) > 5 ? 82 : 70),
    when: (c) => c.p.treatShare === 'a-lot',
    title: (c) => c.pick('treats-t', 'Bring treats under the 10% line', 'Count the treats — they add up faster than meals'),
    why: () =>
      'Treats and table scraps are where most canine weight gain actually comes from, and nearly six in ten dogs are now overweight. The WSAVA’s rule of thumb is that treats should be no more than 10% of daily calories; a single dental chew can be a tenth of a small dog’s day on its own.',
    how: (c) =>
      `Set aside part of ${c.v.poss} measured daily ration to use as treats, and swap the rest for things that barely register — carrot, green beans, a piece of apple, a single kibble delivered with enthusiasm. Dogs care far more about the ritual than the calorie.`,
  },
  {
    id: 'treats-some',
    kind: 'note',
    topic: 'food',
    evidence: 'moderate',
    sources: ['wsavaNutrition'],
    priority: 40,
    when: (c) => c.p.treatShare === 'some',
    title: () => 'Treats in moderation',
    why: () =>
      'A reasonable amount. The guideline is under 10% of daily calories, and the easy way to stay there is to treat from the day’s own ration rather than on top of it.',
  },
  {
    id: 'treats-rarely',
    kind: 'win',
    topic: 'food',
    evidence: 'moderate',
    sources: ['wsavaNutrition'],
    priority: 46,
    when: (c) => c.p.treatShare === 'rarely',
    title: () => 'Treats kept to a minimum',
    why: () =>
      'That removes the most common source of hidden calories in a dog’s day. If you want to use treats for training, pull them from the measured ration and they stay free.',
  },
  {
    id: 'raised-bowls-big',
    kind: 'move',
    topic: 'food',
    evidence: 'low',
    sources: ['glickman2000', 'pipan2012'],
    priority: (c) => (deepChested(c) ? 68 : 55),
    when: (c) => c.p.raisedBowls === true && c.big,
    title: () => 'Feed from the floor, not a raised stand',
    why: () =>
      'Raised bowls were sold for years as a bloat preventive. The largest study to test that found the opposite — raised feeding was associated with a higher risk of GDV in large and giant breeds — and a later survey found no effect either way. No study has ever shown a benefit.',
    how: (c) =>
      `Unless a vet has prescribed elevated feeding for a specific condition (megaoesophagus, a neck problem), put ${c.v.poss} bowls on the floor. A non-slip mat under them solves the sliding.`,
  },
  {
    id: 'raised-bowls-small',
    kind: 'note',
    topic: 'food',
    evidence: 'low',
    sources: ['glickman2000'],
    priority: 32,
    when: (c) => c.p.raisedBowls === true && !c.big,
    title: () => 'Raised bowls for a smaller dog',
    why: () =>
      'The bloat concern about raised feeders applies to large, deep-chested dogs; for a smaller dog there is no evidence either way, so this is purely a comfort choice.',
  },
  {
    id: 'puppy-large-breed-food',
    kind: 'move',
    topic: 'food',
    evidence: 'moderate',
    sources: ['merck', 'kealy1997', 'wsavaNutrition'],
    priority: 72,
    when: (c) => c.stage === 'puppy' && c.big,
    title: () => 'Use a large-breed puppy formula, and don’t let them grow fast',
    why: (c) =>
      `Big puppies that grow too fast or get too much calcium are more likely to develop hip and elbow dysplasia and other growth disorders. Large-breed puppy foods control energy and calcium for exactly this reason, and lean puppies develop markedly less hip arthritis than well-fed littermates${c.breedName ? ` — which matters for a ${c.breedName}` : ''}.`,
    how: (c) =>
      `Feed a food labelled for large-breed growth until about 12–18 months, measured, in three meals until six months and two after. Keep ${c.v.obj} lean throughout: ribs easy to feel, visible waist. No calcium supplements.`,
  },
  {
    id: 'senior-food',
    kind: 'note',
    topic: 'food',
    evidence: 'moderate',
    sources: ['aahaLifeStage2019', 'aahaSenior2023'],
    priority: 44,
    when: (c) => c.older && c.p.foodType !== undefined,
    title: () => 'No automatic switch to a “senior” food',
    why: () =>
      'There is no legal definition of a senior diet, and the guidelines say not to switch by default. Older dogs generally need *more* good-quality protein, not less, unless they have kidney disease — and then the diet is a specific therapeutic one, not a supermarket label.',
    how: (c) =>
      `Adjust for ${c.v.poss} actual body condition and any diagnosis, not the number on the calendar. If ${c.v.subj} ${c.v.verb('start')} losing muscle over the back and hips, raise protein and ask the vet about why.`,
  },
]
