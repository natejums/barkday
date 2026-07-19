# Changelog

All notable changes to Barkday are recorded here. Dates are ISO 8601.

## [0.2.0] — 2026-07-19

A "sharper" release: a more accurate age from a new criterion, and a far more
robust breed-health picture — both built to the project's existing standard that
every number is traceable and nothing overlapping gets counted twice.

### Added

- **Neuter-timing criterion.** A new optional input — was the dog neutered before
  a year old? — refines the neuter factor for large and giant breeds, per Hart et
  al. (2020), who found early neutering raises joint-disorder and some cancer risk
  in bigger dogs. It reaches the headline age through the same expected-lifespan
  channel as every other factor. Because Hart reported disorder *rates* rather
  than lifespan *years*, the translation is documented as this project's own
  derivation and ships **low confidence**; it stays a single net-positive factor
  rather than a bonus plus a separate penalty, so it can't be double-counted.
  Small breeds, where the evidence shows no such effect, are unaffected.
- **A robust breed-health system.** Every recognised breed now gets a health
  report instead of a flat list of terms:
  - A catalogue of ~66 well-established canine conditions, referenced to the Merck
    Veterinary Manual and the veterinary specialty colleges, each with the signs
    to watch for, its severity and urgency, its typical age of onset, and what
    genuinely helps.
  - Each breed's documented risks are matched to the catalogue (~91% of the
    corpus) and enriched — the breed's own wording is always preserved verbatim;
    a match only adds detail. The catalogue never invents a predisposition.
  - **Life-stage-aware prioritisation:** concerns are flagged for what matters
    around the dog's current age — developmental problems for a puppy, cancers and
    cognitive change for a senior, and emergencies like bloat at any age.
  - **Body-system grouping** and **profile cross-referenced callouts**: feeding
    guidance for a deep-chested bloat-prone breed, airway and heat guidance for a
    flat face, an anaesthetic-sensitivity flag for sighthounds, and joint
    monitoring for a large breed neutered early.
- **Known mixed breeds.** A "mixed breed" checkbox lets you enter up to three
  component breeds with percentages. The engine blends their observed size and
  lifespan baselines by fraction and pools their documented health risks into one
  report — using the composition you supplied, with *no* mutt bonus or crossbreed
  penalty added (the "mutts are healthier" claim has no honest answer; blending a
  known composition is a separate question that does). New
  `DogProfile.breedComposition` input and `blendBreeds` engine export.
- **Ideal-weight hint.** As you enter a weight, the form shows the typical range
  for the selected breed (or the blended range for a mix), so the number has a
  reference point.
- New engine exports: `buildBreedHealth`, `matchCondition`, `CONDITION_CATALOG`,
  and the supporting types (`BreedHealthReport`, `HealthConcern`, `ConditionInfo`,
  `HealthCallout`, `BodySystem`, `ConditionSeverity`, `OnsetStage`).
- New `DogProfile.neuterAgeMonths` input and `DogAgeResult.breedHealth` output.

### Changed

- The breed panel in the UI is now a richer, personalised health section with
  severity indicators, expandable per-condition detail, and life-stage priorities
  — accessible in both light and dark themes, severity conveyed by label and shape
  rather than colour alone.
- **Body condition score** is now self-explanatory: an up-front instruction on how
  to assess it, the 4–5 ideal target marked on the control, and "too thin / ideal
  / overweight" anchors under the scale.
- **Weight defaults to pounds.**
- Documentation: `docs/METHODOLOGY.md` gains sections on neuter timing and the
  breed-health system, and clarifies that a *known mix's composition* is blended
  even though the crossbreed *bonus* is still deliberately not modelled; the
  README describes all of it.

### Tested

- New suites for the condition catalogue's integrity and clinical-field
  completeness, the matcher's specificity and corpus match rate, life-stage-aware
  prioritisation, profile callouts, neuter-timing behaviour, and the end-to-end
  wiring. The suite grew from 139 to 170 tests; the engine remains pure and
  dependency-free.

## [0.1.0]

Initial release: the four-model comparison, the size- and lifespan-personalised
headline estimate, saturating lifespan modifiers, AAHA life stages, 247 breeds,
and the calculator UI.
