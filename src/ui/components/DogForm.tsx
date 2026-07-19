import { fromKilograms, weightUnitLabel } from '../../core'
import type { Breed, WeightUnit } from '../../core'
import { MAX_MIX_BREEDS, type FormPatch, type FormState } from '../formState'
import { BreedCombobox } from './BreedCombobox'
import { SegmentedControl } from './SegmentedControl'

/** A breed's typical weight range in the unit the form is using, e.g. "55–80 lbs". */
function weightRangeLabel(range: readonly [number, number], unit: WeightUnit): string {
  const round = (v: number) => (unit === 'kg' ? Math.round(v * 10) / 10 : Math.round(v))
  return `${round(fromKilograms(range[0], unit))}–${round(fromKilograms(range[1], unit))} ${weightUnitLabel(unit)}`
}

/** WSAVA 9-point body condition scale, in language an owner can actually apply. */
const BCS_DESCRIPTIONS: Record<number, string> = {
  1: 'Emaciated — ribs, spine and hip bones visible from across the room.',
  2: 'Very thin — bones easily visible, no fat you can feel.',
  3: 'Thin — ribs easy to see, very little fat over them.',
  4: 'Lean — ribs easy to feel, clear waist. Ideal for a working or sighthound build.',
  5: 'Ideal — ribs felt without pressing, waist visible from above, belly tucks up from the side.',
  6: 'Slightly heavy — ribs need light pressure to find, waist starting to disappear.',
  7: 'Overweight — ribs hard to feel under fat, no waist from above.',
  8: 'Obese — ribs only findable with firm pressure, obvious fat over the spine and tail base.',
  9: 'Severely obese — heavy fat deposits, no waist, distended belly.',
}

interface Props {
  state: FormState
  onChange: (patch: FormPatch) => void
  /** The resolved breed (single or blended mix), used only for the weight hint. */
  hintBreed?: Breed | undefined
}

