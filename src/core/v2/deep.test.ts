import { describe, expect, it } from 'vitest'
import { calculateDogAge } from '../calculate'
import { BREEDS } from '../breeds'
import type { DogProfile } from '../types'
import { calculateDeep, composeDeepReport, DEEP_QUESTION_TOTAL } from './compose'
import { buildContext, profileSignature } from './context'
import { INSIGHT_LIBRARY } from './insights'
import { SOURCES, SOURCE_IDS } from './sources'
import type { DeepProfile } from './types'

const FULL: DeepProfile = {
  name: 'Jesse',
  ageYears: 7,
  sex: 'female',
  breedName: 'Labrador Retriever',
  weightKg: 34,
  neuterStatus: 'neutered',
  neuterAgeMonths: 18,
  bodyConditionScore: 6,
  activityLevel: 'lightly-active',
  dietQuality: 'average',
  dentalCare: 'occasional',
  vetCare: 'annual',
  environment: 'indoor',
  secondhandSmoke: false,
  anxiety: 'some',
  origin: 'shelter-rescue',
  joinedAt: 'adult',
  yearsTogether: 4,
  daysUntilBirthday: 40,
  foodType: 'dry',
  grainFree: 'yes',
  mealsPerDay: 'one',
  treatShare: 'a-lot',
  waterSource: 'bowl-topped-up',
  raisedBowls: true,
  exerciseTypes: ['leash-walks', 'fetch', 'swimming'],
  enrichment: 'rarely',
  sleep: 'sound',
  timeAlone: '4-8h',
  otherDogs: false,
  children: true,
  training: 'mixed',
  vaccination: 'up-to-date',
  parasitePrevention: 'seasonal',
  microchip: 'chipped-unsure',
  knownConditions: ['allergies'],
  recentSigns: ['scratching'],
  weightTrend: 'gaining',
  mobility: 'stiff-after-rest',
  climate: 'hot',
  lawnChemicals: true,
  carTravel: 'loose',
  supplements: ['joint'],
  readiness: 'neither',
  knowsEmergencyVet: false,
}

/** A small deterministic generator, so the fuzz is reproducible. */
function rng(seed: number) {
  // Scramble the seed and discard the first outputs: a raw LCG's first draw is
  // almost linear in a small seed, which quietly made every fuzzed dog a purebred.
  let s = Math.imul(seed ^ 0x9e3779b9, 2654435761) >>> 0
  const next = () => {
    s = (Math.imul(s, 1664525) + 1013904223) >>> 0
    return s / 2 ** 32
  }
  next()
  next()
  return next
}
function pickOne<T>(r: () => number, items: readonly T[]): T {
  return items[Math.floor(r() * items.length)] as T
}
function maybe<T>(r: () => number, items: readonly T[], p = 0.7): T | undefined {
  return r() < p ? pickOne(r, items) : undefined
}

