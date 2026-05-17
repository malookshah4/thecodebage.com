import type { Metadata } from "next";
import Link from "next/link";

const PURCHASE_URL =
  "https://buy.polar.sh/polar_cl_nc0qTMzy8xpUjOSeFRhF1LzgmOjRfrCCSoJgE05GDii";

// Always points at the latest GitHub Release asset.
// Make sure the release uploads an asset literally named LifeOS-Setup.exe.
const DOWNLOAD_URL =
  "https://github.com/malookshah4/LifeOS/releases/latest/download/LifeOS-Setup.exe";
const RELEASES_URL = "https://github.com/malookshah4/LifeOS/releases";

export const metadata: Metadata = {
  title: "LifeOS — Your second brain, fully local",
  description:
    "Windows app that quietly captures your screen, mic, and system audio, OCR + transcribes it, and lets you ask anything across your memory. Local-first. $49.99 one-time, 7-day trial.",
  alternates: { canonical: "https://lifeos.thecodebage.com/" },
  openGraph: {
    type: "website",
    url: "https://lifeos.thecodebage.com/",
    siteName: "LifeOS",
    title: "LifeOS — Your second brain, fully local",
    description:
      "Capture, transcribe, recall. Runs entirely on your PC. $49.99 one-time, 7-day trial.",
  },
};

const FEATURES: { title: string; body: string }[] = [
  {
    title: "Always-on capture",
    body: "Screen, microphone, and system audio. Tiny ring buffer; nothing leaves your machine.",
  },
  {
    title: "OCR + Whisper transcription",
    body: "Every word on your screen, every word you say or hear — indexed and searchable.",
  },
  {
    title: "Ask anything",
    body: "Local LLM answers questions across your captured memory. Daily digest, mood timeline, patterns.",
  },
  {
    title: "Air-gap mode",
    body: "One toggle blocks all outbound traffic except license re-check. Verify in the network log.",
  },
];

const PRICE_POINTS: { label: string; body: string }[] = [
  { label: "$49.99 one-time", body: "Lifetime license. No subscription. No renewals." },
  { label: "2 devices", body: "Use on your laptop + desktop. Swap any time via Deactivate." },
  { label: "7-day free trial", body: "Full Pro features. No card. After trial, capture + AI lock until activated." },
  { label: "14-day offline grace", body: "App rechecks license every 7 days online; works fine offline for 2 weeks." },
];

