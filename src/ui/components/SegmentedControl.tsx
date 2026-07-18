import { useId } from 'react'

interface Option<T extends string> {
  value: T
  label: string
}

interface Props<T extends string> {
  legend: string
  help?: string
  options: readonly Option<T>[]
  value: T | undefined
  onChange: (value: T | undefined) => void
  /** Clicking the selected option clears it, so "unknown" stays reachable. */
  clearable?: boolean
}

export function SegmentedControl<T extends string>({
  legend,
  help,
  options,
  value,
  onChange,
  clearable = true,
}: Props<T>) {
  // A generated id, not one built from the legend text: `aria-labelledby` is a
  // space-separated ID *list*, so "Activity level-label" would be read as two
  // ids that don't exist, leaving the group with no accessible name at all.
  const labelId = useId()

  return (
    <div className="field">
      <span className="field__label" id={labelId}>
        {legend}
      </span>
      <div className="segmented" role="group" aria-labelledby={labelId}>
        {options.map((option) => {
          const selected = value === option.value
          return (
            <button
              key={option.value}
              type="button"
              className="segmented__option"
              aria-pressed={selected}
              onClick={() => onChange(selected && clearable ? undefined : option.value)}
            >
              {option.label}
            </button>
          )
        })}
      </div>
      {help ? <p className="field__help">{help}</p> : null}
    </div>
  )
}
