import { render, screen, within } from '@testing-library/react'
import { describe, expect, it } from 'vitest'
import { App } from './App'

describe('App', () => {
  it('shows a result on first paint, without the visitor typing anything', () => {
    render(<App />)

    expect(screen.getByRole('heading', { name: /barkday/i })).toBeInTheDocument()
    // The default state is a real dog, so a headline number must be present.
    expect(screen.getByText(/human years old/i)).toBeInTheDocument()
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
})
