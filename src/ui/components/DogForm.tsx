import type { FormPatch, FormState } from '../formState'
import { BreedCombobox } from './BreedCombobox'
import { SegmentedControl } from './SegmentedControl'

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
}

export function DogForm({ state, onChange }: Props) {
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

        <BreedCombobox value={state.breedName} onChange={(breedName) => onChange({ breedName })} />

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
              <option value="kg">kg</option>
              <option value="lb">lb</option>
            </select>
          </div>
          <p className="field__help">
            Used for sizing when the breed is unknown. With a breed set, the breed standard
            decides the size class so an overweight dog isn't counted twice.
          </p>
        </div>
      </div>

      <div className="form__section">
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
        <p className="form__legend">Body condition</p>
        <div className="field">
          <span className="field__label" id="bcs-label">
            Body condition score
          </span>
          <div className="segmented" role="group" aria-labelledby="bcs-label">
            {[1, 2, 3, 4, 5, 6, 7, 8, 9].map((score) => (
              <button
                key={score}
                type="button"
                className="segmented__option"
                style={{ flex: '1 1 0', padding: '7px 0' }}
                aria-pressed={state.bodyConditionScore === score}
                aria-label={`Body condition ${score} of 9`}
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
          <p className="field__help">
            {state.bodyConditionScore
              ? BCS_DESCRIPTIONS[state.bodyConditionScore]
              : 'Run your hands along their ribs. 4–5 is ideal — this is the single biggest lever you have.'}
          </p>
        </div>
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
    </form>
  )
}
