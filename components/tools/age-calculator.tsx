"use client";

import { useState, useSyncExternalStore } from "react";
import { Field, Notice, Stat, TextInput, formatNumber } from "./ui";

// All date math works on plain calendar dates (year, month, day). Day counts use
// Date.UTC on those parts, which has no time zones or daylight saving, so a
// date never shifts by one day the way new Date("2024-03-10") can.

interface Ymd {
  y: number;
  m: number; // 1 to 12
  d: number;
}

const WEEKDAYS = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];
const MONTHS = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];

function parse(s: string): Ymd | null {
  const m = /^(\d{4})-(\d{2})-(\d{2})$/.exec(s);
  if (!m) return null;
  const v = { y: Number(m[1]), m: Number(m[2]), d: Number(m[3]) };
  if (v.m < 1 || v.m > 12 || v.d < 1 || v.d > daysInMonth(v.y, v.m)) return null;
  return v;
}

function daysInMonth(y: number, m: number): number {
  return new Date(Date.UTC(y, m, 0)).getUTCDate();
}

function dayNumber(v: Ymd): number {
  return Math.round(Date.UTC(v.y, v.m - 1, v.d) / 86_400_000);
}

function fromDayNumber(n: number): Ymd {
  const dt = new Date(n * 86_400_000);
  return { y: dt.getUTCFullYear(), m: dt.getUTCMonth() + 1, d: dt.getUTCDate() };
}

function weekday(v: Ymd): string {
  return WEEKDAYS[new Date(Date.UTC(v.y, v.m - 1, v.d)).getUTCDay()];
}

function pretty(v: Ymd): string {
  return `${v.d} ${MONTHS[v.m - 1]} ${v.y}`;
}

/** Add whole months, clamping the day to the month's length (31 Jan + 1 month = 28 or 29 Feb). */
function addMonths(v: Ymd, n: number): Ymd {
  const total = v.y * 12 + (v.m - 1) + n;
  const y = Math.floor(total / 12);
  const m = (total % 12) + 1;
  return { y, m, d: Math.min(v.d, daysInMonth(y, m)) };
}

/** Years, months and days from a to b (a must not be after b). */
function diff(a: Ymd, b: Ymd) {
  let months = (b.y - a.y) * 12 + (b.m - a.m);
  if (dayNumber(addMonths(a, months)) > dayNumber(b)) months--;
  const days = dayNumber(b) - dayNumber(addMonths(a, months));
  return { years: Math.floor(months / 12), months: months % 12, days, totalMonths: months, totalDays: dayNumber(b) - dayNumber(a) };
}

function plural(n: number, word: string): string {
  return `${formatNumber(n, 0)} ${word}${n === 1 ? "" : "s"}`;
}

