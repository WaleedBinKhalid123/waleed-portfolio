import type { Duration, MonthString } from "@/types/portfolio";

/**
 * Date utilities.
 *
 * All portfolio dates are authored as `YYYY-MM` strings. Everything the UI
 * shows — formatted months, ranges, durations, total years of experience — is
 * derived here so components stay free of date logic and the data files never
 * contain pre-formatted presentation strings.
 */

const MONTH_LABELS = [
  "Jan",
  "Feb",
  "Mar",
  "Apr",
  "May",
  "Jun",
  "Jul",
  "Aug",
  "Sep",
  "Oct",
  "Nov",
  "Dec",
] as const;

/** Months elapsed since January of year 0 — a comparable integer timeline. */
interface MonthIndex {
  year: number;
  month: number;
  index: number;
}

const MONTH_PATTERN = /^(\d{4})-(\d{2})(?:-\d{2})?$/;

/**
 * Parses a `YYYY-MM` (or `YYYY-MM-DD`) string into a comparable month index.
 * Returns `null` for missing or malformed input rather than throwing, so a
 * single bad entry degrades one line of the UI instead of the whole page.
 */
export function parseMonth(value?: MonthString): MonthIndex | null {
  if (!value) return null;

  const match = MONTH_PATTERN.exec(value.trim());
  if (!match) return null;

  const year = Number(match[1]);
  const month = Number(match[2]);
  if (month < 1 || month > 12) return null;

  return { year, month, index: year * 12 + (month - 1) };
}

function currentMonth(): MonthIndex {
  const now = new Date();
  const year = now.getFullYear();
  const month = now.getMonth() + 1;
  return { year, month, index: year * 12 + (month - 1) };
}

/**
 * `"2024-03"` → `"Mar 2024"`. Returns `fallback` when the value is missing or
 * unparseable.
 */
export function formatMonthYear(value?: MonthString, fallback = ""): string {
  const parsed = parseMonth(value);
  if (!parsed) return fallback;
  return `${MONTH_LABELS[parsed.month - 1]} ${parsed.year}`;
}

/** `"2021-09"` → `"2021"`. */
export function formatYear(value?: MonthString, fallback = ""): string {
  const parsed = parseMonth(value);
  return parsed ? String(parsed.year) : fallback;
}

/**
 * `("2021-06", "2023-11")` → `"Jun 2021 — Nov 2023"`.
 * An ongoing entry (`current`, or no end date) ends with `"Present"`.
 */
export function formatDateRange(
  startDate?: MonthString,
  endDate?: MonthString,
  current?: boolean,
): string {
  const start = formatMonthYear(startDate);
  const end = current || !endDate ? "Present" : formatMonthYear(endDate);

  if (!start) return end === "Present" && !current ? "" : end;
  if (!end) return start;
  return `${start} — ${end}`;
}

function pluralise(value: number, unit: "year" | "month"): string {
  return `${value} ${unit}${value === 1 ? "" : "s"}`;
}

/** Builds a zero-suppressed, correctly pluralised label from a month count. */
function durationLabel(years: number, months: number, totalMonths: number): string {
  if (totalMonths <= 0) return "Less than a month";
  if (years === 0) return pluralise(months, "month");
  if (months === 0) return pluralise(years, "year");
  return `${pluralise(years, "year")} ${pluralise(months, "month")}`;
}

/**
 * Duration between two months. An omitted `endDate` runs to the current month,
 * which is what "Present" roles need.
 *
 * `calculateDuration("2022-03", "2024-08")` →
 * `{ years: 2, months: 5, totalMonths: 29, label: "2 years 5 months" }`
 */
export function calculateDuration(startDate?: MonthString, endDate?: MonthString): Duration {
  const start = parseMonth(startDate);
  const end = parseMonth(endDate) ?? currentMonth();

  if (!start) return { years: 0, months: 0, totalMonths: 0, label: "" };

  const totalMonths = Math.max(0, end.index - start.index);
  const years = Math.floor(totalMonths / 12);
  const months = totalMonths % 12;

  return { years, months, totalMonths, label: durationLabel(years, months, totalMonths) };
}

/** Anything with a start month and an optional end — the shape of a role. */
interface DatedPeriod {
  startDate: MonthString;
  endDate?: MonthString;
  current?: boolean;
}

/**
 * Total professional experience across every role, counting overlapping months
 * only once — concurrent or back-to-back contracts must not inflate the total.
 */
export function calculateTotalExperience(periods: readonly DatedPeriod[]): Duration {
  const now = currentMonth().index;

  const ranges = periods
    .map((period) => {
      const start = parseMonth(period.startDate);
      if (!start) return null;
      const parsedEnd = period.current ? null : parseMonth(period.endDate);
      const end = parsedEnd ? parsedEnd.index : now;
      return end > start.index ? { start: start.index, end } : null;
    })
    .filter((range): range is { start: number; end: number } => range !== null)
    .sort((a, b) => a.start - b.start);

  // Merge overlapping ranges, then sum the merged spans.
  let totalMonths = 0;
  let cursorStart: number | null = null;
  let cursorEnd = 0;

  for (const range of ranges) {
    if (cursorStart === null) {
      cursorStart = range.start;
      cursorEnd = range.end;
      continue;
    }

    if (range.start <= cursorEnd) {
      cursorEnd = Math.max(cursorEnd, range.end);
    } else {
      totalMonths += cursorEnd - cursorStart;
      cursorStart = range.start;
      cursorEnd = range.end;
    }
  }

  if (cursorStart !== null) totalMonths += cursorEnd - cursorStart;

  const years = Math.floor(totalMonths / 12);
  const months = totalMonths % 12;

  return { years, months, totalMonths, label: durationLabel(years, months, totalMonths) };
}

/**
 * Compact headline form of a total, e.g. `"5+ years"`. Falls back to the exact
 * label below a year, where "0+ years" would be nonsense.
 */
export function formatExperienceHeadline(duration: Duration): string {
  if (duration.totalMonths <= 0) return "";
  if (duration.years < 1) return duration.label;
  // Round up once past the 9-month mark; "4 years 11 months" reads as "5+".
  const years = duration.months >= 9 ? duration.years + 1 : duration.years;
  return `${years}+ years`;
}

/** Newest-first comparator for anything with a `startDate`. */
export function byMostRecent<T extends { startDate?: MonthString; date?: MonthString }>(
  a: T,
  b: T,
): number {
  const aIndex = parseMonth(a.startDate ?? a.date)?.index ?? 0;
  const bIndex = parseMonth(b.startDate ?? b.date)?.index ?? 0;
  return bIndex - aIndex;
}

/**
 * True when the month has already passed — used to mark a certification whose
 * expiry date is behind us, rather than showing a stale "valid" credential.
 */
export function isPastMonth(value?: MonthString): boolean {
  const parsed = parseMonth(value);
  if (!parsed) return false;
  return parsed.index < currentMonth().index;
}

/** Newest-first comparator for certifications, keyed on the issue date. */
export function byMostRecentIssue(
  a: { issueDate?: MonthString },
  b: { issueDate?: MonthString },
): number {
  return (parseMonth(b.issueDate)?.index ?? 0) - (parseMonth(a.issueDate)?.index ?? 0);
}
