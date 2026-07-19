import { useCallback, useEffect, useId, useLayoutEffect, useMemo, useRef, useState } from 'react'
import { searchBreeds } from '../../core'
import type { Breed } from '../../core'

interface Props {
  value: string
  onChange: (breedName: string) => void
  /** Field label. Defaults to "Breed"; a mix uses "Breed 1", "Breed 2", … */
  label?: string
  /** Whether to show the 247-breeds helper line. Off for repeated mix rows. */
  showHelp?: boolean
}

/**
 * A searchable breed picker.
 *
 * Written by hand rather than pulled from a library: the engine has no
 * dependencies and it would be a shame for the UI to add three thousand
 * transitive ones for a filtered list. Keyboard support is the part people
 * actually skip, so it is here — arrows to move, Enter to pick, Escape to close.
 */
export function BreedCombobox({ value, onChange, label = 'Breed', showHelp = true }: Props) {
  const [query, setQuery] = useState(value)
  const [open, setOpen] = useState(false)
  const [activeIndex, setActiveIndex] = useState(0)
  const containerRef = useRef<HTMLDivElement>(null)
  const listRef = useRef<HTMLUListElement>(null)
  const inputRef = useRef<HTMLInputElement>(null)
  const listId = useId()

  // The dropdown is position:fixed to escape the sticky column's overflow clip,
  // which means it has to be told where the input is, and re-told whenever
  // anything moves it.
  const [anchor, setAnchor] = useState<{ left: number; top: number; width: number } | null>(null)

  const measure = useCallback(() => {
    const rect = inputRef.current?.getBoundingClientRect()
    if (rect) setAnchor({ left: rect.left, top: rect.bottom + 4, width: rect.width })
  }, [])

  useLayoutEffect(() => {
    if (!open) return
    measure()
    // Capture phase: the sticky column scrolls, not the window, and a scroll
    // inside it doesn't bubble.
    window.addEventListener('scroll', measure, true)
    window.addEventListener('resize', measure)
    return () => {
      window.removeEventListener('scroll', measure, true)
      window.removeEventListener('resize', measure)
    }
  }, [open, measure])

  const results = useMemo(() => searchBreeds(query, 40), [query])

  const activeOption = open ? results[activeIndex] : undefined
  const optionId = (index: number) => `${listId}-option-${index}`

  // Keep the highlighted row visible: forty results don't fit, so arrowing past
  // the fold would otherwise move a selection the user can't see.
  useEffect(() => {
    if (!open) return
    const el = listRef.current?.children[activeIndex]
    // jsdom has no layout engine and doesn't implement scrollIntoView.
    if (el instanceof HTMLElement && typeof el.scrollIntoView === 'function') {
      el.scrollIntoView({ block: 'nearest' })
    }
  }, [activeIndex, open])

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
        {label}
      </label>
      <div className="combobox" ref={containerRef}>
        <input
          ref={inputRef}
          id={`${listId}-input`}
          className="input"
          type="text"
          role="combobox"
          autoComplete="off"
          aria-expanded={open}
          aria-controls={listId}
          aria-autocomplete="list"
          {...(activeOption ? { 'aria-activedescendant': optionId(activeIndex) } : {})}
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
          <ul
            className="combobox__list"
            id={listId}
            role="listbox"
            ref={listRef}
            aria-label="Breed suggestions"
            style={
              anchor ? { left: anchor.left, top: anchor.top, width: anchor.width } : { visibility: 'hidden' }
            }
          >
            {results.length === 0 ? (
              <li className="combobox__empty" role="presentation">
                No match. Leaving this blank still works — the estimate falls back to
                population averages.
              </li>
            ) : (
              results.map((breed, index) => (
                <li
                  key={breed.name}
                  id={optionId(index)}
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
      {showHelp ? (
        <p className="field__help">
          247 breeds, with population lifespan data for each. Common nicknames work too.
        </p>
      ) : null}
    </div>
  )
}
