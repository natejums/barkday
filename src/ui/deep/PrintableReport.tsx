import { describeYears } from '../../core'
import type { DeepReport, DogAgeResult, ReportInsight } from '../../core'
import { CalendarList, EvidenceTag, SourcesList } from './DeepResults'

interface Props {
  result: DogAgeResult
  report: DeepReport
  printedOn: string
  onBack: () => void
}

function PrintInsight({ insight, rank }: { insight: ReportInsight; rank?: number }) {
  return (
    <li className="print-item">
      <p className="print-item__title">
        {rank !== undefined ? <span className="print-item__rank">{rank}.</span> : null} {insight.title}
        {insight.potentialYears !== undefined ? (
          <span className="print-item__gain"> +{insight.potentialYears.toFixed(2)} yrs</span>
        ) : null}
      </p>
      <p className="print-item__why">{insight.why}</p>
      {insight.how ? (
        <p className="print-item__how">
          <strong>What to do:</strong> {insight.how}
        </p>
      ) : null}
      <p className="print-item__meta">
        <EvidenceTag level={insight.evidence} />
      </p>
    </li>
  )
}

/**
 * The 2.0 report laid out for paper: one column, no controls, nothing that
 * needs a click to read. The browser's print dialog turns it into a PDF.
 */
export function PrintableReport({ result, report, printedOn, onBack }: Props) {
  const name = result.profile.name?.trim() || 'Your dog'
  const { humanAge, lifeStage, lifespan, remaining } = result

  function print() {
    if (typeof window !== 'undefined' && typeof window.print === 'function') window.print()
  }

  return (
    <article className="print-report" aria-labelledby="print-heading">
      <div className="print-report__toolbar no-print">
        <button type="button" className="theme-toggle" onClick={onBack}>
          ← Back to the calculator
        </button>
        <button type="button" className="theme-toggle theme-toggle--primary" onClick={print}>
          Print or save as PDF
        </button>
      </div>

      <header className="print-report__head">
        <p className="print-report__kicker">Barkday 2.0 · Proactive care report</p>
        <h1 className="print-report__title" id="print-heading">
          {name}
        </h1>
        <p className="print-report__sub">
          {result.breed ? `${result.breed.name} · ` : ''}
          {describeYears(result.profile.ageYears).label} old · prepared {printedOn} · report {report.signature}
        </p>
        <div className="print-report__stats">
          <div>
            <p className="tile__label">Human-age equivalent</p>
            <p className="tile__value">{humanAge.years}</p>
            <p className="tile__detail">
              likely {humanAge.rangeYears[0]}–{humanAge.rangeYears[1]}
            </p>
          </div>
          <div>
            <p className="tile__label">Life stage</p>
            <p className="tile__value">{lifeStage.label}</p>
            <p className="tile__detail">
              {lifeStage.nextStage ? `${lifeStage.nextStage.label} from ${lifeStage.nextStage.atAgeYears} yrs` : 'The final stage'}
            </p>
          </div>
          <div>
            <p className="tile__label">Expected lifespan</p>
            <p className="tile__value">{lifespan.expectedYears} yrs</p>
            <p className="tile__detail">
              range {lifespan.rangeYears[0]}–{lifespan.rangeYears[1]}
            </p>
          </div>
          <div>
            <p className="tile__label">Time likely ahead</p>
            <p className="tile__value">{remaining.years > 0 ? remaining.label : 'Every day a gift'}</p>
            <p className="tile__detail">
              {remaining.years > 0 ? `around ${remaining.rangeYears[0]}–${remaining.rangeYears[1]} more years` : 'already past the average'}
            </p>
          </div>
        </div>
      </header>

      <section className="print-section">
        <h2>A note about {name}</h2>
        {report.story.map((paragraph, index) => (
          <p className="print-para" key={index}>
            {paragraph}
          </p>
        ))}
      </section>

      {report.moves.length > 0 ? (
        <section className="print-section">
          <h2>Top proactive moves, in order</h2>
          <ol className="print-list">
            {report.moves.map((move, index) => (
              <PrintInsight insight={move} rank={index + 1} key={move.id} />
            ))}
          </ol>
          <p className="print-note">
            A figure in years is what the lifespan model gives back for that one change, already
            discounted for overlap, so the figures do not simply add up.
          </p>
        </section>
      ) : null}

      {report.flags.length > 0 ? (
        <section className="print-section">
          <h2>Worth knowing now</h2>
          <ul className="print-list">
            {report.flags.map((flag) => (
              <PrintInsight insight={flag} key={flag.id} />
            ))}
          </ul>
        </section>
      ) : null}

      {report.calendar.length > 0 ? (
        <section className="print-section">
          <h2>The next twelve months</h2>
          <CalendarList calendar={report.calendar} />
        </section>
      ) : null}

      {report.vetQuestions.length > 0 ? (
        <section className="print-section">
          <h2>Bring to the next vet visit</h2>
          <ul className="print-list print-list--checkboxes">
            {report.vetQuestions.map((q) => (
              <li className="print-item" key={q.id}>
                <p className="print-item__title">
                  <span className="print-checkbox" aria-hidden="true" /> {q.title}
                </p>
                <p className="print-item__why">{q.why}</p>
              </li>
            ))}
          </ul>
        </section>
      ) : null}

      {report.wins.length > 0 ? (
        <section className="print-section">
          <h2>What’s going well</h2>
          <ul className="print-list">
            {report.wins.map((win) => (
              <li className="print-item" key={win.id}>
                <p className="print-item__title">{win.title}</p>
                <p className="print-item__why">{win.why}</p>
              </li>
            ))}
          </ul>
        </section>
      ) : null}

      {report.topics.length > 0 ? (
        <section className="print-section">
          <h2>The detail, by topic</h2>
          {report.topics.map((group) => (
            <div className="print-topic" key={group.topic}>
              <h3>{group.label}</h3>
              <ul className="print-list print-list--compact">
                {group.insights.map((insight) => (
                  <li className="print-item" key={insight.id}>
                    <p className="print-item__title">{insight.title}</p>
                    <p className="print-item__why">{insight.how ?? insight.why}</p>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </section>
      ) : null}

      {report.gear.length > 0 ? (
        <section className="print-section">
          <h2>Gear that tends to help</h2>
          <ul className="print-list print-list--compact">
            {report.gear.map((product) => (
              <li className="print-item" key={product.id}>
                <p className="print-item__title">{product.title}</p>
                <p className="print-item__why">{product.detail}</p>
              </li>
            ))}
          </ul>
          <p className="print-note">Generic categories only — no brands, no links, nothing sponsored.</p>
        </section>
      ) : null}

      {result.breedHealth && result.breedHealth.priorityNow.length > 0 ? (
        <section className="print-section">
          <h2>{result.breedHealth.breedName} — health to watch around this age</h2>
          <ul className="print-list print-list--compact">
            {result.breedHealth.priorityNow.map((concern, index) => (
              <li className="print-item" key={`${concern.label}-${index}`}>
                <p className="print-item__title">{concern.label}</p>
                {concern.condition ? (
                  <p className="print-item__why">
                    <strong>Watch for:</strong> {concern.condition.signs} <strong>What helps:</strong>{' '}
                    {concern.condition.action}
                  </p>
                ) : null}
              </li>
            ))}
          </ul>
        </section>
      ) : null}

      <section className="print-section">
        <h2>Sources</h2>
        <SourcesList report={report} />
      </section>

      <footer className="print-report__foot">
        <p>
          <strong>This is not veterinary advice.</strong> Every figure here is a population average
          pointed at one animal, and no model can see the dog in front of you. Bring this to your
          vet and let them tell you which parts apply. Barkday — the world’s best dog age calculator —
          is open source and free; nothing in this report was sent anywhere or written by a language
          model.
        </p>
      </footer>
    </article>
  )
}
