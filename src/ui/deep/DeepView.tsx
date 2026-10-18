import { useEffect, useMemo, useState } from 'react'
import { calculateDeep } from '../../core'
import { DeepForm } from './DeepForm'
import { DeepResults } from './DeepResults'
import { PrintableReport } from './PrintableReport'
import { DEFAULT_DEEP_STATE, toDeepProfile, type DeepFormPatch, type DeepFormState } from './formStateDeep'

/**
 * Barkday 2.0: the same two-column layout as the classic calculator, with a
 * longer form and a far more specific report — and a printable version of it.
 */
export function DeepView() {
  const [state, setState] = useState<DeepFormState>(DEFAULT_DEEP_STATE)
  const [printing, setPrinting] = useState(false)

  const now = useMemo(() => new Date(), [])

  const computed = useMemo(() => {
    const profile = toDeepProfile(state, now)
    return profile ? { profile, ...calculateDeep(profile) } : null
  }, [state, now])

  // The print view replaces the page; bring the top of it into view.
  useEffect(() => {
    if (typeof window !== 'undefined' && typeof window.scrollTo === 'function') window.scrollTo(0, 0)
  }, [printing])

  function update(patch: DeepFormPatch) {
    setState((current) => ({ ...current, ...patch }))
  }

  if (printing && computed) {
    return (
      <PrintableReport
        result={computed.base}
        report={computed.report}
        printedOn={now.toLocaleDateString(undefined, { year: 'numeric', month: 'long', day: 'numeric' })}
        onBack={() => setPrinting(false)}
      />
    )
  }

  return (
    <div className="layout">
      <div className="layout__form">
        <DeepForm
          state={state}
          onChange={update}
          hintBreed={computed?.base.breed}
          ageYears={computed?.profile.ageYears ?? null}
        />
      </div>

      <div className="results">
        {computed === null ? (
          <section className="card">
            <h2 className="card__title">Tell me about your dog</h2>
            <p className="card__subtitle">
              An age is all that's strictly needed to start. Every answer after that makes the
              report more specific to your dog.
            </p>
          </section>
        ) : (
          <DeepResults result={computed.base} report={computed.report} onPrint={() => setPrinting(true)} />
        )}
      </div>
    </div>
  )
}
