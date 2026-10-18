/**
 * The opening note of a 2.0 report: who this dog is, where they came from,
 * how they live, and what matters most — in three or four short paragraphs,
 * worded differently for every dog.
 */

import type { InsightContext } from './context'
import type { ExerciseType, FoodType, MealsPerDay, ReportInsight } from './types'

const FOOD_PHRASE: Readonly<Record<FoodType, string>> = {
  dry: 'kibble',
  wet: 'wet food',
  mixed: 'a mix of wet and dry food',
  'fresh-commercial': 'a fresh-cooked commercial diet',
  'home-cooked': 'home-cooked meals',
  raw: 'a raw diet',
  'table-food': 'mostly what the family eats',
}

const MEALS_PHRASE: Readonly<Record<MealsPerDay, string>> = {
  'free-fed': 'from a bowl that is always full',
  one: 'in one meal a day',
  two: 'in two meals a day',
  'three-plus': 'in three or more small meals',
}

const EXERCISE_PHRASE: Readonly<Record<ExerciseType, string>> = {
  'leash-walks': 'walks on the lead',
  'off-leash': 'off-lead runs',
  fetch: 'games of fetch',
  swimming: 'swimming',
  'dog-sports': 'dog sports',
  hiking: 'hikes',
}

function joinList(items: readonly string[]): string {
  if (items.length <= 1) return items[0] ?? ''
  return `${items.slice(0, -1).join(', ')} and ${items[items.length - 1]}`
}

/**
 * Make a move's title sit inside a sentence: drop trailing punctuation and
 * lower-case the opening word unless it is a name or an acronym ("Get Jesse to
 * a lean weight" → "get Jesse to a lean weight"; "Jesse is avoiding stairs" and
 * "MDR1" stay as they are).
 */
function tidyTitle(title: string, name: string): string {
  const trimmed = title.replace(/[.!]+$/, '')
  if (trimmed.startsWith(name) || /^[A-Z]{2}/.test(trimmed)) return trimmed
  return trimmed.charAt(0).toLowerCase() + trimmed.slice(1)
}

function stagePhrase(c: InsightContext): string {
  const v = c.v
  switch (c.stage) {
    case 'puppy':
      return c.pick('story-stage', 'right at the very beginning of it all', 'a puppy, with everything still ahead', 'at the start of the whole story')
    case 'young-adult':
      return c.pick('story-stage', `young, and growing into ${v.poss} prime`, 'a young adult with energy to spare', `in ${v.poss} first strong years`)
    case 'mature-adult':
      return c.pick('story-stage', 'in the long, steady middle — often the best stretch of a life', 'squarely in the prime of life', 'in the good middle years, where habits pay off')
    case 'senior':
      return c.pick('story-stage', 'a senior now, in the last quarter or so of a full life', `well into ${v.poss} senior years`, 'a senior, and a well-loved one')
    case 'geriatric':
      return c.pick('story-stage', `in ${v.poss} final chapter, the time to hold close`, 'in the gentle last stretch of a long life', `at the far end of a long road, with you beside ${v.obj}`)
  }
}

function lifespanSentence(c: InsightContext): string {
  const v = c.v
  const expected = c.r.lifespan.expectedYears
  const breed = c.r.breed
  if (!breed) {
    return c.pick(
      'story-nobreed',
      `Without a breed to go on, ${v.poss} size puts ${v.poss} expected span at about ${expected} years — adding a breed, a mix or a DNA result would sharpen everything here.`,
      `Going on size alone, ${v.poss} expected span works out to about ${expected} years; a breed or DNA result would make the rest of this far more specific.`,
    )
  }
  const [lo, hi] = breed.lifespanYears
  const mid = (lo + hi) / 2
  const cmp =
    expected > mid + 0.3
      ? c.pick('story-cmp-up', 'a little above the breed norm', 'ahead of the breed average')
      : expected < mid - 0.3
        ? c.pick('story-cmp-down', 'a little below it, which the moves below are about', 'under the breed average — the moves below are about closing that gap')
        : c.pick('story-cmp-even', 'right on the breed norm', 'about where the breed average sits')
  if (breed.name.includes('%')) {
    return `${v.Poss} mix — ${breed.name} — blends to a typical span of ${lo}–${hi} years, and ${v.poss} own profile works out to about ${expected}: ${cmp}.`
  }
  return c.pick(
    'story-breed',
    `As a ${breed.name}, ${v.subj} ${v.verb('come')} from a line that typically lives ${lo}–${hi} years; everything you have told us puts ${v.poss} own expected span at about ${expected}, ${cmp}.`,
    `A ${breed.name}'s typical span is ${lo}–${hi} years, and ${v.poss} profile works out to around ${expected} — ${cmp}.`,
    `The ${breed.name} typically lives ${lo}–${hi} years. With everything you have described, ${v.poss} own expected span comes out at about ${expected}, ${cmp}.`,
  )
}

