import { composeDogReport } from '../../core'
import type { DogAgeResult } from '../../core'

/**
 * The warm, personalised note. It sits high in the results on purpose — the
 * first thing after the number should be a reason to feel good, not a countdown.
 */
export function DogReport({ result }: { result: DogAgeResult }) {
  const report = composeDogReport(result)
  const name = result.profile.name?.trim()

  return (
    <section className="card report" aria-labelledby="report-heading">
      <header className="card__header">
        <h2 className="card__title" id="report-heading">
          {name ? `A note about ${name}` : 'A note about your dog'}
        </h2>
        <p className="card__subtitle">
          This isn't a countdown. It's here to help you make the most of the time you have together.
        </p>
      </header>

      <div className="report__body">
        {report.paragraphs.map((paragraph, index) => (
          <p className="report__para" key={index}>
            {paragraph}
          </p>
        ))}
      </div>

      {report.togetherIdeas.length > 0 ? (
        <>
          <p className="report__ideas-title">Ways to make the most of this stage together</p>
          <ul className="checklist report__ideas">
            {report.togetherIdeas.map((idea) => (
              <li key={idea}>{idea}</li>
            ))}
          </ul>
        </>
      ) : null}
    </section>
  )
}
