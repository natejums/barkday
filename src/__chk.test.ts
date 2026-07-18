import { describe, it } from 'vitest'
import { calculateDogAge } from './core/calculate'
describe('c', () => { it('x', () => {
  for (const b of ['Mixed Breed Medium', undefined]) {
    const r = calculateDogAge(b ? { ageYears: 5, breedName: b } : { ageYears: 5 })
    console.log(b ?? 'NO BREED', '->', r.lifespan.factors.map(f => f.id).join(',') || '(none)', '| expected', r.lifespan.expectedYears)
  }
})})