function storyParagraph(c: InsightContext): string | null {
  const { p, v } = c
  const parts: string[] = []

  const origin: Partial<Record<NonNullable<typeof p.origin>, string>> = {
    breeder: 'came home from a breeder',
    'shelter-rescue': 'came to you through a shelter or rescue',
    rehomed: 'was rehomed to you from another family',
    'born-at-home': 'was born under your roof',
    'found-stray': `found ${v.poss} own way to you as a stray`,
    other: 'came to you',
  }
  const joined: Record<NonNullable<typeof p.joinedAt>, string> = {
    'under-6-months': 'as a young puppy',
    '6-12-months': 'as an older puppy',
    adult: 'as an adult',
    senior: 'already a senior',
  }

  if (p.origin && origin[p.origin]) {
    parts.push(`${v.Name} ${origin[p.origin]}${p.joinedAt ? ` ${joined[p.joinedAt]}` : ''}.`)
  } else if (p.joinedAt) {
    parts.push(`${v.Name} joined you ${joined[p.joinedAt]}.`)
  }

  if (p.yearsTogether !== undefined) {
    const n = Math.floor(p.yearsTogether)
    if (n >= 1) {
      parts.push(
        c.pick(
          'story-years',
          `That makes ${n} ${n === 1 ? 'year' : 'years'} together so far.`,
          `${n} ${n === 1 ? 'year' : 'years'} of shared history, and counting.`,
          `You have had ${n} ${n === 1 ? 'year' : 'years'} together — more than any number in this report can measure.`,
        ),
      )
    } else {
      parts.push(c.pick('story-early', 'Early days still — you are both still learning each other.', 'It is early days; the two of you are still working each other out.'))
    }
  }

  const unknownHistory =
    (p.origin === 'shelter-rescue' || p.origin === 'found-stray' || p.origin === 'rehomed') &&
    (p.joinedAt === 'adult' || p.joinedAt === 'senior')
  if (unknownHistory) {
    const before =
      p.yearsTogether !== undefined && c.ageYears - p.yearsTogether >= 1
        ? `first ${Math.round(c.ageYears - p.yearsTogether)} years`
        : 'early years'
    parts.push(
      c.pick(
        'story-unknown',
        `The ${before} are a story you know only in part — nothing to worry about, just a reason the first check-ups count double.`,
        `${v.Poss} ${before} happened before you, which is no problem at all; it just means a baseline exam does more work than usual.`,
      ),
    )
  }

  return parts.length > 0 ? parts.join(' ') : null
}

function lifeParagraph(c: InsightContext): string | null {
  const { p, v } = c
  const sentences: string[] = []

  if (p.foodType) {
    sentences.push(
      `${v.Subj} ${v.verb('eat')} ${FOOD_PHRASE[p.foodType]}${p.mealsPerDay ? `, ${MEALS_PHRASE[p.mealsPerDay]}` : ''}.`,
    )
  } else if (p.mealsPerDay) {
    sentences.push(`${v.Name} is fed ${MEALS_PHRASE[p.mealsPerDay]}.`)
  }

  const activity: Record<NonNullable<typeof p.activityLevel>, string> = {
    sedentary: `${v.verb('get')} very little exercise`,
    'lightly-active': `${v.verb('get')} light exercise`,
    active: `${v.verb('get')} a good amount of exercise`,
    'very-active': `${v.verb('get')} a lot of exercise`,
  }
  const types = (p.exerciseTypes ?? []).map((t) => EXERCISE_PHRASE[t])
  if (p.activityLevel) {
    sentences.push(
      `${v.Subj} ${activity[p.activityLevel]}${types.length > 0 ? `, mostly ${joinList(types)}` : ''}.`,
    )
  } else if (types.length > 0) {
    sentences.push(`${v.Poss} exercise is mostly ${joinList(types)}.`)
  }

  const company: string[] = []
  if (p.otherDogs === true) company.push('another dog')
  if (p.children === true) company.push('children')
  if (company.length > 0) {
    sentences.push(
      `${v.Subj} ${v.verb('share')} the house with ${joinList(company)}${p.timeAlone === 'over-8h' ? ', and still spends long days alone' : p.timeAlone === 'under-4h' ? ', and is rarely alone for long' : ''}.`,
    )
  } else if (p.timeAlone) {
    const alone: Record<NonNullable<typeof p.timeAlone>, string> = {
      'under-4h': `${v.Subj} ${c.be} rarely alone for long.`,
      '4-8h': `${v.Subj} ${v.verb('spend')} a normal working day alone.`,
      'over-8h': `${v.Subj} ${v.verb('spend')} long days alone.`,
    }
    sentences.push(alone[p.timeAlone])
  }

  return sentences.length > 0 ? sentences.join(' ') : null
}

