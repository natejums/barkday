import type { ConditionSeverity, DogAgeResult, HealthConcern, OnsetStage } from '../../core'

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

export function HelpfulGear({ result }: { result: DogAgeResult }) {
  const { productSuggestions } = result
  if (productSuggestions.length === 0) return null

  return (
    <section className="card" aria-labelledby="gear-heading">
      <header className="card__header">
        <h2 className="card__title" id="gear-heading">
          Gear that tends to help
        </h2>
        <p className="card__subtitle">
          Generic categories tied to what's above — no brands, no links, nothing sponsored. Pick
          what fits your dog and ignore the rest.
        </p>
      </header>

      <div>
        {productSuggestions.map((product) => (
          <div className="rec" key={product.id}>
            <div className="rec__gain" data-empty="true">
              Gear
            </div>
            <div>
              <p className="rec__title">{product.title}</p>
              <p className="rec__detail">{product.detail}</p>
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

const SEVERITY_META: Record<ConditionSeverity, { label: string; variant: string }> = {
  emergency: { label: 'Emergency', variant: 'critical' },
  serious: { label: 'Serious', variant: 'warning' },
  monitor: { label: 'Keep an eye on it', variant: 'muted' },
}

const ONSET_PHRASE: Record<OnsetStage, string> = {
  puppy: 'in puppyhood',
  'young-adult': 'in young adults',
  'mature-adult': 'in middle age',
  senior: 'in the senior years',
  any: 'at any age',
}

/** One concern. Enriched entries expand to signs and what helps; the rest stay plain. */
function ConcernRow({ concern }: { concern: HealthConcern }) {
  const sev = SEVERITY_META[concern.severity]
  const badge = (
    <span className="sev-badge" data-variant={sev.variant}>
      {sev.label}
    </span>
  )

  if (!concern.condition) {
    return (
      <div className="health-item">
        <div className="health-item__head">
          <span className="health-item__label">{concern.label}</span>
          {badge}
        </div>
      </div>
    )
  }

  const { condition } = concern
  return (
    <details className="health-item health-item--expandable">
      <summary className="health-item__head">
        <span className="health-item__label">{concern.label}</span>
        {badge}
      </summary>
      <div className="health-item__body">
        <p>
          <strong>Watch for:</strong> {condition.signs}
        </p>
        <p>
          <strong>What helps:</strong> {condition.action}
        </p>
        <p className="health-item__meta">Typically appears {ONSET_PHRASE[condition.typicalOnset]}.</p>
      </div>
    </details>
  )
}

export function BreedHealth({ result }: { result: DogAgeResult }) {
  const { breed, breedHealth } = result
  // Both are present together — the engine only builds breedHealth when the
  // breed was recognised — but narrowing here keeps the types honest.
  if (!breed || !breedHealth) return null

  const { callouts, priorityNow, bySystem, concerns, screeningMatters } = breedHealth

  return (
    <section className="card" aria-labelledby="health-heading">
      <header className="card__header">
        <h2 className="card__title" id="health-heading">
          {breed.name} — health to watch
        </h2>
        <p className="card__subtitle">
          {breed.group} group · typically {breed.weightKg[0]}–{breed.weightKg[1]} kg · population
          lifespan {breed.lifespanYears[0]}–{breed.lifespanYears[1]} years
          {breed.brachycephalic ? ' · flat-faced' : ''}. These are the breed's documented
          predispositions — things to know about and raise with a vet, not a diagnosis of your dog.
        </p>
      </header>

      {breed.notes ? <p className="rec__detail">{breed.notes}</p> : null}

      {callouts.length > 0 ? (
        <div className="health__callouts">
          {callouts.map((callout) => (
            <div
              className="health-callout"
              data-variant={SEVERITY_META[callout.severity].variant}
              key={callout.id}
            >
              <p className="health-callout__title">{callout.title}</p>
              <p className="health-callout__detail">{callout.detail}</p>
            </div>
          ))}
        </div>
      ) : null}

      {priorityNow.length > 0 ? (
        <div className="health__block">
          <p className="health__block-title">Most relevant around this age</p>
          <div className="health__list">
            {priorityNow.map((concern, i) => (
              <ConcernRow concern={concern} key={`p-${i}-${concern.label}`} />
            ))}
          </div>
        </div>
      ) : null}

      {/*
        The priority view is the curated answer; this is the full reference.
        Collapsed when there's a priority view above it so the card doesn't open
        as a wall, expanded when there's nothing else to show.
      */}
      <details className="health__all" open={priorityNow.length === 0}>
        <summary className="health__all-summary">
          All {concerns.length} documented {concerns.length === 1 ? 'concern' : 'concerns'}, by body system
        </summary>
        {bySystem.map((group) => (
          <div className="health__block" key={group.system}>
            <p className="health__block-title">{group.label}</p>
            <div className="health__list">
              {group.concerns.map((concern, i) => (
                <ConcernRow concern={concern} key={`${group.system}-${i}-${concern.label}`} />
              ))}
            </div>
          </div>
        ))}
      </details>

      {screeningMatters ? (
        <p className="field__help" style={{ marginTop: 14 }}>
          At this life stage, twice-yearly exams with bloodwork turn many of these from
          emergencies into things caught early. Screening is where it earns its keep.
        </p>
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
