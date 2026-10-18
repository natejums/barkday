import { CALENDAR_WHEN_LABELS } from '../../core'
import type {
  CalendarItem,
  CalendarWhen,
  Confidence,
  DeepReport,
  DogAgeResult,
  ReportInsight,
  Topic,
  TopicGroup,
} from '../../core'
import { FactorWaterfall } from '../components/FactorWaterfall'
import { BreedHealth, Warnings } from '../components/Guidance'
import { HeroResult } from '../components/HeroResult'
import { ModelComparison } from '../components/ModelComparison'

const EVIDENCE_LABEL: Record<Confidence, string> = {
  high: 'strong evidence',
  moderate: 'moderate evidence',
  low: 'weak evidence',
}

export function EvidenceTag({ level }: { level: Confidence }) {
  return (
    <span className="evidence" data-level={level}>
      {EVIDENCE_LABEL[level]}
    </span>
  )
}

/** The four panels the seventeen topics fold into. */
const PANELS: readonly { id: string; title: string; subtitle: string; topics: readonly Topic[] }[] = [
  {
    id: 'food-body',
    title: 'Food, water and body',
    subtitle: 'What goes in, and what it is doing to the frame.',
    topics: ['weight', 'food', 'water', 'dental'],
  },
  {
    id: 'mind-company',
    title: 'Movement, mind and company',
    subtitle: 'Exercise, enrichment, sleep, fear, training and who is around.',
    topics: ['exercise', 'mind', 'social', 'behaviour'],
  },
  {
    id: 'prevention-home',
    title: 'Prevention, home and safety',
    subtitle: 'Vet care, vaccines, parasites, identification, the house and the car.',
    topics: ['prevention', 'home', 'safety', 'readiness'],
  },
  {
    id: 'story-breed',
    title: 'Their story, their stage, their breed',
    subtitle: 'What this particular dog’s history, age and ancestry ask for.',
    topics: ['story', 'stage', 'breed', 'conditions', 'signs'],
  },
]

const WHEN_ORDER: readonly CalendarWhen[] = [
  'this-week',
  'this-month',
  'next-3-months',
  'next-6-months',
  'this-year',
  'monthly',
  'every-6-months',
]

function Insight({ insight, rank }: { insight: ReportInsight; rank?: number }) {
  return (
    <div className="move" data-kind={insight.kind}>
      <div className="move__badge">
        {insight.potentialYears !== undefined ? (
          <span className="rec__gain" title="Years the lifespan model gives back for this change">
            +{insight.potentialYears.toFixed(2)}
          </span>
        ) : rank !== undefined ? (
          <span className="move__rank" aria-hidden="true">
            {rank}
          </span>
        ) : (
          <span className="rec__gain" data-empty="true">
            {insight.kind === 'flag' ? 'Know' : insight.kind === 'win' ? 'Good' : insight.kind === 'question' ? 'Ask' : 'Note'}
          </span>
        )}
      </div>
      <div className="move__body">
        <p className="move__title">{insight.title}</p>
        <p className="move__why">{insight.why}</p>
        {insight.how ? (
          <p className="move__how">
            <strong>What to do:</strong> {insight.how}
          </p>
        ) : null}
        <p className="move__meta">
          <EvidenceTag level={insight.evidence} />
        </p>
      </div>
    </div>
  )
}

function CompactInsight({ insight }: { insight: ReportInsight }) {
  return (
    <details className="health-item health-item--expandable">
      <summary className="health-item__head">
        <span className="health-item__label">{insight.title}</span>
        <EvidenceTag level={insight.evidence} />
      </summary>
      <div className="health-item__body">
        <p>{insight.why}</p>
        {insight.how ? (
          <p>
            <strong>What to do:</strong> {insight.how}
          </p>
        ) : null}
      </div>
    </details>
  )
}

