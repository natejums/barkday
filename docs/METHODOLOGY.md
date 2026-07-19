# Methodology

Every constant the engine uses, where it came from, and how much to trust it.

The distinction that matters most here is between **what a study reported** and **what this project derived from it**. Those are marked separately throughout. A calculator needs continuous responses to sliders; the literature mostly provides group comparisons. Bridging that gap is engineering, not evidence, and it is labelled as such.

---

## 1. Size classification

Two taxonomies, on purpose.

**Five bands** (Montoya et al. 2023), used for life expectancy, because that is the stratification the figures were measured against:

| Class | Adult weight | Life expectancy at birth | 95% CI |
|---|---|---|---|
| Toy | < 5.5 kg | 13.36 yr | 13.33–13.38 |
| Small | 5.5–11 kg | 13.53 yr | 13.52–13.55 |
| Medium | 11–26 kg | 12.70 yr | 12.68–12.72 |
| Large | 26–45 kg | 11.51 yr | 11.49–11.52 |
| Giant | ≥ 45 kg | 9.51 yr | 9.45–9.58 |
| *All dogs* | — | *12.69 yr* | — |

Note toy < small. The size/lifespan relationship is **not monotonic** at the small end — very small dogs carry congenital and dental burdens that cost them the advantage their size would otherwise buy. There is a regression test guarding this so nobody "fixes" it.

**Four bands** for the human-age charts, at the cutoffs those charts actually used (20 / 50 / 90–100 lb). They do not separate toy from small, so toy dogs ride in the small column rather than have a column invented for them.

Forcing either source onto the other's bands would mean fabricating numbers.

## 2. Human-age conversion

### The chart (ages 1–25, depending on band)

Ages 1–16 are the AKC chart verbatim; from 17 the Metzger/IDEXX chart continues, which extends further. The two agree exactly from 6 to 16 apart from a year or so of rounding in the giant column, so the seam is invisible.

The bands stop where their source charts stop, which is not the same age for each — small and medium run to 25, large to 22, giant to 18. Nothing is invented to square them off; past the end of a band the model extrapolates and says so.

Below age 6 they diverge sharply, and the AKC values are the defensible ones — Metzger puts a one-year-old dog at 7 human years, which contradicts the basic fact that a yearling dog is sexually mature.

Between whole years the lookup interpolates linearly. Past the end of a band the model extrapolates using the mean of the last three steps, and flags the result as extrapolated rather than presenting it as data.

**Known weakness:** the AKC chart is not genuinely size-stratified below age 6 — small, medium and large share identical values until then. That is a limitation of the source, faithfully reproduced rather than papered over.

### The first year

The published charts start at age 1, but most people asking about a dog's age are asking about a puppy. The first year is interpolated across developmental anchors, expressed as fractions of the year-one value so the same curve serves every band:

| Age | Fraction of year-one equivalent |
|---|---|
| 1 month | 1/15 |
| 2 months | 2.5/15 |
| 3 months | 4/15 |
| 6 months | 10/15 |
| 9 months | 13/15 |
| 12 months | 1 |

**These are interpolated developmental anchors, not published data.** They encode the fact that a 6-month puppy is roughly a 10-year-old child rather than a 6-month-old infant.

### The epigenetic clock

`human_age = 16 × ln(dog_age) + 31` — Wang et al. (2020), *Cell Systems*, from DNA methylation in 104 Labrador Retrievers against 320 human methylomes.

Fact-checking during development rejected two variant constant pairs in circulation (`17 ln(d) + 33` and `16 ln(d) + 30`); 16 and 31 are the published values.

**The engine returns null below one year rather than a number.** The curve crosses zero at about 7.5 weeks and goes negative below that, and even well clear of that singularity it misbehaves: at six months it returns 19.9, which would make a pre-adolescent puppy a twenty-year-old human. Clamping the output to zero would conceal the problem rather than fix it.

