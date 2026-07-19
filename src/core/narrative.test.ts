import { describe, expect, it } from 'vitest'
import { calculateDogAge } from './calculate'
import { composeDogReport } from './narrative'
import type { DogProfile } from './types'

const report = (profile: DogProfile) => composeDogReport(calculateDogAge(profile))

describe('composeDogReport', () => {
  it('always returns a few paragraphs and some things to do together', () => {
    const r = report({ ageYears: 3, breedName: 'Beagle' })
    expect(r.paragraphs.length).toBeGreaterThanOrEqual(2)
    expect(r.togetherIdeas.length).toBeGreaterThanOrEqual(3)
    for (const idea of r.togetherIdeas) expect(idea.length).toBeGreaterThan(15)
  })

  it('uses the dog by name and the right pronouns for a female', () => {
    const r = report({ name: 'Jesse', ageYears: 13, sex: 'female', breedName: 'Labrador Retriever' })
    const text = r.paragraphs.join(' ')
    expect(text).toMatch(/\bJesse\b/)
    expect(text).toMatch(/\bher\b/)
    expect(text).not.toMatch(/\bhim\b|\bhis\b/)
  })

  it('uses he/him for a male', () => {
    const text = report({ name: 'Max', ageYears: 1, sex: 'male', breedName: 'Boxer' }).paragraphs.join(' ')
    expect(text).toMatch(/\bhim\b|\bhis\b/)
    expect(text).not.toMatch(/\bher\b|\bshe\b/)
  })

  it('stays grammatical with no name and unknown sex (they, but singular "dog is")', () => {
    const text = report({ ageYears: 12, breedName: 'Beagle' }).paragraphs.join(' ')
    // The subject "Your dog" is singular — never "Your dog are".
    expect(text.toLowerCase()).not.toContain('dog are')
    expect(text).toMatch(/Your dog is/)
    // …while the pronoun clause is plural: "what they want", not "what they wants".
    expect(text).not.toMatch(/they wants/)
  })

  it('speaks to a geriatric dog with warmth and reassurance, not doom', () => {
    const text = report({ name: 'Rosie', ageYears: 15, sex: 'female', breedName: 'Chihuahua' }).paragraphs
      .join(' ')
      .toLowerCase()
    expect(text).toMatch(/comfort|final chapter|hold close|gentle/)
    expect(text).toMatch(/okay|more than enough|small joys/)
  })

  it('never puts final-years framing on a puppy', () => {
    const text = report({ name: 'Pip', ageYears: 0.4, sex: 'male', breedName: 'Border Collie' }).paragraphs
      .join(' ')
      .toLowerCase()
    expect(text).toMatch(/photos|world|shapes everything|beginning|start/)
    expect(text).not.toMatch(/final chapter|last stretches|borrowed/)
  })

  it('weaves the top improvements in gently when there are any', () => {
    const text = report({
      name: 'Duke',
      ageYears: 6,
      sex: 'male',
      breedName: 'Labrador Retriever',
      bodyConditionScore: 8,
      dentalCare: 'none',
    }).paragraphs.join(' ')
    expect(text).toMatch(/kindest place to start/i)
    expect(text.toLowerCase()).toMatch(/weight|tooth/)
  })

  it('reassures a well-cared-for dog instead of inventing problems', () => {
    const text = report({
      name: 'Willow',
      ageYears: 4,
      sex: 'female',
      breedName: 'Border Collie',
      bodyConditionScore: 5,
      dentalCare: 'professional',
      vetCare: 'proactive',
      activityLevel: 'very-active',
      dietQuality: 'excellent',
    }).paragraphs.join(' ')
    expect(text).toMatch(/thriving/i)
  })

  it('is deterministic — the same dog gets the same note', () => {
    const p: DogProfile = { name: 'Sam', ageYears: 8, sex: 'male', breedName: 'Poodle (Standard)' }
    expect(report(p)).toEqual(report(p))
  })
})