export default function LifeOSPage() {
  return (
    <>
      {/* Hero */}
      <section className="mx-auto max-w-[1200px] px-6 pt-16 pb-12 sm:px-8 sm:pt-24">
        <div
          className="hub-mono"
          style={{ fontSize: 12, color: "var(--ink-muted)", textTransform: "uppercase" }}
        >
          ↳ codeBage · LifeOS · Windows · local-first
        </div>
        <h1
          className="hub-display"
          style={{
            fontFamily: "var(--font-fraunces), Georgia, serif",
            fontSize: "clamp(40px, 6.4vw, 88px)",
            lineHeight: 0.98,
            letterSpacing: "-0.025em",
            margin: "16px 0 0",
          }}
        >
          Your second brain,
          <br />
          <em>fully local.</em>
        </h1>
        <p
          style={{
            color: "var(--ink-muted)",
            fontSize: "clamp(15px, 1.1vw, 18px)",
            margin: "24px 0 0",
            maxWidth: 620,
            lineHeight: 1.55,
          }}
        >
          LifeOS quietly captures your screen, mic, and system audio on Windows.
          It OCRs every frame and transcribes every word — then lets you ask anything
          across your own memory. Nothing leaves your PC. Pay once, use forever.
        </p>

        <div className="mt-9 flex flex-wrap items-center gap-3">
          <a
            href={PURCHASE_URL}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 rounded-full bg-[color:var(--hub-accent)] px-6 py-3 text-[15px] font-medium text-white"
          >
            Buy — $49.99 <span aria-hidden>→</span>
          </a>
          <a
            href="#download"
            className="inline-flex items-center gap-2 rounded-full border border-[color:var(--line-strong)] px-6 py-3 text-[15px] font-medium hover:bg-[color:var(--chip-bg)]"
          >
            Download trial
          </a>
          <span className="hub-chip">
            Windows 10/11 · ~180 MB · no account
          </span>
        </div>
      </section>

      {/* Features */}
      <section className="mx-auto max-w-[1200px] px-6 py-20 sm:px-8">
        <div className="mb-10 flex items-end justify-between gap-8">
          <div>
            <div className="hub-mono text-[11px] uppercase text-[color:var(--ink-muted)]">
              What it does
            </div>
            <h2
              className="hub-display"
              style={{ fontSize: "clamp(28px, 3.6vw, 44px)", marginTop: 6 }}
            >
              Capture. Transcribe. Recall.
            </h2>
          </div>
        </div>
        <div className="grid gap-6 sm:grid-cols-2">
          {FEATURES.map((f) => (
            <div
              key={f.title}
              className="rounded-2xl border border-[color:var(--line)] p-6"
              style={{ background: "color-mix(in oklab, var(--paper) 96%, transparent)" }}
            >
              <h3 className="hub-display" style={{ fontSize: 20, margin: 0 }}>
                {f.title}
              </h3>
              <p style={{ marginTop: 10, color: "var(--ink-muted)", lineHeight: 1.6 }}>
                {f.body}
              </p>
            </div>
          ))}
        </div>
      </section>

      {/* Pricing */}
      <section className="mx-auto max-w-[1200px] px-6 py-20 sm:px-8">
        <div className="mb-10">
          <div className="hub-mono text-[11px] uppercase text-[color:var(--ink-muted)]">
            Pricing
          </div>
          <h2
            className="hub-display"
            style={{ fontSize: "clamp(28px, 3.6vw, 44px)", marginTop: 6 }}
          >
            One price. Forever.
          </h2>
        </div>
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {PRICE_POINTS.map((p) => (
            <div
              key={p.label}
              className="rounded-2xl border border-[color:var(--line)] p-6"
            >
              <div
                className="hub-display"
                style={{ fontSize: 22, lineHeight: 1.1, margin: 0 }}
              >
                {p.label}
              </div>
              <p style={{ marginTop: 10, color: "var(--ink-muted)", lineHeight: 1.5, fontSize: 14 }}>
                {p.body}
              </p>
            </div>
          ))}
        </div>
        <div className="mt-10 flex flex-wrap items-center gap-3">
          <a
            href={PURCHASE_URL}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 rounded-full bg-[color:var(--hub-accent)] px-6 py-3 text-[15px] font-medium text-white"
          >
            Unlock LifeOS Pro — $49.99
          </a>
          <span style={{ color: "var(--ink-muted)", fontSize: 13 }}>
            Polar checkout · cards / Apple Pay / Google Pay · refund within 14 days
          </span>
        </div>
      </section>

      {/* Download */}
      <section id="download" className="mx-auto max-w-[1200px] px-6 py-20 sm:px-8 scroll-mt-20">
        <div className="mb-8">
          <div className="hub-mono text-[11px] uppercase text-[color:var(--ink-muted)]">
            Download · 7-day free trial
          </div>
          <h2
            className="hub-display"
            style={{ fontSize: "clamp(28px, 3.6vw, 44px)", marginTop: 6 }}
          >
            Get the installer.
          </h2>
        </div>

        <div className="grid gap-6 sm:grid-cols-[1fr_320px]">
          <div className="rounded-2xl border border-[color:var(--line)] p-6">
            <div className="hub-display" style={{ fontSize: 22, margin: 0 }}>
              LifeOS for Windows
            </div>
            <p style={{ marginTop: 10, color: "var(--ink-muted)", lineHeight: 1.6, fontSize: 14 }}>
              Trial unlocks all Pro features for 7 days. No card, no account.
              After trial, capture &amp; AI lock until you activate a license — your
              captured data stays accessible either way.
            </p>
            <div className="mt-6 flex flex-wrap items-center gap-3">
              <a
                href={DOWNLOAD_URL}
                className="inline-flex items-center gap-2 rounded-full bg-[color:var(--hub-accent)] px-6 py-3 text-[15px] font-medium text-white"
              >
                Download LifeOS-Setup.exe
              </a>
              <a
                href={RELEASES_URL}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 rounded-full border border-[color:var(--line-strong)] px-5 py-3 text-[14px] font-medium hover:bg-[color:var(--chip-bg)]"
              >
                All releases ↗
              </a>
              <span className="hub-chip">x64 · ~180 MB · signed</span>
            </div>
            <div
              style={{
                marginTop: 16,
                fontFamily: "var(--font-mono-stack)",
                fontSize: 11,
                color: "var(--ink-muted)",
                wordBreak: "break-all",
              }}
            >
              SHA-256 + changelog published on the GitHub release page above.
            </div>
          </div>

          <div className="rounded-2xl border border-[color:var(--line)] p-6">
            <div className="hub-mono text-[11px] uppercase text-[color:var(--ink-muted)]">
              Requirements
            </div>
            <ul
              className="mt-3 list-disc pl-5 text-sm leading-relaxed"
              style={{ color: "var(--ink-muted)" }}
            >
              <li>Windows 10 (1903+) or Windows 11</li>
              <li>x64 CPU · 8 GB RAM recommended</li>
              <li>~2 GB free disk for index + bundled model</li>
              <li>Microphone + screen-capture permission</li>
            </ul>
          </div>
        </div>
      </section>

      {/* How it stays private */}
      <section className="mx-auto max-w-[1200px] px-6 py-20 sm:px-8">
        <div
          className="grid gap-12 py-14 md:grid-cols-[200px_1fr]"
          style={{ borderTop: "1px solid var(--line)", borderBottom: "1px solid var(--line)" }}
        >
          <div className="hub-mono self-start text-[11px] uppercase text-[color:var(--ink-muted)]">
            Privacy stance
          </div>
          <div>
            <p
              className="hub-display m-0"
              style={{ fontSize: 24, lineHeight: 1.35, maxWidth: "44ch" }}
            >
              Capture data stays on your machine — in a SQLite file you can open,
              delete, or wipe. The only outbound traffic is a license re-check
              every 7 days, listed in <em>Settings → Network</em> with timestamp
              and byte count.
              <em style={{ color: "var(--hub-accent)" }}> No telemetry. No account.</em>
            </p>
          </div>
        </div>
      </section>

      {/* Footer-ish links */}
      <section className="mx-auto max-w-[1200px] px-6 pb-20 sm:px-8">
        <div className="flex flex-wrap gap-5 text-sm" style={{ color: "var(--ink-muted)" }}>
          <a href="#download" className="hover:text-[color:var(--ink)]">
            Download
          </a>
          <Link href="/lifeos/privacy/" className="hover:text-[color:var(--ink)]">
            Privacy
          </Link>
          <Link href="/lifeos/terms/" className="hover:text-[color:var(--ink)]">
            Terms
          </Link>
          <Link href="/support/" className="hover:text-[color:var(--ink)]">
            Support
          </Link>
          <a
            href="mailto:lifeos@thecodebage.com"
            className="hover:text-[color:var(--ink)]"
          >
            lifeos@thecodebage.com
          </a>
        </div>
      </section>
    </>
  );
}
