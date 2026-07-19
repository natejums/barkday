import { describe, expect, it } from 'vitest'
import { BREEDS, findBreed } from '../breeds'
import type { BodySystem, ConditionSeverity, OnsetStage } from '../types'
import { BODY_SYSTEM_LABELS, BODY_SYSTEM_ORDER, CONDITION_CATALOG } from './catalog'
import { buildBreedHealth, matchCondition } from './index'

const SEVERITIES: readonly ConditionSeverity[] = ['monitor', 'serious', 'emergency']
const ONSETS: readonly OnsetStage[] = ['puppy', 'young-adult', 'mature-adult', 'senior', 'any']
const SEVERITY_RANK: Record<ConditionSeverity, number> = { emergency: 0, serious: 1, monitor: 2 }

describe('condition catalogue integrity', () => {
  it('has a substantial, well-formed catalogue', () => {
    expect(CONDITION_CATALOG.length).toBeGreaterThan(40)
  })

  it('has no duplicate ids', () => {
    const ids = CONDITION_CATALOG.map((c) => c.id)
    expect(new Set(ids).size).toBe(ids.length)
  })

  it('gives every entry the fields the UI and matcher depend on', () => {
    for (const c of CONDITION_CATALOG) {
      expect(c.id, c.id).toMatch(/^[a-z0-9-]+$/)
      expect(c.name.length, c.id).toBeGreaterThan(2)
      expect(c.aliases.length, c.id).toBeGreaterThan(0)
      expect(SEVERITIES, c.id).toContain(c.severity)
      expect(ONSETS, c.id).toContain(c.typicalOnset)
      expect(BODY_SYSTEM_ORDER, c.id).toContain(c.system)
      // Real, ownable signs and actions — not a stub.
      expect(c.signs.length, c.id).toBeGreaterThan(30)
      expect(c.action.length, c.id).toBeGreaterThan(30)
      // Every clinical claim carries a reference, like everything else in this engine.
      expect(c.references.length, c.id).toBeGreaterThan(0)
      for (const ref of c.references) expect(ref.length, c.id).toBeGreaterThan(4)
    }
  })

  it('keeps every alias lower-case, so matching is case-stable', () => {
    for (const c of CONDITION_CATALOG) {
      for (const alias of c.aliases) {
        expect(alias, `${c.id}: "${alias}"`).toBe(alias.toLowerCase())
        expect(alias.trim().length, `${c.id}: "${alias}"`).toBeGreaterThan(2)
      }
    }
  })

  it('labels every body system it uses', () => {
    for (const system of BODY_SYSTEM_ORDER) {
      expect(BODY_SYSTEM_LABELS[system as BodySystem].length).toBeGreaterThan(0)
    }
  })
})

