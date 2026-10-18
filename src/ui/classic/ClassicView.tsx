import { useMemo, useState } from 'react'
import { calculateDogAge } from '../../core'
import { completeness, DEFAULT_STATE, toProfile, type FormPatch, type FormState } from '../formState'
import { DogForm } from '../components/DogForm'
import { DogReport } from '../components/DogReport'
import { FactorWaterfall } from '../components/FactorWaterfall'
import { BreedHealth, CareGuidance, HelpfulGear, Recommendations, Warnings } from '../components/Guidance'
import { HeroResult } from '../components/HeroResult'
import { ModelComparison } from '../components/ModelComparison'

/**
 * The classic calculator — Barkday as it first shipped, kept exactly as it was.
 * The 2.0 report lives in its own tab; this one stays the quick, clear answer.
 */
export function ClassicView() {
  const [state, setState] = useState<FormState>(DEFAULT_STATE)

  // One clock reading per session. Recomputing it on every render would make
  // the dog imperceptibly older each keystroke and defeat memoisation.
  const now = useMemo(() => new Date(), [])

  const result = useMemo(() => {
    const profile = toProfile(state, now)
    return profile ? calculateDogAge(profile) : null
  }, [state, now])

  const progress = completeness(state)

  function update(patch: FormPatch) {
    setState((current) => ({ ...current, ...patch }))
  }

  return (
    <div className="layout">
      <div className="layout__form">
        <DogForm state={state} onChange={update} hintBreed={result?.breed} />
      </div>

      <div className="results">
        {result === null ? (
          <section className="card">
            <h2 className="card__title">Tell me about your dog</h2>
            <p className="card__subtitle">
              An age is all that's strictly needed to start. Everything else sharpens the
              estimate — and the more you add, the less this is guesswork.
            </p>
          </section>
        ) : (
          <>
            <HeroResult result={result} />

            <DogReport result={result} />

            {progress.filled < progress.total ? (
              <div className="notice">
                <span className="notice__icon" aria-hidden="true">
                  ✎
                </span>
                <span>
                  {progress.filled} of {progress.total} details filled in. Body condition and
                  dental care move the number most — they're the two best-evidenced levers there
                  are.
                </span>
              </div>
            ) : null}

            <Warnings warnings={result.warnings} />
            <FactorWaterfall lifespan={result.lifespan} breedKnown={result.breed !== undefined} />
            <Recommendations result={result} detailsGiven={progress.filled} />
            <HelpfulGear result={result} />
            <ModelComparison models={result.models} />
            <CareGuidance result={result} />
            {result.breedHealth ? <BreedHealth result={result} /> : null}
          </>
        )}
      </div>
    </div>
  )
}