function PlanCard({
  result,
  report,
  onPrint,
}: {
  result: DogAgeResult
  report: DeepReport
  onPrint: () => void
}) {
  const name = result.profile.name?.trim()
  return (
    <section className="card report" aria-labelledby="plan-heading">
      <header className="card__header plan__header">
        <div>
          <h2 className="card__title" id="plan-heading">
            {name ? `${name}'s plan` : 'Your dog’s plan'}
          </h2>
          <p className="card__subtitle">
            Built from {report.insightCount} findings across your answers · {report.completeness.answered} of{' '}
            {report.completeness.total} questions answered · report {report.signature}
          </p>
        </div>
        <button type="button" className="theme-toggle no-print" onClick={onPrint}>
          Printable report
        </button>
      </header>

      <div className="report__body">
        {report.story.map((paragraph, index) => (
          <p className="report__para" key={index}>
            {paragraph}
          </p>
        ))}
      </div>

      {report.moves.length > 0 ? (
        <>
          <p className="report__ideas-title">Top proactive moves, in order</p>
          <div className="moves">
            {report.moves.map((move, index) => (
              <Insight insight={move} rank={index + 1} key={move.id} />
            ))}
          </div>
          <p className="field__help" style={{ marginTop: 12 }}>
            Where a figure is shown, it is the years the lifespan model gives back for that one
            change — already discounted for overlap with everything else, so they don’t simply add
            up. Moves without a figure are ranked by the strength and urgency of the evidence.
          </p>
        </>
      ) : null}
    </section>
  )
}

function FlagsCard({ flags }: { flags: readonly ReportInsight[] }) {
  if (flags.length === 0) return null
  return (
    <section className="card" aria-labelledby="flags-heading">
      <header className="card__header">
        <h2 className="card__title" id="flags-heading">
          Worth knowing now
        </h2>
        <p className="card__subtitle">
          The things that can’t wait for a routine visit: emergencies to recognise, and risks that
          apply to this dog in particular.
        </p>
      </header>
      <div className="moves">
        {flags.map((flag) => (
          <Insight insight={flag} key={flag.id} />
        ))}
      </div>
    </section>
  )
}

function WinsCard({ wins, name }: { wins: readonly ReportInsight[]; name: string }) {
  if (wins.length === 0) return null
  return (
    <section className="card" aria-labelledby="wins-heading">
      <header className="card__header">
        <h2 className="card__title" id="wins-heading">
          What’s going well for {name}
        </h2>
        <p className="card__subtitle">
          Not flattery — each of these is a thing the research says matters, that you are already
          doing.
        </p>
      </header>
      <div className="moves">
        {wins.map((win) => (
          <Insight insight={win} key={win.id} />
        ))}
      </div>
    </section>
  )
}

export function CalendarList({ calendar }: { calendar: readonly CalendarItem[] }) {
  const groups = WHEN_ORDER.map((when) => ({ when, items: calendar.filter((i) => i.when === when) })).filter(
    (g) => g.items.length > 0,
  )
  return (
    <div className="calendar">
      {groups.map((group) => (
        <div className="calendar__group" key={group.when}>
          <p className="calendar__when">{CALENDAR_WHEN_LABELS[group.when]}</p>
          <ul className="checklist">
            {group.items.map((item) => (
              <li key={item.id}>
                <span>
                  <strong>{item.title}.</strong> {item.detail}
                </span>
              </li>
            ))}
          </ul>
        </div>
      ))}
    </div>
  )
}

function CalendarCard({ calendar }: { calendar: readonly CalendarItem[] }) {
  if (calendar.length === 0) return null
  return (
    <section className="card" aria-labelledby="calendar-heading">
      <header className="card__header">
        <h2 className="card__title" id="calendar-heading">
          The next twelve months
        </h2>
        <p className="card__subtitle">
          The same advice as a plan: what to do and roughly when. “Every six months” only happens
          if it is written down somewhere.
        </p>
      </header>
      <CalendarList calendar={calendar} />
    </section>
  )
}

