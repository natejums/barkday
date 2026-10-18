import type { ReactNode } from 'react'
import type { Breed } from '../../core'
import { BodyConditionField, EssentialsFields } from '../components/DogForm'
import { MultiSelect } from '../components/MultiSelect'
import { SegmentedControl } from '../components/SegmentedControl'
import { possibleJoinedAt, type DeepFormPatch, type DeepFormState } from './formStateDeep'

interface Props {
  state: DeepFormState
  onChange: (patch: DeepFormPatch) => void
  hintBreed?: Breed | undefined
  /** The dog's resolved age, which decides which "when they joined you" options make sense. */
  ageYears: number | null
}

/** One folded group of questions, in the same style as the 1.0 advanced fold. */
function Group({
  title,
  note,
  children,
  open = false,
}: {
  title: string
  note?: string
  children: ReactNode
  open?: boolean
}) {
  return (
    <details className="form__advanced" open={open}>
      <summary className="form__advanced-summary">{title}</summary>
      {note ? <p className="form__advanced-note">{note}</p> : null}
      <div className="form__section form__section--first">{children}</div>
    </details>
  )
}

const JOINED_LABEL = {
  'under-6-months': 'Under 6 months',
  '6-12-months': '6–12 months',
  adult: 'As an adult',
  senior: 'As a senior',
} as const

/**
 * The 2.0 form. Same essentials as the classic form, then the 1.0 lifestyle
 * questions and the new ones, spread across folded groups by subject so the
 * page never reads as a forty-question wall.
 */
