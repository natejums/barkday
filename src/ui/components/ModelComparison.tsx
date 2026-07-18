import type { ModelEstimate } from '../../core'

interface Props {
  models: readonly ModelEstimate[]
}

const CONFIDENCE_LABEL: Record<ModelEstimate['confidence'], string> = {
  high: 'High confidence',
  moderate: 'Moderate confidence',
  low: 'Low confidence',
}

/**
 * Emphasis rather than categorical colour: one of these four models is the
 * answer and the other three are context. Giving each its own hue would imply
 * they are peers competing for the reader's attention, which is exactly the
 * wrong idea — the point is that they disagree and one is better founded.
 */
export function ModelComparison({ models }: Props) {
  const max = Math.max(...models.map((model) => model.humanYears ?? 0), 1)

  return (
    <section className="card" aria-labelledby="models-heading">
      <header className="card__header">
        <h2 className="card__title" id="models-heading">
          How the models disagree
        </h2>
        <p className="card__subtitle">
          There is no single accepted formula for converting dog years. These are the four
          approaches in circulation, run against the same dog. The highlighted one drives the
          estimate above.
        </p>
      </header>

      <div className="bars">
        {models.map((model) => (
          <div key={model.id}>
            <div className="bar__head">
              <span className="bar__name">{model.label}</span>
              <span className="bar__value">
                {model.humanYears === null
                  ? 'Not applicable'
                  : `${model.humanYears} yrs · ${CONFIDENCE_LABEL[model.confidence]}`}
              </span>
            </div>
            <div
              className="bar__track"
              role="img"
              aria-label={
                model.humanYears === null
                  ? `${model.label}: not applicable at this age`
                  : `${model.label}: ${model.humanYears} human years`
              }
            >
              <div
                className="bar__fill"
                data-emphasis={model.headline === true}
                style={{ width: `${((model.humanYears ?? 0) / max) * 100}%` }}
              />
            </div>
            <p className="bar__note">{model.description}</p>
          </div>
        ))}
      </div>
    </section>
  )
}
