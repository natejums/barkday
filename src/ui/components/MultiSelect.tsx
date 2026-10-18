import { useId } from 'react'

interface Option<T extends string> {
  value: T
  label: string
}

interface Props<T extends string> {
  legend: string
  help?: string
  options: readonly Option<T>[]
  value: readonly T[]
  onChange: (value: readonly T[]) => void
  /** Label for an explicit "none of these" choice. Omit to not offer one. */
  noneLabel?: string
  none?: boolean
  onNone?: (none: boolean) => void
}

/**
 * The segmented control's many-of sibling: chips that toggle independently,
 * with an optional explicit "none" that counts as an answer rather than a blank.
 */
export function MultiSelect<T extends string>({
  legend,
  help,
  options,
  value,
  onChange,
  noneLabel,
  none = false,
  onNone,
}: Props<T>) {
  const labelId = useId()

  function toggle(option: T) {
    if (value.includes(option)) onChange(value.filter((v) => v !== option))
    else {
      onChange([...value, option])
      onNone?.(false)
    }
  }

  return (
    <div className="field">
      <span className="field__label" id={labelId}>
        {legend}
      </span>
      <div className="segmented segmented--multi" role="group" aria-labelledby={labelId}>
        {options.map((option) => {
          const selected = value.includes(option.value)
          return (
            <button
              key={option.value}
              type="button"
              className="segmented__option"
              aria-pressed={selected}
              onClick={() => toggle(option.value)}
            >
              {option.label}
            </button>
          )
        })}
        {noneLabel && onNone ? (
          <button
            type="button"
            className="segmented__option segmented__option--none"
            aria-pressed={none}
            onClick={() => {
              const next = !none
              onNone(next)
              if (next) onChange([])
            }}
          >
            {noneLabel}
          </button>
        ) : null}
      </div>
      {help ? <p className="field__help">{help}</p> : null}
    </div>
  )
}