export function DeepForm({ state, onChange, hintBreed, ageYears }: Props) {
  const joinedOptions = possibleJoinedAt(ageYears ?? 30).map((value) => ({ value, label: JOINED_LABEL[value] }))

  return (
    <form className="card" onSubmit={(event) => event.preventDefault()}>
      <p className="form__intro">
        Answer what you can. Everything is optional, and every answer makes the report more
        specific to your dog — nothing here is a test.
      </p>

      <EssentialsFields state={state} onChange={onChange} hintBreed={hintBreed} />

      <BodyConditionField state={state} onChange={onChange} />

      <Group
        title="Their story — where they came from"
        note="Where a dog came from and how old they were decides how much of their history you can know, which changes what the first check-ups should look for."
        open
      >
        <SegmentedControl
          legend="How did they come to you?"
          options={[
            { value: 'breeder', label: 'Breeder' },
            { value: 'shelter-rescue', label: 'Shelter or rescue' },
            { value: 'rehomed', label: 'Rehomed' },
            { value: 'born-at-home', label: 'Born at home' },
            { value: 'found-stray', label: 'Found as a stray' },
            { value: 'other', label: 'Other' },
          ]}
          value={state.origin}
          onChange={(origin) => onChange({ origin })}
        />
        <SegmentedControl
          legend="How old were they when they joined you?"
          options={joinedOptions}
          value={state.joinedAt}
          onChange={(joinedAt) => onChange({ joinedAt })}
        />
        <div className="field">
          <label className="field__label" htmlFor="homecoming">
            Roughly when did they come home?{' '}
            <span className="field__help" style={{ display: 'inline' }}>(optional)</span>
          </label>
          <input
            id="homecoming"
            className="input"
            type="date"
            value={state.homecomingDate}
            onChange={(event) => onChange({ homecomingDate: event.target.value })}
          />
          <p className="field__help">Used only to work out how long you have been together.</p>
        </div>
      </Group>

      <Group title="Basics — sex and neutering">
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
            help="Only matters for large and giant breeds — Hart et al. (2020) link early neutering to more joint disorders in bigger dogs."
            options={[
              { value: 'early', label: 'Under 1 year' },
              { value: 'adult', label: '1 year or older' },
            ]}
            value={state.neuterTiming}
            onChange={(neuterTiming) => onChange({ neuterTiming })}
          />
        ) : null}
      </Group>

      <Group
        title="Food and water"
        note="What they eat, how often, how many treats, and how they get their water."
      >
        <SegmentedControl
          legend="Diet quality"
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
          legend="What kind of food?"
          options={[
            { value: 'dry', label: 'Dry' },
            { value: 'wet', label: 'Wet' },
            { value: 'mixed', label: 'Mix of both' },
            { value: 'fresh-commercial', label: 'Fresh-cooked (bought)' },
            { value: 'home-cooked', label: 'Home-cooked' },
            { value: 'raw', label: 'Raw' },
            { value: 'table-food', label: 'Table food' },
          ]}
          value={state.foodType}
          onChange={(foodType) => onChange({ foodType })}
        />
        <SegmentedControl
          legend="Is it grain-free or legume-heavy?"
          help="Peas, lentils, chickpeas or potato among the first ingredients."
          options={[
            { value: 'yes', label: 'Yes' },
            { value: 'no', label: 'No' },
            { value: 'not-sure', label: 'Not sure' },
          ]}
          value={state.grainFree}
          onChange={(grainFree) => onChange({ grainFree })}
        />
        <SegmentedControl
          legend="Meals a day"
          options={[
            { value: 'free-fed', label: 'Free-fed' },
            { value: 'one', label: 'One' },
            { value: 'two', label: 'Two' },
            { value: 'three-plus', label: 'Three or more' },
          ]}
          value={state.mealsPerDay}
          onChange={(mealsPerDay) => onChange({ mealsPerDay })}
        />
        <SegmentedControl
          legend="Treats and table scraps"
          options={[
            { value: 'rarely', label: 'Rarely' },
            { value: 'some', label: 'Some' },
            { value: 'a-lot', label: 'A lot' },
          ]}
          value={state.treatShare}
          onChange={(treatShare) => onChange({ treatShare })}
        />
        <SegmentedControl
          legend="How do they get their water?"
          options={[
            { value: 'bowl-refreshed-daily', label: 'Bowl, washed and refilled daily' },
            { value: 'bowl-topped-up', label: 'Bowl, topped up' },
            { value: 'fountain', label: 'Pet fountain' },
            { value: 'outdoor-sources', label: 'Mostly outdoors — puddles, pond, trough' },
          ]}
          value={state.waterSource}
          onChange={(waterSource) => onChange({ waterSource })}
        />
        <SegmentedControl
          legend="Raised food and water bowls?"
          options={[
            { value: 'yes', label: 'Yes' },
            { value: 'no', label: 'No' },
          ]}
          value={state.raisedBowls}
          onChange={(raisedBowls) => onChange({ raisedBowls })}
        />
      </Group>

      <Group title="Daily life — exercise, sleep, time alone">
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
        <MultiSelect
          legend="What does their exercise mostly look like?"
          help="Pick all that apply."
          options={[
            { value: 'leash-walks', label: 'Lead walks' },
            { value: 'off-leash', label: 'Off-lead runs' },
            { value: 'fetch', label: 'Fetch' },
            { value: 'swimming', label: 'Swimming' },
            { value: 'dog-sports', label: 'Dog sports' },
            { value: 'hiking', label: 'Hiking' },
          ]}
          value={state.exerciseTypes}
          onChange={(exerciseTypes) => onChange({ exerciseTypes })}
        />
        <SegmentedControl
          legend="Mental enrichment — puzzles, scent games, training"
          options={[
            { value: 'rarely', label: 'Rarely' },
            { value: 'sometimes', label: 'Sometimes' },
            { value: 'daily', label: 'Daily' },
          ]}
          value={state.enrichment}
          onChange={(enrichment) => onChange({ enrichment })}
        />
        <SegmentedControl
          legend="How do they sleep?"
          options={[
            { value: 'sound', label: 'Soundly' },
            { value: 'restless', label: 'Restless at night' },
            { value: 'not-sure', label: 'Not sure' },
          ]}
          value={state.sleep}
          onChange={(sleep) => onChange({ sleep })}
        />
        <SegmentedControl
          legend="Time alone on a typical day"
          options={[
            { value: 'under-4h', label: 'Under 4 h' },
            { value: '4-8h', label: '4–8 h' },
            { value: 'over-8h', label: 'Over 8 h' },
          ]}
          value={state.timeAlone}
          onChange={(timeAlone) => onChange({ timeAlone })}
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
      </Group>

      <Group title="Mind and company — fear, training, who's at home">
        <SegmentedControl
          legend="Would you call them anxious or fearful?"
          help="Storms, fireworks, strangers, being alone, the vet."
          options={[
            { value: 'none', label: 'Not really' },
            { value: 'some', label: 'Somewhat' },
            { value: 'a-lot', label: 'Very' },
          ]}
          value={state.anxiety}
          onChange={(anxiety) => onChange({ anxiety })}
        />
        <SegmentedControl
          legend="How are they trained?"
          options={[
            { value: 'reward-based', label: 'Reward-based' },
            { value: 'mixed', label: 'A mix' },
            { value: 'correction-based', label: 'Correction-based' },
            { value: 'none', label: 'Not really trained' },
          ]}
          value={state.training}
          onChange={(training) => onChange({ training })}
        />
        <SegmentedControl
          legend="Other dogs at home?"
          options={[
            { value: 'yes', label: 'Yes' },
            { value: 'no', label: 'No' },
          ]}
          value={state.otherDogs}
          onChange={(otherDogs) => onChange({ otherDogs })}
        />
        <SegmentedControl
          legend="Children at home?"
          options={[
            { value: 'yes', label: 'Yes' },
            { value: 'no', label: 'No' },
          ]}
          value={state.children}
          onChange={(children) => onChange({ children })}
        />
      </Group>

      <Group
        title="Health and prevention"
        note="Dental and vet care, vaccines, parasites, the microchip, and anything already diagnosed or recently noticed."
      >
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
          legend="Vaccinations"
          options={[
            { value: 'up-to-date', label: 'Up to date' },
            { value: 'overdue', label: 'Overdue' },
            { value: 'not-sure', label: 'Not sure' },
          ]}
          value={state.vaccination}
          onChange={(vaccination) => onChange({ vaccination })}
        />
        <SegmentedControl
          legend="Flea, tick and heartworm prevention"
          options={[
            { value: 'year-round', label: 'Year-round' },
            { value: 'seasonal', label: 'Seasonal' },
            { value: 'none', label: 'None' },
            { value: 'not-sure', label: 'Not sure' },
          ]}
          value={state.parasitePrevention}
          onChange={(parasitePrevention) => onChange({ parasitePrevention })}
        />
        <SegmentedControl
          legend="Microchip"
          options={[
            { value: 'registered', label: 'Chipped, registered to me' },
            { value: 'chipped-unsure', label: 'Chipped, not sure it’s registered' },
            { value: 'none', label: 'Not chipped' },
            { value: 'not-sure', label: 'Not sure' },
          ]}
          value={state.microchip}
          onChange={(microchip) => onChange({ microchip })}
        />
        <SegmentedControl
          legend="Weight over the last few months"
          options={[
            { value: 'gaining', label: 'Gaining' },
            { value: 'stable', label: 'Stable' },
            { value: 'losing', label: 'Losing' },
            { value: 'not-sure', label: 'Not sure' },
          ]}
          value={state.weightTrend}
          onChange={(weightTrend) => onChange({ weightTrend })}
        />
        <SegmentedControl
          legend="Getting around"
          options={[
            { value: 'fine', label: 'Moves fine' },
            { value: 'stiff-after-rest', label: 'Stiff after rest' },
            { value: 'avoids-stairs', label: 'Avoids stairs or jumps' },
            { value: 'limping', label: 'Limping' },
          ]}
          value={state.mobility}
          onChange={(mobility) => onChange({ mobility })}
        />
        <MultiSelect
          legend="Anything already diagnosed?"
          options={[
            { value: 'arthritis', label: 'Arthritis' },
            { value: 'heart', label: 'Heart' },
            { value: 'allergies', label: 'Allergies or skin' },
            { value: 'dental', label: 'Dental disease' },
            { value: 'overweight', label: 'Overweight' },
            { value: 'diabetes', label: 'Diabetes' },
            { value: 'epilepsy', label: 'Epilepsy' },
            { value: 'thyroid', label: 'Thyroid' },
            { value: 'kidney', label: 'Kidney' },
            { value: 'cancer', label: 'Cancer' },
            { value: 'anxiety', label: 'Anxiety' },
            { value: 'digestive', label: 'Digestive' },
            { value: 'eyes', label: 'Eyes' },
            { value: 'back', label: 'Back or disc' },
            { value: 'other', label: 'Other' },
          ]}
          value={state.knownConditions}
          onChange={(knownConditions) => onChange({ knownConditions })}
          noneLabel="Nothing diagnosed"
          none={state.knownConditionsNone}
          onNone={(knownConditionsNone) => onChange({ knownConditionsNone })}
        />
        <MultiSelect
          legend="Noticed any of these lately?"
          options={[
            { value: 'drinking-more', label: 'Drinking more' },
            { value: 'new-lump', label: 'A new lump' },
            { value: 'night-restless', label: 'Restless at night' },
            { value: 'coughing', label: 'Coughing' },
            { value: 'accidents', label: 'Accidents indoors' },
            { value: 'stiffness', label: 'Stiffness' },
            { value: 'weight-change', label: 'Weight change' },
            { value: 'bad-breath', label: 'Bad breath' },
            { value: 'appetite-change', label: 'Appetite change' },
            { value: 'confusion', label: 'Confusion' },
            { value: 'scratching', label: 'Scratching' },
            { value: 'tiring', label: 'Tiring easily' },
          ]}
          value={state.recentSigns}
          onChange={(recentSigns) => onChange({ recentSigns })}
          noneLabel="None of these"
          none={state.recentSignsNone}
          onNone={(recentSignsNone) => onChange({ recentSignsNone })}
        />
        <MultiSelect
          legend="Supplements"
          options={[
            { value: 'omega-3', label: 'Omega-3 / fish oil' },
            { value: 'joint', label: 'Joint' },
            { value: 'probiotic', label: 'Probiotic' },
            { value: 'multivitamin', label: 'Multivitamin' },
            { value: 'other', label: 'Other' },
          ]}
          value={state.supplements}
          onChange={(supplements) => onChange({ supplements })}
          noneLabel="None"
          none={state.supplementsNone}
          onNone={(supplementsNone) => onChange({ supplementsNone })}
        />
      </Group>

      <Group title="Home and safety — climate, smoke, garden, car">
        <SegmentedControl
          legend="Your climate"
          options={[
            { value: 'hot', label: 'Hot summers' },
            { value: 'cold', label: 'Cold winters' },
            { value: 'both', label: 'Both extremes' },
            { value: 'temperate', label: 'Mild' },
          ]}
          value={state.climate}
          onChange={(climate) => onChange({ climate })}
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
        <SegmentedControl
          legend="Lawn or garden treated with weedkiller or pesticide?"
          options={[
            { value: 'no', label: 'No' },
            { value: 'yes', label: 'Yes' },
          ]}
          value={state.lawnChemicals}
          onChange={(lawnChemicals) => onChange({ lawnChemicals })}
        />
        <SegmentedControl
          legend="In the car, they are…"
          options={[
            { value: 'restrained', label: 'In a harness or crate' },
            { value: 'loose', label: 'Loose' },
            { value: 'rarely', label: 'Rarely in the car' },
          ]}
          value={state.carTravel}
          onChange={(carTravel) => onChange({ carTravel })}
        />
      </Group>

      <Group title="Being ready — for the bad day">
        <SegmentedControl
          legend="Pet insurance or an emergency fund?"
          options={[
            { value: 'insured', label: 'Insured' },
            { value: 'savings', label: 'Savings set aside' },
            { value: 'both', label: 'Both' },
            { value: 'neither', label: 'Neither' },
          ]}
          value={state.readiness}
          onChange={(readiness) => onChange({ readiness })}
        />
        <SegmentedControl
          legend="Do you know where your nearest 24-hour emergency vet is?"
          options={[
            { value: 'yes', label: 'Yes' },
            { value: 'no', label: 'No' },
          ]}
          value={state.knowsEmergencyVet}
          onChange={(knowsEmergencyVet) => onChange({ knowsEmergencyVet })}
        />
      </Group>
    </form>
  )
}
