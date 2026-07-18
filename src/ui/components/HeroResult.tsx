import { describeYears, stageBoundaries } from '../../core'
import type { DogAgeResult } from '../../core'

const STAGE_KEYS = [
  { id: 'puppy', label: 'Puppy', varName: '--stage-1' },
  { id: 'young-adult', label: 'Young adult', varName: '--stage-2' },
  { id: 'mature-adult', label: 'Mature adult', varName: '--stage-3' },
  { id: 'senior', label: 'Senior', varName: '--stage-4' },
  { id: 'geriatric', label: 'Geriatric', varName: '--stage-5' },
] as const

interface Props {
  result: DogAgeResult
}

export function HeroResult({ result }: Props) {
  const { humanAge, lifespan, lifeStage, remaining, profile, sizeClass } = result
  const name = profile.name?.trim()
  const subject = name ? name : 'Your dog'

  const bounds = stageBoundaries(sizeClass, lifespan.expectedYears)
  // Give the scale room when the dog has already outlived the estimate, so the
  // position marker never runs off the end of the track.
  const scaleMax = Math.max(lifespan.expectedYears, profile.ageYears * 1.05, 1)

  const segments = [
    { key: STAGE_KEYS[0], from: 0, to: bounds.puppyEndsYears },
    { key: STAGE_KEYS[1], from: bounds.puppyEndsYears, to: bounds.youngAdultEndsYears },
    { key: STAGE_KEYS[2], from: bounds.youngAdultEndsYears, to: bounds.seniorStarts },
    { key: STAGE_KEYS[3], from: bounds.seniorStarts, to: bounds.geriatricStarts },
    { key: STAGE_KEYS[4], from: bounds.geriatricStarts, to: scaleMax },
  ].map((segment) => ({
    ...segment,
    width: (Math.max(0, segment.to - segment.from) / scaleMax) * 100,
  }))

  const markerPercent = Math.min(100, (profile.ageYears / scaleMax) * 100)

  return (
    <section className="card" aria-labelledby="hero-heading">
      {/*
        The whole results column recomputes on every keystroke in a column the
        user is not focused on. Without a live region a screen-reader user
        changes an input and hears nothing at all — the answer silently moves
        behind them. Announcing just the headline keeps the queue short; the
        detail is still there to navigate to.
      */}
      <p className="visually-hidden" role="status">
        {subject} is about {humanAge.years} human years old. Life stage: {lifeStage.label}.
      </p>

      <h2 className="hero__label" id="hero-heading">
        <span aria-hidden="true">{subject} is about</span>
        <span className="visually-hidden">
          {subject} is about {humanAge.years} human years old
        </span>
      </h2>

      {/* Announced by the heading above, so hidden here to avoid double-reading. */}
      <div className="hero" aria-hidden="true">
        <span className="hero__figure">{humanAge.years}</span>
        <span className="hero__unit">human years old</span>
      </div>

      <p className="hero__range">
        Most likely between {humanAge.rangeYears[0]} and {humanAge.rangeYears[1]}, based on a
        chronological age of {describeYears(profile.ageYears).label}.
      </p>

      <div className="tiles">
        <div className="tile">
          <p className="tile__label">Life stage</p>
          <p className="tile__value">{lifeStage.label}</p>
          <p className="tile__detail">
            {lifeStage.nextStage
              ? `${lifeStage.nextStage.label} from ${lifeStage.nextStage.atAgeYears} years`
              : 'The final stage'}
          </p>
        </div>

        <div className="tile">
          <p className="tile__label">Expected lifespan</p>
          <p className="tile__value">{lifespan.expectedYears} yrs</p>
          <p className="tile__detail">
            Range {lifespan.rangeYears[0]}–{lifespan.rangeYears[1]}
          </p>
        </div>

        <div className="tile">
          <p className="tile__label">Time likely remaining</p>
          <p className="tile__value">
            {remaining.years > 0 ? remaining.label : 'Living on borrowed time'}
          </p>
          <p className="tile__detail">
            {remaining.years > 0
              ? `Range ${remaining.rangeYears[0]}–${remaining.rangeYears[1]} yrs`
              : 'Already past the estimate — plenty of dogs are'}
          </p>
        </div>
      </div>

      <div className="meter">
        <div className="meter__marker">
          <span className="meter__pin" style={{ left: `${markerPercent}%` }}>
            {name ?? 'Today'}
          </span>
        </div>

        <div
          className="meter__track"
          role="img"
          aria-label={`Life stage progress: ${lifeStage.label}, ${Math.round(
            lifeStage.progress * 100,
          )}% through an expected lifespan of ${lifespan.expectedYears} years.`}
        >
          {segments.map((segment) =>
            segment.width <= 0 ? null : (
              <div
                key={segment.key.id}
                className="meter__segment"
                style={{
                  width: `${segment.width}%`,
                  background: `var(${segment.key.varName})`,
                }}
              />
            ),
          )}
        </div>

        <div className="meter__scale">
          <span>Birth</span>
          <span>{Math.round(scaleMax)} years</span>
        </div>

        <div className="meter__legend">
          {STAGE_KEYS.map((stage) => (
            <span className="meter__key" key={stage.id}>
              <span className="swatch" style={{ background: `var(${stage.varName})` }} />
              {stage.label}
            </span>
          ))}
        </div>
      </div>
    </section>
  )
}
