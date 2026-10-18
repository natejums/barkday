/**
 * The next twelve months as a proactive plan: what to do, roughly when, and why.
 *
 * Nothing here is new advice. It is the same evidence as the insights, laid
 * out against a calendar — because "every six months" only happens if it is
 * written down somewhere.
 */

import type { InsightContext } from './context'
import type { CalendarItem, CalendarWhen } from './types'

const WHEN_ORDER: readonly CalendarWhen[] = [
  'this-week',
  'this-month',
  'next-3-months',
  'next-6-months',
  'this-year',
  'monthly',
  'every-6-months',
]

export const CALENDAR_WHEN_LABELS: Readonly<Record<CalendarWhen, string>> = {
  'this-week': 'This week',
  'this-month': 'This month',
  'next-3-months': 'In the next three months',
  'next-6-months': 'In the next six months',
  'this-year': 'Within the year',
  monthly: 'Every month',
  'every-6-months': 'Every six months',
}

function birthdayWhen(days: number): CalendarWhen {
  if (days <= 7) return 'this-week'
  if (days <= 31) return 'this-month'
  if (days <= 92) return 'next-3-months'
  if (days <= 183) return 'next-6-months'
  return 'this-year'
}

export function buildCalendar(c: InsightContext): CalendarItem[] {
  const { p, v } = c
  const items: CalendarItem[] = []
  const add = (item: CalendarItem) => {
    if (!items.some((i) => i.id === item.id)) items.push(item)
  }

  // --- the dog's own day ---------------------------------------------------
  if (p.daysUntilBirthday !== undefined && p.daysUntilBirthday >= 0) {
    const turning = Math.floor(c.ageYears) + 1
    add({
      id: 'barkday',
      when: birthdayWhen(p.daysUntilBirthday),
      title:
        p.daysUntilBirthday === 0
          ? `${v.Name}'s barkday is today`
          : `${v.Name}'s barkday in ${p.daysUntilBirthday} ${p.daysUntilBirthday === 1 ? 'day' : 'days'}`,
      detail: `${v.Subj} ${v.verb('turn')} ${turning}. A good excuse for a longer sniff walk and a photo.`,
      sources: [],
    })
  }

  // --- urgent follow-ups from recent signs ---------------------------------
  if (c.sign('new-lump')) {
    add({ id: 'cal-lump', when: 'this-week', title: 'Book a needle sample of the new lump', detail: 'A fine-needle aspirate answers the question in one visit. Measure and photograph it in the meantime.', sources: ['merck'] })
  }
  if (c.sign('drinking-more') || c.sign('appetite-change') || c.sign('coughing') || c.sign('tiring') || c.sign('confusion')) {
    add({
      id: 'cal-signs-exam',
      when: 'this-week',
      title: 'Book an exam for the recent changes',
      detail: `Bring the list of what changed — ${[c.sign('drinking-more') ? 'drinking' : '', c.sign('appetite-change') ? 'appetite' : '', c.sign('coughing') ? 'the cough' : '', c.sign('tiring') ? 'tiring' : '', c.sign('confusion') ? 'confusion' : ''].filter(Boolean).join(', ')} — and ask for bloodwork and urinalysis.`,
      sources: ['merck'],
    })
  }
  if (p.mobility === 'limping') {
    add({ id: 'cal-limp', when: 'this-week', title: 'Have the limp examined if it has lasted more than a few days', detail: 'Rest first; if it is still there after 48 hours, book it. Take a video — limps vanish in clinics.', sources: ['merck'] })
  }
  if (p.weightTrend === 'losing' && (p.bodyConditionScore ?? 5) <= 5) {
    add({ id: 'cal-weight-loss', when: 'this-week', title: 'Book an exam for the unexplained weight loss', detail: 'Bloodwork, urinalysis and a look in the mouth. Note appetite and drinking for the vet.', sources: ['merck'] })
  }

  // --- vet care rhythm -------------------------------------------------------
  if (p.vetCare === 'none' || p.vetCare === 'reactive') {
    add({ id: 'cal-baseline-exam', when: 'this-month', title: 'Book a baseline exam with bloodwork', detail: 'The foundation for everything else in this report. Take the report with you.', sources: ['aahaLifeStage2019'] })
  } else if (c.stage === 'geriatric') {
    add({ id: 'cal-geriatric-exam', when: 'next-3-months', title: 'Check-up with a pain score and a weight', detail: 'Every three to six months now. Bring the quality-of-life record.', sources: ['aahaSenior2023'] })
  } else if (c.older) {
    add({ id: 'cal-senior-exam', when: 'every-6-months', title: 'Senior exam with bloodwork, urinalysis, blood pressure and thyroid', detail: 'The six-monthly rhythm is where early detection actually changes outcomes.', sources: ['aahaSenior2023'] })
  } else if (c.stage === 'puppy') {
    add({ id: 'cal-puppy-visits', when: 'this-month', title: 'Puppy visit — vaccines, weight check, parasite plan', detail: 'Every three to four weeks until the vaccine course is complete at 16–20 weeks.', sources: ['aahaVaccination2022'] })
  } else {
    add({ id: 'cal-annual-exam', when: 'this-year', title: 'Annual exam', detail: `Weight, mouth, heart and — ${c.stage === 'mature-adult' ? 'from now' : 'from middle age'} — a blood and urine panel as a baseline.`, sources: ['aahaLifeStage2019'] })
  }

  // --- vaccines --------------------------------------------------------------
  if (p.vaccination === 'overdue' || p.vaccination === 'not-sure') {
    add({ id: 'cal-vaccines', when: 'this-month', title: p.vaccination === 'overdue' ? 'Bring the vaccines up to date' : 'Find the vaccine record, or start the core course', detail: 'Distemper, parvovirus, adenovirus, rabies and leptospirosis — the last now core for every dog.', sources: ['aahaVaccination2022'] })
  } else if (c.stage === 'puppy') {
    add({ id: 'cal-puppy-vaccines', when: 'next-3-months', title: 'Complete the puppy vaccine series', detail: 'Final core dose at 16–20 weeks; leptospirosis as a two-dose course from 12 weeks.', sources: ['aahaVaccination2022'] })
  } else {
    add({ id: 'cal-vaccine-check', when: 'this-year', title: 'Check vaccine due dates at the next exam', detail: 'Ask specifically about leptospirosis, the one most often missing.', sources: ['aahaVaccination2022'] })
  }

  // --- parasites -------------------------------------------------------------
  if (p.parasitePrevention === 'none' || p.parasitePrevention === 'not-sure') {
    add({ id: 'cal-parasites-start', when: 'this-week', title: 'Start year-round parasite prevention', detail: 'A heartworm test first if there has been a gap, then a combined preventive on schedule.', sources: ['ahsHeartworm'] })
  } else if (p.parasitePrevention === 'seasonal') {
    add({ id: 'cal-parasites-continuous', when: 'this-month', title: 'Switch parasite prevention to continuous', detail: 'Same product, no gap. Ticks and mosquitoes do not keep to the calendar.', sources: ['ahsHeartworm'] })
  }
  if (p.parasitePrevention !== undefined && c.stage !== 'puppy') {
    add({ id: 'cal-heartworm-test', when: 'this-year', title: 'Annual heartworm test', detail: 'Catches a breakthrough while treatment is still straightforward.', sources: ['ahsHeartworm'] })
  }
  if (p.parasitePrevention === 'year-round') {
    add({ id: 'cal-parasite-dose', when: 'monthly', title: 'Parasite preventive on schedule', detail: 'The forgotten dose is the one that matters. Put it on a repeating reminder.', sources: ['ahsHeartworm'] })
  }

  // --- teeth -----------------------------------------------------------------
  if (p.dentalCare === 'none' || p.dentalCare === 'occasional') {
    add({ id: 'cal-brushing', when: 'this-week', title: 'Start (or step up to) daily brushing', detail: 'Finger brush, canine enzymatic paste, thirty seconds after the evening meal.', sources: ['harvey2015'] })
  }
  if (c.ageYears >= 2 && p.dentalCare !== undefined) {
    add({ id: 'cal-dental-assess', when: 'this-year', title: 'Ask whether a professional cleaning with radiographs is due', detail: c.tiny ? 'Small breeds usually need the first one by three to five.' : 'Tartar that brushing cannot shift needs a cleaning under anaesthesia.', sources: ['avdc', 'oneill2021perio'] })
  }

  // --- weight ----------------------------------------------------------------
  if ((p.bodyConditionScore ?? 5) > 5 || p.weightTrend === 'gaining' || c.has('overweight')) {
    add({ id: 'cal-weigh-monthly', when: 'monthly', title: `Weigh ${v.name}`, detail: 'Aim for 1–2% of body weight a month on the way down; adjust the ration by 10% when the trend stalls.', sources: ['aahaWeight2014'] })
  } else if (p.bodyConditionScore !== undefined) {
    add({ id: 'cal-bcs-check', when: 'every-6-months', title: 'Hands-on body-condition check and a weigh-in', detail: 'Ribs easy to feel, waist from above, tuck from the side. Catch creep early.', sources: ['salt2019'] })
  }

  // --- identification --------------------------------------------------------
  if (p.microchip === 'none') {
    add({ id: 'cal-chip', when: 'this-month', title: 'Microchip, and register it the same day', detail: 'Plus a collar tag with your number — the tag is faster than the scanner.', sources: ['lord2009'] })
  } else if (p.microchip === 'chipped-unsure' || p.microchip === 'not-sure') {
    add({ id: 'cal-chip-check', when: 'this-week', title: 'Check the microchip registration points to you', detail: 'Any vet can read the number; a registry lookup shows who it is registered to.', sources: ['lord2009'] })
  }

  // --- breed-specific screening ---------------------------------------------
  if (c.cond.has('gdv-bloat') && (p.neuterStatus === 'intact' || c.young)) {
    add({ id: 'cal-gastropexy', when: 'this-year', title: 'Discuss a preventive gastropexy', detail: 'Often done at the time of neutering for the highest-risk breeds.', sources: ['glickman2000'] })
  }
  if (c.cond.has('mdr1')) {
    add({ id: 'cal-mdr1', when: 'this-month', title: 'Order the MDR1 drug-sensitivity test', detail: 'A one-off cheek swab. Until the result is back, treat as affected.', sources: ['wsuMdr1'] })
  }
  if ((c.cond.has('mitral-valve-disease') || c.cond.has('dilated-cardiomyopathy') || c.has('heart')) && !c.sign('coughing')) {
    add({ id: 'cal-heart', when: 'this-year', title: c.has('heart') ? 'Heart recheck on the cardiologist’s schedule' : 'Careful heart auscultation at the exam', detail: c.has('heart') ? 'Keep the sleeping breathing-rate log going between visits.' : 'A murmur means an echocardiogram to stage it, not a wait for symptoms.', sources: ['acvim2019mvd'] })
  }
  if (c.cond.has('progressive-retinal-atrophy') || c.cond.has('cataracts') || c.cond.has('glaucoma') || c.has('eyes')) {
    add({ id: 'cal-eyes', when: 'this-year', title: 'Eye examination', detail: 'Ideally with a veterinary ophthalmologist for an inherited-risk breed.', sources: ['ofa'] })
  }
  if (c.cond.has('deafness') && c.stage === 'puppy') {
    add({ id: 'cal-baer', when: 'next-3-months', title: 'BAER hearing test', detail: 'Quick, painless, and it settles the question for life.', sources: ['ofa'] })
  }
  if (c.cond.has('hip-dysplasia') && c.big && c.young) {
    add({ id: 'cal-joints', when: 'this-year', title: 'Ask about joint screening and the neutering timing', detail: 'Keep lean and low-impact until the growth plates close.', sources: ['kealy1997', 'hart2020'] })
  }

  // --- known conditions ------------------------------------------------------
  if (c.has('kidney')) add({ id: 'cal-kidney', when: 'every-6-months', title: 'Kidney bloodwork, urinalysis and blood pressure', detail: 'Or on the IRIS-stage schedule your vet sets — often every three months.', sources: ['jacob2002'] })
  if (c.has('thyroid')) add({ id: 'cal-thyroid', when: 'every-6-months', title: 'Thyroid level recheck', detail: 'Dose requirements drift; weight gain or lethargy returning is the cue to check sooner.', sources: ['merck'] })
  if (c.has('diabetes')) add({ id: 'cal-diabetes', when: 'every-6-months', title: 'Diabetes review — glucose curve or fructosamine, eyes checked', detail: 'Bring the log of insulin, meals, water and energy.', sources: ['merck'] })
  if (c.has('epilepsy')) add({ id: 'cal-epilepsy', when: 'this-year', title: 'Seizure medication review and drug levels', detail: 'Bring the seizure diary. Ask about a rescue medication to keep at home.', sources: ['acvim2016seizures'] })
  if (c.has('arthritis') || p.mobility === 'stiff-after-rest' || p.mobility === 'avoids-stairs') {
    add({ id: 'cal-pain', when: 'every-6-months', title: 'Pain and mobility reassessment', detail: 'Plans need adjusting as joints change; ask for the score each time.', sources: ['aahaSenior2023'] })
  }

  // --- the mind --------------------------------------------------------------
  if (c.older) {
    add({ id: 'cal-cognition', when: 'every-6-months', title: 'Two-minute cognitive screen at each visit', detail: 'Night restlessness, disorientation, house-training lapses — the DISHAA checklist.', sources: ['salvin2010'] })
  }
  if (c.stage === 'geriatric') {
    add({ id: 'cal-qol', when: 'monthly', title: 'Quality-of-life score (HHHHHMM)', detail: 'Seven items out of ten; watch the trend, not the single bad day.', sources: ['villalobosQol'] })
  }

  // --- puppy milestones --------------------------------------------------------
  if (c.stage === 'puppy') {
    if (c.ageYears < 0.35) {
      add({ id: 'cal-socialise', when: 'this-week', title: 'Socialisation — a few new, positive experiences every day', detail: 'The window closes around 12–16 weeks. Safe settings only until the vaccines are done.', sources: ['avsabSocialization'] })
    }
    add({ id: 'cal-neuter-talk', when: 'this-year', title: 'Decide on neutering timing with the breed in mind', detail: c.big ? 'For a large breed, the evidence favours waiting until at least 12 months.' : 'For a smaller breed, timing is mostly about convenience and behaviour.', sources: ['hart2020'] })
    if (p.training === undefined || p.training === 'none') {
      add({ id: 'cal-puppy-class', when: 'this-month', title: 'Enrol in a reward-based puppy class', detail: 'Socialisation and manners in one, under supervision.', sources: ['avsabSocialization'] })
    }
  } else if (c.young && (p.training === 'none' || p.training === undefined)) {
    add({ id: 'cal-training', when: 'this-month', title: 'Start reward-based training — recall and “leave it” first', detail: 'The two cues that keep young dogs out of the road and in their homes.', sources: ['boyd2018'] })
  }

  // --- season and safety -------------------------------------------------------
  if (p.climate === 'hot' || p.climate === 'both') {
    add({ id: 'cal-heat-plan', when: 'next-6-months', title: 'Hot-weather plan in place before the heat', detail: 'Early and late walks, pavement check, water carried, and the signs of heatstroke learned.', sources: ['hall2020triggers'] })
  }
  if (p.climate === 'cold' || p.climate === 'both') {
    add({ id: 'cal-cold-plan', when: 'next-6-months', title: 'Winter check: antifreeze stored, paw care, bedding off the floor', detail: c.tiny || c.older ? 'A fitted coat for the coldest days.' : 'Rinse paws after salted pavements.', sources: ['aspcaApcc'] })
  }
  if (p.knowsEmergencyVet === false) {
    add({ id: 'cal-emergency-vet', when: 'this-week', title: 'Save the 24-hour emergency vet and poison line in your phone', detail: 'Drive the route once in daylight.', sources: ['aspcaApcc'] })
  }
  if (c.stage === 'mature-adult' || c.older) {
    add({ id: 'cal-lump-check', when: 'monthly', title: 'Hands-on lump and lymph-node check', detail: 'Armpits, groin, between the toes, under the jaw. Anything new gets a needle sample.', sources: ['merck'] })
  }

  items.sort((a, b) => WHEN_ORDER.indexOf(a.when) - WHEN_ORDER.indexOf(b.when))
  return items.slice(0, 16)
}
