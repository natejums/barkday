/**
 * A warm, personalised note about one dog.
 *
 * Everything else in this engine is careful and clinical on purpose. This part
 * is deliberately kind. The point of a life-expectancy number is not to start a
 * countdown — it's to help someone make the most of the time they have with an
 * animal they love, and to feel good about the life they're giving it. So this
 * composes a short, personal note: where the dog is in life, how it's doing, and
 * concrete, tender things to do together at this stage.
 *
 * It is generated from the structured result, not written by a language model —
 * so it stays private (nothing leaves the browser), free, offline, and unable to
 * make anything up. Every warm sentence is anchored to a real finding: the life
 * stage, the recommendations, the breed's own health notes.
 */

import type { DogAgeResult, LifeStageId, Sex } from './types'

export interface DogReport {
  /** A few short, warm paragraphs — the note itself. */
  paragraphs: readonly string[]
  /** Concrete, kind things to do together at this stage. */
  togetherIdeas: readonly string[]
}

/**
 * The pronoun/verb set for the dog, so the note reads naturally for a she, a he,
 * or a they. Subjects are almost always the dog's name (always singular), so the
 * only agreement that varies is the handful of `be`/`have`/`verb()` uses.
 */
interface Voice {
  /** Sentence-initial: "Jesse" or "Your dog". */
  Name: string
  /** Mid-sentence: "Jesse" or "your dog". */
  name: string
  subj: string
  obj: string
  poss: string
  /**
   * Conjugate a regular verb for the *pronoun* subject: verb('want') → "wants"
   * for she/he, "want" for they. The dog's name is always a singular subject, so
   * name-led clauses just use "is"/"has" directly and never touch this.
   */
  verb: (base: string) => string
}

function voiceFor(name: string | undefined, sex: Sex | undefined): Voice {
  const display = name?.trim()
  const female = sex === 'female'
  const male = sex === 'male'
  const plural = !female && !male // "they"
  return {
    Name: display || 'Your dog',
    name: display || 'your dog',
    subj: female ? 'she' : male ? 'he' : 'they',
    obj: female ? 'her' : male ? 'him' : 'them',
    poss: female ? 'her' : male ? 'his' : 'their',
    verb: (base) => (plural ? base : `${base}s`),
  }
}

const STAGE_PREDICATE: Readonly<Record<LifeStageId, (v: Voice) => string>> = {
  puppy: () => 'right at the very start of it all',
  'young-adult': (v) => `young, and growing into ${v.poss} prime`,
  'mature-adult': () => 'in the long, steady middle — often the very best stretch of a life',
  senior: () => 'a senior now, in the last quarter or so of a full life',
  geriatric: (v) => `in ${v.poss} final chapter, the time to hold close`,
}

/** Warm rewrites of the recommendations, in the second person. */
function warmImprovement(id: string, title: string, v: Voice): string {
  switch (id) {
    case 'body-condition':
      return `help ${v.obj} reach a lean, healthy weight`
    case 'dental':
      return 'start a daily tooth-brushing habit'
    case 'vet-care':
      return `get ${v.obj} onto a regular check-up schedule`
    case 'activity':
      return `add a little more movement to ${v.poss} days`
    case 'diet':
      return 'switch to measured, consistent meals'
    case 'environment':
      return `bring more of ${v.poss} life indoors with you`
    case 'smoke':
      return 'keep the air at home smoke-free'
    default:
      return title.toLowerCase()
  }
}

const STAGE_CLOSE: Readonly<Record<LifeStageId, (v: Voice) => string>> = {
  puppy: (v) =>
    `This is the age that shapes everything. Get ${v.obj} out into the world while ${v.poss} mind is wide open, play often and keep it gentle, and take far more photos than you think you need — the tiny phase is over in a blink.`,
  'young-adult': (v) =>
    `${v.Name} has energy to spare and a mind that wants a job. This is the time to adventure, to train, and to build the bond that carries the two of you through all the years ahead.`,
  'mature-adult': (v) =>
    `These are the easy, golden years. Keep the adventures coming and ${v.poss} mind busy, and try not to let the ordinary days slip by unnoticed — those turn out to be the ones you miss most.`,
  senior: (v) =>
    `These are the years to slow down together. Take ${v.obj} on slow, sniffy walks, say yes to ${v.poss} favourite things a little more often, and take plenty of pictures. ${v.Name} may begin to slow down — that isn't a failure, it's just time — and the best thing you can give ${v.obj} now is simply you. That is more than enough.`,
  geriatric: (v) =>
    `Lead with comfort now — soft warm beds, easy footing, favourite foods, and you close by. ${v.Name} has given you a whole life; these last stretches are for gentle days and small joys. It may ask something of you, and it's okay to find that hard. Make ${v.poss} days easy and full, and know that just being there is the whole of what ${v.subj} ${v.verb('want')}.`,
}

