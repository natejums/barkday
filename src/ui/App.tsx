import { useEffect, useMemo, useState } from 'react'
import { calculateDogAge } from '../core'
import { completeness, DEFAULT_STATE, toProfile, type FormPatch, type FormState } from './formState'
import { DogForm } from './components/DogForm'
import { DogReport } from './components/DogReport'
import { FactorWaterfall } from './components/FactorWaterfall'
import { BreedHealth, CareGuidance, HelpfulGear, Recommendations, Warnings } from './components/Guidance'
import { HeroResult } from './components/HeroResult'
import { ModelComparison } from './components/ModelComparison'

type Theme = 'system' | 'light' | 'dark'

const REPO_URL = 'https://github.com/natejums/barkday'

export function App() {
  const [state, setState] = useState<FormState>(DEFAULT_STATE)
  const [theme, setTheme] = useState<Theme>('system')

  // One clock reading per session. Recomputing it on every render would make
  // the dog imperceptibly older each keystroke and defeat memoisation.
  const now = useMemo(() => new Date(), [])

  useEffect(() => {
    const root = document.documentElement
    if (theme === 'system') root.removeAttribute('data-theme')
    else root.setAttribute('data-theme', theme)
  }, [theme])

  const result = useMemo(() => {
    const profile = toProfile(state, now)
    return profile ? calculateDogAge(profile) : null
  }, [state, now])

  const progress = completeness(state)

  function update(patch: FormPatch) {
    setState((current) => ({ ...current, ...patch }))
  }

  return (
    <div className="page">
      <header className="masthead">
        <div>
          <h1 className="masthead__title">
            <svg
              className="masthead__mark"
              viewBox="0 0 32 32"
              width="28"
              height="28"
              fill="currentColor"
              aria-hidden="true"
            >
              <ellipse cx="7" cy="13" rx="3" ry="3.9" />
              <ellipse cx="13.6" cy="8.4" rx="3.2" ry="4.3" />
              <ellipse cx="20.6" cy="8.4" rx="3.2" ry="4.3" />
              <ellipse cx="27" cy="13" rx="3" ry="3.9" />
              <ellipse cx="17" cy="23" rx="7.6" ry="6.6" />
            </svg>
            Barkday
          </h1>
          <p className="masthead__tagline">
            A dog's age in human years depends on their size, their breed, their weight and how
            they live — not on multiplying by seven. This works out the rest of it.
          </p>
        </div>

        <button
          type="button"
          className="theme-toggle"
          onClick={() => setTheme(theme === 'dark' ? 'light' : theme === 'light' ? 'system' : 'dark')}
        >
          {theme === 'system' ? 'Theme: auto' : theme === 'dark' ? 'Theme: dark' : 'Theme: light'}
        </button>
      </header>

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

      <footer className="footer">
        <p>
          <strong>This is not veterinary advice.</strong> Every number here is a population
          average pointed at one animal, and no model can see the dog in front of you. If
          something seems wrong with your dog, ask a vet — not a website.
        </p>
        <p>
          Built on peer-reviewed work: Montoya et al. (2023) for life expectancy by size, Salt
          et al. (2019) for body condition, the Purina Life Span Study for caloric restriction,
          and the AAHA Canine Life Stage Guidelines for the stage boundaries. McMillan et al.
          (2024) is why skull shape and mixed ancestry are deliberately <em>not</em> modelled.
          The sources, the constants and their caveats are all in the repository.
        </p>
        <p>
          <a href={REPO_URL}>Source on GitHub</a> ·{' '}
          <a href={`${REPO_URL}/issues/new`}>Feedback or a correction?</a> · MIT licensed
        </p>
      </footer>
    </div>
  )
}
