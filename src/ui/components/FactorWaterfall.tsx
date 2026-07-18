import type { LifespanEstimate } from '../../core'

interface Props {
  lifespan: LifespanEstimate
}

const CONFIDENCE_LABEL = {
  high: 'strong evidence',
  moderate: 'moderate evidence',
  low: 'weak evidence',
} as const

/**
 * Diverging bars around a zero baseline — the natural form for signed
 * adjustments. The sign is carried by the ± in the value as well as by hue, so
 * the chart never depends on colour alone.
 */
export function FactorWaterfall({ lifespan }: Props) {
  const { factors, baselineYears, expectedYears, rawDeltaYears, appliedDeltaYears } = lifespan

  if (factors.length === 0) {
    return (
      <section className="card">
        <header className="card__header">
          <h2 className="card__title">What's shaping the estimate</h2>
          <p className="card__subtitle">
            Nothing beyond the breed baseline of {baselineYears} years so far. Fill in body
            condition, dental care and daily routine on the left and this will fill out.
          </p>
        </header>
      </section>
    )
  }

  const max = Math.max(...factors.map((factor) => Math.abs(factor.deltaYears)), 0.5)
  const saturationApplied = Math.abs(rawDeltaYears - appliedDeltaYears) > 0.05

  return (
    <section className="card" aria-labelledby="factors-heading">
      <header className="card__header">
        <h2 className="card__title" id="factors-heading">
          What's shaping the estimate
        </h2>
        <p className="card__subtitle">
          Starting from a baseline of {baselineYears} years for this breed and size, here is what
          each detail contributes.
        </p>
      </header>

      <div>
        {factors.map((factor) => {
          const positive = factor.deltaYears > 0
          const width = (Math.abs(factor.deltaYears) / max) * 50

          return (
            <div className="waterfall__row" key={factor.id} title={factor.explanation}>
              <div className="waterfall__label">
                {factor.label}
                <div className="waterfall__confidence">{CONFIDENCE_LABEL[factor.confidence]}</div>
              </div>

              <div className="waterfall__plot">
                <div className="waterfall__axis" />
                <div
                  className="waterfall__bar"
                  data-sign={positive ? 'positive' : 'negative'}
                  style={{ width: `${width}%` }}
                />
              </div>

              <div className="waterfall__delta">
                {positive ? '+' : '−'}
                {Math.abs(factor.deltaYears).toFixed(2)} yrs
              </div>
            </div>
          )
        })}
      </div>

      <div className="waterfall__summary">
        {saturationApplied ? (
          <>
            These add up to {rawDeltaYears > 0 ? '+' : '−'}
            {Math.abs(rawDeltaYears).toFixed(2)} years on paper, but only{' '}
            <strong>
              {appliedDeltaYears > 0 ? '+' : '−'}
              {Math.abs(appliedDeltaYears).toFixed(2)} years
            </strong>{' '}
            are applied. These factors are not independent — diet, weight and exercise largely
            measure one underlying thing, and dental care and vet visits both stand in for having
            an attentive owner. Adding them straight would double-count.{' '}
            <strong>Expected lifespan: {expectedYears} years.</strong>
          </>
        ) : (
          <>
            Net effect{' '}
            <strong>
              {appliedDeltaYears > 0 ? '+' : '−'}
              {Math.abs(appliedDeltaYears).toFixed(2)} years
            </strong>{' '}
            on a baseline of {baselineYears}. <strong>Expected lifespan: {expectedYears} years.</strong>
          </>
        )}
      </div>
    </section>
  )
}