function stageClose(c: InsightContext): string {
  const v = c.v
  switch (c.stage) {
    case 'puppy':
      return c.pick(
        'story-close',
        `This is the age that shapes everything. Get ${v.obj} out into the world while ${v.poss} mind is wide open, keep it gentle and playful, and take far more photos than you think you need — the tiny phase is over in a blink.`,
        `Everything you do in these months compounds. Show ${v.obj} the world kindly, handle ${v.obj} everywhere, play often, and photograph all of it; ${v.subj} will never be this small again.`,
        `Puppyhood is short and it sets the dog. Socialise deliberately, train in small playful bursts, protect the growing joints, and enjoy it — this part goes fast.`,
      )
    case 'young-adult':
      return c.pick(
        'story-close',
        `${v.Name} has energy to spare and a mind that wants a job. This is the time to adventure, to train, and to build the bond that carries the two of you through all the years ahead.`,
        `These are the years for adventure. Give ${v.obj} places to go and problems to solve, lock in the habits — weight, teeth, recall — and the next decade mostly takes care of itself.`,
        `A young adult dog is a joy and a responsibility in equal measure: the habits set now hold for life. Train, explore, and keep ${v.obj} lean.`,
      )
    case 'mature-adult':
      return c.pick(
        'story-close',
        `These are the easy, golden years. Keep the adventures coming and ${v.poss} mind busy, and try not to let the ordinary days slip by unnoticed — those turn out to be the ones you miss most.`,
        `The middle years are when the senior years are decided: weight held, teeth kept, bloodwork baselined. Do that quietly in the background and spend the rest of the time enjoying ${v.obj}.`,
        `This is the long, good middle. Keep ${v.obj} moving and curious, watch the waistline, and take the pictures — the ordinary afternoons are the ones you will want back.`,
      )
    case 'senior':
      return c.pick(
        'story-close',
        `These are the years to slow down together. Take ${v.obj} on slow, sniffy walks, say yes to ${v.poss} favourite things a little more often, and take plenty of pictures. ${v.Name} may begin to slow down — that isn't a failure, it's just time — and the best thing you can give ${v.obj} now is simply you.`,
        `Senior years are about comfort and attention: six-monthly check-ups, pain taken seriously, the home made easy, and more of whatever ${v.subj} ${v.verb('love')}. Slow walks count double now. So do photographs.`,
        `${v.Name} has earned an easy life, and this is when you give it: gentler exercise, more vet attention, a softer bed, and your time. Slowing down is not a problem to fix; it is a season to share.`,
      )
    case 'geriatric':
      return c.pick(
        'story-close',
        `Lead with comfort now — soft warm beds, easy footing, favourite foods, and you close by. ${v.Name} has given you a whole life; these last stretches are for gentle days and small joys. It may ask something of you, and it's okay to find that hard. Make ${v.poss} days easy and full, and know that just being there is the whole of what ${v.subj} ${v.verb('want')}.`,
        `The job now is simple and not easy: keep ${v.obj} comfortable, keep ${v.obj} close, and notice the good days. ${v.Name} does not need more from you than your presence and your attention to ${v.poss} comfort. That is everything.`,
        `This is the chapter for small kindnesses — warmth, soft ground, favourite smells, unhurried time. Watch the good days against the hard ones, talk to your vet early about what comes next, and let ${v.obj} feel you there. It is more than enough.`,
      )
  }
}

export function composeStory(
  c: InsightContext,
  moves: readonly ReportInsight[],
  wins: readonly ReportInsight[],
): string[] {
  const v = c.v
  const paragraphs: string[] = []
  const humanAge = Math.round(c.r.humanAge.years)

  paragraphs.push(`${v.Name} is about ${humanAge} in human years — ${stagePhrase(c)}. ${lifespanSentence(c)}`)

  const story = storyParagraph(c)
  if (story) paragraphs.push(story)

  const life = lifeParagraph(c)
  if (life) paragraphs.push(life)

  if (moves.length > 0) {
    const top = moves.slice(0, 2).map((m) => tidyTitle(m.title, v.Name))
    const lead =
      moves.length === 1
        ? c.pick('story-heart-1', 'Here is the one thing that would do the most:', `If you do one thing for ${v.name} this season:`)
        : c.pick('story-heart', 'Here is the heart of it:', `If you only act on two things for ${v.name} this season:`, 'The two moves that would do the most:')
    paragraphs.push(`${lead} ${top.join('; and ')}. ${stageClose(c)}`)
  } else if (wins.length >= 3) {
    paragraphs.push(
      `${c.pick('story-thriving', `From everything you have described, ${v.name} is genuinely thriving — keep doing exactly what you are doing.`, `By every measure you have given, ${v.name} is doing beautifully. Nothing to fix; plenty to enjoy.`)} ${stageClose(c)}`,
    )
  } else {
    paragraphs.push(`${c.pick('story-more', 'Every answer on the left changes something below — fill in more and this note gets more specific.', 'This note sharpens with every answer you add on the left.')} ${stageClose(c)}`)
  }

  return paragraphs
}