function randomProfile(seed: number): DeepProfile {
  const r = rng(seed)
  const breed = r() < 0.85 ? pickOne(r, BREEDS).name : undefined
  const ageYears = Math.round(r() * 160) / 10
  const p = {
    ageYears,
    name: pickOne(r, ['Rufus', 'Jesse', 'Max', 'Willow', 'Pip', 'Rosie', 'Duke', undefined]),
    ...(breed ? { breedName: breed } : {}),
    sex: maybe(r, ['male', 'female'] as const),
    neuterStatus: maybe(r, ['neutered', 'intact'] as const),
    bodyConditionScore: r() < 0.7 ? 1 + Math.floor(r() * 9) : undefined,
    activityLevel: maybe(r, ['sedentary', 'lightly-active', 'active', 'very-active'] as const),
    dietQuality: maybe(r, ['poor', 'average', 'good', 'excellent'] as const),
    dentalCare: maybe(r, ['none', 'occasional', 'regular', 'professional'] as const),
    vetCare: maybe(r, ['none', 'reactive', 'annual', 'proactive'] as const),
    environment: maybe(r, ['indoor', 'mixed', 'outdoor'] as const),
    secondhandSmoke: r() < 0.5 ? r() < 0.2 : undefined,
    anxiety: maybe(r, ['none', 'some', 'a-lot'] as const),
    origin: maybe(r, ['breeder', 'shelter-rescue', 'rehomed', 'born-at-home', 'found-stray', 'other'] as const),
    joinedAt: maybe(r, ['under-6-months', '6-12-months', 'adult', 'senior'] as const),
    yearsTogether: r() < 0.5 ? Math.round(r() * ageYears * 10) / 10 : undefined,
    foodType: maybe(r, ['dry', 'wet', 'mixed', 'fresh-commercial', 'home-cooked', 'raw', 'table-food'] as const),
    grainFree: maybe(r, ['yes', 'no', 'not-sure'] as const),
    mealsPerDay: maybe(r, ['free-fed', 'one', 'two', 'three-plus'] as const),
    treatShare: maybe(r, ['rarely', 'some', 'a-lot'] as const),
    waterSource: maybe(r, ['bowl-refreshed-daily', 'bowl-topped-up', 'fountain', 'outdoor-sources'] as const),
    raisedBowls: r() < 0.5 ? r() < 0.3 : undefined,
    exerciseTypes:
      r() < 0.6
        ? (['leash-walks', 'off-leash', 'fetch', 'swimming', 'dog-sports', 'hiking'] as const).filter(() => r() < 0.4)
        : undefined,
    enrichment: maybe(r, ['rarely', 'sometimes', 'daily'] as const),
    sleep: maybe(r, ['sound', 'restless', 'not-sure'] as const),
    timeAlone: maybe(r, ['under-4h', '4-8h', 'over-8h'] as const),
    otherDogs: r() < 0.6 ? r() < 0.5 : undefined,
    children: r() < 0.6 ? r() < 0.4 : undefined,
    training: maybe(r, ['reward-based', 'mixed', 'correction-based', 'none'] as const),
    vaccination: maybe(r, ['up-to-date', 'overdue', 'not-sure'] as const),
    parasitePrevention: maybe(r, ['year-round', 'seasonal', 'none', 'not-sure'] as const),
    microchip: maybe(r, ['registered', 'chipped-unsure', 'none', 'not-sure'] as const),
    knownConditions:
      r() < 0.5
        ? (['arthritis', 'heart', 'allergies', 'dental', 'overweight', 'diabetes', 'epilepsy', 'thyroid', 'kidney', 'cancer', 'anxiety', 'digestive', 'eyes', 'back', 'other'] as const).filter(() => r() < 0.15)
        : undefined,
    recentSigns:
      r() < 0.5
        ? (['drinking-more', 'new-lump', 'night-restless', 'coughing', 'accidents', 'stiffness', 'weight-change', 'bad-breath', 'appetite-change', 'confusion', 'scratching', 'tiring'] as const).filter(() => r() < 0.15)
        : undefined,
    weightTrend: maybe(r, ['gaining', 'stable', 'losing', 'not-sure'] as const),
    mobility: maybe(r, ['fine', 'stiff-after-rest', 'avoids-stairs', 'limping'] as const),
    climate: maybe(r, ['hot', 'cold', 'temperate', 'both'] as const),
    lawnChemicals: r() < 0.5 ? r() < 0.4 : undefined,
    carTravel: maybe(r, ['restrained', 'loose', 'rarely'] as const),
    supplements: r() < 0.5 ? (['omega-3', 'joint', 'probiotic', 'multivitamin', 'other'] as const).filter(() => r() < 0.3) : undefined,
    readiness: maybe(r, ['insured', 'savings', 'both', 'neither'] as const),
    knowsEmergencyVet: r() < 0.6 ? r() < 0.5 : undefined,
  }
  // exactOptionalPropertyTypes: strip the undefineds the generator leaves behind.
  return Object.fromEntries(Object.entries(p).filter(([, v]) => v !== undefined)) as unknown as DeepProfile
}