export function DogForm({ state, onChange, hintBreed }: Props) {
  function updateMixRow(index: number, patch: Partial<FormState['mix'][number]>) {
    onChange({ mix: state.mix.map((row, i) => (i === index ? { ...row, ...patch } : row)) })
  }

  function addMixRow() {
    if (state.mix.length >= MAX_MIX_BREEDS) return
    onChange({ mix: [...state.mix, { breedName: '', percent: '' }] })
  }

  function removeMixRow(index: number) {
    if (state.mix.length <= 1) return
    onChange({ mix: state.mix.filter((_, i) => i !== index) })
  }

  // Kept out of the advanced fold: body condition is the single biggest lever,
  // and it's the one thing worth asking every owner up front.
  const bodyCondition = (
    <div className="form__section">
      <p className="form__legend">Body condition</p>
      <div className="field">
        <span className="field__label" id="bcs-label">
          Body condition score{' '}
          <span className="field__help" style={{ display: 'inline' }}>(optional)</span>
        </span>
        <p className="field__help" style={{ marginTop: 0, marginBottom: 8 }}>
          Feel along the ribs and look for a waist from above, then tap the number that fits — 1 is
          skin and bone, 9 is very overweight. Most healthy dogs are a <strong>4 or 5</strong>.
          It's the single biggest lever here.
        </p>
        <div className="segmented" role="group" aria-labelledby="bcs-label">
          {[1, 2, 3, 4, 5, 6, 7, 8, 9].map((score) => (
            <button
              key={score}
              type="button"
              className="segmented__option"
              style={{ flex: '1 1 0', padding: '7px 0' }}
              data-ideal={score === 4 || score === 5}
              aria-pressed={state.bodyConditionScore === score}
              aria-label={`Body condition ${score} of 9${score === 4 || score === 5 ? ', ideal' : ''}`}
              onClick={() =>
                onChange({
                  bodyConditionScore: state.bodyConditionScore === score ? undefined : score,
                })
              }
            >
              {score}
            </button>
          ))}
        </div>
        <div className="scale-anchors" aria-hidden="true">
          <span>1 · too thin</span>
          <span>4–5 · ideal</span>
          <span>9 · overweight</span>
        </div>
        <p className="field__help">
          {state.bodyConditionScore
            ? BCS_DESCRIPTIONS[state.bodyConditionScore]
            : 'Tap a number to see what it means, or leave it blank to skip.'}
        </p>
      </div>
    </div>
  )

  return (
    <form className="card" onSubmit={(event) => event.preventDefault()}>
      <div className="form__section">
        <p className="form__legend">Your dog</p>

        <div className="field">
          <label className="field__label" htmlFor="dog-name">
            Name <span className="field__help" style={{ display: 'inline' }}>(optional)</span>
          </label>
          <input
            id="dog-name"
            className="input"
            type="text"
            placeholder="Rufus"
            value={state.name}
            onChange={(event) => onChange({ name: event.target.value })}
          />
        </div>

        <div className="field">
          <span className="field__label">How old are they?</span>
          <div className="segmented" role="group" aria-label="Age entry mode">
            <button
              type="button"
              className="segmented__option"
              aria-pressed={state.ageMode === 'age'}
              onClick={() => onChange({ ageMode: 'age' })}
            >
              I know their age
            </button>
            <button
              type="button"
              className="segmented__option"
              aria-pressed={state.ageMode === 'birthdate'}
              onClick={() => onChange({ ageMode: 'birthdate' })}
            >
              I know their birthday
            </button>
          </div>
        </div>

        {state.ageMode === 'age' ? (
          <div className="field">
            <label className="field__label" htmlFor="dog-age">
              Age
            </label>
            <div className="input-row">
              <input
                id="dog-age"
                className="input"
                type="number"
                min={0}
                max={state.ageUnit === 'years' ? 30 : 360}
                step={state.ageUnit === 'years' ? 0.5 : 1}
                value={state.ageValue}
                onChange={(event) => onChange({ ageValue: event.target.value })}
              />
              <select
                className="input"
                aria-label="Age unit"
                value={state.ageUnit}
                onChange={(event) =>
                  onChange({ ageUnit: event.target.value as FormState['ageUnit'] })
                }
              >
                <option value="years">years</option>
                <option value="months">months</option>
              </select>
            </div>
          </div>
        ) : (
          <div className="field">
            <label className="field__label" htmlFor="dog-birthday">
              Date of birth
            </label>
            <input
              id="dog-birthday"
              className="input"
              type="date"
              value={state.birthDate}
              onChange={(event) => onChange({ birthDate: event.target.value })}
            />
          </div>
        )}

        <div className="field">
          <label className="checkbox-row">
            <input
              type="checkbox"
              checked={state.isMixed}
              onChange={(event) => onChange({ isMixed: event.target.checked })}
            />
            <span>Mixed breed (I know roughly what's in the mix)</span>
          </label>
        </div>

        {state.isMixed ? (
          <div className="field">
            {state.mix.map((row, index) => (
              <div className="mix-row" key={index}>
                <div className="mix-row__breed">
                  <BreedCombobox
                    label={`Breed ${index + 1}`}
                    showHelp={false}
                    value={row.breedName}
                    onChange={(breedName) => updateMixRow(index, { breedName })}
                  />
                </div>
                <div className="mix-row__pct field">
                  <label className="field__label" htmlFor={`mix-pct-${index}`}>
                    %
                  </label>
                  <input
                    id={`mix-pct-${index}`}
                    className="input"
                    type="number"
                    min={0}
                    max={100}
                    placeholder="—"
                    aria-label={`Breed ${index + 1} percentage`}
                    value={row.percent}
                    onChange={(event) => updateMixRow(index, { percent: event.target.value })}
                  />
                </div>
                {state.mix.length > 1 ? (
                  <button
                    type="button"
                    className="mix-row__remove"
                    aria-label={`Remove breed ${index + 1}`}
                    onClick={() => removeMixRow(index)}
                  >
                    ×
                  </button>
                ) : null}
              </div>
            ))}

            {state.mix.length < MAX_MIX_BREEDS ? (
              <button type="button" className="link-button" onClick={addMixRow}>
                + Add another breed
              </button>
            ) : null}

            <p className="field__help">
              Up to three breeds. Percentages are optional — leave them blank for an even split, and
              they don't need to add up to exactly 100.
            </p>
          </div>
        ) : (
          <BreedCombobox value={state.breedName} onChange={(breedName) => onChange({ breedName })} />
        )}

        <div className="field">
          <label className="field__label" htmlFor="dog-weight">
            Current weight <span className="field__help" style={{ display: 'inline' }}>(optional)</span>
          </label>
          <div className="input-row">
            <input
              id="dog-weight"
              className="input"
              type="number"
              min={0}
              step={0.5}
              placeholder="—"
              value={state.weight}
              onChange={(event) => onChange({ weight: event.target.value })}
            />
            <select
              className="input"
              aria-label="Weight unit"
              value={state.weightUnit}
              onChange={(event) =>
                onChange({ weightUnit: event.target.value as FormState['weightUnit'] })
              }
            >
              <option value="lb">lbs</option>
              <option value="kg">kg</option>
            </select>
          </div>
          {hintBreed ? (
            <p className="field__help">
              {state.isMixed ? 'Typical for this mix' : `Typical for a ${hintBreed.name}`}:{' '}
              <strong>{weightRangeLabel(hintBreed.weightKg, state.weightUnit)}</strong>.
            </p>
          ) : null}
          <p className="field__help">
            Used for sizing when the breed is unknown. With a breed set, the breed standard
            decides the size class so an overweight dog isn't counted twice.
          </p>
        </div>
      </div>

      {bodyCondition}

      <details className="form__advanced">
        <summary className="form__advanced-summary">
          Advanced options — sex, activity, diet, dental &amp; more
        </summary>
        <p className="form__advanced-note">
          Everything here is optional, but body condition, dental and vet care move the number most.
        </p>

      <div className="form__section form__section--first">
        <p className="form__legend">Basics</p>

        <SegmentedControl
          legend="Sex"
          options={[
            { value: 'female', label: 'Female' },
            { value: 'male', label: 'Male' },
          ]}
          value={state.sex}
          onChange={(sex) => onChange({ sex })}
        />

        <SegmentedControl
          legend="Neutered or spayed"
          options={[
            { value: 'neutered', label: 'Yes' },
            { value: 'intact', label: 'No' },
          ]}
          value={state.neuterStatus}
          onChange={(neuterStatus) => onChange({ neuterStatus })}
        />

        {state.neuterStatus === 'neutered' ? (
          <SegmentedControl
            legend="Neutered before a year old?"
            help="Only matters for large and giant breeds — Hart et al. (2020) link early neutering to more joint disorders in bigger dogs. Timing past a year, or in smaller dogs, doesn't change the estimate."
            options={[
              { value: 'early', label: 'Under 1 year' },
              { value: 'adult', label: '1 year or older' },
            ]}
            value={state.neuterTiming}
            onChange={(neuterTiming) => onChange({ neuterTiming })}
          />
        ) : null}
      </div>

      <div className="form__section">
        <p className="form__legend">Daily life</p>

        <SegmentedControl
          legend="Activity level"
          options={[
            { value: 'sedentary', label: 'Low' },
            { value: 'lightly-active', label: 'Light' },
            { value: 'active', label: 'Active' },
            { value: 'very-active', label: 'Very active' },
          ]}
          value={state.activityLevel}
          onChange={(activityLevel) => onChange({ activityLevel })}
        />

        <SegmentedControl
          legend="Diet"
          help="What matters is measured portions of a complete food, not what it costs."
          options={[
            { value: 'poor', label: 'Poor' },
            { value: 'average', label: 'Average' },
            { value: 'good', label: 'Good' },
            { value: 'excellent', label: 'Excellent' },
          ]}
          value={state.dietQuality}
          onChange={(dietQuality) => onChange({ dietQuality })}
        />

        <SegmentedControl
          legend="Dental care"
          options={[
            { value: 'none', label: 'None' },
            { value: 'occasional', label: 'Now and then' },
            { value: 'regular', label: 'Regular' },
            { value: 'professional', label: 'Professional' },
          ]}
          value={state.dentalCare}
          onChange={(dentalCare) => onChange({ dentalCare })}
        />

        <SegmentedControl
          legend="Veterinary care"
          options={[
            { value: 'none', label: 'None' },
            { value: 'reactive', label: 'When ill' },
            { value: 'annual', label: 'Annual' },
            { value: 'proactive', label: 'Twice yearly' },
          ]}
          value={state.vetCare}
          onChange={(vetCare) => onChange({ vetCare })}
        />

        <SegmentedControl
          legend="Lives"
          options={[
            { value: 'indoor', label: 'Indoors' },
            { value: 'mixed', label: 'Both' },
            { value: 'outdoor', label: 'Outdoors' },
          ]}
          value={state.environment}
          onChange={(environment) => onChange({ environment })}
        />

        <SegmentedControl
          legend="Anyone smoke at home?"
          options={[
            { value: 'no', label: 'No' },
            { value: 'yes', label: 'Yes' },
          ]}
          value={state.secondhandSmoke}
          onChange={(secondhandSmoke) => onChange({ secondhandSmoke })}
        />
      </div>
      </details>
    </form>
  )
}
