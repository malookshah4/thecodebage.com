"use client";

import { useEffect, useMemo, useState } from "react";
import { ArrowLeftRight } from "lucide-react";
import { Btn, Field, Notice, NumberInput, Select, Stat } from "./ui";

const API = "https://open.er-api.com/v6/latest/USD";
const CACHE_KEY = "codebage-fx-usd";
const MAX_AGE = 6 * 60 * 60 * 1000;
const QUICK = ["PKR", "USD", "AED", "SAR", "GBP", "EUR", "CNY", "INR"];
const TABLE = ["PKR", "USD", "AED", "SAR", "GBP", "EUR"];

interface Rates {
  result: string;
  time_last_update_unix: number;
  time_last_update_utc: string;
  rates: Record<string, number>;
}

interface Cached {
  savedAt: number;
  data: Rates;
}

type Status =
  | { kind: "loading" }
  | { kind: "ready"; data: Rates; offline: boolean }
  | { kind: "error"; message: string };

function readCache(): Cached | null {
  try {
    const raw = localStorage.getItem(CACHE_KEY);
    if (!raw) return null;
    const c = JSON.parse(raw) as Cached;
    return c && c.data && c.data.rates ? c : null;
  } catch {
    return null;
  }
}

function writeCache(data: Rates) {
  try {
    localStorage.setItem(CACHE_KEY, JSON.stringify({ savedAt: Date.now(), data } satisfies Cached));
  } catch {
    // Storage full or blocked; we just fetch again next time.
  }
}

async function getRates(): Promise<{ data: Rates; offline: boolean }> {
  const cached = readCache();
  if (cached && Date.now() - cached.savedAt < MAX_AGE) return { data: cached.data, offline: false };
  try {
    const res = await fetch(API);
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    const data = (await res.json()) as Rates;
    if (data.result !== "success" || !data.rates) throw new Error("Bad response");
    writeCache(data);
    return { data, offline: false };
  } catch (e) {
    if (cached) return { data: cached.data, offline: true };
    throw e;
  }
}

let displayNames: Intl.DisplayNames | null | undefined;
function currencyName(code: string): string {
  if (displayNames === undefined) {
    try {
      displayNames = new Intl.DisplayNames(["en"], { type: "currency" });
    } catch {
      displayNames = null;
    }
  }
  const name = displayNames?.of(code);
  return name && name !== code ? name : "";
}

function fmt(n: number): string {
  if (!Number.isFinite(n)) return "-";
  const abs = Math.abs(n);
  if (abs !== 0 && abs < 0.01) return n.toLocaleString("en-US", { maximumSignificantDigits: 4 });
  if (abs < 1) return n.toLocaleString("en-US", { maximumFractionDigits: 4 });
  return n.toLocaleString("en-US", { minimumFractionDigits: 2, maximumFractionDigits: 2 });
}

function Chip({ code, active, onClick }: { code: string; active: boolean; onClick: () => void }) {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-pressed={active}
      style={{
        padding: "4px 10px",
        borderRadius: 999,
        fontSize: 13,
        border: `1px solid ${active ? "var(--hub-accent)" : "var(--line-strong)"}`,
        background: active ? "var(--hub-accent-soft)" : "transparent",
        color: active ? "var(--hub-accent)" : "var(--ink-2)",
        cursor: "pointer",
      }}
    >
      {code}
    </button>
  );
}