It is also single-breed, so it carries no size information at all — the authors themselves warn that breeds with different lifespans would likely need different translation functions.

### The headline model

The chart, evaluated at an age scaled by how long this dog is expected to live:

```
effectiveAge = actualAge × (cohortBaseline / expectedLifespan)
humanAge     = chartLookup(effectiveAge, sizeBand)
```

Scaling the input rather than the output preserves the shape of the developmental curve — a puppy still races through its first year however healthy it is. The ratio is clamped to [0.7, 1.4]; the chart was never validated on a dog living half again as long as its breed average.

## 3. Life stages

From the AAHA Canine Life Stage Guidelines, whose key move is defining the later stages as **proportions of expected lifespan** rather than fixed ages.

| Stage | Boundary |
|---|---|
| Puppy | birth → 0.75–1.5 yr (by size) |
| Young adult | → 3–4 yr (by size) |
| Mature adult | → 0.75 × expected lifespan |
| Senior | → 0.90 × expected lifespan |
| Geriatric | beyond |

Growth milestones are absolute — bones finish when they finish — while senior and geriatric scale with lifespan. Those two schemes can cross for a short-lived giant breed, so boundaries are forced monotonic afterwards (tested).

AAHA publishes the 0.75 rule and stops at senior. **The 0.90 geriatric threshold is this project's addition**, matching the band the Metzger chart draws, because owners find the distinction useful and the care recommendations genuinely change. AAHA publishes no per-size onset ages; any table showing them is a derivation from the proportional rule plus a lifespan source.

## 4. Lifespan modifiers

Baseline is the breed's population lifespan midpoint, or the size-class figure when the breed is unknown.

| Factor | Adjustment | Confidence | Source |
|---|---|---|---|
| Body condition, per point over 5 | −0.9 (toy/small), −0.88 (medium), −0.34 (large/giant) | **Low — derived** | Salt 2019, n = 50,787 |
| Body condition, ideal (4–5) | +0.4 yr | Moderate | Purina Life Span Study |
| Underweight, per point under 4 | −0.3 yr | Low | Usually a marker of illness, not a cause |
| Female | +0.13 yr | High | Montoya 2023: 12.76 vs 12.63 |
| Neutered | +0.5 yr | Moderate | Population data; confounded by owner type |
| Neutered young, large/giant breed | +0.5 − 0.35 = +0.15 yr | **Low — derived** | Hart 2020; rate-to-years translation is ours |
| Dental care | −0.8 (none) → +0.5 (professional) | Moderate | Glickman 2011, n = 164,706 |
| Veterinary care | −1.0 (none) → +0.5 (twice-yearly) | Moderate | Preventive care and parasite compliance |
| Activity | −0.5 (sedentary) → +0.4 (very active) | Low | Dog Aging Project; reverse causation likely |
| Diet | −0.6 (poor) → +0.7 (excellent) | Moderate | Purina; portion control is the lever |
| Environment | +0.2 (indoor) → −0.4 (outdoor) | Low | Trauma, infection, temperature |
| Household smoke | −0.3 yr | Low | Respiratory disease and some cancers |

### On mixed ancestry, which is also deliberately absent

"Mutts are healthier" is the most confidently repeated claim in dog folklore, and the large datasets do not support it:

- **Montoya (n = 13.3M):** mixed breeds 12.71 years, all dogs 12.69 — a tie.
- **McMillan (n = 584,734):** crossbreeds 12.0 years, purebreds 12.7 — crossbreeds *shorter*-lived.
- **Kraus et al. (2022):** breed-level heterozygosity does track lifespan, +0.084 yr per percentage point.

Only the third points the way folklore does, and it is an ecological correlation *between breeds* rather than a claim about any individual crossbred dog.

An earlier version of this model shipped a +0.3 year bonus here. That was fifteen times the effect its own cited source reported, and the opposite sign to a study cited a few lines away in the same file. Two large datasets pointing in opposite directions is a reason to model nothing, not a reason to average them into a number.