describe('the insight library', () => {
  it('is large', () => {
    expect(INSIGHT_LIBRARY.length).toBeGreaterThanOrEqual(150)
  })

  it('has unique ids', () => {
    const ids = INSIGHT_LIBRARY.map((i) => i.id)
    expect(new Set(ids).size).toBe(ids.length)
  })

  it('cites at least one real source per insight, and every source cited exists', () => {
    const known = new Set<string>(SOURCE_IDS)
    for (const insight of INSIGHT_LIBRARY) {
      expect(insight.sources.length, insight.id).toBeGreaterThan(0)
      for (const id of insight.sources) expect(known.has(id), `${insight.id} cites ${id}`).toBe(true)
    }
  })

  it('has a full citation for every source, and only verified URLs', () => {
    for (const id of SOURCE_IDS) {
      const entry = SOURCES[id]
      expect(entry.citation.length, id).toBeGreaterThan(40)
      expect(entry.short.length, id).toBeGreaterThanOrEqual(3)
      if ('url' in entry && entry.url) expect(entry.url, id).toMatch(/^https:\/\//)
    }
  })

  it('every insight is reachable by some profile', () => {
    const seen = new Set<string>()
    for (let seed = 1; seed <= 600; seed += 1) {
      const profile = randomProfile(seed)
      const c = buildContext(profile, calculateDogAge(profile))
      for (const spec of INSIGHT_LIBRARY) if (spec.when(c)) seen.add(spec.id)
    }
    // A handful depend on specific breed conditions (deafness, MDR1) that the random
    // breed draw may miss; check them directly.
    for (const [breed, age] of [
      ['Dalmatian', 0.3],
      ['Collie (Rough)', 3],
      ['Great Dane', 4],
      ['Cavalier King Charles Spaniel', 8],
      ['Dachshund', 5],
      ['Pug', 4],
      ['Doberman Pinscher', 4],
      ['Border Collie', 2],
    ] as const) {
      const profile: DeepProfile = { ageYears: age, breedName: breed, sleep: 'restless', mobility: 'limping', foodType: 'raw', grainFree: 'yes', mealsPerDay: 'one', exerciseTypes: ['swimming', 'fetch'], origin: 'breeder', joinedAt: 'under-6-months' }
      const c = buildContext(profile, calculateDogAge(profile))
      for (const spec of INSIGHT_LIBRARY) if (spec.when(c)) seen.add(spec.id)
    }
    const unreachable = INSIGHT_LIBRARY.map((i) => i.id).filter((id) => !seen.has(id))
    expect(unreachable).toEqual([])
  })

  it('renders every fired insight with a non-empty title and why, and no brands or links', () => {
    for (let seed = 1; seed <= 300; seed += 1) {
      const { report } = calculateDeep(randomProfile(seed))
      const all = [...report.moves, ...report.wins, ...report.flags, ...report.vetQuestions, ...report.topics.flatMap((t) => t.insights)]
      for (const i of all) {
        expect(i.title.trim().length, i.id).toBeGreaterThan(8)
        expect(i.why.trim().length, i.id).toBeGreaterThan(40)
        expect(`${i.title} ${i.why} ${i.how ?? ''}`, i.id).not.toMatch(/https?:\/\//)
        expect(`${i.title} ${i.why} ${i.how ?? ''}`, i.id).not.toMatch(/\bundefined\b|\[object Object\]|\$\{/)
        if (i.kind === 'move') expect(i.how, i.id).toBeTruthy()
      }
      for (const paragraph of report.story) {
        expect(paragraph).not.toMatch(/\bundefined\b|\$\{|NaN/)
      }
    }
  })

  it('never conjugates a pronoun verb wrongly', () => {
    for (const sex of ['male', 'female', undefined] as const) {
      const { report } = calculateDeep({ ...FULL, ...(sex ? { sex } : {}), name: 'Sam' })
      const text = [
        ...report.story,
        ...report.moves.flatMap((m) => [m.title, m.why, m.how ?? '']),
        ...report.flags.flatMap((m) => [m.title, m.why, m.how ?? '']),
        ...report.topics.flatMap((t) => t.insights.flatMap((m) => [m.title, m.why, m.how ?? ''])),
      ].join(' ')
      expect(text).not.toMatch(/\b(haves|dos|carrys|scratchs|they wants|they needs|they eats|they gets|she eat\b|he eat\b|she have\b|he have\b)\b/)
    }
  })
})

describe('composeDeepReport', () => {
  it('produces every section for a fully answered dog', () => {
    const { report, base } = calculateDeep(FULL)
    expect(report.story.length).toBeGreaterThanOrEqual(3)
    expect(report.moves.length).toBe(6)
    expect(report.wins.length).toBeGreaterThan(0)
    expect(report.flags.length).toBeGreaterThan(0)
    expect(report.calendar.length).toBeGreaterThan(5)
    expect(report.vetQuestions.length).toBeGreaterThan(0)
    expect(report.topics.length).toBeGreaterThan(3)
    expect(report.sources.length).toBeGreaterThan(10)
    expect(report.gear.length).toBeGreaterThan(base.productSuggestions.length - 1)
    expect(report.completeness.total).toBe(DEEP_QUESTION_TOTAL)
    expect(report.completeness.answered).toBe(DEEP_QUESTION_TOTAL)
    expect(report.signature).toMatch(/^[0-9A-F]{8}$/)
  })

  it('ranks the priced lifespan moves by the years they give back', () => {
    const { report } = calculateDeep(FULL)
    const priced = report.moves.filter((m) => m.potentialYears !== undefined)
    expect(priced.length).toBeGreaterThan(0)
    for (const move of priced) expect(move.potentialYears).toBeGreaterThan(0)
    // Body condition is the biggest lever for an overweight dog, and it leads.
    expect(report.moves[0]?.id).toBe('weight-over')
  })

  it('puts emergencies first among the flags', () => {
    const { report } = calculateDeep({ ageYears: 5, breedName: 'Great Dane', recentSigns: ['scratching'], foodType: 'raw' })
    expect(report.flags[0]?.id).toBe('breed-bloat')
  })

  it('says nothing about care it was not told about', () => {
    const { report } = calculateDeep({ ageYears: 3 })
    // Age alone earns stage-based advice (a lump check in middle age) and nothing else.
    for (const move of report.moves) expect(move.topic).toBe('stage')
    expect(report.wins).toEqual([])
    expect(report.flags).toEqual([])
    expect(report.completeness.answered).toBe(0)
    expect(report.story.length).toBeGreaterThanOrEqual(2)
  })

  it('is deterministic — the same dog gets the same report', () => {
    expect(calculateDeep(FULL)).toEqual(calculateDeep({ ...FULL }))
    for (let seed = 1; seed <= 25; seed += 1) {
      const p = randomProfile(seed)
      expect(composeDeepReport(p, calculateDogAge(p))).toEqual(composeDeepReport(p, calculateDogAge(p)))
    }
  })

  it('does not reshuffle the rest of the report when one answer changes', () => {
    const a = calculateDeep(FULL).report
    const b = calculateDeep({ ...FULL, carTravel: 'restrained' }).report
    // Same opening paragraph, same phrasing of unrelated moves.
    expect(b.story[0]).toBe(a.story[0])
    const aById = new Map(a.moves.map((m) => [m.id, m.title]))
    for (const move of b.moves) {
      const before = aById.get(move.id)
      if (before) expect(move.title).toBe(before)
    }
  })

  it('reads as unique — hundreds of dogs, hundreds of different openings', () => {
    const openings = new Set<string>()
    const movesets = new Set<string>()
    for (let seed = 1; seed <= 400; seed += 1) {
      const { report } = calculateDeep(randomProfile(seed))
      openings.add(report.story.join('\n'))
      movesets.add(report.moves.map((m) => m.id).join(','))
    }
    expect(openings.size).toBeGreaterThan(380)
    expect(movesets.size).toBeGreaterThan(300)
  })

  it('addresses the dog by name with the right pronouns', () => {
    const she = calculateDeep({ ...FULL, name: 'Jesse', sex: 'female' }).report
    const text = [...she.story, ...she.moves.map((m) => `${m.title} ${m.why} ${m.how ?? ''}`)].join(' ')
    expect(text).toMatch(/\bJesse\b/)
    expect(text).toMatch(/\bher\b/)
    expect(text).not.toMatch(/\bhim\b|\bhis\b/)
  })

  it('tells the dog’s story when it knows it', () => {
    const { report } = calculateDeep(FULL)
    expect(report.story[1]).toMatch(/shelter or rescue/)
    expect(report.story[1]).toMatch(/4 years together|4 years of shared/)
  })

  it('puts the barkday on the calendar when the birthday is known', () => {
    const { report } = calculateDeep({ ...FULL, daysUntilBirthday: 3 })
    const item = report.calendar.find((i) => i.id === 'barkday')
    expect(item?.when).toBe('this-week')
    expect(item?.title).toMatch(/barkday in 3 days/)
  })

  it('leaves the 1.0 result untouched for a plain 1.0 profile', () => {
    const plain: DogProfile = { name: 'Rufus', ageYears: 9, breedName: 'Lab', bodyConditionScore: 7, dentalCare: 'none', activityLevel: 'sedentary' }
    const before = calculateDogAge(plain)
    const { base } = calculateDeep(plain)
    expect(base).toEqual(before)
    expect(base.humanAge.years).toBe(65.3)
  })
})

describe('the fear factor — the one 2.0 question that moves the number', () => {
  it('docks half a year for marked fear and prices the fix', () => {
    const calm = calculateDogAge({ ageYears: 5, breedName: 'Beagle' })
    const some = calculateDogAge({ ageYears: 5, breedName: 'Beagle', anxiety: 'some' })
    const marked = calculateDogAge({ ageYears: 5, breedName: 'Beagle', anxiety: 'a-lot' })
    expect(some.lifespan.expectedYears).toBe(calm.lifespan.expectedYears)
    expect(marked.lifespan.expectedYears).toBeLessThan(calm.lifespan.expectedYears)
    expect(marked.lifespan.factors.find((f) => f.id === 'anxiety')?.confidence).toBe('low')
    const rec = marked.recommendations.find((r) => r.id === 'anxiety')
    expect(rec?.potentialYears).toBeGreaterThan(0.3)
  })

  it('surfaces as a priced 2.0 move', () => {
    const { report } = calculateDeep({ ageYears: 5, breedName: 'Beagle', anxiety: 'a-lot' })
    const move = report.moves.find((m) => m.id === 'anxiety-a-lot')
    expect(move?.potentialYears).toBeGreaterThan(0)
  })
})

describe('profileSignature', () => {
  it('is stable for a dog and different between dogs', () => {
    expect(profileSignature(FULL)).toBe(profileSignature({ ...FULL }))
    expect(profileSignature(FULL)).not.toBe(profileSignature({ ...FULL, name: 'Max' }))
  })
})
