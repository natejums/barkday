import { useEffect, useId, useMemo, useRef, useState } from 'react'
import { searchBreeds } from '../../core'
import type { Breed } from '../../core'

interface Props {
  value: string
  onChange: (breedName: string) => void
}

/**
 * A searchable breed picker.
 *
 * Written by hand rather than pulled from a library: the engine has no
 * dependencies and it would be a shame for the UI to add three thousand
 * transitive ones for a filtered list. Keyboard support is the part people
 * actually skip, so it is here — arrows to move, Enter to pick, Escape to close.
 */
export function BreedCombobox({ value, onChange }: Props) {
  const [query, setQuery] = useState(value)
  const [open, setOpen] = useState(false)
  const [activeIndex, setActiveIndex] = useState(0)
  const containerRef = useRef<HTMLDivElement>(null)
  const listId = useId()

  const results = useMemo(() => searchBreeds(query, 40), [query])

  // Keep the input in step when the profile is changed from elsewhere.
  useEffect(() => {
    setQuery(value)
  }, [value])

  useEffect(() => {
    if (!open) return
    function onPointerDown(event: PointerEvent) {
      if (!containerRef.current?.contains(event.target as Node)) setOpen(false)
    }
    document.addEventListener('pointerdown', onPointerDown)
    return () => document.removeEventListener('pointerdown', onPointerDown)
  }, [open])

  function select(breed: Breed) {
    onChange(breed.name)
    setQuery(breed.name)
    setOpen(false)
  }

  function onKeyDown(event: React.KeyboardEvent<HTMLInputElement>) {
    if (event.key === 'ArrowDown' || event.key === 'ArrowUp') {
      event.preventDefault()
      if (!open) {
        setOpen(true)
        return
      }
      const delta = event.key === 'ArrowDown' ? 1 : -1
      setActiveIndex((index) => {
        const next = index + delta
        if (next < 0) return results.length - 1
        if (next >= results.length) return 0
        return next
      })
      return
    }

    if (event.key === 'Enter' && open) {
      const breed = results[activeIndex]
      if (breed) {
        event.preventDefault()
        select(breed)
      }
      return
    }

    if (event.key === 'Escape') {
      setOpen(false)
    }
  }

  return (
    <div className="field">
      <label className="field__label" htmlFor={`${listId}-input`}>
        Breed
      </label>
      <div className="combobox" ref={containerRef}>
        <input
          id={`${listId}-input`}
          className="input"
          type="text"
          role="combobox"
          autoComplete="off"
          aria-expanded={open}
          aria-controls={listId}
          aria-autocomplete="list"
          placeholder="Start typing, or leave blank"
          value={query}
          onChange={(event) => {
            setQuery(event.target.value)
            onChange(event.target.value)
            setActiveIndex(0)
            setOpen(true)
          }}
          onFocus={() => setOpen(true)}
          onKeyDown={onKeyDown}
        />

        {open ? (
          <ul className="combobox__list" id={listId} role="listbox">
            {results.length === 0 ? (
              <li className="combobox__empty">
                No match. Leaving this blank still works — the estimate falls back to
                population averages.
              </li>
            ) : (
              results.map((breed, index) => (
                <li
                  key={breed.name}
                  role="option"
                  aria-selected={index === activeIndex}
                  className="combobox__option"
                  onPointerEnter={() => setActiveIndex(index)}
                  onClick={() => select(breed)}
                >
                  <span>{breed.name}</span>
                  <span className="combobox__meta">
                    {breed.lifespanYears[0]}–{breed.lifespanYears[1]} yrs
                  </span>
                </li>
              ))
            )}
          </ul>
        ) : null}
      </div>
      <p className="field__help">
        247 breeds, with population lifespan data for each. Common nicknames work too.
      </p>
    </div>
  )
}
