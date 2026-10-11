"use client";

import { useMemo, useState } from "react";
import { Field, Notice, NumberInput, Segmented, Select, Stat, formatNumber } from "./ui";

type Mode = "loan" | "price";
type TenureUnit = "years" | "months";
type ScheduleView = "yearly" | "monthly";

const CURRENCIES = ["Rs", "$", "AED", "SAR", "£", "€"].map((c) => ({ value: c, label: c }));
const MAX_MONTHS = 600;

function num(s: string): number {
  return s.trim() === "" ? NaN : Number(s);
}

interface Row {
  label: string;
  payment: number;
  principal: number;
  interest: number;
  balance: number;
}

function emiFor(p: number, annualRate: number, n: number): number {
  const r = annualRate / 12 / 100;
  if (r === 0) return p / n;
  const f = Math.pow(1 + r, n);
  return (p * r * f) / (f - 1);
}

function buildSchedule(p: number, annualRate: number, n: number, emi: number): Row[] {
  const r = annualRate / 12 / 100;
  const rows: Row[] = [];
  let balance = p;
  for (let m = 1; m <= n; m++) {
    const interest = balance * r;
    // The last payment clears whatever is left so rounding never leaves a tail.
    const principal = m === n ? balance : Math.min(emi - interest, balance);
    balance = Math.max(0, balance - principal);
    rows.push({ label: String(m), payment: principal + interest, principal, interest, balance });
  }
  return rows;
}

function groupYearly(rows: Row[]): Row[] {
  const out: Row[] = [];
  for (let i = 0; i < rows.length; i += 12) {
    const chunk = rows.slice(i, i + 12);
    out.push({
      label: String(i / 12 + 1),
      payment: chunk.reduce((s, x) => s + x.payment, 0),
      principal: chunk.reduce((s, x) => s + x.principal, 0),
      interest: chunk.reduce((s, x) => s + x.interest, 0),
      balance: chunk[chunk.length - 1].balance,
    });
  }
  return out;
}