**What *is* modelled is composition, which is a different question.** When an owner
knows their dog is, say, 60% Labrador and 40% Poodle, the engine blends the two
breeds' observed size and lifespan baselines by those percentages and pools their
documented health risks. That is not the mutt bonus above — it adds no
heterozygosity credit and no crossbreed penalty, and a 50/50 cross with no
lifestyle factors lands exactly on the blended baseline. It only uses the
composition the owner supplied to produce a better starting point than a generic
size-band average. Where the *bonus* question has no honest answer, the
*composition* question does, and the two are kept strictly separate.

### On brachycephaly, which is deliberately absent

McMillan et al. (2024) is a strong result — brachycephalic breeds have a median lifespan of 11.2 years against 12.8 for mesocephalic ones, across 584,734 dogs. An earlier version of this model applied it as a −1.6 year modifier. That was wrong, and the reason is the same one this whole section is about.

The breed baselines are *observed* lifespans. Flat-faced breeds already average 11.0 years in this dataset against 12.9 for everything else — a 1.9-year gap that exists **because** of the airway. Applying McMillan on top charged those breeds twice for one nose.

Worse, it applied the population average to breeds that contradict it. A Shih Tzu is brachycephalic and lives about 14 years; the penalty docked it anyway. Using the observed baseline instead lets a long-lived flat-faced breed read as long-lived, and a Pug read as short-lived, which is what the data actually says about each of them.

Brachycephaly still reaches the user — as breed health risks and as care guidance about heat, harnesses and airway signs. It just does not get counted twice in the arithmetic.

### On neuter timing, which is modelled — carefully

Neutering earns a +0.5-year bonus because neutered dogs outlive intact ones in
essentially every population dataset. But *when* it happens matters. Hart et al.
(2020), across 35 breeds, found that in a number of the larger ones, neutering
before the growth plates close — roughly the first year — raised the rate of
joint disorders (hip and elbow dysplasia, cruciate rupture) and, in several
breeds, certain cancers. It found no comparable signal in small breeds.

So the neuter factor is timing-aware: a large or giant dog neutered before 12
months keeps only part of the bonus (+0.15 rather than +0.5). The important
honesty caveat is that **Hart reported disorder rates, not lifespan years.**
Translating "joint disorders roughly double" into "give back 0.35 of a year" is
this project's own bridge, not a figure any author published, so it ships as
**low confidence** and is documented as a derivation at the point of use — the
same standard applied to the body-condition per-point costs.

**And a second caveat, which the brachycephaly section demands be stated
plainly.** Hart's effect is *breed-specific and heterogeneous* — several of the
large breeds it studied showed no significant increase at any neuter age, and the
cancer signal appeared only in some. Applying the discount to every large and
giant breed by size class alone is therefore a generalisation beyond what Hart
established for any one breed, and it is the same *shape* of move this document
rejects for brachycephaly: imposing a group average on individuals that may
contradict it. Two things keep it defensible here where the skull-shape penalty
was not. First, the mechanism genuinely scales with the proxy: neutering removes
the hormones that signal growth-plate closure, so later closure and altered joint
loading really are a function of how big and how slow-maturing the dog is —
whereas skull shape has no such size gradient. Second, unlike the brachycephaly
penalty, this does not double-count, because neuter timing is not already priced
into the observed breed baseline the way the airway is. It remains a deliberate
simplification, though, and that is a large part of why it is rated low
confidence and kept small. The more evidence-faithful alternative — restricting
the discount to the specific breeds Hart implicated — was rejected only because
Hart studied 35 of 247 breeds, so a per-breed rule would be as silent about the
other 212 as the size proxy is, without being any more honest about them.

Two design choices follow from the principles elsewhere in this document. It is
kept a **single factor with a net-positive delta**, not a bonus plus a separate
penalty, because early neutering is one causal story and splitting it would let
the saturation logic double-count it. And the net stays positive, because that
is what the population data shows — an early-neutered large dog still tends to
outlive an intact one. The timing cost is a discount on an advantage, not a
reversal of it.

