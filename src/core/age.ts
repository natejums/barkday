/**
 * Turning "when was your dog born?" into a number the models can use.
 *
 * The engine is deliberately pure: nothing in here reads the clock. Callers
 * pass `asOf`, which keeps every calculation reproducible and testable.
 */

const MS_PER_DAY = 86_400_000

/** Mean Gregorian year, so long spans don't drift on leap years. */
export const DAYS_PER_YEAR = 365.2425
export const MS_PER_YEAR = DAYS_PER_YEAR * MS_PER_DAY

/**
 * Fractional years between two dates. Negative if `to` precedes `from`;
 * callers are expected to reject that rather than have this silently clamp.
 *
 * Counted by calendar anniversaries rather than by dividing elapsed
 * milliseconds by a mean year. Dividing is very slightly wrong in a way that
 * lands on the worst possible day: a common year is 365 days against a mean of
 * 365.2425, so a dog on its first birthday came out at 0.99934 years and the
 * label rendered "11 months" — on the one day an owner is most likely to look.
 *
 * Anniversary arithmetic makes whole birthdays exact by construction, and the
 * remainder is measured against the length of the year actually in progress, so
 * leap years account for themselves instead of being averaged away.
 */
export function yearsBetween(from: Date, to: Date): number {
  if (to.getTime() < from.getTime()) return -yearsBetween(to, from)

  let years = to.getFullYear() - from.getFullYear()

  const anniversary = new Date(from.getTime())
  anniversary.setFullYear(from.getFullYear() + years)
  if (anniversary.getTime() > to.getTime()) {
    years -= 1
    anniversary.setFullYear(from.getFullYear() + years)
  }

  const nextAnniversary = new Date(from.getTime())
  nextAnniversary.setFullYear(from.getFullYear() + years + 1)

  const spanMs = nextAnniversary.getTime() - anniversary.getTime()
  if (spanMs <= 0) return years

  return years + (to.getTime() - anniversary.getTime()) / spanMs
}

export interface AgeParts {
  years: number
  months: number
  /** e.g. "2 years, 3 months" — or "7 months" when there are no whole years. */
  label: string
}

/**
 * Splits fractional years into whole years and months for display.
 *
 * Months are floored rather than rounded so the label never claims an age the
 * dog has not reached yet. The epsilon absorbs float drift, so an age that is
 * arithmetically 2.0 doesn't render as "1 year, 11 months".
 */
export function describeYears(totalYears: number): AgeParts {
  const totalMonths = Math.floor(Math.max(0, totalYears) * 12 + 1e-6)
  const years = Math.floor(totalMonths / 12)
  const months = totalMonths % 12

  const parts: string[] = []
  if (years > 0) parts.push(`${years} ${years === 1 ? 'year' : 'years'}`)
  if (months > 0) parts.push(`${months} ${months === 1 ? 'month' : 'months'}`)
  if (parts.length === 0) parts.push('under a month')

  return { years, months, label: parts.join(', ') }
}

/** Midnight local time on the calendar day containing `date`. */
function startOfDay(date: Date): Date {
  return new Date(date.getFullYear(), date.getMonth(), date.getDate())
}

/**
 * The dog's next birthday on or after `asOf` — today counts, so a dog whose
 * birthday is today gets 0 days rather than a full year.
 *
 * Feb 29 birthdays roll to Mar 1 in common years, which is what `Date` does
 * natively and what most people mean.
 */
export function nextBirthday(birthDate: Date, asOf: Date): Date {
  const today = startOfDay(asOf)
  const thisYear = new Date(today.getFullYear(), birthDate.getMonth(), birthDate.getDate())
  return thisYear.getTime() >= today.getTime()
    ? thisYear
    : new Date(today.getFullYear() + 1, birthDate.getMonth(), birthDate.getDate())
}

/** Whole days until the next birthday — the app calls this the dog's barkday. */
export function daysUntilBirthday(birthDate: Date, asOf: Date): number {
  const target = nextBirthday(birthDate, asOf)
  // Both operands are local midnight, so rounding absorbs any DST hour shift.
  return Math.round((target.getTime() - startOfDay(asOf).getTime()) / MS_PER_DAY)
}
