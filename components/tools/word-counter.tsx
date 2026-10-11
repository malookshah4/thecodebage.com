"use client";

import { useDeferredValue, useEffect, useRef, useState } from "react";
import { Eraser } from "lucide-react";
import { Btn, CopyButton, Field, Stat, TextArea, formatNumber } from "./ui";

const DRAFT_KEY = "codebage-word-counter-draft";

// ---------- counting helpers ----------

let graphemeSegmenter: Intl.Segmenter | null | undefined;

/** Count user-visible characters, so an emoji or a combined letter counts as 1. */
function countGraphemes(s: string): number {
  if (!s) return 0;
  if (graphemeSegmenter === undefined) {
    graphemeSegmenter =
      typeof Intl !== "undefined" && "Segmenter" in Intl
        ? new Intl.Segmenter(undefined, { granularity: "grapheme" })
        : null;
  }
  if (!graphemeSegmenter) return Array.from(s).length;
  let n = 0;
  for (const _ of graphemeSegmenter.segment(s)) n++; // eslint-disable-line @typescript-eslint/no-unused-vars
  return n;
}

function countWords(s: string): number {
  const t = s.trim();
  if (!t) return 0;
  return t.split(/\s+/).filter((w) => /[\p{L}\p{N}]/u.test(w)).length;
}

function countSentences(s: string): number {
  return s.split(/[.!?۔؟]+(?:\s+|$)|\n{2,}/).filter((p) => /[\p{L}\p{N}]/u.test(p)).length;
}

function countParagraphs(s: string): number {
  return s.split(/\n+/).filter((p) => p.trim()).length;
}

function formatDuration(minutes: number): string {
  if (minutes <= 0) return "0 sec";
  const total = Math.max(1, Math.round(minutes * 60));
  if (total < 60) return `${total} sec`;
  const m = Math.floor(total / 60);
  const s = total % 60;
  if (m >= 60) return `${Math.floor(m / 60)} hr ${m % 60} min`;
  return s ? `${m} min ${s} sec` : `${m} min`;
}

// GSM 03.38 basic set (1 unit each) and extension set (2 units each).
const GSM_BASIC = new Set(
  Array.from(
    "@£$¥èéùìòÇ\nØø\rÅåΔ_ΦΓΛΩΠΨΣΘΞÆæßÉ !\"#¤%&'()*+,-./0123456789:;<=>?¡ABCDEFGHIJKLMNOPQRSTUVWXYZÄÖÑÜ§¿abcdefghijklmnopqrstuvwxyzäöñüà",
  ),
);
const GSM_EXT = new Set(Array.from("^{}\\[~]|€\f"));

function smsInfo(s: string) {
  let gsm = true;
  let gsmUnits = 0;
  for (const ch of s) {
    if (GSM_BASIC.has(ch)) gsmUnits += 1;
    else if (GSM_EXT.has(ch)) gsmUnits += 2;
    else {
      gsm = false;
      break;
    }
  }
  if (gsm) {
    const segments = gsmUnits === 0 ? 0 : gsmUnits <= 160 ? 1 : Math.ceil(gsmUnits / 153);
    return { gsm, length: gsmUnits, perSegment: gsmUnits <= 160 ? 160 : 153, segments };
  }
  const units = s.length; // UTF-16 code units, which is what UCS-2 SMS counts
  const segments = units <= 70 ? 1 : Math.ceil(units / 67);
  return { gsm, length: units, perSegment: units <= 70 ? 70 : 67, segments };
}

const STOPWORDS = new Set(
  (
    "a about above after again against all am an and any are aren't as at be because been before being below between both but by " +
    "can can't cannot could couldn't did didn't do does doesn't doing don't down during each few for from further had hadn't has hasn't " +
    "have haven't having he he'd he'll he's her here here's hers herself him himself his how how's i i'd i'll i'm i've if in into is " +
    "isn't it it's its itself let's me more most mustn't my myself no nor not of off on once only or other ought our ours ourselves " +
    "out over own same shan't she she'd she'll she's should shouldn't so some such than that that's the their theirs them themselves " +
    "then there there's these they they'd they'll they're they've this those through to too under until up very was wasn't we we'd " +
    "we'll we're we've were weren't what what's when when's where where's which while who who's whom why why's will with won't would " +
    "wouldn't you you'd you'll you're you've your yours yourself yourselves also just get got like one really can will us may much many " +
    "even still well"
  ).split(" "),
);