function todayIso(): string {
  const d = new Date();
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(d.getDate()).padStart(2, "0")}`;
}

const noopSubscribe = () => () => {};

/** Today's local date, or "" during prerender so server and client HTML match. */
function useToday(): string {
  return useSyncExternalStore(noopSubscribe, todayIso, () => "");
}

export default function AgeCalculator() {
  const today = useToday();
  return (
    <div className="tool-stack">
      <AgeSection today={today} />
      <hr style={{ border: 0, borderTop: "1px solid var(--line)" }} />
      <DiffSection today={today} />
    </div>
  );
}

function H2({ children }: { children: React.ReactNode }) {
  return <h2 style={{ fontSize: 16, fontWeight: 600, color: "var(--ink)", marginBottom: 12 }}>{children}</h2>;
}

function AgeSection({ today }: { today: string }) {
  const [dob, setDob] = useState("1995-06-15");
  const [at, setAt] = useState("");
  const atValue = at || today;

  const birth = parse(dob);
  const ref = parse(atValue);

  let error = "";
  if (dob && !birth) error = "Enter a valid date of birth.";
  else if (birth && ref && dayNumber(birth) > dayNumber(ref)) error = "The date of birth is after the \"age at\" date.";

  const ready = birth && ref && !error;
  const age = ready ? diff(birth, ref) : null;

  let next: { date: Ymd; days: number; turning: number } | null = null;
  if (ready) {
    let y = ref.y;
    // A 29 Feb birthday falls on 28 Feb in non-leap years here.
    let date: Ymd = { y, m: birth.m, d: Math.min(birth.d, daysInMonth(y, birth.m)) };
    if (dayNumber(date) < dayNumber(ref)) {
      y += 1;
      date = { y, m: birth.m, d: Math.min(birth.d, daysInMonth(y, birth.m)) };
    }
    next = { date, days: dayNumber(date) - dayNumber(ref), turning: y - birth.y };
  }

  return (
    <div>
      <H2>Age from date of birth</H2>
      <div className="tool-stack">
        <div className="tool-grid cols-2">
          <Field label="Date of birth" htmlFor="age-dob">
            <TextInput id="age-dob" type="date" value={dob} max={atValue || undefined} onChange={(e) => setDob(e.target.value)} />
          </Field>
          <Field label="Age at" htmlFor="age-at" hint={at ? undefined : "Today by default. Pick another date to see your age then."}>
            <TextInput id="age-at" type="date" value={atValue} onChange={(e) => setAt(e.target.value)} />
          </Field>
        </div>

        {error && <Notice tone="error">{error}</Notice>}

        {!today && !at && !error && <div className="tool-hint">Working out today&apos;s date...</div>}

        {age && next && birth && (
          <>
            {next.days === 0 && <Notice tone="success">Happy birthday. You turn {next.turning} today.</Notice>}
            <Stat
              label="Exact age"
              value={`${plural(age.years, "year")}, ${plural(age.months, "month")}, ${plural(age.days, "day")}`}
              sub={`Born on a ${weekday(birth)}, ${pretty(birth)}`}
              accent
            />
            <div className="tool-grid cols-4">
              <Stat label="Total months" value={formatNumber(age.totalMonths, 0)} />
              <Stat
                label="Total weeks"
                value={formatNumber(Math.floor(age.totalDays / 7), 0)}
                sub={age.totalDays % 7 ? `plus ${plural(age.totalDays % 7, "day")}` : undefined}
              />
              <Stat label="Total days" value={formatNumber(age.totalDays, 0)} />
              <Stat label="Hours (approx)" value={formatNumber(age.totalDays * 24, 0)} />
            </div>
            <div className="tool-grid cols-2">
              <Stat
                label="Next birthday"
                value={next.days === 0 ? "Today" : plural(next.days, "day")}
                sub={`${weekday(next.date)}, ${pretty(next.date)}. You turn ${next.turning}.`}
              />
              <Stat label="Day you were born" value={weekday(birth)} />
            </div>
            {birth.m === 2 && birth.d === 29 && (
              <div className="tool-hint">
                Born on 29 February: in years without a leap day this tool counts your birthday on 28 February.
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
}

function DiffSection({ today }: { today: string }) {
  const [from, setFrom] = useState("2026-01-01");
  const [to, setTo] = useState("");
  const [includeEnd, setIncludeEnd] = useState(false);
  const toValue = to || today;

  const a = parse(from);
  const b = parse(toValue);
  let error = "";
  if (from && !a) error = "Enter a valid start date.";
  else if (toValue && !b) error = "Enter a valid end date.";

  let result: ReturnType<typeof diff> | null = null;
  let swapped = false;
  if (a && b && !error) {
    let start = a;
    let end = b;
    if (dayNumber(start) > dayNumber(end)) {
      [start, end] = [end, start];
      swapped = true;
    }
    if (includeEnd) end = fromDayNumber(dayNumber(end) + 1);
    result = diff(start, end);
  }

  return (
    <div>
      <H2>Difference between two dates</H2>
      <div className="tool-stack">
        <div className="tool-grid cols-2">
          <Field label="From" htmlFor="diff-from">
            <TextInput id="diff-from" type="date" value={from} onChange={(e) => setFrom(e.target.value)} />
          </Field>
          <Field label="To" htmlFor="diff-to" hint={to ? undefined : "Today by default."}>
            <TextInput id="diff-to" type="date" value={toValue} onChange={(e) => setTo(e.target.value)} />
          </Field>
        </div>
        <label className="tool-checkbox">
          <input type="checkbox" checked={includeEnd} onChange={(e) => setIncludeEnd(e.target.checked)} />
          Include the end date (adds 1 day)
        </label>

        {error && <Notice tone="error">{error}</Notice>}

        {result && (
          <>
            <div className="tool-grid cols-2">
              <Stat
                label="Difference"
                value={`${plural(result.years, "year")}, ${plural(result.months, "month")}, ${plural(result.days, "day")}`}
                accent
              />
              <Stat
                label="Total days"
                value={formatNumber(result.totalDays, 0)}
                sub={`${formatNumber(Math.floor(result.totalDays / 7), 0)} weeks and ${plural(result.totalDays % 7, "day")}`}
              />
            </div>
            {swapped && <div className="tool-hint">The end date is before the start date, so they were swapped.</div>}
          </>
        )}
      </div>
    </div>
  );
}