function TopicPanel({
  panel,
  groups,
}: {
  panel: (typeof PANELS)[number]
  groups: readonly TopicGroup[]
}) {
  const mine = groups.filter((g) => panel.topics.includes(g.topic))
  if (mine.length === 0) return null
  return (
    <section className="card" aria-labelledby={`panel-${panel.id}`}>
      <header className="card__header">
        <h2 className="card__title" id={`panel-${panel.id}`}>
          {panel.title}
        </h2>
        <p className="card__subtitle">{panel.subtitle}</p>
      </header>
      {mine.map((group) => (
        <div className="health__block" key={group.topic}>
          <p className="health__block-title">{group.label}</p>
          <div className="health__list">
            {group.insights.map((insight) => (
              <CompactInsight insight={insight} key={insight.id} />
            ))}
          </div>
        </div>
      ))}
    </section>
  )
}

function VetQuestionsCard({ questions }: { questions: readonly ReportInsight[] }) {
  if (questions.length === 0) return null
  return (
    <section className="card" aria-labelledby="questions-heading">
      <header className="card__header">
        <h2 className="card__title" id="questions-heading">
          Bring to the next vet visit
        </h2>
        <p className="card__subtitle">
          Questions, not diagnoses. Each comes from something you noticed or something already known.
        </p>
      </header>
      <div className="moves">
        {questions.map((q) => (
          <Insight insight={q} key={q.id} />
        ))}
      </div>
    </section>
  )
}

function GearCard({ report }: { report: DeepReport }) {
  if (report.gear.length === 0) return null
  return (
    <section className="card" aria-labelledby="deep-gear-heading">
      <header className="card__header">
        <h2 className="card__title" id="deep-gear-heading">
          Gear that tends to help
        </h2>
        <p className="card__subtitle">
          Generic categories tied to the findings above — no brands, no links, nothing sponsored.
        </p>
      </header>
      <div>
        {report.gear.map((product) => (
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

export function SourcesList({ report }: { report: DeepReport }) {
  return (
    <ol className="sources">
      {report.sources.map((source) => (
        <li key={source.id} id={`source-${source.id}`}>
          <span className="sources__short">{source.short}.</span> {source.citation}{' '}
          {source.url ? (
            <a href={source.url} rel="noopener noreferrer">
              {source.url.replace(/^https?:\/\//, '')}
            </a>
          ) : null}
        </li>
      ))}
    </ol>
  )
}

function SourcesCard({ report }: { report: DeepReport }) {
  if (report.sources.length === 0) return null
  return (
    <section className="card" aria-labelledby="sources-heading">
      <header className="card__header">
        <h2 className="card__title" id="sources-heading">
          The research behind this report
        </h2>
        <p className="card__subtitle">
          Only the {report.sources.length} sources this particular report drew on, in order of first
          use. Each finding above is labelled with how strong its evidence is.
        </p>
      </header>
      <SourcesList report={report} />
    </section>
  )
}

export function DeepResults({
  result,
  report,
  onPrint,
}: {
  result: DogAgeResult
  report: DeepReport
  onPrint: () => void
}) {
  const name = result.profile.name?.trim() || 'your dog'
  return (
    <>
      <HeroResult result={result} />
      <PlanCard result={result} report={report} onPrint={onPrint} />
      <FlagsCard flags={report.flags} />
      <WinsCard wins={report.wins} name={name} />
      <CalendarCard calendar={report.calendar} />
      {PANELS.map((panel) => (
        <TopicPanel panel={panel} groups={report.topics} key={panel.id} />
      ))}
      <VetQuestionsCard questions={report.vetQuestions} />
      <GearCard report={report} />
      {result.breedHealth ? <BreedHealth result={result} /> : null}
      <details className="card numbers">
        <summary className="health__all-summary">The numbers — the factors, and how the four models disagree</summary>
        <div className="numbers__body">
          <Warnings warnings={result.warnings} />
          <FactorWaterfall lifespan={result.lifespan} breedKnown={result.breed !== undefined} />
          <ModelComparison models={result.models} />
        </div>
      </details>
      <SourcesCard report={report} />
    </>
  )
}