export default function CurrencyConverter() {
  const [status, setStatus] = useState<Status>({ kind: "loading" });
  const [amount, setAmount] = useState("100");
  const [from, setFrom] = useState("USD");
  const [to, setTo] = useState("PKR");

  useEffect(() => {
    let cancelled = false;
    getRates()
      .then(({ data, offline }) => {
        if (!cancelled) setStatus({ kind: "ready", data, offline });
      })
      .catch(() => {
        if (!cancelled)
          setStatus({
            kind: "error",
            message: "Exchange rates could not be loaded. Check your internet connection and reload the page.",
          });
      });
    return () => {
      cancelled = true;
    };
  }, []);

  const rates = status.kind === "ready" ? status.data.rates : null;

  const options = useMemo(() => {
    if (!rates) return [];
    return Object.keys(rates)
      .sort()
      .map((code) => {
        const name = currencyName(code);
        return { value: code, label: name ? `${code}, ${name}` : code };
      });
  }, [rates]);

  if (status.kind === "loading") return <Notice>Loading today&apos;s exchange rates...</Notice>;
  if (status.kind === "error") return <Notice tone="error">{status.message}</Notice>;

  const r = status.data.rates;
  const value = amount.trim() === "" ? NaN : Number(amount);
  const convert = (v: number, a: string, b: string) => (r[a] && r[b] ? (v * r[b]) / r[a] : NaN);
  const result = convert(value, from, to);
  const unit = convert(1, from, to);
  const inverse = convert(1, to, from);
  // Picking the currency already on the other side swaps them instead.
  const pickFrom = (c: string) => {
    if (c === to) setTo(from);
    setFrom(c);
  };
  const pickTo = (c: string) => {
    if (c === from) setFrom(to);
    setTo(c);
  };
  const updatedAt = status.data.time_last_update_unix
    ? new Date(status.data.time_last_update_unix * 1000)
    : new Date(status.data.time_last_update_utc);
  const updated = Number.isNaN(updatedAt.getTime())
    ? "recently"
    : updatedAt.toLocaleString(undefined, { dateStyle: "medium", timeStyle: "short" });

  return (
    <div className="tool-stack">
      {status.offline && (
        <Notice>You seem to be offline, so these are the rates saved on your last visit ({updated}).</Notice>
      )}

      <Field label="Amount" htmlFor="fx-amount">
        <NumberInput id="fx-amount" min={0} step="any" value={amount} onChange={(e) => setAmount(e.target.value)} />
      </Field>
      {amount.trim() !== "" && !Number.isFinite(value) && <Notice tone="error">Enter a number, like 100 or 2500.50.</Notice>}

      <div className="tool-swap-row">
        <Field label="From" htmlFor="fx-from">
          <Select id="fx-from" value={from} onChange={(e) => setFrom(e.target.value)} options={options} />
        </Field>
        <Btn
          variant="ghost"
          aria-label="Swap currencies"
          title="Swap"
          style={{ padding: "0 12px" }}
          onClick={() => {
            setFrom(to);
            setTo(from);
          }}
        >
          <ArrowLeftRight size={16} aria-hidden />
        </Btn>
        <Field label="To" htmlFor="fx-to">
          <Select id="fx-to" value={to} onChange={(e) => setTo(e.target.value)} options={options} />
        </Field>
      </div>

      <div className="tool-grid cols-2">
        <div>
          <div className="tool-label" style={{ marginBottom: 6 }}>Quick pick: from</div>
          <div style={{ display: "flex", flexWrap: "wrap", gap: 6 }}>
            {QUICK.map((c) => (
              <Chip key={c} code={c} active={from === c} onClick={() => pickFrom(c)} />
            ))}
          </div>
        </div>
        <div>
          <div className="tool-label" style={{ marginBottom: 6 }}>Quick pick: to</div>
          <div style={{ display: "flex", flexWrap: "wrap", gap: 6 }}>
            {QUICK.map((c) => (
              <Chip key={c} code={c} active={to === c} onClick={() => pickTo(c)} />
            ))}
          </div>
        </div>
      </div>

      <Stat
        label={`${Number.isFinite(value) ? fmt(value) : "-"} ${from} =`}
        value={`${fmt(result)} ${to}`}
        sub={
          <>
            1 {from} = {fmt(unit)} {to}
            <br />1 {to} = {fmt(inverse)} {from}
          </>
        }
        accent
      />

      <div className="tool-scroll-x">
        <table className="tool-table">
          <thead>
            <tr>
              <th>Currency</th>
              <th>{Number.isFinite(value) ? fmt(value) : "-"} {from} is</th>
            </tr>
          </thead>
          <tbody>
            {TABLE.map((c) => (
              <tr key={c}>
                <td>
                  {c} <span className="tool-hint">{currencyName(c)}</span>
                </td>
                <td>{fmt(convert(value, from, c))}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <p className="tool-hint">
        Rates updated {updated}. These are mid-market rates. Banks, exchange companies and card payments add their own margin, so
        the rate you actually get will be a little worse.{" "}
        <a href="https://www.exchangerate-api.com" target="_blank" rel="noopener noreferrer" style={{ textDecoration: "underline" }}>
          Rates By Exchange Rate API
        </a>
      </p>
    </div>
  );
}
