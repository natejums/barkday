/**
 * A catalogue of well-established canine health conditions.
 *
 * This is general, educational veterinary reference material — the same tier of
 * evidence the rest of the engine leans on (AAHA, AVMA, Merck). It is
 * deliberately breed-agnostic: the breed-specific claim is which conditions a
 * breed is predisposed to, and that lives in the breed data. Here we only
 * describe each named condition — what body system it affects, roughly how
 * serious and how urgent it is, when it typically first appears, what an owner
 * can actually notice, and what genuinely helps.
 *
 * None of this is a diagnosis. It exists so that a breed's list of documented
 * predispositions can be organised, prioritised for a dog's age, and turned
 * into "what to watch for and raise with your vet" rather than a wall of terms.
 *
 * `aliases` are lower-case fragments matched against the breed data's own
 * free-text phrasing. They are chosen to be specific enough not to mis-fire —
 * "hip dysplasia", never a bare "hip" — and the matcher prefers the longest
 * matching alias, so a more specific condition always wins over a general one.
 *
 * Primary reference for the clinical facts throughout: the Merck Veterinary
 * Manual (merckvetmanual.com), supplemented by the specialty colleges cited
 * per entry (ACVS, ACVO, ACVIM) and the OFA. These are consensus references,
 * not primary literature, because the claims here are textbook rather than novel.
 */

import type { BodySystem, ConditionInfo } from '../types'

const MERCK = 'Merck Veterinary Manual — merckvetmanual.com'
const ACVS = 'American College of Veterinary Surgeons — acvs.org/small-animal'
const ACVO = 'American College of Veterinary Ophthalmologists — acvo.org'
const OFA = 'Orthopedic Foundation for Animals — ofa.org'
const ACVIM = 'American College of Veterinary Internal Medicine — acvim.org'

/** Human-readable names for the body-system groupings, in a sensible display order. */
export const BODY_SYSTEM_LABELS: Readonly<Record<BodySystem, string>> = {
  orthopedic: 'Bones & joints',
  cardiac: 'Heart',
  respiratory: 'Breathing & airway',
  neurological: 'Brain & nervous system',
  ocular: 'Eyes',
  aural: 'Ears & hearing',
  cancer: 'Cancer',
  endocrine: 'Hormones & metabolism',
  gastrointestinal: 'Stomach & gut',
  hepatic: 'Liver',
  urinary: 'Kidneys & urinary',
  haematological: 'Blood',
  dermatological: 'Skin & coat',
  dental: 'Teeth & gums',
  immune: 'Immune system',
  other: 'Other',
}

/** The order body-system groups are shown in. Whatever isn't listed trails after. */
export const BODY_SYSTEM_ORDER: readonly BodySystem[] = [
  'orthopedic',
  'cardiac',
  'respiratory',
  'neurological',
  'ocular',
  'cancer',
  'endocrine',
  'gastrointestinal',
  'hepatic',
  'urinary',
  'haematological',
  'dermatological',
  'aural',
  'dental',
  'immune',
  'other',
]