function topKeywords(s: string, totalWords: number) {
  const counts = new Map<string, number>();
  const words = s.toLowerCase().replace(/[‘’]/g, "'").match(/[\p{L}\p{N}][\p{L}\p{N}'\-]*/gu) ?? [];
  for (const raw of words) {
    const w = raw.replace(/['\-]+$/, "");
    if (w.length < 2 || STOPWORDS.has(w) || /^\d+$/.test(w)) continue;
    counts.set(w, (counts.get(w) ?? 0) + 1);
  }
  return [...counts.entries()]
    .sort((a, b) => b[1] - a[1] || a[0].localeCompare(b[0]))
    .slice(0, 10)
    .map(([word, count]) => ({ word, count, pct: totalWords ? (count / totalWords) * 100 : 0 }));
}

// ---------- text transforms ----------

function titleCase(s: string): string {
  return s.toLowerCase().replace(/(^|[\s\-("'/\[])(\p{L})/gu, (_, pre: string, ch: string) => pre + ch.toUpperCase());
}

function sentenceCase(s: string): string {
  return s
    .toLowerCase()
    .replace(/(^\s*|[.!?۔؟]\s+|\n\s*)(\p{L})/gu, (_, pre: string, ch: string) => pre + ch.toUpperCase())
    .replace(/\bi\b/g, "I");
}

function removeExtraSpaces(s: string): string {
  return s
    .replace(/[ \t ]+/g, " ")
    .split("\n")
    .map((l) => l.trim())
    .join("\n")
    .replace(/\n{3,}/g, "\n\n")
    .trim();
}

function removeLineBreaks(s: string): string {
  return s.replace(/\s*\n+\s*/g, " ").replace(/[ \t]+/g, " ").trim();
}

// ---------- platform limits ----------

const LIMITS: { name: string; limit: number; hint?: string }[] = [
  { name: "X (Twitter) post", limit: 280, hint: "X counts every link as 23 and some scripts as 2, so treat this as a guide." },
  { name: "Instagram caption", limit: 2200 },
  { name: "Instagram bio", limit: 150 },
  { name: "YouTube title", limit: 100 },
  { name: "YouTube description", limit: 5000 },
  { name: "LinkedIn post", limit: 3000 },
  { name: "SEO meta description", limit: 160, hint: "Google cuts by pixel width, so about 150 to 160 characters is safe." },
];

function LimitBar({ used, limit }: { used: number; limit: number }) {
  const over = used > limit;
  const pct = Math.min(100, (used / limit) * 100);
  return (
    <div
      style={{ height: 6, borderRadius: 999, background: "var(--chip-bg)", overflow: "hidden" }}
      role="progressbar"
      aria-valuenow={used}
      aria-valuemin={0}
      aria-valuemax={limit}
    >
      <div style={{ width: `${pct}%`, height: "100%", background: over ? "#d8463a" : "var(--hub-accent)" }} />
    </div>
  );
}

function LimitRow({
  name,
  used,
  limit,
  detail,
  hint,
}: {
  name: string;
  used: number;
  limit: number;
  detail?: string;
  hint?: string;
}) {
  const over = used - limit;
  return (
    <div className="tool-list-item" style={{ flexDirection: "column", alignItems: "stretch", gap: 6 }}>
      <div style={{ display: "flex", justifyContent: "space-between", gap: 8, fontSize: 14, flexWrap: "wrap" }}>
        <span style={{ color: "var(--ink)", fontWeight: 500 }}>{name}</span>
        <span style={{ color: over > 0 ? "#b3261e" : "var(--ink-muted)", fontVariantNumeric: "tabular-nums" }}>
          {detail ?? `${formatNumber(used, 0)} / ${formatNumber(limit, 0)}`}
          {over > 0 && !detail ? ` (${formatNumber(over, 0)} over)` : ""}
        </span>
      </div>
      <LimitBar used={used} limit={limit} />
      {hint && <div className="tool-hint">{hint}</div>}
    </div>
  );
}

function H2({ children }: { children: React.ReactNode }) {
  return <h2 style={{ fontSize: 16, fontWeight: 600, color: "var(--ink)", marginBottom: 12 }}>{children}</h2>;
}

export default function WordCounter() {
  const [text, setText] = useState("");
  const loaded = useRef(false);
  const deferred = useDeferredValue(text);

  // Restore the saved draft once, after mount (localStorage does not exist on the server).
  useEffect(() => {
    let saved: string | null = null;
    try {
      saved = localStorage.getItem(DRAFT_KEY);
    } catch {
      // Storage blocked (private mode); just start empty.
    }
    loaded.current = true;
    if (saved) {
      const value = saved;
      queueMicrotask(() => setText((cur) => (cur ? cur : value)));
    }
  }, []);

  useEffect(() => {
    if (!loaded.current) return;
    const t = setTimeout(() => {
      try {
        if (text) localStorage.setItem(DRAFT_KEY, text);
        else localStorage.removeItem(DRAFT_KEY);
      } catch {
        // Quota or blocked storage; the draft just won't survive a reload.
      }
    }, 400);
    return () => clearTimeout(t);
  }, [text]);

  const words = countWords(deferred);
  const chars = countGraphemes(deferred);
  const charsNoSpaces = countGraphemes(deferred.replace(/\s/g, ""));
  const sentences = countSentences(deferred);
  const paragraphs = countParagraphs(deferred);
  const sms = smsInfo(deferred);
  const keywords = topKeywords(deferred, words);

  return (
    <div className="tool-stack">
      <Field label="Your text" htmlFor="wc-text" hint="Saved in this browser as you type, so a reload won't lose it.">
        <TextArea
          id="wc-text"
          rows={10}
          style={{ minHeight: 240 }}
          placeholder="Type or paste your text here..."
          value={text}
          onChange={(e) => setText(e.target.value)}
        />
      </Field>

      <div className="tool-actions">
        <CopyButton text={text} label="Copy text" />
        <Btn variant="ghost" onClick={() => setText("")} disabled={!text}>
          <Eraser size={16} aria-hidden />
          Clear
        </Btn>
      </div>

      <div className="tool-grid cols-4">
        <Stat label="Words" value={formatNumber(words, 0)} accent />
        <Stat label="Characters" value={formatNumber(chars, 0)} />
        <Stat label="No spaces" value={formatNumber(charsNoSpaces, 0)} sub="Characters without spaces" />
        <Stat label="Sentences" value={formatNumber(sentences, 0)} />
        <Stat label="Paragraphs" value={formatNumber(paragraphs, 0)} />
        <Stat label="Reading time" value={formatDuration(words / 230)} sub="At about 230 words a minute" />
        <Stat label="Speaking time" value={formatDuration(words / 130)} sub="At about 130 words a minute" />
        <Stat
          label="SMS"
          value={`${sms.segments} ${sms.segments === 1 ? "part" : "parts"}`}
          sub={sms.gsm ? "Standard (GSM) text" : "Unicode text (Urdu or emoji)"}
        />
      </div>

      <div>
        <H2>Text tools</H2>
        <div className="tool-actions">
          <Btn variant="ghost" disabled={!text} onClick={() => setText(text.toUpperCase())}>UPPERCASE</Btn>
          <Btn variant="ghost" disabled={!text} onClick={() => setText(text.toLowerCase())}>lowercase</Btn>
          <Btn variant="ghost" disabled={!text} onClick={() => setText(titleCase(text))}>Title Case</Btn>
          <Btn variant="ghost" disabled={!text} onClick={() => setText(sentenceCase(text))}>Sentence case</Btn>
          <Btn variant="ghost" disabled={!text} onClick={() => setText(removeExtraSpaces(text))}>Remove extra spaces</Btn>
          <Btn variant="ghost" disabled={!text} onClick={() => setText(removeLineBreaks(text))}>Remove line breaks</Btn>
        </div>
      </div>

      <div>
        <H2>Platform limits</H2>
        <div className="tool-grid cols-2">
          {LIMITS.map((l) => (
            <LimitRow key={l.name} name={l.name} used={chars} limit={l.limit} hint={l.hint} />
          ))}
          <LimitRow
            name="SMS"
            used={sms.length}
            limit={sms.gsm ? 160 : 70}
            detail={`${formatNumber(sms.length, 0)} ${sms.gsm ? "" : "Unicode "}chars, ${sms.segments} ${sms.segments === 1 ? "message" : "messages"}`}
            hint={
              sms.gsm
                ? "Plain English text fits 160 characters per SMS (153 each when split)."
                : "Urdu, emoji and other special characters switch the SMS to Unicode: 70 characters per SMS (67 each when split)."
            }
          />
        </div>
      </div>

      <div>
        <H2>Top keywords</H2>
        {keywords.length === 0 ? (
          <p className="tool-hint">Common words like &quot;the&quot; and &quot;and&quot; are skipped. Add some text to see the rest.</p>
        ) : (
          <div className="tool-scroll-x">
            <table className="tool-table">
              <thead>
                <tr>
                  <th>Keyword</th>
                  <th>Count</th>
                  <th>Density</th>
                </tr>
              </thead>
              <tbody>
                {keywords.map((k) => (
                  <tr key={k.word}>
                    <td>{k.word}</td>
                    <td>{k.count}</td>
                    <td>{formatNumber(k.pct, 1)}%</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