Timing also reaches the user as care guidance — a prompt to watch the joints —
in the breed-health panel, not only as arithmetic.

### On the body condition figures

These are the clearest case of derivation, so they are worth spelling out.

Salt et al. supports a **binary** claim: dogs overweight in middle age had shorter median lifespans than matched normal-condition dogs, by 5 months to 2 years 6 months depending on breed and sex. The authors published no per-point figure and no continuous dose-response.

The per-point values above divide the observed whole-category difference by the roughly two 9-point BCS units that Salt's "overweight" category spans. That is this project's arithmetic, not the study's finding, which is why it ships as low confidence.

The size pattern is real and reproducible, and counterintuitive: small dogs are penalised roughly 2.5× as heavily as large ones (Yorkshire Terrier 2.5 yr, Chihuahua ~2.1, against German Shepherd ~5 months). The likely explanation is competing mortality — large breeds tend to be claimed by cancer and cardiac disease before adiposity collects its full bill.

### Why they don't sum

Positive and negative adjustments are pooled separately, then each passed through `limit × tanh(total / limit)` with a limit of 3 years.

The research is emphatic on this point: these factors are not independent. Caloric restriction, body condition, diet quality and exercise are four windows onto largely one causal pathway. "Attentive owner" is a latent variable sitting behind dental care, preventive vet visits and parasite compliance alike. Adding the published effects straight would let a fully-optimised profile claim six or seven extra years, which no study supports.

`tanh` is close to linear for small inputs and flattens as the total grows — so one good habit counts almost fully and the sixth counts for much less. Saturating each direction separately keeps a long list of small penalties from being cancelled by a long list of small bonuses.

The result is clamped to [5, 20] years, and both the raw sum and the applied figure are exposed in the output so the discount is visible rather than hidden.

## 5. Uncertainty

The lifespan interval comes from the breed's population range (±1.8 yr when the breed is unknown). The human-age interval is derived by running the headline model at both ends of that lifespan interval — a dog on the short-lived end of its range is effectively older today.

These are not formal confidence intervals. They are a defensible spread, and they are wide on purpose.

## 6. Breed data

247 breeds, each with adult weight range, population lifespan range, AKC-style group, brachycephaly flag and documented health predispositions. Sources are breed health surveys, the 2024 VetCompass / Royal Veterinary College life tables, and Kennel Club breed data.

Size class is computed from the weight midpoint rather than stored independently, so the dataset cannot drift out of agreement with the bands the lifespan model uses. Tested across all 247 entries, along with weight/lifespan coherence, alias collisions and duplicate names.

## 7. Breed health

Each breed carries a hand-written list of documented predispositions. On its own
that is a wall of terms; the health module turns it into something an owner can
act on, without inventing anything breed-specific.

**A condition catalogue.** About 66 well-established canine conditions, each
described in breed-agnostic terms: which body system it affects, roughly how
serious and how urgent it is, the life stage it typically first appears in, the
signs an owner can actually notice, and what genuinely helps. These are textbook
veterinary facts — the same evidence tier as the AAHA and AVMA material the rest
of the engine uses — referenced to the Merck Veterinary Manual and the relevant
specialty colleges (ACVS, ACVO, ACVIM), and framed as general education, not
diagnosis.

The catalogue is deliberately breed-agnostic. The only breed-specific claim is
*which* conditions a breed is prone to, and that already lives in the breed data,
written by hand. The catalogue never adds a predisposition to a breed; it only
enriches one the breed data already states.

**Matching, not rewriting.** Each free-text risk is linked to a catalogue entry
by matching against alias fragments, longest-match-wins, with catch-all entries
("heart disease", "inherited eye conditions") consulted only when nothing
specific matches — so "entropion" is never swallowed by a vaguer, longer phrase.
The breed's own wording is always shown verbatim; a match only adds detail
beneath it. About 91% of the ~1,160 risk phrases across the dataset link to an
entry; the rest stay as plain text rather than being forced into a wrong bucket.
A test guards the match rate against regressions.