describe('matchCondition', () => {
  it('links common phrasings to the right condition', () => {
    const cases: [string, string][] = [
      ['bloat (gastric torsion)', 'gdv-bloat'],
      ['slipping kneecaps (patellar luxation)', 'patellar-luxation'],
      ['hip dysplasia', 'hip-dysplasia'],
      ['dilated cardiomyopathy (enlarged heart)', 'dilated-cardiomyopathy'],
      ['progressive retinal atrophy', 'progressive-retinal-atrophy'],
      ['von willebrand disease (bleeding disorder)', 'von-willebrand'],
      ['degenerative myelopathy', 'degenerative-myelopathy'],
      ['cushing’s disease', 'cushings'],
      ['collapsing windpipe (tracheal collapse)', 'tracheal-collapse'],
    ]
    for (const [risk, id] of cases) {
      expect(matchCondition(risk)?.id, risk).toBe(id)
    }
  })

  it('resolves accents, so "Legg-Calvé" finds the entry', () => {
    expect(matchCondition('Legg-Calvé-Perthes disease affecting the hip')?.id).toBe('legg-calve-perthes')
  })

  it('prefers the specific condition over a generic one sharing a word', () => {
    // "eye conditions" is a catch-all; "entropion" is precise and must win even
    // though the generic phrase is the longer string.
    expect(matchCondition('eye conditions including entropion')?.id).toBe('entropion')
    expect(matchCondition('heart disease including dilated cardiomyopathy')?.id).toBe(
      'dilated-cardiomyopathy',
    )
    // A bare generic still resolves to the catch-all.
    expect(matchCondition('assorted heart disease')?.id).toBe('heart-disease-general')
  })

  it('returns nothing for a phrase it has no entry for', () => {
    expect(matchCondition('possessed by a poltergeist')).toBeUndefined()
    expect(matchCondition('')).toBeUndefined()
  })

  it('lets a named stone cause beat the generic "bladder stones" it co-occurs with', () => {
    // Every breed that names cystinuria or urate defect pairs it with "bladder
    // stones"; the generic umbrella must not swallow the specific aetiology, or
    // the Dalmatian gets generic advice instead of its urate DNA-test guidance.
    expect(matchCondition('cystinuria and bladder stones (mainly males)')?.id).toBe('cystinuria')
    expect(matchCondition('urate bladder stones from a uric acid defect')?.id).toBe('urate-stones')
    // …but a bare mention still resolves to the umbrella.
    expect(matchCondition('bladder stones and urinary blockages')?.id).toBe('bladder-stones')
  })

  it('matches on word boundaries, so "thyroid" does not fire inside "parathyroid"', () => {
    // Hyperparathyroidism is a calcium/parathyroid disorder with no entry here.
    // A bare substring match handed it hypothyroidism's reassuring advice.
    expect(matchCondition('primary hyperparathyroidism (high blood calcium)')).toBeUndefined()
    // The real thing still resolves, via its own aliases.
    expect(matchCondition('underactive thyroid (hypothyroidism)')?.id).toBe('hypothyroidism')
    expect(matchCondition('thyroid problems')?.id).toBe('hypothyroidism')
  })

  it('does not read epileptoid cramping syndrome as epilepsy', () => {
    // CECS ("Spike's disease") is a paroxysmal dyskinesia, clinically distinct
    // from epilepsy; there is no entry for it, so it should stay unmatched.
    expect(matchCondition("canine epileptoid cramping syndrome (spike's disease)")).toBeUndefined()
    expect(matchCondition('epilepsy')?.id).toBe('epilepsy')
    expect(matchCondition('idiopathic epilepsy and seizures')?.id).toBe('epilepsy')
  })

  it('matches a large majority of the real breed risk corpus', () => {
    let total = 0
    let matched = 0
    for (const breed of BREEDS) {
      for (const risk of breed.healthRisks ?? []) {
        total += 1
        if (matchCondition(risk)) matched += 1
      }
    }
    // A regression that guts the alias lists would crater this. It sits at ~91%.
    expect(matched / total).toBeGreaterThan(0.85)
  })
})

