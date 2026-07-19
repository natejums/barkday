import { fireEvent, render, screen, within } from '@testing-library/react'
import { describe, expect, it } from 'vitest'
import { App } from './App'

describe('App', () => {
  it('shows a result on first paint, without the visitor typing anything', () => {
    render(<App />)

    expect(screen.getByRole('heading', { name: /barkday/i })).toBeInTheDocument()
    // The default state is a real dog, so a headline number must be present.
    expect(screen.getByRole('heading', { level: 2, name: /is about .* human years old/i })).toBeInTheDocument()
  })

  it('announces the headline to assistive tech through a live region', () => {
    // The results column updates in a place the user is not focused on, so
    // without this a screen-reader user gets no signal that the answer moved.
    render(<App />)

    const status = screen.getByRole('status')
    expect(status).toHaveTextContent(/is about [\d.]+ human years old/i)
    expect(status).toHaveTextContent(/life stage/i)
  })

  it('renders all four models with the headline one marked', () => {
    render(<App />)

    const section = screen.getByRole('region', { name: /how the models disagree/i })
    expect(within(section).getByText(/Barkday estimate/)).toBeInTheDocument()
    expect(within(section).getByText(/times seven/i)).toBeInTheDocument()
    expect(within(section).getByText(/Epigenetic clock/)).toBeInTheDocument()
    expect(within(section).getByText(/Veterinary chart/)).toBeInTheDocument()
  })

  it('offers the life stage and its care guidance', () => {
    render(<App />)

    const care = screen.getByRole('region', { name: /care for a/i })
    expect(within(care).getAllByRole('listitem').length).toBeGreaterThan(2)
  })

  it('exposes the form controls a visitor needs', () => {
    render(<App />)

    expect(screen.getByLabelText(/^age$/i)).toBeInTheDocument()
    expect(screen.getByRole('combobox', { name: /breed/i })).toBeInTheDocument()
    expect(screen.getByRole('group', { name: /body condition score/i })).toBeInTheDocument()
    expect(screen.getByRole('group', { name: /activity level/i })).toBeInTheDocument()
  })

  it('carries the not-veterinary-advice disclaimer', () => {
    render(<App />)
    expect(screen.getByText(/not veterinary advice/i)).toBeInTheDocument()
  })

  it('does not congratulate a visitor on care they never described', () => {
    // The landing view has nothing entered but age, so the recommendations list
    // is empty because nothing was assessed — not because everything is fine.
    render(<App />)

    expect(screen.getByText(/0 of 10 details filled in/i)).toBeInTheDocument()
    expect(screen.queryByText(/doing well on every factor/i)).not.toBeInTheDocument()
    expect(screen.getByText(/nothing to go on yet/i)).toBeInTheDocument()
  })

  it('does not claim a breed baseline when no breed is known', () => {
    // The warning directly above this card says medium-dog population averages
    // were assumed; the baseline copy must not contradict it.
    render(<App />)

    expect(screen.getByText(/population averages were assumed/i)).toBeInTheDocument()
    expect(screen.getByText(/baseline for a dog of this size/i)).toBeInTheDocument()
    expect(screen.queryByText(/for this breed and size/i)).not.toBeInTheDocument()
  })

  it('shows a breed-specific health panel once a breed is set', () => {
    render(<App />)

    // No breed on the landing view, so no health panel yet.
    expect(screen.queryByRole('region', { name: /health to watch/i })).not.toBeInTheDocument()

    fireEvent.change(screen.getByRole('combobox', { name: /breed/i }), {
      target: { value: 'Great Dane' },
    })

    const panel = screen.getByRole('region', { name: /great dane — health to watch/i })
    // A deep-chested breed gets the bloat feeding callout.
    expect(within(panel).getByText(/guard against bloat/i)).toBeInTheDocument()
    // And the full documented list is reachable.
    expect(within(panel).getByText(/by body system/i)).toBeInTheDocument()
  })

  it('defaults the weight unit to pounds', () => {
    render(<App />)
    const unit = screen.getByRole('combobox', { name: /weight unit/i }) as HTMLSelectElement
    expect(unit.value).toBe('lb')
  })

  it('spells out how to read the body condition score', () => {
    render(<App />)
    // The instruction and the ideal target are both present up front.
    expect(screen.getByText(/feel along the ribs/i)).toBeInTheDocument()
    expect(screen.getByText(/4–5 · ideal/i)).toBeInTheDocument()
    const ideal = screen.getByRole('button', { name: /body condition 5 of 9, ideal/i })
    expect(ideal).toBeInTheDocument()
  })

  it('turns the breed picker into a mix when the box is ticked', () => {
    render(<App />)

    // Single breed picker to start; no numbered breed rows.
    expect(screen.getByRole('combobox', { name: /^breed$/i })).toBeInTheDocument()
    expect(screen.queryByRole('combobox', { name: /breed 1/i })).not.toBeInTheDocument()

    fireEvent.click(screen.getByRole('checkbox', { name: /mixed breed/i }))

    // Two component rows appear, each its own breed picker with a percentage.
    expect(screen.getByRole('combobox', { name: /breed 1/i })).toBeInTheDocument()
    expect(screen.getByRole('combobox', { name: /breed 2/i })).toBeInTheDocument()
    expect(screen.getByRole('spinbutton', { name: /breed 1 percentage/i })).toBeInTheDocument()
  })

  it('shows a blended health panel for a known mix', () => {
    render(<App />)
    fireEvent.click(screen.getByRole('checkbox', { name: /mixed breed/i }))

    fireEvent.change(screen.getByRole('combobox', { name: /breed 1/i }), {
      target: { value: 'Great Dane' },
    })
    fireEvent.change(screen.getByRole('combobox', { name: /breed 2/i }), {
      target: { value: 'Poodle (Standard)' },
    })

    // The health panel names the blend and still surfaces the Dane's bloat callout.
    const panel = screen.getByRole('region', { name: /health to watch/i })
    expect(within(panel).getByText(/great dane/i)).toBeInTheDocument()
    expect(within(panel).getByText(/guard against bloat/i)).toBeInTheDocument()
  })

  it('reveals the neuter-timing question only after a dog is marked neutered', () => {
    render(<App />)

    expect(screen.queryByRole('group', { name: /neutered before a year/i })).not.toBeInTheDocument()

    const neuterGroup = screen.getByRole('group', { name: /neutered or spayed/i })
    fireEvent.click(within(neuterGroup).getByRole('button', { name: /^yes$/i }))

    expect(screen.getByRole('group', { name: /neutered before a year/i })).toBeInTheDocument()
  })

  it('credits McMillan for what it rules out rather than for a modifier', () => {
    // The engine deliberately applies no skull-shape penalty, so the footer
    // must not tell visitors it does.
    render(<App />)

    const footer = screen.getByText(/built on peer-reviewed work/i)
    expect(footer).toHaveTextContent(/McMillan et al\. \(2024\) is why skull shape/i)
    expect(footer).not.toHaveTextContent(/McMillan et al\. \(2024\) for skull shape/i)
  })
})
