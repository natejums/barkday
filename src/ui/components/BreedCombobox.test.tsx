import { fireEvent, render, screen, within } from '@testing-library/react'
import { useState } from 'react'
import { describe, expect, it } from 'vitest'
import { BreedCombobox } from './BreedCombobox'

/** The real thing is controlled, so drive it the way the app does. */
function Harness({ onPick }: { onPick?: (name: string) => void }) {
  const [value, setValue] = useState('')
  return (
    <BreedCombobox
      value={value}
      onChange={(name) => {
        setValue(name)
        onPick?.(name)
      }}
    />
  )
}

function openWith(query: string) {
  const input = screen.getByRole('combobox', { name: /breed/i })
  fireEvent.focus(input)
  fireEvent.change(input, { target: { value: query } })
  return input
}

describe('BreedCombobox', () => {
  it('points aria-activedescendant at the highlighted option', () => {
    render(<Harness />)
    const input = openWith('lab')

    const options = within(screen.getByRole('listbox')).getAllByRole('option')
    expect(options.length).toBeGreaterThan(1)

    // The first result starts highlighted, and the attribute must name it by id
    // rather than leaving a screen reader to infer it from styling.
    expect(options[0]).toHaveAttribute('aria-selected', 'true')
    expect(input).toHaveAttribute('aria-activedescendant', options[0]!.id)

    fireEvent.keyDown(input, { key: 'ArrowDown' })
    expect(input).toHaveAttribute('aria-activedescendant', options[1]!.id)
    expect(options[1]).toHaveAttribute('aria-selected', 'true')
  })

  it('wraps around the ends of the list', () => {
    render(<Harness />)
    const input = openWith('lab')
    const options = within(screen.getByRole('listbox')).getAllByRole('option')

    fireEvent.keyDown(input, { key: 'ArrowUp' })
    expect(input).toHaveAttribute('aria-activedescendant', options.at(-1)!.id)
  })

  it('selects the highlighted breed on Enter, resolving nicknames', () => {
    const picked: string[] = []
    render(<Harness onPick={(name) => picked.push(name)} />)
    const input = openWith('Frenchie')

    fireEvent.keyDown(input, { key: 'Enter' })

    expect(picked.at(-1)).toBe('French Bulldog')
    expect(screen.queryByRole('listbox')).not.toBeInTheDocument()
  })

  it('closes on Escape without choosing anything', () => {
    const picked: string[] = []
    render(<Harness onPick={(name) => picked.push(name)} />)
    const input = openWith('lab')

    fireEvent.keyDown(input, { key: 'Escape' })

    expect(screen.queryByRole('listbox')).not.toBeInTheDocument()
    // 'lab' is what typing reported; Escape must not have upgraded it to a breed.
    expect(picked.at(-1)).toBe('lab')
  })

  it('explains itself when nothing matches, and highlights nothing', () => {
    render(<Harness />)
    const input = openWith('qqqqqqzzz')

    expect(within(screen.getByRole('listbox')).queryAllByRole('option')).toHaveLength(0)
    expect(screen.getByText(/no match/i)).toBeInTheDocument()
    expect(input).not.toHaveAttribute('aria-activedescendant')
  })
})
