"use client";

import { useEffect, useState } from "react";
import { Eraser } from "lucide-react";
import { Btn, Field, Notice, NumberInput, Select, Stat, TextArea, formatNumber } from "./ui";

type Basis = "o200k" | "cl100k" | "claude" | "gemini";

interface Result {
  o200k: number;
  cl100k: number;
  preview: string[];
  forText: string;
}

const SAMPLE =
  "You are a helpful assistant. Summarise the customer email below in three short bullet points, " +
  "then suggest a polite reply in plain English.\n\nHi, I ordered a blue kurta (size M) on Monday and " +
  "received a green one instead. Can you send the right colour? I need it before Friday. Thanks, Sara";

const VIEW_LIMIT = 300;
const CHIP_COLORS = [
  "rgba(59, 130, 246, 0.18)",
  "rgba(16, 185, 129, 0.2)",
  "rgba(245, 158, 11, 0.22)",
  "rgba(236, 72, 153, 0.18)",
  "rgba(139, 92, 246, 0.2)",
];

const CONTEXTS = [
  { value: "8192", label: "8K (8,192)" },
  { value: "32768", label: "32K (32,768)" },
  { value: "128000", label: "128K (128,000)" },
  { value: "200000", label: "200K (200,000)" },
  { value: "1000000", label: "1M (1,000,000)" },
];

type Encoders = {
  o200k: typeof import("gpt-tokenizer/encoding/o200k_base");
  cl100k: typeof import("gpt-tokenizer/encoding/cl100k_base");
};

let encodersPromise: Promise<Encoders> | null = null;
function loadEncoders(): Promise<Encoders> {
  if (!encodersPromise) {
    encodersPromise = Promise.all([
      import("gpt-tokenizer/encoding/o200k_base"),
      import("gpt-tokenizer/encoding/cl100k_base"),
    ]).then(([o200k, cl100k]) => ({ o200k, cl100k }));
    encodersPromise.catch(() => {
      encodersPromise = null; // allow a retry after a network hiccup
    });
  }
  return encodersPromise;
}

// Treat "<|endoftext|>" and friends as plain text instead of throwing.
const PLAIN = { disallowedSpecial: new Set<string>() };

function num(s: string): number {
  return s.trim() === "" ? NaN : Number(s);
}

function money(n: number): string {
  if (!Number.isFinite(n)) return "-";
  if (n === 0) return "$0";
  if (n < 0.01) return `$${n.toPrecision(2)}`;
  return `$${n.toLocaleString("en-US", { minimumFractionDigits: 2, maximumFractionDigits: 4 })}`;
}

function showToken(t: string): string {
  return t.replace(/\n/g, "↵").replace(/\t/g, "⇥").replace(/ /g, "·");
}

function H2({ children }: { children: React.ReactNode }) {
  return <h2 style={{ fontSize: 16, fontWeight: 600, color: "var(--ink)", marginBottom: 12 }}>{children}</h2>;
}