**Personalised to the dog, not just the breed.** A condition is flagged
"relevant around this age" when the dog is within one life stage of the
condition's typical onset — the coming-up-or-just-arrived window — with two
exceptions that are always relevant: acute emergencies (bloat), and conditions
that are not age-linked at all (a clotting disorder, anaesthetic sensitivity). So
a senior's highlighted list is about senior things, and a puppy's is about
developmental ones, drawn from the same breed data.

**Profile cross-references.** A handful of callouts fire on the profile rather
than the breed alone: feeding guidance for a deep-chested bloat-prone breed,
airway and heat guidance for a flat-faced one, an anaesthetic-sensitivity flag
for sighthounds, and a joint-monitoring prompt for a large breed neutered early.
Each is triggered by a matched condition plus a fact about the individual dog.

Nothing here is a diagnosis or a prediction about the individual animal. It is
the breed's documented predispositions, organised, prioritised for the dog's age,
and cross-referenced against the profile — so an owner knows what to watch for
and what to raise with a vet.

## References

1. Montoya M. et al. (2023). Life expectancy tables for dogs and cats derived from clinical data. *Frontiers in Veterinary Science*. https://www.frontiersin.org/articles/10.3389/fvets.2023.1082102/full
2. McMillan K.M. et al. (2024). Longevity of companion dog breeds: those at risk from early death. *Scientific Reports*. https://www.nature.com/articles/s41598-023-50458-w
3. Salt C. et al. (2019). Association between life span and body condition in neutered client-owned dogs. *Journal of Veterinary Internal Medicine*. https://pmc.ncbi.nlm.nih.gov/articles/PMC6335446/
4. Kealy R.D. et al. (2002). Effects of diet restriction on life span and age-related changes in dogs. *JAVMA*. https://pubmed.ncbi.nlm.nih.gov/11991408/
5. Wang T. et al. (2020). Quantitative translation of dog-to-human aging by conserved remodeling of the DNA methylome. *Cell Systems*. https://www.cell.com/cell-systems/fulltext/S2405-4712(20)30203-9
6. AAHA Canine Life Stage Guidelines. https://www.aaha.org/resources/life-stage-canine-2019/
7. Glickman L.T. et al. (2011). Association between chronic azotemic kidney disease and the severity of periodontal disease in dogs. *Preventive Veterinary Medicine*. https://pubmed.ncbi.nlm.nih.gov/21345505/
8. Kraus C., Snyder-Mackler N. & Promislow D.E.L. (2022). How size and genetic diversity shape lifespan across breeds of purebred dogs. *GeroScience*. https://doi.org/10.1007/s11357-022-00653-w
9. Hart B.L. et al. (2020). Assisting decision-making on age of neutering for 35 breeds of dogs. *Frontiers in Veterinary Science*. https://www.frontiersin.org/articles/10.3389/fvets.2020.00388/full
10. AVMA — Senior pet care. https://www.avma.org/resources-tools/pet-owners/petcare/senior-pets
11. AKC dog age chart. https://www.akc.org/wp-content/uploads/2015/11/Dog_Age_Chart_Proof_01Blue.jpg
12. Metzger F.L. — IDEXX preventive care age chart. https://www.idexx.com/files/preventive-brochures-age-chart.pdf
13. Merck Veterinary Manual — the general clinical reference behind the condition catalogue. https://www.merckvetmanual.com/
14. American College of Veterinary Surgeons (ACVS), Ophthalmologists (ACVO) and Internal Medicine (ACVIM) small-animal condition references. https://www.acvs.org/small-animal · https://www.acvo.org · https://www.acvim.org
15. Orthopedic Foundation for Animals (OFA) — screening for inherited orthopaedic and other disease. https://www.ofa.org