function stageIdeas(stage: LifeStageId, v: Voice): string[] {
  switch (stage) {
    case 'puppy':
      return [
        `Introduce ${v.obj} to as many friendly people, dogs, sounds and surfaces as you can before 14 weeks — it shapes the whole adult dog`,
        `Play short, gentle training games; they build the bond as much as the manners`,
        `Handle paws, ears and mouth daily, so vet and grooming visits are easy for life`,
        `Take a photo every week — ${v.name} will never be this small again`,
      ]
    case 'young-adult':
      return [
        `Find a shared hobby — hiking, a dog sport, scent games, trick training`,
        `Take ${v.obj} somewhere new regularly; novelty is real enrichment`,
        `Build the recall and manners now that make the next decade easy`,
        `Photograph the adventures — this is ${v.poss} prime`,
      ]
    case 'mature-adult':
      return [
        `Keep a steady rhythm of walks and play, with the occasional new place thrown in`,
        `Teach ${v.obj} a new trick now and then to keep ${v.poss} mind sharp`,
        `Plan a proper adventure — a road trip, a long hike, a day at the water`,
        `Keep taking pictures; the ordinary days are the ones you'll want back`,
      ]
    case 'senior':
      return [
        `Trade fast walks for slow, sniffy ones — let ${v.obj} read the world at ${v.poss} own pace`,
        `Say yes to ${v.poss} favourite things more often than you used to`,
        `Make the home easy — soft beds, traction on slick floors, no big jumps`,
        `Take lots of photos and little videos: ${v.poss} voice, ${v.poss} habits, all of it`,
      ]
    case 'geriatric':
      return [
        `Lead with comfort — warm soft beds, easy footing, favourite foods`,
        `Keep the good routines and the gentle outings ${v.name} still enjoys`,
        `Spend unhurried time together; your presence is the thing ${v.name} wants most`,
        `Capture the small moments now — photos, videos, ${v.poss} funny little habits`,
      ]
  }
}

/** True when the owner has told us anything about day-to-day life. */
function hasLifestyleInfo(result: DogAgeResult): boolean {
  const p = result.profile
  return (
    p.bodyConditionScore !== undefined ||
    p.activityLevel !== undefined ||
    p.dietQuality !== undefined ||
    p.dentalCare !== undefined ||
    p.vetCare !== undefined ||
    p.environment !== undefined ||
    p.secondhandSmoke !== undefined
  )
}

/**
 * Compose the note. Pure and deterministic: the same dog always gets the same
 * words, and nothing here reaches the network.
 */
export function composeDogReport(result: DogAgeResult): DogReport {
  const v = voiceFor(result.profile.name, result.profile.sex)
  const stage = result.lifeStage.stage
  const humanAge = Math.round(result.humanAge.years)

  const paragraphs: string[] = []

  // 1 — where they are in life.
  paragraphs.push(
    `${v.Name} is about ${humanAge} in human years, ${STAGE_PREDICATE[stage](v)}.`,
  )

  // 2 — how they're doing, warmly.
  const improvements = result.recommendations.filter((r) => r.potentialYears > 0).slice(0, 2)
  if (improvements.length > 0) {
    const phrases = improvements.map((r) => warmImprovement(r.id, r.title, v))
    const joined = phrases.length === 2 ? `${phrases[0]}, and ${phrases[1]}` : phrases[0]
    paragraphs.push(
      `${v.Name} is doing well on plenty of fronts. If you want to give ${v.obj} even more good time, the kindest place to start is to ${joined} — small, steady changes that genuinely add up.`,
    )
  } else if (hasLifestyleInfo(result)) {
    paragraphs.push(
      `From everything you've described, ${v.name} is genuinely thriving — keep doing exactly what you're doing.`,
    )
  }

  // 3 — the bonding close.
  paragraphs.push(STAGE_CLOSE[stage](v))

  // Concrete things to do together, stage-based with a couple of tuned touches.
  const ideas = stageIdeas(stage, v)

  const active = result.profile.activityLevel === 'active' || result.profile.activityLevel === 'very-active'
  if ((active || stage === 'puppy' || stage === 'young-adult') && ideas.length < 6) {
    ideas.push(
      `Try a dog park or a group walk — the company is as good for ${v.obj} as the exercise`,
    )
  }

  // The little specific touch, straight from the breed's own health notes.
  const skinOrEars = result.breedHealth?.concerns.some(
    (c) => c.condition?.id === 'atopic-dermatitis' || c.condition?.id === 'otitis',
  )
  if (skinOrEars && ideas.length < 6) {
    ideas.push(
      `Rinse ${v.obj} off after muddy or dusty outings — ${v.name}'s skin and ears stay happier clean`,
    )
  }

  return { paragraphs, togetherIdeas: ideas }
}
