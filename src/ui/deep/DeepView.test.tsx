import { fireEvent, render, screen, within } from '@testing-library/react'
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import { App } from '../App'

function openDeep() {
  render(<App />)
  fireEvent.click(screen.getByRole('tab', { name: /2\.0/i }))
}

describe('Barkday 2.0', () => {
  beforeEach(() => {
    window.location.hash = ''
  })
  afterEach(() => {
    window.location.hash = ''
  })

  it('opens on the classic calculator, with 2.0 one tab away', () => {
    render(<App />)
    expect(screen.getByRole('tab', { name: /classic/i })).toHaveAttribute('aria-selected', 'true')
    expect(screen.getByRole('tab', { name: /2\.0/i })).toHaveAttribute('aria-selected', 'false')
    expect(screen.getByText(/0 of 10 details filled in/i)).toBeInTheDocument()
  })

  it('brands both versions as the world’s best dog age calculator', () => {
    render(<App />)
    expect(screen.getByText(/world's best dog age calculator/i)).toBeInTheDocument()
  })

  it('switches to 2.0 and puts the tab in the URL hash', () => {
    openDeep()
    expect(screen.getByRole('tab', { name: /2\.0/i })).toHaveAttribute('aria-selected', 'true')
    expect(window.location.hash).toBe('#2.0')
    expect(screen.getByRole('region', { name: /your dog’s plan/i })).toBeInTheDocument()
  })

  it('opens straight onto 2.0 when the page is loaded with #2.0', () => {
    window.location.hash = '#2.0'
    render(<App />)
    expect(screen.getByRole('tab', { name: /2\.0/i })).toHaveAttribute('aria-selected', 'true')
  })

  it('keeps the classic essentials and folds the in-depth questions into groups', () => {
    openDeep()
    expect(screen.getByLabelText(/^age$/i)).toBeInTheDocument()
    expect(screen.getByRole('combobox', { name: /^breed$/i })).toBeInTheDocument()
    expect(screen.getByRole('group', { name: /body condition score/i })).toBeInTheDocument()
    for (const group of [
      /their story — where they came from/i,
      /^food and water$/i,
      /daily life — exercise/i,
      /mind and company — fear/i,
      /^health and prevention$/i,
      /home and safety — climate/i,
      /being ready — for the bad day/i,
    ]) {
      expect(screen.getByText(group)).toBeInTheDocument()
    }
    expect(screen.getByRole('group', { name: /how do they get their water/i })).toBeInTheDocument()
    expect(screen.getByRole('group', { name: /how did they come to you/i })).toBeInTheDocument()
    expect(screen.getByRole('group', { name: /what kind of food/i })).toBeInTheDocument()
  })

  it('names the dog in the plan and reacts to the answers', () => {
    openDeep()
    fireEvent.change(screen.getByLabelText(/name/i), { target: { value: 'Jesse' } })
    expect(screen.getByRole('region', { name: /jesse's plan/i })).toBeInTheDocument()

    fireEvent.change(screen.getByRole('combobox', { name: /^breed$/i }), { target: { value: 'Great Dane' } })
    const flags = screen.getByRole('region', { name: /worth knowing now/i })
    expect(within(flags).getByText(/signs of bloat/i)).toBeInTheDocument()

    const water = screen.getByRole('group', { name: /how do they get their water/i })
    fireEvent.click(within(water).getByRole('button', { name: /mostly outdoors/i }))
    expect(within(screen.getByRole('region', { name: /worth knowing now/i })).getByText(/leptospirosis and algae/i)).toBeInTheDocument()
  })

  it('treats “nothing diagnosed” as an answer and clears the list', () => {
    openDeep()
    const group = screen.getByRole('group', { name: /anything already diagnosed/i })
    fireEvent.click(within(group).getByRole('button', { name: /^arthritis$/i }))
    expect(within(group).getByRole('button', { name: /^arthritis$/i })).toHaveAttribute('aria-pressed', 'true')
    fireEvent.click(within(group).getByRole('button', { name: /nothing diagnosed/i }))
    expect(within(group).getByRole('button', { name: /^arthritis$/i })).toHaveAttribute('aria-pressed', 'false')
    expect(within(group).getByRole('button', { name: /nothing diagnosed/i })).toHaveAttribute('aria-pressed', 'true')
  })

  it('shows the calendar, the vet questions and the sources', () => {
    openDeep()
    fireEvent.change(screen.getByRole('combobox', { name: /^breed$/i }), { target: { value: 'Labrador Retriever' } })
    const signs = screen.getByRole('group', { name: /noticed any of these lately/i })
    fireEvent.click(within(signs).getByRole('button', { name: /bad breath/i }))
    expect(screen.getByRole('region', { name: /next twelve months/i })).toBeInTheDocument()
    expect(within(screen.getByRole('region', { name: /bring to the next vet visit/i })).getByText(/bad breath is disease/i)).toBeInTheDocument()
    const sources = screen.getByRole('region', { name: /research behind this report/i })
    expect(within(sources).getAllByRole('listitem').length).toBeGreaterThan(3)
  })

  it('offers a printable version of the report and prints it', () => {
    const print = vi.fn()
    window.print = print
    openDeep()
    fireEvent.change(screen.getByLabelText(/name/i), { target: { value: 'Jesse' } })
    fireEvent.click(screen.getByRole('button', { name: /printable report/i }))

    expect(screen.getByRole('heading', { level: 1, name: /jesse/i })).toBeInTheDocument()
    expect(screen.getByText(/proactive care report/i)).toBeInTheDocument()
    // The form is gone from the page in the print view.
    expect(screen.queryByLabelText(/^age$/i)).not.toBeInTheDocument()

    fireEvent.click(screen.getByRole('button', { name: /print or save as pdf/i }))
    expect(print).toHaveBeenCalledTimes(1)

    fireEvent.click(screen.getByRole('button', { name: /back to the calculator/i }))
    expect(screen.getByLabelText(/^age$/i)).toBeInTheDocument()
  })

  it('still carries the not-veterinary-advice disclaimer on 2.0', () => {
    openDeep()
    expect(screen.getByText(/not veterinary advice/i)).toBeInTheDocument()
  })
})