export const CONDITION_CATALOG: readonly ConditionInfo[] = [
  // --- Bones & joints ---------------------------------------------------------
  {
    id: 'hip-dysplasia',
    name: 'Hip dysplasia',
    aliases: ['hip dysplasia'],
    system: 'orthopedic',
    severity: 'serious',
    typicalOnset: 'young-adult',
    signs:
      'A "bunny-hopping" gait, stiffness after rest, reluctance to jump or climb stairs, and looser hips that ache and turn arthritic with age.',
    action:
      'Keep them lean — extra weight is the single biggest lever on joint pain. Hip-score breeding stock (OFA/PennHIP), keep exercise low-impact and regular, and ask about pain relief or surgery if it progresses.',
    references: [OFA, ACVS],
  },
  {
    id: 'elbow-dysplasia',
    name: 'Elbow dysplasia',
    aliases: ['elbow dysplasia'],
    system: 'orthopedic',
    severity: 'serious',
    typicalOnset: 'puppy',
    signs:
      'Front-leg lameness that worsens after exercise, often appearing before a year old, with the paw sometimes held slightly outward.',
    action:
      'Keep growing puppies lean and off slippery floors and repetitive jumping. Screening exists for breeding stock; early surgery can help selected cases.',
    references: [OFA, ACVS],
  },
  {
    id: 'patellar-luxation',
    name: 'Luxating patella (slipping kneecap)',
    aliases: ['patellar luxation', 'luxating patella', 'slipping kneecap', 'slipping kneecaps', 'patella'],
    system: 'orthopedic',
    severity: 'serious',
    typicalOnset: 'young-adult',
    signs:
      'A sudden skip or hop for a stride or two, sometimes with the leg held up briefly before it "pops" back and they carry on as normal.',
    action:
      'Keep them lean and well-muscled. Mild cases are managed conservatively; recurrent or higher-grade ones are corrected surgically before arthritis sets in.',
    references: [ACVS, MERCK],
  },
  {
    id: 'legg-calve-perthes',
    name: 'Legg-Calvé-Perthes disease',
    aliases: ['legg-calve-perthes', 'legg-calvé-perthes', 'legg calve perthes', 'perthes'],
    system: 'orthopedic',
    severity: 'serious',
    typicalOnset: 'puppy',
    signs:
      'Gradual hind-leg lameness and wasting of the thigh muscle in a young small-breed dog, usually between five months and a year, as the hip-joint head loses its blood supply.',
    action:
      'This needs veterinary imaging to confirm. It is painful and usually treated surgically, after which most dogs do very well.',
    references: [ACVS, MERCK],
  },
  {
    id: 'cruciate-rupture',
    name: 'Cruciate ligament rupture',
    aliases: ['cruciate', 'cranial cruciate', 'ccl rupture', 'ruptured cruciate'],
    system: 'orthopedic',
    severity: 'serious',
    typicalOnset: 'mature-adult',
    signs:
      'A sudden hind-leg lameness, often after a twist or jump, that may improve then linger; the other knee frequently follows within a year or two.',
    action:
      'Keep them lean — obesity sharply raises the risk. Larger dogs usually need surgical stabilisation; ask your vet which technique suits the dog.',
    references: [ACVS, MERCK],
  },
  {
    id: 'panosteitis',
    name: 'Panosteitis (growing pains)',
    aliases: ['panosteitis', 'growing pains'],
    system: 'orthopedic',
    severity: 'monitor',
    typicalOnset: 'puppy',
    signs:
      'Lameness that shifts from leg to leg in a fast-growing young large-breed dog, coming and going over weeks.',
    action:
      'It is self-limiting and resolves with maturity; a vet can confirm it and manage the pain, and rule out the dysplasias that mimic it.',
    references: [MERCK],
  },
  {
    id: 'osteoarthritis',
    name: 'Osteoarthritis',
    aliases: ['osteoarthritis', 'arthritis', 'joint degeneration', 'degenerative joint'],
    system: 'orthopedic',
    severity: 'serious',
    typicalOnset: 'senior',
    signs:
      'Stiffness getting up, slowing on walks, reluctance on stairs or into the car, and licking at a sore joint. Dogs hide pain well, so it is easy to read as "just getting old".',
    action:
      'Weight control, regular gentle exercise, traction on slick floors and, when needed, proper pain management. It is treatable — under-treated arthritis costs quality of life for years.',
    references: [MERCK, ACVS],
  },
  // --- Heart ------------------------------------------------------------------
  {
    id: 'mitral-valve-disease',
    name: 'Mitral valve disease',
    aliases: ['mitral valve', 'mitral', 'degenerative valve', 'endocardiosis'],
    system: 'cardiac',
    severity: 'serious',
    typicalOnset: 'senior',
    signs:
      'Often silent for years — first sign is usually a heart murmur a vet hears. Later: a soft cough, tiring on walks, faster breathing at rest.',
    action:
      'The commonest heart disease in small breeds. Annual listening catches the murmur; medication started at the right point (guided by imaging) delays heart failure meaningfully.',
    references: [ACVIM, MERCK],
  },
  {
    id: 'dilated-cardiomyopathy',
    name: 'Dilated cardiomyopathy',
    aliases: ['dilated cardiomyopathy', 'dcm'],
    system: 'cardiac',
    severity: 'serious',
    typicalOnset: 'mature-adult',
    signs:
      'The heart enlarges and weakens, often quietly. Watch for tiring easily, a soft cough, faster or laboured breathing, or a fainting spell — and, occasionally, sudden collapse.',
    action:
      'A leading cause of death in several large breeds. Screening echocardiograms catch it early; medication slows progression. Ask your vet about diet, given the ongoing grain-free/DCM question.',
    references: [ACVIM, MERCK],
  },
  {
    id: 'subaortic-stenosis',
    name: 'Subaortic stenosis',
    aliases: ['subaortic', 'aortic valve', 'aortic and subaortic', 'aortic stenosis', 'narrowing of the aortic'],
    system: 'cardiac',
    severity: 'serious',
    typicalOnset: 'puppy',
    signs:
      'A congenital narrowing below the aortic valve, usually found as a murmur in a puppy. Severe cases cause fainting, exercise intolerance, or sudden death in young dogs.',
    action:
      'A murmur in a predisposed puppy warrants a cardiology work-up before strenuous exercise or anaesthesia. Affected dogs should not be bred.',
    references: [ACVIM, MERCK],
  },
  {
    id: 'patent-ductus-arteriosus',
    name: 'Patent ductus arteriosus (PDA)',
    aliases: ['patent ductus'],
    system: 'cardiac',
    severity: 'serious',
    typicalOnset: 'puppy',
    signs:
      'A congenital vessel that should close at birth stays open, giving a distinctive continuous murmur; pups may be small, tire quickly, or breathe fast.',
    action:
      'One of the more treatable congenital defects — closing it early, often by catheter, usually gives a normal life. It needs prompt referral once the murmur is heard.',
    references: [ACVIM, MERCK],
  },
  // --- Breathing & airway -----------------------------------------------------
  {
    id: 'boas',
    name: 'Brachycephalic obstructive airway syndrome (BOAS)',
    aliases: [
      'brachycephalic airway',
      'brachycephalic obstructive',
      'boas',
      'breathing difficulty and heat intolerance',
      'heat intolerance',
      'airway obstruction',
      'short muzzle',
      'shortened muzzle',
      'flat face',
    ],
    system: 'respiratory',
    severity: 'serious',
    typicalOnset: 'young-adult',
    signs:
      'Noisy or snorting breathing, snoring, tiring quickly, struggling in heat, and gums that gray or blue in extreme cases. Loud breathing is not "just the breed" — it is obstruction.',
    action:
      'Walk in the cool of the day, use a harness not a collar, keep them lean, and never leave them anywhere warm. Corrective surgery helps significantly in affected dogs — ask early.',
    references: [ACVS, MERCK],
  },
  {
    id: 'tracheal-collapse',
    name: 'Tracheal collapse',
    aliases: ['tracheal collapse', 'collapsing windpipe', 'collapsing trachea'],
    system: 'respiratory',
    severity: 'serious',
    typicalOnset: 'mature-adult',
    signs:
      'A dry, honking cough — classically like a goose — brought on by excitement, pulling on a collar, or drinking, mostly in middle-aged small breeds.',
    action:
      'Use a harness, keep them lean, and avoid smoke and irritants. Most cases are managed with medication; a stent or surgery is reserved for severe ones.',
    references: [ACVS, MERCK],
  },
  {
    id: 'laryngeal-paralysis',
    name: 'Laryngeal paralysis',
    aliases: ['laryngeal paralysis'],
    system: 'respiratory',
    severity: 'serious',
    typicalOnset: 'senior',
    signs:
      'A change in the bark, noisy raspy breathing in, and tiring or overheating on walks in an older large-breed dog, as the voice-box cartilages stop opening properly.',
    action:
      'Keep them cool and lean and avoid over-exertion; a hot day can tip it into a breathing crisis. Surgery ("tie-back") helps severe cases. It can be an early sign of a wider nerve condition.',
    references: [ACVS, MERCK],
  },
  // --- Brain & nervous system -------------------------------------------------
  {
    id: 'epilepsy',
    name: 'Idiopathic epilepsy',
    // Not a bare "epilep-" prefix: it also matches "epileptoid cramping
    // syndrome", a distinct dyskinesia this entry would misdescribe.
    aliases: ['epilepsy', 'epileptic', 'seizure', 'seizures'],
    system: 'neurological',
    severity: 'serious',
    typicalOnset: 'young-adult',
    signs:
      'Seizures — collapse, paddling, chomping, loss of awareness — usually first appearing between six months and six years in an otherwise healthy dog.',
    action:
      'Film an episode if you safely can and note the date and length; it helps enormously. A seizure over five minutes, or clusters, is an emergency. Most epileptic dogs live well on medication.',
    references: [ACVIM, MERCK],
  },
  {
    id: 'intervertebral-disc-disease',
    name: 'Intervertebral disc disease (IVDD)',
    aliases: ['intervertebral disc', 'ivdd', 'disc disease', 'slipped disc', 'herniated disc', 'disk disease', 'spinal disc'],
    system: 'neurological',
    severity: 'serious',
    typicalOnset: 'mature-adult',
    signs:
      'Sudden back or neck pain, a hunched posture, reluctance to move, wobbly hind legs — or, at worst, sudden paralysis. Common in long-backed, short-legged breeds.',
    action:
      'Discourage jumping on and off furniture, use ramps, and keep them lean. Sudden weakness or paralysis is an emergency where hours matter — go straight to a vet.',
    references: [ACVS, MERCK],
  },
  {
    id: 'degenerative-myelopathy',
    name: 'Degenerative myelopathy',
    aliases: ['degenerative myelopathy'],
    system: 'neurological',
    severity: 'serious',
    typicalOnset: 'senior',
    signs:
      'A slow, painless weakness of the hind legs in an older dog — knuckling the paws, scuffing the nails, wobbling — that creeps forward over months.',
    action:
      'There is no cure, but physiotherapy and keeping them mobile and comfortable helps quality of life. A DNA test identifies at-risk dogs; a vet can rule out treatable look-alikes like disc disease.',
    references: [ACVIM, MERCK],
  },
  {
    id: 'wobbler',
    name: 'Wobbler syndrome',
    aliases: ['wobbler'],
    system: 'neurological',
    severity: 'serious',
    typicalOnset: 'mature-adult',
    signs:
      'An unsteady, wobbly gait — worse behind — and a reluctance to bend the neck, as the neck vertebrae compress the spinal cord in a large or giant breed.',
    action:
      'Use a harness rather than a neck collar. It is managed medically or surgically depending on severity; a neurological work-up guides the choice.',
    references: [ACVIM, ACVS],
  },
  {
    id: 'syringomyelia',
    name: 'Syringomyelia / Chiari-like malformation',
    aliases: ['syringomyelia', 'chiari'],
    system: 'neurological',
    severity: 'serious',
    typicalOnset: 'young-adult',
    signs:
      'Persistent scratching at the neck and shoulder — often into the air, without contact — plus signs of head or neck pain and sensitivity to touch.',
    action:
      'MRI confirms it. Pain and progression are managed with medication and, in some dogs, surgery. Raise persistent air-scratching with a vet rather than dismissing it as a habit.',
    references: [ACVIM, MERCK],
  },
  // --- Eyes -------------------------------------------------------------------
  {
    id: 'cataracts',
    name: 'Cataracts',
    aliases: ['cataract', 'cataracts'],
    system: 'ocular',
    severity: 'serious',
    typicalOnset: 'mature-adult',
    signs:
      'A cloudy, bluish-white look to the lens and bumping into things in dim light. Not to be confused with the harmless bluish haze of old age (nuclear sclerosis).',
    action:
      'An eye exam distinguishes cataract from harmless ageing and checks for diabetes as a cause. Surgery can restore sight in suitable dogs.',
    references: [ACVO, MERCK],
  },
  {
    id: 'progressive-retinal-atrophy',
    name: 'Progressive retinal atrophy (PRA)',
    aliases: ['progressive retinal atrophy', 'retinal atrophy', 'retinal degeneration'],
    system: 'ocular',
    severity: 'serious',
    typicalOnset: 'mature-adult',
    signs:
      'Night blindness first — hesitating in the dark, reluctance to go out at night — progressing gradually to full blindness, painlessly.',
    action:
      'DNA tests exist for many breeds and should guide breeding. There is no cure, but dogs adapt remarkably well to gradual sight loss; keep their environment consistent.',
    references: [ACVO, MERCK],
  },
  {
    id: 'glaucoma',
    name: 'Glaucoma',
    aliases: ['glaucoma'],
    system: 'ocular',
    severity: 'emergency',
    typicalOnset: 'mature-adult',
    signs:
      'A suddenly red, cloudy, painful eye that may bulge, with squinting and tearing. Acute glaucoma is genuinely painful and can destroy vision within a day.',
    action:
      'A red, painful eye is a same-day emergency — pressure must be brought down fast to save sight. If one eye is affected, the other is often treated preventively.',
    references: [ACVO, MERCK],
  },
  {
    id: 'lens-luxation',
    name: 'Primary lens luxation',
    aliases: ['lens luxation'],
    system: 'ocular',
    severity: 'emergency',
    typicalOnset: 'mature-adult',
    signs:
      'A suddenly painful, red or cloudy eye as the lens slips from position, most often in terriers in middle age. It can trigger glaucoma fast.',
    action:
      'This is an ophthalmic emergency — prompt treatment saves the eye and the sight. A DNA test identifies at-risk dogs so the other eye can be watched.',
    references: [ACVO, MERCK],
  },
  {
    id: 'entropion',
    name: 'Entropion (in-rolling eyelids)',
    aliases: ['entropion'],
    system: 'ocular',
    severity: 'serious',
    typicalOnset: 'puppy',
    signs:
      'Squinting, tearing and a sore eye as the eyelid rolls inward and the lashes rub the surface, risking corneal ulcers.',
    action:
      'It is painful and usually corrected with a straightforward surgery. Persistent squinting or a weepy eye is worth a vet visit rather than waiting.',
    references: [ACVO, MERCK],
  },
  {
    id: 'ectropion',
    name: 'Ectropion (out-rolling eyelids)',
    aliases: ['ectropion'],
    system: 'ocular',
    severity: 'monitor',
    typicalOnset: 'young-adult',
    signs:
      'A droopy lower lid that exposes the pink inner rim, collecting dust and drying the eye, with recurrent mild conjunctivitis.',
    action:
      'Often just needs eye hygiene and lubrication; more severe cases are corrected surgically. Keep the exposed area clean and watch for redness.',
    references: [ACVO, MERCK],
  },
  {
    id: 'cherry-eye',
    name: 'Cherry eye (prolapsed tear gland)',
    aliases: ['cherry eye'],
    system: 'ocular',
    severity: 'monitor',
    typicalOnset: 'puppy',
    signs:
      'A pink, fleshy lump popping up in the inner corner of a young dog’s eye as the third-eyelid gland prolapses.',
    action:
      'It should be surgically repositioned rather than removed, since the gland makes tears and losing it leads to dry eye. See a vet reasonably promptly.',
    references: [ACVO, MERCK],
  },
  {
    id: 'corneal-ulcers',
    name: 'Corneal ulcers',
    aliases: ['corneal ulcer', 'eye ulcer'],
    system: 'ocular',
    severity: 'serious',
    typicalOnset: 'any',
    signs:
      'A suddenly painful, weepy, squinting eye, sometimes with a visible cloudy patch — especially in flat-faced breeds whose eyes are more exposed.',
    action:
      'A painful eye needs same-day attention; ulcers can deepen quickly. Never use a leftover steroid eye drop, which can make an ulcer much worse.',
    references: [ACVO, MERCK],
  },
  {
    id: 'proptosis',
    name: 'Proptosis (eye out of the socket)',
    aliases: ['proptosis', 'pop out of the socket', 'eyes that can pop out'],
    system: 'ocular',
    severity: 'emergency',
    typicalOnset: 'any',
    signs:
      'The eyeball is pushed forward out of its socket — usually after a knock, a fight or rough handling, and most easily in flat-faced breeds whose shallow sockets barely hold the eye.',
    action:
      'A go-immediately emergency. Keep the eye moist with saline or a clean damp cloth, stop the dog rubbing or pawing it, and get to a vet at once — prompt repositioning saves the eye far more often than a delayed one.',
    references: [ACVO, MERCK],
  },
  {
    id: 'distichiasis',
    name: 'Distichiasis (extra eyelashes)',
    aliases: ['distichias'],
    system: 'ocular',
    severity: 'monitor',
    typicalOnset: 'young-adult',
    signs:
      'Extra lashes growing from the eyelid margin toward the eye, causing tearing, blinking and mild irritation.',
    action:
      'Mild cases just need lubrication; troublesome ones are treated to remove the offending lashes. Watch for a persistently weepy or squinting eye.',
    references: [ACVO, MERCK],
  },
  {
    id: 'collie-eye-anomaly',
    name: 'Collie eye anomaly',
    aliases: ['collie eye anomaly'],
    system: 'ocular',
    severity: 'serious',
    typicalOnset: 'puppy',
    signs:
      'A congenital malformation at the back of the eye, present from birth and detectable in pups; most dogs see well, but severe cases risk retinal detachment and blindness.',
    action:
      'Pups should have an eye exam by a specialist, and DNA testing guides breeding. Affected dogs need their vision monitored over time.',
    references: [ACVO, MERCK],
  },
  // --- Cancer -----------------------------------------------------------------
  {
    id: 'cancer-general',
    name: 'Cancer',
    aliases: ['cancer', 'tumour', 'tumor', 'neoplasia'],
    system: 'cancer',
    severity: 'serious',
    typicalOnset: 'senior',
    generic: true,
    signs:
      'Any new or growing lump, a sore that will not heal, unexplained weight loss, lasting lethargy, or a change in appetite or toilet habits in an older dog.',
    action:
      'Get new or changing lumps checked — many are benign, and the ones that are not are far more treatable caught early. Feel your dog over monthly so you notice change.',
    references: [MERCK, ACVIM],
  },
  {
    id: 'lymphoma',
    name: 'Lymphoma',
    aliases: ['lymphoma'],
    system: 'cancer',
    severity: 'serious',
    typicalOnset: 'mature-adult',
    signs:
      'Firm, painless swellings of the lymph nodes — most easily felt under the jaw, in front of the shoulders, and behind the knees — sometimes with tiredness or reduced appetite.',
    action:
      'Enlarged nodes warrant prompt testing. Lymphoma is one of the more chemotherapy-responsive canine cancers, and many dogs get good-quality remission time.',
    references: [ACVIM, MERCK],
  },
  {
    id: 'osteosarcoma',
    name: 'Osteosarcoma (bone cancer)',
    aliases: ['osteosarcoma', 'bone cancer'],
    system: 'cancer',
    severity: 'serious',
    typicalOnset: 'mature-adult',
    signs:
      'A persistent lameness or a firm, painful swelling on a leg of a large or giant breed, often near the wrist or shoulder, that does not settle with rest.',
    action:
      'It is aggressive and painful, so unexplained limb pain in a big older dog needs prompt X-rays. Early treatment controls pain and extends good time.',
    references: [ACVIM, MERCK],
  },
  {
    id: 'hemangiosarcoma',
    name: 'Haemangiosarcoma',
    aliases: ['hemangiosarcoma', 'haemangiosarcoma'],
    system: 'cancer',
    severity: 'serious',
    typicalOnset: 'senior',
    signs:
      'Often silent until a sudden crisis — a spleen or heart-based tumour bleeds, causing sudden weakness, pale gums, a swollen belly or collapse. That collapse is an emergency.',
    action:
      'Sudden collapse or pale gums is a go-now emergency. There is no reliable early screen, but a vet may find a mass on a routine senior exam or ultrasound.',
    references: [ACVIM, MERCK],
  },
  {
    id: 'mast-cell-tumour',
    name: 'Mast cell tumour',
    aliases: ['mast cell'],
    system: 'cancer',
    severity: 'serious',
    typicalOnset: 'mature-adult',
    signs:
      'A skin lump that can change size day to day — swelling, reddening or flattening — sometimes itchy. Its shape-shifting is the giveaway.',
    action:
      'The great mimic of skin lumps: have any lump that changes checked with a simple needle sample rather than watched. Caught early and removed with clear margins, many are cured.',
    references: [ACVIM, MERCK],
  },
  // --- Hormones & metabolism --------------------------------------------------
  {
    id: 'hypothyroidism',
    name: 'Hypothyroidism',
    aliases: ['hypothyroid', 'underactive thyroid', 'thyroid'],
    system: 'endocrine',
    severity: 'monitor',
    typicalOnset: 'mature-adult',
    signs:
      'Weight gain without eating more, low energy, a dull, thinning or symmetrical coat, and seeking out warm spots — creeping on over months in a middle-aged dog.',
    action:
      'A simple blood test diagnoses it, and a cheap daily tablet reverses it well. Easy to write off as "just slowing down", so worth testing when the picture fits.',
    references: [ACVIM, MERCK],
  },
  {
    id: 'cushings',
    name: "Cushing's disease (hyperadrenocorticism)",
    aliases: ['cushing'],
    system: 'endocrine',
    severity: 'serious',
    typicalOnset: 'senior',
    signs:
      'Drinking and weeing much more, a bigger appetite, a pot-bellied look, thinning coat and panting, in an older dog.',
    action:
      'It needs blood and urine testing to confirm and to distinguish the causes, then lifelong medication and monitoring. Mention the drinking-and-weeing change to your vet.',
    references: [ACVIM, MERCK],
  },
  {
    id: 'addisons',
    name: "Addison's disease (hypoadrenocorticism)",
    aliases: ['addison'],
    system: 'endocrine',
    severity: 'serious',
    typicalOnset: 'young-adult',
    signs:
      'Vague, waxing-and-waning illness — off food, low energy, vomiting or diarrhoea, weakness — often in a young-to-middle-aged female. It can crash into a collapse (an "Addisonian crisis").',
    action:
      'A collapse is an emergency. Otherwise it is a great imitator, so raise the pattern of recurrent vague illness with a vet; once diagnosed it is very manageable long-term.',
    references: [ACVIM, MERCK],
  },
  {
    id: 'diabetes',
    name: 'Diabetes mellitus',
    aliases: ['diabetes', 'diabetic', 'diabetes mellitus'],
    system: 'endocrine',
    severity: 'serious',
    typicalOnset: 'senior',
    signs:
      'Drinking and weeing a lot more, a big appetite alongside weight loss, and sometimes sudden cataracts clouding the eyes.',
    action:
      'It is managed well with insulin, diet and routine once diagnosed. Increased thirst plus weight loss deserves a prompt blood and urine test.',
    references: [ACVIM, MERCK],
  },
  {
    id: 'obesity',
    name: 'Tendency to gain weight',
    aliases: ['obesity', 'obese', 'prone to weight', 'weight gain', 'gain weight'],
    system: 'endocrine',
    severity: 'monitor',
    typicalOnset: 'any',
    signs:
      'A disappearing waist, ribs that get harder to feel, and a padded look — easy to miss on a dog you see every day.',
    action:
      'This is the most controllable risk on the list, and it moves lifespan and joints more than almost anything else. Weigh meals, skip the calorie-dense treats, and score body condition monthly.',
    references: [MERCK, 'WSAVA Global Nutrition Guidelines — wsava.org'],
  },
  // --- Stomach & gut ----------------------------------------------------------
  {
    id: 'gdv-bloat',
    name: 'Bloat / gastric dilatation-volvulus (GDV)',
    aliases: ['bloat', 'gastric torsion', 'gastric dilatation', 'gastric dilation', 'gdv', 'stomach twist'],
    system: 'gastrointestinal',
    severity: 'emergency',
    typicalOnset: 'mature-adult',
    signs:
      'A swollen, hard belly, unproductive retching (trying to be sick with nothing coming up), drooling, restlessness and fast decline — in a deep-chested breed. This kills within hours.',
    action:
      'It is a drop-everything, go-now emergency — every minute counts. To lower the risk: feed smaller meals, avoid hard exercise right after eating, and ask about a preventive gastropexy for high-risk breeds.',
    references: [ACVS, MERCK],
  },
  {
    id: 'pancreatitis',
    name: 'Pancreatitis',
    aliases: ['pancreatitis', 'pancreat'],
    system: 'gastrointestinal',
    severity: 'serious',
    typicalOnset: 'mature-adult',
    signs:
      'Vomiting, a painful or hunched belly, going off food and lethargy — often after a fatty meal or a bin raid.',
    action:
      'Keep them off fatty scraps and rich treats, especially around holidays. A painful, vomiting dog needs veterinary care; severe bouts can be life-threatening.',
    references: [ACVIM, MERCK],
  },
  {
    id: 'megaesophagus',
    name: 'Megaoesophagus',
    aliases: ['megaesophagus', 'megaoesophagus', 'mega-oesophagus', 'mega-esophagus'],
    system: 'gastrointestinal',
    severity: 'serious',
    typicalOnset: 'puppy',
    signs:
      'Bringing food back up undigested minutes after eating (regurgitation, not true vomiting), sometimes with a rattly chest from inhaled food.',
    action:
      'Feeding from a height so gravity helps, with the food consistency a vet advises, manages many dogs. The big danger is inhalation pneumonia, so a lingering cough needs prompt attention.',
    references: [ACVIM, MERCK],
  },
  // --- Liver ------------------------------------------------------------------
  {
    id: 'portosystemic-shunt',
    name: 'Liver shunt (portosystemic shunt)',
    aliases: ['portosystemic', 'liver shunt', 'porto-systemic'],
    system: 'hepatic',
    severity: 'serious',
    typicalOnset: 'puppy',
    signs:
      'A smaller-than-littermates youngster who is dull or disoriented after meals, drinks and wees a lot, and may drool or seem "spacey" as toxins bypass the liver.',
    action:
      'Blood tests and imaging confirm it. Many are correctable surgically; others are managed with diet and medication. Worth investigating in a young dog who fails to thrive.',
    references: [ACVS, MERCK],
  },
  {
    id: 'copper-hepatopathy',
    name: 'Copper-storage liver disease',
    aliases: ['copper storage', 'copper-associated', 'copper toxicosis', 'copper associated'],
    system: 'hepatic',
    severity: 'serious',
    typicalOnset: 'mature-adult',
    signs:
      'Often silent early, then vague illness — reduced appetite, weight loss, vomiting, drinking more — as copper builds up and damages the liver.',
    action:
      'Predisposed breeds can be screened with liver bloods; diagnosis may need a biopsy. A low-copper diet and medication manage it, so it is worth catching before symptoms.',
    references: [ACVIM, MERCK],
  },
  // --- Kidneys & urinary ------------------------------------------------------
  {
    id: 'chronic-kidney-disease',
    name: 'Chronic kidney disease',
    aliases: ['kidney disease', 'chronic kidney', 'renal disease', 'renal failure', 'kidney failure', 'chronic renal'],
    system: 'urinary',
    severity: 'serious',
    typicalOnset: 'senior',
    signs:
      'Drinking and weeing more, then weight loss, poor appetite and low energy as the kidneys lose reserve — often well advanced before it shows.',
    action:
      'Senior blood and urine screening catches it early, when diet and management add good months or years. Dental care matters here too — gum disease is linked to kidney disease.',
    references: [ACVIM, MERCK],
  },
  {
    id: 'bladder-stones',
    name: 'Bladder stones',
    aliases: ['bladder stone', 'urinary stone', 'urolith', 'urinary blockage'],
    system: 'urinary',
    severity: 'serious',
    typicalOnset: 'mature-adult',
    // "Bladder stones" is the umbrella; cystinuria and urate stones name the
    // actual cause. Marking this generic lets those win when a phrase mentions
    // both — otherwise the longer "bladder stone" alias buries them.
    generic: true,
    signs:
      'Straining to wee, blood in the urine, frequent small squats and accidents. A male dog who cannot pass urine at all is an emergency.',
    action:
      'A dog straining and unable to pass urine needs to be seen immediately. Otherwise, stones are diagnosed by imaging and managed by diet or surgery depending on type.',
    references: [ACVIM, MERCK],
  },
  {
    id: 'cystinuria',
    name: 'Cystinuria',
    aliases: ['cystinuria'],
    system: 'urinary',
    severity: 'serious',
    typicalOnset: 'mature-adult',
    signs:
      'An inherited defect that lets cystine stones form, mostly in males — causing straining, blood in the urine, and a risk of blockage.',
    action:
      'Managed with diet, plenty of water and monitoring; a blocked male is an emergency. DNA tests exist for some breeds to guide breeding.',
    references: [ACVIM, MERCK],
  },
  {
    id: 'urate-stones',
    name: 'Urate stones (hyperuricosuria)',
    aliases: ['urate', 'hyperuricosuria', 'uric acid'],
    system: 'urinary',
    severity: 'serious',
    typicalOnset: 'mature-adult',
    signs:
      'A tendency to form urate stones, causing straining, blood in the urine and, in males, a risk of blockage.',
    action:
      'Managed with a suitable diet and generous water intake; a DNA test identifies affected dogs. A male straining to pass urine is an emergency.',
    references: [ACVIM, MERCK],
  },
  // --- Blood ------------------------------------------------------------------
  {
    id: 'von-willebrand',
    name: "von Willebrand disease",
    aliases: ['von willebrand', 'vwd', 'bleeding disorder', 'clotting disorder'],
    system: 'haematological',
    severity: 'serious',
    typicalOnset: 'any',
    signs:
      'An inherited clotting-factor shortfall that shows as excess bleeding — nosebleeds, bleeding gums, or heavy bleeding after a small injury or surgery.',
    action:
      'Tell every vet before any surgery or dental so bleeding can be planned for. A DNA or blood test identifies affected dogs; most live normally with sensible precautions.',
    references: [ACVIM, MERCK],
  },
  {
    id: 'anaesthetic-sensitivity',
    name: 'Anaesthetic sensitivity',
    aliases: ['anaesthesia', 'anaesthetic', 'anesthesia', 'anesthetic', 'barbiturate'],
    system: 'other',
    severity: 'serious',
    typicalOnset: 'any',
    signs:
      'No day-to-day sign — the risk is under anaesthesia. Sighthounds and some lean breeds clear certain anaesthetic drugs more slowly, mainly through slower liver metabolism, so standard doses last longer than expected.',
    action:
      'Make sure your vet knows the breed before any procedure; sighthound-aware protocols and drug choices make anaesthesia safe. Not a reason to avoid needed surgery.',
    references: [MERCK, 'American College of Veterinary Anesthesia and Analgesia — acvaa.org'],
  },
  // --- Skin & coat ------------------------------------------------------------
  {
    id: 'atopic-dermatitis',
    name: 'Allergic skin disease (atopy)',
    aliases: ['atopic', 'atopy', 'allerg', 'itchy skin', 'itchy, infected skin', 'skin allerg', 'skin disease', 'skin problem'],
    system: 'dermatological',
    severity: 'monitor',
    typicalOnset: 'young-adult',
    signs:
      'Recurrent itching, licking and chewing — paws, face, belly, ears — with red or infected skin, often seasonal at first then year-round.',
    action:
      'Long-term but very manageable with modern treatments and by controlling flare triggers (fleas, food, environment). Get on top of ear and skin infections early; do not just re-treat forever without a plan.',
    references: ['American College of Veterinary Dermatology — acvd.org', MERCK],
  },
  {
    id: 'demodicosis',
    name: 'Demodectic mange',
    aliases: ['demodex', 'demodectic', 'demodicosis'],
    system: 'dermatological',
    severity: 'monitor',
    typicalOnset: 'puppy',
    signs:
      'Patchy hair loss and thinning, often around the eyes and mouth of a young dog, usually not very itchy unless the skin gets infected.',
    action:
      'Localised puppy cases often resolve; widespread ones are very treatable with modern medication. Adult-onset can signal a deeper problem, so it warrants a vet work-up.',
    references: ['American College of Veterinary Dermatology — acvd.org', MERCK],
  },
  {
    id: 'sebaceous-adenitis',
    name: 'Sebaceous adenitis',
    aliases: ['sebaceous adenitis'],
    system: 'dermatological',
    severity: 'monitor',
    typicalOnset: 'young-adult',
    signs:
      'A dull, dry, thinning coat with silvery scale and a musty smell, often starting along the back and head, as the skin’s oil glands are destroyed.',
    action:
      'Not curable but manageable with oil soaks, medicated baths and supplements to keep the coat and skin comfortable. A skin biopsy confirms it.',
    references: ['American College of Veterinary Dermatology — acvd.org', MERCK],
  },
  {
    id: 'skin-fold-dermatitis',
    name: 'Skin-fold dermatitis',
    aliases: ['skin fold', 'skin-fold', 'fold dermatitis', 'wrinkle'],
    system: 'dermatological',
    severity: 'monitor',
    typicalOnset: 'any',
    signs:
      'Redness, moisture and a sour smell in the deep folds — face, lips, tail pocket, vulva — where skin rubs and traps warmth.',
    action:
      'Keep the folds clean and dry as a daily habit; a vet can advise wipes or treatment for flare-ups. Persistent sore folds sometimes warrant surgical correction.',
    references: ['American College of Veterinary Dermatology — acvd.org', MERCK],
  },
  // --- Ears & hearing ---------------------------------------------------------
  {
    id: 'otitis',
    name: 'Chronic ear infections',
    aliases: ['ear infection', 'otitis', 'chronic ear'],
    system: 'aural',
    severity: 'monitor',
    typicalOnset: 'any',
    signs:
      'Head-shaking, scratching at the ears, a yeasty or foul smell, redness and discharge — common in breeds with heavy, hanging or hairy-canalled ears.',
    action:
      'Keep ears clean and dry (especially after swimming) and treat flare-ups promptly before they become chronic. Recurrent infections often trace back to an underlying allergy worth addressing.',
    references: ['American College of Veterinary Dermatology — acvd.org', MERCK],
  },
  {
    id: 'deafness',
    name: 'Congenital deafness',
    aliases: ['deaf', 'deafness'],
    system: 'aural',
    severity: 'monitor',
    typicalOnset: 'puppy',
    signs:
      'A pup who does not startle to sound, sleeps through noise, or is hard to rouse — linked to the genes behind white and merle coats.',
    action:
      'A BAER hearing test confirms it, including one-sided deafness that is easy to miss. Deaf dogs live full lives on hand signals and vibration cues, with sensible safety around traffic.',
    references: [MERCK, ACVIM],
  },
  // --- Less common, but named often enough to be worth enriching --------------
  {
    id: 'mdr1',
    name: 'MDR1 drug sensitivity',
    aliases: ['mdr1', 'multidrug sensitivity', 'multi-drug sensitivity', 'multidrug resistance'],
    system: 'other',
    severity: 'serious',
    typicalOnset: 'any',
    signs:
      'No everyday sign — the danger is a severe, sometimes fatal reaction to ordinary drugs (some worming and anti-parasite drugs, a few sedatives and anti-diarrhoeals) in herding-type breeds carrying the gene.',
    action:
      'A cheap DNA cheek-swab tells you the status; make sure it is on the file at every vet and check any new medication against the known at-risk list. Entirely manageable once known.',
    references: ['Washington State University Veterinary Clinical Pharmacology Lab — vcpl.vetmed.wsu.edu', MERCK],
  },
  {
    id: 'exercise-induced-collapse',
    name: 'Exercise-induced collapse (EIC)',
    aliases: ['exercise-induced collapse', 'exercise induced collapse'],
    system: 'neurological',
    severity: 'monitor',
    typicalOnset: 'young-adult',
    signs:
      'After a few minutes of intense excited exercise, the hind legs go weak and wobbly and the dog may collapse, then recover fully within a half-hour — most often in young retrievers.',
    action:
      'Stop exercise at the first wobble and cool them down — do not push through it, as rare episodes turn fatal when exercise continues or the dog overheats. Avoid hard exertion in heat and high excitement. A DNA test identifies carriers, and a vet should rule out heart and breathing causes.',
    references: ['University of Minnesota Canine Genetics Lab — vetmed.umn.edu', MERCK],
  },
  {
    id: 'juvenile-hypoglycaemia',
    name: 'Juvenile hypoglycaemia (low blood sugar)',
    aliases: ['low blood sugar', 'hypoglycaemia', 'hypoglycemia'],
    system: 'endocrine',
    severity: 'serious',
    typicalOnset: 'puppy',
    signs:
      'A tiny toy-breed puppy going wobbly, weak, glassy-eyed or trembling — often when tired, cold, stressed or overdue a meal — and, at worst, seizures or collapse.',
    action:
      'Feed small meals frequently and do not let a toy puppy run on empty. In a crisis, rub honey or glucose syrup on the gums and get to a vet at once. Most grow out of it as they mature.',
    references: [MERCK],
  },
  {
    id: 'craniomandibular-osteopathy',
    name: 'Craniomandibular osteopathy',
    aliases: ['craniomandibular'],
    system: 'orthopedic',
    severity: 'serious',
    typicalOnset: 'puppy',
    signs:
      'A young terrier with a painful, swollen jaw, difficulty or reluctance opening the mouth to eat, drooling and sometimes a fever, as extra bone forms along the jaw.',
    action:
      'A vet manages the pain through the growth phase; it usually stabilises and often regresses once the dog matures. Soft food helps while it is sore.',
    references: [MERCK],
  },
  {
    id: 'hereditary-ataxia',
    name: 'Hereditary ataxia',
    aliases: ['ataxia', 'cerebellar', 'leukodystrophy'],
    system: 'neurological',
    severity: 'serious',
    typicalOnset: 'young-adult',
    signs:
      'Growing wobbliness and incoordination — a high-stepping or drunken gait, tremors, trouble judging distances — that worsens over time.',
    action:
      'DNA tests exist for several breeds and should guide breeding. There is no cure; a vet can confirm it, rate the progression and rule out treatable look-alikes.',
    references: [ACVIM, MERCK],
  },
  {
    id: 'autoimmune-general',
    name: 'Autoimmune disease',
    aliases: ['autoimmune', 'immune-mediated', 'immune mediated'],
    system: 'immune',
    severity: 'serious',
    typicalOnset: 'any',
    generic: true,
    signs:
      'Varies with what the immune system turns on — pale gums and weakness (attacking red cells), lameness that moves between joints, or crusting skin lesions. Often a waxing-and-waning illness.',
    action:
      'These need a vet to diagnose and are treated by calming the immune system; some are serious. Flag sudden pallor, weakness or unexplained recurring illness promptly.',
    references: [ACVIM, MERCK],
  },
  {
    id: 'dermatomyositis',
    name: 'Dermatomyositis',
    aliases: ['dermatomyositis'],
    system: 'dermatological',
    severity: 'monitor',
    typicalOnset: 'puppy',
    signs:
      'Crusty, hairless skin lesions on the face, ear tips and legs of a young collie-type dog, sometimes with muscle wasting in more severe cases.',
    action:
      'Protect affected skin from sun, which worsens it, and work with a vet on management. Severity varies widely; many dogs have only mild skin signs.',
    references: ['American College of Veterinary Dermatology — acvd.org', MERCK],
  },
  {
    id: 'heart-disease-general',
    name: 'Heart disease',
    aliases: [
      'heart disease',
      'heart murmur',
      'heart failure',
      'congestive heart',
      'cardiac disease',
      'cardiomyopathy',
      'heart valve',
      'heart rhythm',
      'pulmonic stenosis',
    ],
    system: 'cardiac',
    severity: 'serious',
    typicalOnset: 'senior',
    generic: true,
    signs:
      'Often a murmur a vet hears before anything shows at home. Later: a soft cough, tiring on walks, faster or harder breathing at rest, or a fainting spell.',
    action:
      'Yearly listening catches most heart disease early, and imaging times the start of medication well. Report a cough or new exercise intolerance rather than putting it down to age.',
    references: [ACVIM, MERCK],
  },
  {
    id: 'eye-disease-general',
    name: 'Inherited eye conditions',
    aliases: [
      'inherited eye',
      'eye conditions',
      'eye problems',
      'eye disorders',
      'eye disease',
      'retinal dysplasia',
      'persistent pupillary',
      'pupillary membrane',
      'night blindness',
    ],
    system: 'ocular',
    severity: 'monitor',
    typicalOnset: 'any',
    generic: true,
    signs:
      'Depends on the condition — cloudiness, redness, a change in the eyes’ appearance, or bumping into things in dim light are the everyday flags.',
    action:
      'A specialist eye exam (many breed schemes offer them) screens for inherited eye disease and guides breeding. Get any red, cloudy or painful eye seen promptly.',
    references: [ACVO, MERCK],
  },
  // --- Teeth & gums -----------------------------------------------------------
  {
    id: 'periodontal-disease',
    name: 'Dental & gum disease',
    aliases: ['dental disease', 'periodontal', 'gum disease', 'dental and gum', 'dental problems', 'tooth'],
    system: 'dental',
    severity: 'monitor',
    typicalOnset: 'mature-adult',
    signs:
      'Bad breath, yellow-brown tartar, red or receding gums, and reluctance to chew — near-universal by middle age, and worst in small breeds with crowded mouths.',
    action:
      'Brush most days with dog paste, and keep up professional cleanings. This is not just cosmetic — dental disease is linked to higher rates of kidney and heart disease, so dental care is whole-body care.',
    references: ['American Veterinary Dental College — avdc.org', MERCK],
  },
]