export default function LoanEmiCalculator() {
  const [mode, setMode] = useState<Mode>("loan");
  const [amount, setAmount] = useState("2500000");
  const [price, setPrice] = useState("3500000");
  const [down, setDown] = useState("1000000");
  const [rate, setRate] = useState("18");
  const [tenure, setTenure] = useState("5");
  const [unit, setUnit] = useState<TenureUnit>("years");
  const [currency, setCurrency] = useState("Rs");
  const [view, setView] = useState<ScheduleView>("yearly");

  const dp = currency === "Rs" ? 0 : 2;
  const money = (n: number) => (Number.isFinite(n) ? `${currency} ${formatNumber(n, dp)}` : "-");

  const principal = mode === "loan" ? num(amount) : num(price) - num(down);
  const annualRate = num(rate);
  const months = unit === "years" ? Math.round(num(tenure) * 12) : Math.round(num(tenure));

  let error = "";
  if (mode === "price" && Number.isFinite(principal) && principal <= 0)
    error = "The down payment covers the whole price, so there is nothing to borrow.";
  else if (!Number.isFinite(principal) || principal <= 0) error = "Enter a loan amount above zero.";
  else if (!Number.isFinite(annualRate) || annualRate < 0 || annualRate > 100)
    error = "Enter an interest rate between 0 and 100%.";
  else if (!Number.isFinite(months) || months < 1) error = "Enter a tenure of at least 1 month.";
  else if (months > MAX_MONTHS) error = "Tenure can be at most 50 years.";

  const result = useMemo(() => {
    if (error) return null;
    const emi = emiFor(principal, annualRate, months);
    const rows = buildSchedule(principal, annualRate, months, emi);
    const total = rows.reduce((s, x) => s + x.payment, 0);
    return { emi, rows, total, interest: total - principal };
  }, [error, principal, annualRate, months]);

  const shown = result ? (view === "yearly" ? groupYearly(result.rows) : result.rows) : [];
  const principalShare = result ? (principal / result.total) * 100 : 0;

  return (
    <div className="tool-stack">
      <Segmented
        value={mode}
        onChange={setMode}
        ariaLabel="What do you know"
        options={[
          { value: "loan", label: "I know the loan amount" },
          { value: "price", label: "I know the price" },
        ]}
      />

      <div className="tool-grid cols-2">
        {mode === "loan" ? (
          <Field label="Loan amount" htmlFor="emi-amount" hint={Number.isFinite(num(amount)) ? money(num(amount)) : undefined}>
            <NumberInput id="emi-amount" min={0} value={amount} onChange={(e) => setAmount(e.target.value)} />
          </Field>
        ) : (
          <>
            <Field label="Car or property price" htmlFor="emi-price" hint={Number.isFinite(num(price)) ? money(num(price)) : undefined}>
              <NumberInput id="emi-price" min={0} value={price} onChange={(e) => setPrice(e.target.value)} />
            </Field>
            <Field
              label="Down payment"
              htmlFor="emi-down"
              hint={
                Number.isFinite(principal) && principal > 0
                  ? `Loan: ${money(principal)} (${formatNumber((num(down) / num(price)) * 100, 1)}% down)`
                  : undefined
              }
            >
              <NumberInput id="emi-down" min={0} value={down} onChange={(e) => setDown(e.target.value)} />
            </Field>
          </>
        )}
        <Field label="Annual interest rate (%)" htmlFor="emi-rate" hint="The yearly rate on your offer letter, for example KIBOR plus the bank's spread.">
          <NumberInput id="emi-rate" min={0} step="0.1" value={rate} onChange={(e) => setRate(e.target.value)} />
        </Field>
        <Field label="Tenure" htmlFor="emi-tenure">
          <div style={{ display: "flex", gap: 8, alignItems: "center", flexWrap: "wrap" }}>
            <NumberInput
              id="emi-tenure"
              min={1}
              value={tenure}
              onChange={(e) => setTenure(e.target.value)}
              style={{ flex: "1 1 90px", width: "auto" }}
            />
            <Segmented
              value={unit}
              onChange={(u) => {
                // Keep the same length of time when switching units.
                const t = num(tenure);
                if (Number.isFinite(t)) setTenure(u === "months" ? String(Math.round(t * 12)) : String(Math.round((t / 12) * 100) / 100));
                setUnit(u);
              }}
              ariaLabel="Tenure unit"
              options={[
                { value: "years", label: "Years" },
                { value: "months", label: "Months" },
              ]}
            />
          </div>
        </Field>
        <Field label="Currency" htmlFor="emi-currency" hint="Only changes the label. No conversion is done.">
          <Select id="emi-currency" value={currency} onChange={(e) => setCurrency(e.target.value)} options={CURRENCIES} />
        </Field>
      </div>

      {error && <Notice tone="error">{error}</Notice>}

      {result && (
        <>
          <div className="tool-grid cols-4">
            <Stat label="Monthly EMI" value={money(result.emi)} sub={`${months} payments`} accent />
            <Stat label="Total interest" value={money(result.interest)} />
            <Stat label="Total payment" value={money(result.total)} />
            <Stat
              label="Interest share"
              value={`${formatNumber((result.interest / result.total) * 100, 1)}%`}
              sub="of everything you pay"
            />
          </div>

          <div>
            <div
              role="img"
              aria-label={`Principal ${formatNumber(principalShare, 1)}%, interest ${formatNumber(100 - principalShare, 1)}%`}
              style={{
                display: "flex",
                height: 14,
                borderRadius: 999,
                overflow: "hidden",
                background: "var(--chip-bg)",
              }}
            >
              <div style={{ width: `${principalShare}%`, background: "var(--hub-accent)" }} />
              <div style={{ flex: 1, background: "var(--line-strong)" }} />
            </div>
            <div className="tool-hint" style={{ display: "flex", justifyContent: "space-between", gap: 12, marginTop: 6, flexWrap: "wrap" }}>
              <span>
                <span style={{ display: "inline-block", width: 10, height: 10, borderRadius: 3, background: "var(--hub-accent)", marginRight: 6 }} />
                Principal {money(principal)}
              </span>
              <span>
                <span style={{ display: "inline-block", width: 10, height: 10, borderRadius: 3, background: "var(--line-strong)", marginRight: 6 }} />
                Interest {money(result.interest)}
              </span>
            </div>
          </div>

          <div className="tool-hint">
            Bank processing fees, insurance, registration and taxes are not included. Islamic banking
            and car ijarah work on rental and profit rates, so their monthly figure can differ from this
            conventional EMI. Use this as an estimate and confirm with your bank.
          </div>

          <div>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", gap: 12, flexWrap: "wrap", marginBottom: 12 }}>
              <h2 style={{ fontSize: 16, fontWeight: 600, color: "var(--ink)" }}>Repayment schedule</h2>
              <Segmented
                value={view}
                onChange={setView}
                ariaLabel="Schedule view"
                options={[
                  { value: "yearly", label: "Yearly" },
                  { value: "monthly", label: "Monthly" },
                ]}
              />
            </div>
            <div className="tool-scroll-x" style={view === "monthly" ? { maxHeight: 480, overflowY: "auto" } : undefined}>
              <table className="tool-table">
                <thead>
                  <tr>
                    <th>{view === "yearly" ? "Year" : "Month"}</th>
                    <th>Payment</th>
                    <th>Principal</th>
                    <th>Interest</th>
                    <th>Balance</th>
                  </tr>
                </thead>
                <tbody>
                  {shown.map((r) => (
                    <tr key={r.label}>
                      <td>{r.label}</td>
                      <td>{formatNumber(r.payment, dp)}</td>
                      <td>{formatNumber(r.principal, dp)}</td>
                      <td>{formatNumber(r.interest, dp)}</td>
                      <td>{formatNumber(r.balance, dp)}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </>
      )}
    </div>
  );
}
