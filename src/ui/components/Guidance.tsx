import type { Breed, DogAgeResult } from '../../core'

export function Recommendations({
  result,
  detailsGiven,
}: {
  result: DogAgeResult
  /** How many optional details the user has actually filled in. */
  detailsGiven: number
}) {
  const { recommendations, profile } = result
  const name = profile.name?.trim() || 'your dog'

  if (recommendations.length === 0) {
    return (
      <section className="card">
        <header className="card__header">
          <h2 className="card__title">What would help most</h2>
        </header>
        {/*
          An empty list means one of two opposite things, and saying the wrong
          one costs the page its credibility: with nothing entered there is
          simply nothing to assess, and congratulating someone on care they
          never described is not a compliment the model has earned.
        */}
        <p className="card__subtitle">
          {detailsGiven === 0
            ? 'Nothing to go on yet — this is based on age alone. Fill in body condition and dental care on the left and the model will have something to say here.'
            : `Nothing to flag from what you've entered — ${name} is doing well on every factor described so far. Add more detail on the left if you'd like a closer look.`}
        </p>
      </section>
    )
  }

  return (
    <section className="card" aria-labelledby="recs-heading">
      <header className="card__header">
        <h2 className="card__title" id="recs-heading">
          What would help most
        </h2>
        <p className="card__subtitle">
          Ordered by impact. The years shown are what the model gives back if you change that one
          thing — already discounted for overlap with everything else, so they don't simply add up.
        </p>
      </header>

      <div>
        {recommendations.map((rec) => (
          <div className="rec" key={rec.id}>
            <div className="rec__gain" data-empty={rec.potentialYears === 0}>
              {rec.potentialYears > 0 ? `+${rec.potentialYears.toFixed(2)}` : 'Care'}
            </div>
            <div>
              <p className="rec__title">{rec.title}</p>
              <p className="rec__detail">{rec.detail}</p>
            </div>
          </div>
        ))}
      </div>
    </section>
  )
}

export function CareGuidance({ result }: { result: DogAgeResult }) {
  const { lifeStage } = result

  return (
    <section className="card" aria-labelledby="care-heading">
      <header className="card__header">
        <h2 className="card__title" id="care-heading">
          Care for a {lifeStage.label.toLowerCase()}
        </h2>
        <p className="card__subtitle">{lifeStage.description}</p>
      </header>

      <ul className="checklist">
        {lifeStage.careGuidance.map((item) => (
          <li key={item}>{item}</li>
        ))}
      </ul>
    </section>
  )
}

export function BreedPanel({ breed }: { breed: Breed }) {
  return (
    <section className="card" aria-labelledby="breed-heading">
      <header className="card__header">
        <h2 className="card__title" id="breed-heading">
          {breed.name}
        </h2>
        <p className="card__subtitle">
          {breed.group} group · typically {breed.weightKg[0]}–{breed.weightKg[1]} kg · population
          lifespan {breed.lifespanYears[0]}–{breed.lifespanYears[1]} years
          {breed.brachycephalic ? ' · flat-faced' : ''}
        </p>
      </header>

      {breed.notes ? <p className="rec__detail">{breed.notes}</p> : null}

      {breed.healthRisks && breed.healthRisks.length > 0 ? (
        <>
          <p className="field__help" style={{ marginTop: 14 }}>
            Worth knowing about this breed:
          </p>
          <div className="pill-row">
            {breed.healthRisks.map((risk) => (
              <span className="pill" key={risk}>
                {risk}
              </span>
            ))}
          </div>
        </>
      ) : null}
    </section>
  )
}

export function Warnings({ warnings }: { warnings: readonly string[] }) {
  if (warnings.length === 0) return null

  return (
    <section className="card" aria-label="Notes on this estimate">
      {warnings.map((warning) => (
        <div className="notice" key={warning}>
          <span className="notice__icon" aria-hidden="true">
            ⚠
          </span>
          <span>{warning}</span>
        </div>
      ))}
    </section>
  )
}