export default function AiTokenCounter() {
  const [text, setText] = useState(SAMPLE);
  const [result, setResult] = useState<Result | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [showChips, setShowChips] = useState(true);
  const [basis, setBasis] = useState<Basis>("o200k");
  const [priceIn, setPriceIn] = useState("");
  const [priceOut, setPriceOut] = useState("");
  const [outTokens, setOutTokens] = useState("500");
  const [context, setContext] = useState("128000");

  useEffect(() => {
    let cancelled = false;
    const timer = setTimeout(async () => {
      try {
        const enc = await loadEncoders();
        if (cancelled) return;
        const tokens = enc.o200k.encode(text, PLAIN);
        const cl100k = enc.cl100k.countTokens(text, PLAIN);
        const preview = tokens.slice(0, VIEW_LIMIT).map((t) => enc.o200k.decode([t]));
        if (!cancelled) {
          setResult({ o200k: tokens.length, cl100k, preview, forText: text });
          setError(null);
        }
      } catch {
        if (!cancelled) setError("The tokenizer could not load. Check your connection and edit the text to try again.");
      }
    }, 250);
    return () => {
      cancelled = true;
      clearTimeout(timer);
    };
  }, [text]);

  const chars = text.length;
  const words = text.trim() ? text.trim().split(/\s+/).length : 0;
  const claude = Math.ceil(chars / 3.5);
  const gemini = Math.ceil(chars / 4);
  const stale = result !== null && result.forText !== text;

  const inputTokens =
    basis === "o200k" ? result?.o200k ?? NaN : basis === "cl100k" ? result?.cl100k ?? NaN : basis === "claude" ? claude : gemini;
  const out = Math.max(0, num(outTokens) || 0);
  const pIn = num(priceIn);
  const pOut = num(priceOut);
  const hasPrices = Number.isFinite(pIn) || Number.isFinite(pOut);
  const cost = ((Number.isFinite(pIn) ? pIn : 0) * inputTokens + (Number.isFinite(pOut) ? pOut : 0) * out) / 1_000_000;

  const ctx = Number(context);
  const used = inputTokens + out;
  const ctxPct = Number.isFinite(used) ? Math.min(100, (used / ctx) * 100) : 0;
  const overCtx = used > ctx;

  return (
    <div className="tool-stack">
      <Field label="Your prompt or text" htmlFor="tok-text">
        <TextArea
          id="tok-text"
          rows={9}
          style={{ minHeight: 220 }}
          placeholder="Paste a prompt, a document or a chat transcript..."
          value={text}
          onChange={(e) => setText(e.target.value)}
        />
      </Field>
      <div className="tool-actions">
        <Btn variant="ghost" onClick={() => setText("")} disabled={!text}>
          <Eraser size={16} aria-hidden />
          Clear
        </Btn>
        {(result === null || stale) && !error && text && <span className="tool-hint">Counting...</span>}
      </div>

      {error && <Notice tone="error">{error}</Notice>}

      <div className="tool-grid cols-3">
        <Stat
          label="GPT-4o and newer"
          value={result ? formatNumber(result.o200k, 0) : "..."}
          sub="Exact, o200k_base tokenizer"
          accent
        />
        <Stat label="GPT-4, GPT-3.5" value={result ? formatNumber(result.cl100k, 0) : "..."} sub="Exact, cl100k_base tokenizer" />
        <Stat label="Characters / words" value={`${formatNumber(chars, 0)} / ${formatNumber(words, 0)}`} />
        <Stat label="Claude (approx.)" value={`~${formatNumber(claude, 0)}`} sub="Estimate: characters ÷ 3.5" />
        <Stat label="Gemini (approx.)" value={`~${formatNumber(gemini, 0)}`} sub="Estimate: characters ÷ 4" />
      </div>
      <p className="tool-hint">
        OpenAI publishes its tokenizers, so those counts are exact for the text itself (chat formatting adds a few tokens per
        message). Anthropic and Google don&apos;t offer theirs in a browser-friendly form, so the Claude and Gemini numbers are rough
        estimates. Urdu, Hindi, Chinese and code usually use more tokens than the estimate suggests.
      </p>

      <div>
        <H2>Cost estimate</H2>
        <div className="tool-grid cols-4">
          <Field label="Count input with" htmlFor="tok-basis">
            <Select
              id="tok-basis"
              value={basis}
              onChange={(e) => setBasis(e.target.value as Basis)}
              options={[
                { value: "o200k", label: "GPT-4o and newer" },
                { value: "cl100k", label: "GPT-4, GPT-3.5" },
                { value: "claude", label: "Claude (approx.)" },
                { value: "gemini", label: "Gemini (approx.)" },
              ]}
            />
          </Field>
          <Field label="Input price per 1M tokens ($)" htmlFor="tok-pin">
            <NumberInput id="tok-pin" min={0} step="any" placeholder="e.g. 2.50" value={priceIn} onChange={(e) => setPriceIn(e.target.value)} />
          </Field>
          <Field label="Output price per 1M tokens ($)" htmlFor="tok-pout">
            <NumberInput id="tok-pout" min={0} step="any" placeholder="e.g. 10" value={priceOut} onChange={(e) => setPriceOut(e.target.value)} />
          </Field>
          <Field label="Expected output tokens" htmlFor="tok-out">
            <NumberInput id="tok-out" min={0} step={1} value={outTokens} onChange={(e) => setOutTokens(e.target.value)} />
          </Field>
        </div>
        <div className="tool-grid cols-2" style={{ marginTop: 16 }}>
          <Stat label="Cost per request" value={hasPrices ? money(cost) : "-"} accent />
          <Stat label="Cost for 1,000 requests" value={hasPrices ? money(cost * 1000) : "-"} />
        </div>
        <p className="tool-hint" style={{ marginTop: 8 }}>
          Prices change often, so copy the current per million token prices from the provider&apos;s pricing page. The examples in
          the boxes are placeholders, not real prices.
        </p>
      </div>

      <div>
        <H2>Context window</H2>
        <div className="tool-grid cols-2">
          <Field label="Model context size" htmlFor="tok-ctx">
            <Select id="tok-ctx" value={context} onChange={(e) => setContext(e.target.value)} options={CONTEXTS} />
          </Field>
          <div className="tool-field" style={{ justifyContent: "flex-end" }}>
            <div className="tool-hint" style={{ color: overCtx ? "#b3261e" : undefined }}>
              {Number.isFinite(used)
                ? `${formatNumber(used, 0)} of ${formatNumber(ctx, 0)} tokens (input + expected output), ${formatNumber((used / ctx) * 100, 1)}%`
                : "Counting..."}
            </div>
            <div
              style={{ height: 10, borderRadius: 999, background: "var(--chip-bg)", overflow: "hidden" }}
              role="progressbar"
              aria-valuenow={Math.round(ctxPct)}
              aria-valuemin={0}
              aria-valuemax={100}
            >
              <div style={{ width: `${ctxPct}%`, height: "100%", background: overCtx ? "#d8463a" : "var(--hub-accent)" }} />
            </div>
          </div>
        </div>
        {overCtx && (
          <div style={{ marginTop: 12 }}>
            <Notice tone="error">This won&apos;t fit. Trim the text, split it into parts, or pick a model with a bigger context window.</Notice>
          </div>
        )}
      </div>

      <div>
        <H2>See the tokens</H2>
        <label className="tool-checkbox">
          <input type="checkbox" checked={showChips} onChange={(e) => setShowChips(e.target.checked)} />
          Show how the text is split (GPT-4o tokenizer)
        </label>
        {showChips && result && result.preview.length > 0 && (
          <div
            style={{
              marginTop: 12,
              padding: 12,
              borderRadius: 12,
              border: "1px solid var(--line)",
              background: "var(--paper)",
              fontFamily: "var(--font-mono-stack)",
              fontSize: 13,
              lineHeight: 1.9,
              wordBreak: "break-all",
            }}
          >
            {result.preview.map((t, i) => (
              <span
                key={i}
                style={{ background: CHIP_COLORS[i % CHIP_COLORS.length], borderRadius: 4, padding: "2px 1px", margin: "0 1px", color: "var(--ink)" }}
              >
                {showToken(t)}
              </span>
            ))}
            {result.o200k > VIEW_LIMIT && (
              <div className="tool-hint" style={{ marginTop: 8, fontFamily: "inherit" }}>
                Showing the first {VIEW_LIMIT} of {formatNumber(result.o200k, 0)} tokens.
              </div>
            )}
          </div>
        )}
        {showChips && (
          <p className="tool-hint" style={{ marginTop: 8 }}>
            · is a space and ↵ a line break. A � means one character was split across two tokens, which is common for Urdu and emoji.
          </p>
        )}
      </div>
    </div>
  );
}
