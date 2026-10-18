/**
 * Every source the 2.0 report can cite.
 *
 * The rule, inherited from 1.0 and enforced by the type system: an insight may
 * only cite a key that exists here, and every entry here is a real, checkable
 * reference. Where a DOI or stable URL was verified it is given; where it was
 * not, the full bibliographic citation is given and the URL is deliberately
 * left out rather than guessed. A wrong link is worse than no link.
 *
 * The 1.0 methodology document covers the lifespan constants. This registry is
 * about the *advice* — the studies behind what the report tells an owner to do.
 */

export interface SourceEntry {
  short: string
  citation: string
  url?: string
}

export const SOURCES = {
  // ---- the 1.0 foundations --------------------------------------------------
  montoya2023: {
    short: 'Montoya et al. 2023',
    citation:
      'Montoya M. et al. (2023). Life expectancy tables for dogs and cats derived from clinical data. Frontiers in Veterinary Science 10:1082102.',
    url: 'https://www.frontiersin.org/articles/10.3389/fvets.2023.1082102/full',
  },
  mcmillan2024: {
    short: 'McMillan et al. 2024',
    citation:
      'McMillan K.M. et al. (2024). Longevity of companion dog breeds: those at risk from early death. Scientific Reports 14:531.',
    url: 'https://www.nature.com/articles/s41598-023-50458-w',
  },
  salt2019: {
    short: 'Salt et al. 2019',
    citation:
      'Salt C. et al. (2019). Association between life span and body condition in neutered client-owned dogs. Journal of Veterinary Internal Medicine 33(1):89–99.',
    url: 'https://pmc.ncbi.nlm.nih.gov/articles/PMC6335446/',
  },
  kealy2002: {
    short: 'Kealy et al. 2002',
    citation:
      'Kealy R.D. et al. (2002). Effects of diet restriction on life span and age-related changes in dogs. JAVMA 220(9):1315–1320.',
    url: 'https://pubmed.ncbi.nlm.nih.gov/11991408/',
  },
  kealy1997: {
    short: 'Kealy et al. 1997',
    citation:
      'Kealy R.D. et al. (1997). Five-year longitudinal study on limited food consumption and development of osteoarthritis in coxofemoral joints of dogs. JAVMA 210(2):222–225.',
  },
  hart2020: {
    short: 'Hart et al. 2020',
    citation:
      'Hart B.L. et al. (2020). Assisting decision-making on age of neutering for 35 breeds of dogs. Frontiers in Veterinary Science 7:388.',
    url: 'https://www.frontiersin.org/articles/10.3389/fvets.2020.00388/full',
  },
  glickman2011: {
    short: 'Glickman et al. 2011',
    citation:
      'Glickman L.T. et al. (2011). Association between chronic azotemic kidney disease and the severity of periodontal disease in dogs. Preventive Veterinary Medicine 99(2–4):193–200.',
    url: 'https://pubmed.ncbi.nlm.nih.gov/21345505/',
  },

  // ---- guidelines and consensus statements --------------------------------
  aahaLifeStage2019: {
    short: 'AAHA Life Stage Guidelines 2019',
    citation: 'Creevy K.E. et al. (2019). 2019 AAHA Canine Life Stage Guidelines. JAAHA 55(6):267–290.',
    url: 'https://www.aaha.org/resources/life-stage-canine-2019/',
  },
  aahaSenior2023: {
    short: 'AAHA Senior Care Guidelines 2023',
    citation:
      'Dhaliwal R. et al. (2023). 2023 AAHA Senior Care Guidelines for Dogs and Cats. JAAHA 59(1):1–21.',
    url: 'https://www.aaha.org/resources/2023-aaha-senior-care-guidelines-for-dogs-and-cats/',
  },
  aahaVaccination2022: {
    short: 'AAHA Vaccination Guidelines 2022 (updated 2024)',
    citation:
      'Ellis J. et al. (2022). 2022 AAHA Canine Vaccination Guidelines, updated 2024 to list leptospirosis as a core vaccine for all dogs. JAAHA 58(5):213–230.',
    url: 'https://www.aaha.org/aaha-guidelines/2022-aaha-canine-vaccination-guidelines/',
  },
  aahaWeight2014: {
    short: 'AAHA Weight Management Guidelines 2014',
    citation:
      'Brooks D. et al. (2014). 2014 AAHA Weight Management Guidelines for Dogs and Cats. JAAHA 50(1):1–11.',
  },
  wsavaNutrition: {
    short: 'WSAVA Global Nutrition Guidelines',
    citation:
      'WSAVA Global Nutrition Committee. Global Nutrition Guidelines and the "Selecting a pet food" questions for manufacturers.',
    url: 'https://wsava.org/global-guidelines/global-nutrition-guidelines/',
  },
  ahsHeartworm: {
    short: 'American Heartworm Society guidelines',
    citation:
      'American Heartworm Society. Current Canine Guidelines for the Prevention, Diagnosis, and Management of Heartworm Infection in Dogs.',
    url: 'https://www.heartwormsociety.org/veterinary-resources/american-heartworm-society-guidelines',
  },
  avsabSocialization: {
    short: 'AVSAB position on puppy socialisation',
    citation:
      'American Veterinary Society of Animal Behavior. Position Statement on Puppy Socialization; and Position Statement on Humane Dog Training (2021).',
    url: 'https://avsab.org/resources/position-statements/',
  },
  avmaRaw: {
    short: 'AVMA policy on raw diets',
    citation:
      'American Veterinary Medical Association. Policy: Raw or Undercooked Animal-Source Protein in Cat and Dog Diets.',
    url: 'https://www.avma.org/resources-tools/avma-policies/raw-or-undercooked-animal-source-protein-cat-and-dog-diets',
  },
  avmaTravel: {
    short: 'AVMA on travelling with pets',
    citation: 'American Veterinary Medical Association. Traveling with your pet FAQ.',
    url: 'https://www.avma.org/resources-tools/pet-owners/petcare/traveling-your-pet-faq',
  },
  acvim2019mvd: {
    short: 'ACVIM mitral valve consensus 2019',
    citation:
      'Keene B.W. et al. (2019). ACVIM consensus guidelines for the diagnosis and treatment of myxomatous mitral valve disease in dogs. Journal of Veterinary Internal Medicine 33(3):1127–1140.',
  },
  acvim2016seizures: {
    short: 'ACVIM seizure consensus 2016',
    citation:
      'Podell M. et al. (2016). 2015 ACVIM Small Animal Consensus Statement on Seizure Management in Dogs. Journal of Veterinary Internal Medicine 30(2):477–490.',
  },
  avdc: {
    short: 'American Veterinary Dental College',
    citation:
      'American Veterinary Dental College. Position statements, including on anaesthesia-free ("non-professional") dental scaling.',
    url: 'https://avdc.org/',
  },
  vohc: {
    short: 'Veterinary Oral Health Council',
    citation: 'Veterinary Oral Health Council. Accepted products list.',
    url: 'https://vohc.org',
  },
  merck: {
    short: 'Merck Veterinary Manual',
    citation: 'Merck Veterinary Manual (online edition). The general clinical reference used throughout.',
    url: 'https://www.merckvetmanual.com/',
  },
  ofa: {
    short: 'OFA',
    citation: 'Orthopedic Foundation for Animals. Health testing and the CHIC breed-specific screening lists.',
    url: 'https://www.ofa.org',
  },
  acvs: {
    short: 'ACVS',
    citation: 'American College of Veterinary Surgeons. Small-animal condition references.',
    url: 'https://www.acvs.org/small-animal',
  },
  wsuMdr1: {
    short: 'WSU MDR1 testing',
    citation:
      'Washington State University Veterinary Clinical Pharmacology Laboratory. MDR1 (ABCB1) genotyping and the list of problem drugs.',
    url: 'https://vcpl.vetmed.wsu.edu/',
  },
  cambridgeBoas: {
    short: 'Cambridge BOAS research',
    citation:
      'University of Cambridge Department of Veterinary Medicine. Brachycephalic Obstructive Airway Syndrome research group and functional grading scheme.',
    url: 'https://www.vet.cam.ac.uk/boas',
  },
  villalobosQol: {
    short: 'Villalobos quality-of-life scale',
    citation:
      'Villalobos A. The HHHHHMM quality-of-life scale (Hurt, Hunger, Hydration, Hygiene, Happiness, Mobility, More good days than bad), as reproduced in the Merck Veterinary Manual.',
    url: 'https://www.merckvetmanual.com/multimedia/table/the-hhhhhmm-scale',
  },
  aspcaApcc: {
    short: 'ASPCA Animal Poison Control',
    citation: 'ASPCA Animal Poison Control Center. Toxic substances and emergency guidance.',
    url: 'https://www.aspca.org/pet-care/animal-poison-control',
  },

  // ---- the Dog Aging Project ----------------------------------------------
  creevy2022: {
    short: 'Dog Aging Project (Creevy et al. 2022)',
    citation:
      'Creevy K.E. et al. (2022). An open science study of ageing in companion dogs. Nature 602:51–57.',
    url: 'https://doi.org/10.1038/s41586-021-04282-9',
  },
  yarborough2022: {
    short: 'Yarborough et al. 2022',
    citation:
      'Yarborough S., Fitzpatrick A., Schwartz S.M. & the Dog Aging Project Consortium (2022). Evaluation of cognitive function in the Dog Aging Project: associations with baseline canine characteristics. Scientific Reports 12:13316.',
    url: 'https://doi.org/10.1038/s41598-022-15837-9',
  },
  mccoy2023: {
    short: 'McCoy et al. 2023',
    citation:
      'McCoy B.M. et al. (2023). Social determinants of health and disease in companion dogs: a cohort study from the Dog Aging Project. Evolution, Medicine, and Public Health 11(1):187–201.',
    url: 'https://doi.org/10.1093/emph/eoad011',
  },
  bray2022: {
    short: 'Bray et al. 2022',
    citation:
      'Bray E.E. et al. (2022). Once-daily feeding is associated with better health in companion dogs: results from the Dog Aging Project. GeroScience 44(3):1779–1790.',
    url: 'https://doi.org/10.1007/s11357-022-00575-7',
  },

  // ---- feeding, bloat, body condition -------------------------------------
  glickman2000: {
    short: 'Glickman et al. 2000',
    citation:
      'Glickman L.T. et al. (2000). Non-dietary risk factors for gastric dilatation-volvulus in large and giant breed dogs. JAVMA 217(10):1492–1499.',
    url: 'https://doi.org/10.2460/javma.2000.217.1492',
  },
  pipan2012: {
    short: 'Pipan et al. 2012',
    citation:
      'Pipan M. et al. (2012). An Internet-based survey of risk factors for surgical gastric dilatation-volvulus in dogs. JAVMA 241(12):1456–1462.',
    url: 'https://doi.org/10.2460/javma.241.12.1456',
  },
  raghavan2004: {
    short: 'Raghavan et al. 2004',
    citation:
      'Raghavan M., Glickman N., McCabe G., Lantz G. & Glickman L.T. (2004). Diet-related risk factors for gastric dilatation-volvulus in dogs of high-risk breeds. JAAHA 40(3):192–203.',
  },
  stockman2013: {
    short: 'Stockman et al. 2013',
    citation:
      'Stockman J., Fascetti A.J., Kass P.H. & Larsen J.A. (2013). Evaluation of recipes of home-prepared maintenance diets for dogs. JAVMA 242(11):1500–1505.',
    url: 'https://doi.org/10.2460/javma.242.11.1500',
  },
  fdaDcm2019: {
    short: 'FDA DCM investigation',
    citation:
      'U.S. Food and Drug Administration (2019, updated 2022). FDA Investigation into Potential Link between Certain Diets and Canine Dilated Cardiomyopathy.',
    url: 'https://www.fda.gov/animal-veterinary/outbreaks-and-advisories/fda-investigation-potential-link-between-certain-diets-and-canine-dilated-cardiomyopathy',
  },
  freeman2018: {
    short: 'Freeman et al. 2018',
    citation:
      'Freeman L.M., Stern J.A., Fries R., Adin D.B. & Rush J.E. (2018). Diet-associated dilated cardiomyopathy in dogs: what do we know? JAVMA 253(11):1390–1394.',
    url: 'https://doi.org/10.2460/javma.253.11.1390',
  },
  vanbree2018: {
    short: 'van Bree et al. 2018',
    citation:
      'van Bree F.P.J. et al. (2018). Zoonotic bacteria and parasites found in raw meat-based diets for cats and dogs. Veterinary Record 182(2):50.',
    url: 'https://doi.org/10.1136/vr.104535',
  },
  apop2022: {
    short: 'APOP 2022 survey',
    citation:
      'Association for Pet Obesity Prevention (2022). Pet Obesity Prevalence Survey: 59% of US dogs classified overweight or obese.',
    url: 'https://www.petobesityprevention.org/',
  },
  marshall2010: {
    short: 'Marshall et al. 2010',
    citation:
      'Marshall W.G. et al. (2010). The effect of weight loss on lameness in obese dogs with osteoarthritis. Veterinary Research Communications 34(3):241–253.',
    url: 'https://doi.org/10.1007/s11259-010-9348-7',
  },
  jacob2002: {
    short: 'Jacob et al. 2002',
    citation:
      'Jacob F. et al. (2002). Clinical evaluation of dietary modification for treatment of spontaneous chronic renal failure in dogs. JAVMA 220(8):1163–1170.',
    url: 'https://doi.org/10.2460/javma.2002.220.1163',
  },

  // ---- teeth --------------------------------------------------------------
  harvey2015: {
    short: 'Harvey et al. 2015',
    citation:
      'Harvey C., Serfilippi L. & Barnvos D. (2015). Effect of frequency of brushing teeth on plaque and calculus accumulation, and gingivitis in dogs. Journal of Veterinary Dentistry 32(1):16–21.',
  },
  oneill2021perio: {
    short: "O'Neill et al. 2021 (periodontal)",
    citation:
      "O'Neill D.G. et al. (2021). Epidemiology of periodontal disease in dogs in the UK primary-care veterinary setting. Journal of Small Animal Practice 62(12):1051–1061.",
    url: 'https://doi.org/10.1111/jsap.13405',
  },
  oneill2021otitis: {
    short: "O'Neill et al. 2021 (ears)",
    citation:
      "O'Neill D.G. et al. (2021). Frequency and predisposing factors for canine otitis externa in the UK – a primary veterinary care epidemiological view. Canine Medicine and Genetics 8:7.",
    url: 'https://doi.org/10.1186/s40575-021-00106-1',
  },

  // ---- heat, behaviour, fear ----------------------------------------------
  hall2020incidence: {
    short: 'Hall et al. 2020 (risk factors)',
    citation:
      "Hall E.J., Carter A.J. & O'Neill D.G. (2020). Incidence and risk factors for heat-related illness (heatstroke) in UK dogs under primary veterinary care in 2016. Scientific Reports 10:9128.",
    url: 'https://doi.org/10.1038/s41598-020-66015-8',
  },
  hall2020triggers: {
    short: 'Hall et al. 2020 (triggers)',
    citation:
      "Hall E.J., Carter A.J. & O'Neill D.G. (2020). Dogs don't die just in hot cars — exertional heat-related illness (heatstroke) is a greater threat to UK dogs. Animals 10(8):1324.",
    url: 'https://doi.org/10.3390/ani10081324',
  },
  boyd2018: {
    short: 'Boyd et al. 2018',
    citation:
      'Boyd C. et al. (2018). Mortality resulting from undesirable behaviours in dogs aged under three years attending primary-care veterinary practices in England. Animal Welfare 27(3):251–262.',
    url: 'https://doi.org/10.7120/09627286.27.3.251',
  },
  dreschel2010: {
    short: 'Dreschel 2010',
    citation:
      'Dreschel N.A. (2010). The effects of fear and anxiety on health and lifespan in pet dogs. Applied Animal Behaviour Science 125(3–4):157–162.',
  },
  vieiradecastro2020: {
    short: 'Vieira de Castro et al. 2020',
    citation:
      'Vieira de Castro A.C. et al. (2020). Does training method matter? Evidence for the negative impact of aversive-based methods on companion dog welfare. PLOS ONE 15(12):e0225023.',
    url: 'https://doi.org/10.1371/journal.pone.0225023',
  },
  levy2009: {
    short: 'Levy et al. 2009',
    citation:
      'Levy M., Hall C., Trentacosta N. & Percival M. (2009). A preliminary retrospective survey of injuries occurring in dogs participating in canine agility. Veterinary and Comparative Orthopaedics and Traumatology 22(4):321–324.',
    url: 'https://doi.org/10.3415/VCOT-08-09-0089',
  },

  // ---- the ageing brain ---------------------------------------------------
  salvin2010: {
    short: 'Salvin et al. 2010',
    citation:
      'Salvin H.E., McGreevy P.D., Sachdev P.S. & Valenzuela M.J. (2010). Under diagnosis of canine cognitive dysfunction: a cross-sectional survey of older companion dogs. The Veterinary Journal 184(3):277–281.',
    url: 'https://doi.org/10.1016/j.tvjl.2009.11.007',
  },
  milgram2005: {
    short: 'Milgram et al. 2005',
    citation:
      'Milgram N.W. et al. (2005). Learning ability in aged beagle dogs is preserved by behavioral enrichment and dietary fortification: a two-year longitudinal study. Neurobiology of Aging 26(1):77–90.',
  },

  // ---- identification, environment, toxins --------------------------------
  lord2009: {
    short: 'Lord et al. 2009',
    citation:
      'Lord L.K., Ingwersen W., Gray J.L. & Wintz D.J. (2009). Characterization of animals with microchips entering animal shelters. JAVMA 235(2):160–167.',
    url: 'https://doi.org/10.2460/javma.235.2.160',
  },
  glickman2004: {
    short: 'Glickman et al. 2004',
    citation:
      'Glickman L.T., Raghavan M., Knapp D.W., Bonney P.L. & Dawson M.H. (2004). Herbicide exposure and the risk of transitional cell carcinoma of the urinary bladder in Scottish Terriers. JAVMA 224(8):1290–1297.',
    url: 'https://doi.org/10.2460/javma.2004.224.1290',
  },
  takashima2012: {
    short: 'Takashima-Uebelhoer et al. 2012',
    citation:
      "Takashima-Uebelhoer B.B. et al. (2012). Household chemical exposures and the risk of canine malignant lymphoma, a model for human non-Hodgkin's lymphoma. Environmental Research 112:171–176.",
    url: 'https://pmc.ncbi.nlm.nih.gov/articles/PMC3267855/',
  },
  reif1998: {
    short: 'Reif et al. 1998',
    citation:
      'Reif J.S., Bruns C. & Lower K.S. (1998). Cancer of the nasal cavity and paranasal sinuses and exposure to environmental tobacco smoke in pet dogs. American Journal of Epidemiology 147(5):488–492.',
    url: 'https://pubmed.ncbi.nlm.nih.gov/9525536/',
  },
  reif1992: {
    short: 'Reif et al. 1992',
    citation:
      'Reif J.S., Dunn K., Ogilvie G.K. & Harris C.K. (1992). Passive smoking and canine lung cancer risk. American Journal of Epidemiology 135(3):234–239.',
    url: 'https://doi.org/10.1093/oxfordjournals.aje.a116276',
  },
  nsf2011: {
    short: 'NSF International 2011',
    citation:
      'NSF International (2011). Household Germ Study: pet bowls ranked among the most bacteria-laden items in the home.',
  },

  // ---- supplements --------------------------------------------------------
  roush2010: {
    short: 'Roush et al. 2010',
    citation:
      'Roush J.K. et al. (2010). Evaluation of the effects of dietary supplementation with fish oil omega-3 fatty acids on weight bearing in dogs with osteoarthritis. JAVMA 236(1):67–73.',
    url: 'https://doi.org/10.2460/javma.236.1.67',
  },
  vandeweerd2012: {
    short: 'Vandeweerd et al. 2012',
    citation:
      'Vandeweerd J.-M. et al. (2012). Systematic review of efficacy of nutraceuticals to alleviate clinical signs of osteoarthritis. Journal of Veterinary Internal Medicine 26(3):448–456.',
    url: 'https://doi.org/10.1111/j.1939-1676.2012.00901.x',
  },
} as const satisfies Record<string, SourceEntry>

export type SourceId = keyof typeof SOURCES

export const SOURCE_IDS = Object.keys(SOURCES) as readonly SourceId[]

export function sourceEntry(id: SourceId): SourceEntry {
  return SOURCES[id]
}