describe('buildBreedHealth', () => {
  const dane = findBreed('Great Dane')!

  it('preserves every risk verbatim, enriched or not', () => {
    const report = buildBreedHealth(dane, 'senior', dane.sizeClass, { ageYears: 8 })
    expect(report.concerns.map((c) => c.label)).toEqual([...(dane.healthRisks ?? [])])
  })

  it('sorts every concern into a body-system group, losing none', () => {
    const report = buildBreedHealth(dane, 'senior', dane.sizeClass, { ageYears: 8 })
    const grouped = report.bySystem.reduce((n, g) => n + g.concerns.length, 0)
    expect(grouped).toBe(report.concerns.length)

    for (const group of report.bySystem) {
      const ranks = group.concerns.map((c) => SEVERITY_RANK[c.severity])
      expect([...ranks].sort((a, b) => a - b)).toEqual(ranks)
    }
  })

  it('surfaces different priorities for a puppy than for a senior', () => {
    const puppy = buildBreedHealth(dane, 'puppy', dane.sizeClass, { ageYears: 0.5 })
    const senior = buildBreedHealth(dane, 'senior', dane.sizeClass, { ageYears: 8 })

    const idsOf = (r: ReturnType<typeof buildBreedHealth>) =>
      new Set(r.priorityNow.map((c) => c.condition?.id).filter(Boolean))

    // Bloat is an emergency: relevant at every age.
    expect(idsOf(puppy).has('gdv-bloat')).toBe(true)
    expect(idsOf(senior).has('gdv-bloat')).toBe(true)

    // Osteosarcoma is a middle-age-onward concern: relevant for the senior, not the puppy.
    expect(idsOf(senior).has('osteosarcoma')).toBe(true)
    expect(idsOf(puppy).has('osteosarcoma')).toBe(false)

    // Developmental hip dysplasia is the mirror image.
    expect(idsOf(puppy).has('hip-dysplasia')).toBe(true)
    expect(idsOf(senior).has('hip-dysplasia')).toBe(false)
  })

  it('orders the priority list by severity', () => {
    const report = buildBreedHealth(dane, 'senior', dane.sizeClass, { ageYears: 8 })
    const ranks = report.priorityNow.map((c) => SEVERITY_RANK[c.severity])
    expect([...ranks].sort((a, b) => a - b)).toEqual(ranks)
    expect(report.priorityNow.every((c) => c.relevantNow)).toBe(true)
  })

  it('raises a feeding callout for a deep-chested, bloat-prone breed', () => {
    const report = buildBreedHealth(dane, 'mature-adult', dane.sizeClass, { ageYears: 5 })
    expect(report.callouts.map((c) => c.id)).toContain('bloat-feeding')
  })

  it('raises the airway callout for a flat-faced breed', () => {
    const pug = findBreed('Pug')!
    const report = buildBreedHealth(pug, 'mature-adult', pug.sizeClass, { ageYears: 5 })
    expect(report.callouts.map((c) => c.id)).toContain('brachycephalic-airway')
  })

  it('raises the anaesthetic callout for a sighthound', () => {
    const whippet = findBreed('Whippet')!
    const report = buildBreedHealth(whippet, 'mature-adult', whippet.sizeClass, { ageYears: 5 })
    expect(report.callouts.map((c) => c.id)).toContain('anaesthetic-sensitivity')
  })

  it('flags early neutering for a large breed, and not for a small one', () => {
    const big = buildBreedHealth(dane, 'young-adult', dane.sizeClass, {
      ageYears: 2,
      neuterStatus: 'neutered',
      neuterAgeMonths: 6,
    })
    expect(big.callouts.map((c) => c.id)).toContain('early-neuter-joints')

    const cavalier = findBreed('Cavalier King Charles Spaniel')!
    const small = buildBreedHealth(cavalier, 'young-adult', cavalier.sizeClass, {
      ageYears: 2,
      neuterStatus: 'neutered',
      neuterAgeMonths: 6,
    })
    expect(small.callouts.map((c) => c.id)).not.toContain('early-neuter-joints')
  })

  it('marks screening as mattering once a dog is senior, not before', () => {
    expect(buildBreedHealth(dane, 'mature-adult', dane.sizeClass, { ageYears: 5 }).screeningMatters).toBe(
      false,
    )
    expect(buildBreedHealth(dane, 'senior', dane.sizeClass, { ageYears: 8 }).screeningMatters).toBe(true)
    expect(buildBreedHealth(dane, 'geriatric', dane.sizeClass, { ageYears: 10 }).screeningMatters).toBe(
      true,
    )
  })

  it('holds together for every breed across every life stage', () => {
    const stages = ['puppy', 'young-adult', 'mature-adult', 'senior', 'geriatric'] as const
    for (const breed of BREEDS) {
      for (const stage of stages) {
        const report = buildBreedHealth(breed, stage, breed.sizeClass, { ageYears: 5 })
        const label = `${breed.name} @ ${stage}`
        expect(report.concerns.length, label).toBe((breed.healthRisks ?? []).length)
        for (const concern of report.concerns) {
          expect(SEVERITIES, label).toContain(concern.severity)
          expect(BODY_SYSTEM_ORDER, label).toContain(concern.system)
        }
        // Priority is always a subset that is genuinely flagged relevant.
        expect(report.priorityNow.every((c) => c.relevantNow), label).toBe(true)
        expect(report.priorityNow.length, label).toBeLessThanOrEqual(report.concerns.length)
      }
    }
  })
})
