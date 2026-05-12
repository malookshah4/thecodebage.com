import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { ANDROID_APPS, WINDOWS_APPS } from "@/lib/apps";

export const metadata: Metadata = {
  title: "About",
  description:
    "Malook Shah — solo developer behind thecodebage. Privacy-first utilities for Android and Windows.",
};

export default function AboutPage() {
  const totalApps = ANDROID_APPS.length + WINDOWS_APPS.length;

  return (
    <main>
      <div className="mx-auto max-w-[1480px] px-8">
        <nav
          style={{
            paddingTop: 28,
            fontFamily: "var(--font-mono-stack)",
            fontSize: 12,
            color: "var(--ink-muted)",
          }}
        >
          /about/
        </nav>

        {/* Hero */}
        <section className="grid items-center gap-14 py-14 md:grid-cols-[1fr_360px]">
          <div>
            <div
              className="hub-mono"
              style={{ fontSize: 12, color: "var(--ink-muted)", textTransform: "uppercase" }}
            >
              ↳ the person behind the shelf
            </div>
            <h1
              className="hub-display"
              style={{
                fontFamily: "var(--font-fraunces), Georgia, serif",
                fontSize: "clamp(48px, 7.2vw, 96px)",
                lineHeight: 0.98,
                letterSpacing: "-0.025em",
                margin: "14px 0 0",
              }}
            >
              Malook Shah.
            </h1>
            <p
              style={{
                fontSize: 19,
                color: "var(--ink-2)",
                lineHeight: 1.55,
                maxWidth: "52ch",
                margin: "18px 0 0",
              }}
            >
              Solo developer based in Pakistan. I build small, privacy-first utilities for
              Android and Windows under the banner <b>thecodebage</b>. Everything ships from
              a one-person studio — design, code, store listings, support.
            </p>
            <div
              className="mt-7 flex flex-wrap items-center gap-3"
              style={{
                color: "var(--ink-muted)",
                fontFamily: "var(--font-mono-stack)",
                fontSize: 12,
              }}
            >
              <span>
                <b style={{ color: "var(--ink-2)" }}>{totalApps}</b> apps shipped
              </span>
              <Dot />
              <span>est. 2024</span>
              <Dot />
              <span>solo studio</span>
            </div>
          </div>
          <div className="flex justify-center md:justify-end">
            <div
              style={{
                width: 320,
                aspectRatio: "1/1",
                borderRadius: 24,
                overflow: "hidden",
                position: "relative",
                boxShadow: "var(--shadow-3)",
                background: "var(--paper-2)",
              }}
            >
              <Image
                src="/me.jpeg"
                alt="Malook Shah"
                fill
                sizes="320px"
                style={{ objectFit: "cover" }}
                priority
              />
            </div>
          </div>
        </section>

        {/* Why */}
        <section className="py-20">
          <div className="grid gap-12 border-t border-[color:var(--line)] pt-10 md:grid-cols-[200px_1fr]">
            <div className="hub-mono text-[11px] uppercase text-[color:var(--ink-muted)]">
              Why
            </div>
            <div>
              <p
                className="hub-display m-0"
                style={{ fontSize: 28, lineHeight: 1.35, maxWidth: "32ch" }}
              >
                Most software has gotten loud, hungry, and entitled — full of accounts,
                trackers, ads, and dark patterns.{" "}
                <em style={{ color: "var(--hub-accent)" }}>
                  thecodebage is the opposite of that.
                </em>
              </p>
              <p
                style={{
                  color: "var(--ink-2)",
                  fontSize: 17,
                  lineHeight: 1.6,
                  maxWidth: "60ch",
                  margin: "20px 0 0",
                }}
              >
                Every app does one job, runs locally where possible, and stays out of your
                way. No analytics SDKs, no email collection, no nag screens. Built in
                spare hours, released only when the version number is earned.
              </p>
            </div>
          </div>
        </section>

        {/* What I've shipped */}
        <section className="py-20">
          <div className="mb-8">
            <div className="hub-mono text-[11px] uppercase text-[color:var(--ink-muted)]">
              What I&apos;ve shipped
            </div>
            <h2
              className="hub-display"
              style={{ fontSize: "clamp(28px, 3.6vw, 44px)", marginTop: 6 }}
            >
              Two platforms, one shelf.
            </h2>
          </div>
          <div className="grid gap-6 md:grid-cols-2">
            <Link
              href="/apps/android/"
              className="hub-card"
              style={{
                display: "block",
                padding: 28,
                borderRadius: 18,
                background: "var(--paper-card)",
                border: "1px solid var(--line)",
                boxShadow: "var(--shadow-1)",
                textDecoration: "none",
                color: "inherit",
              }}
            >
              <div className="hub-mono text-[11px] uppercase text-[color:var(--ink-muted)]">
                Android · Google Play
              </div>
              <div
                className="hub-display"
                style={{ fontSize: 44, lineHeight: 1, margin: "12px 0 4px" }}
              >
                {ANDROID_APPS.length}
              </div>
              <div style={{ color: "var(--ink-2)", fontSize: 15 }}>
                apps live on the Play Store →
              </div>
            </Link>
            <Link
              href="/apps/windows/"
              className="hub-card"
              style={{
                display: "block",
                padding: 28,
                borderRadius: 18,
                background: "var(--paper-card)",
                border: "1px solid var(--line)",
                boxShadow: "var(--shadow-1)",
                textDecoration: "none",
                color: "inherit",
              }}
            >
              <div className="hub-mono text-[11px] uppercase text-[color:var(--ink-muted)]">
                Windows · Direct download
              </div>
              <div
                className="hub-display"
                style={{ fontSize: 44, lineHeight: 1, margin: "12px 0 4px" }}
              >
                {WINDOWS_APPS.length}
              </div>
              <div style={{ color: "var(--ink-2)", fontSize: 15 }}>
                signed installer{WINDOWS_APPS.length === 1 ? "" : "s"} →
              </div>
            </Link>
          </div>
        </section>

        {/* Operating principles */}
        <section className="py-20">
          <div className="grid gap-12 border-t border-[color:var(--line)] pt-10 md:grid-cols-[200px_1fr]">
            <div className="hub-mono text-[11px] uppercase text-[color:var(--ink-muted)]">
              Operating principles
            </div>
            <div className="feature-grid">
              {PRINCIPLES.map((p, i) => (
                <div key={i} className="feature-row">
                  <span className="feature-num">{String(i + 1).padStart(2, "0")}</span>
                  <span className="feature-text">{p}</span>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Stack */}
        <section className="py-20">
          <div className="grid gap-12 border-t border-[color:var(--line)] pt-10 md:grid-cols-[200px_1fr]">
            <div className="hub-mono text-[11px] uppercase text-[color:var(--ink-muted)]">
              Stack
            </div>
            <div className="flex flex-wrap gap-2.5">
              {STACK.map((s) => (
                <span key={s} className="hub-chip">
                  {s}
                </span>
              ))}
            </div>
          </div>
        </section>

        {/* Contact */}
        <section className="py-20">
          <div className="grid gap-12 border-t border-[color:var(--line)] pt-10 md:grid-cols-[200px_1fr]">
            <div className="hub-mono text-[11px] uppercase text-[color:var(--ink-muted)]">
              Say hello
            </div>
            <div>
              <p
                className="m-0 max-w-[56ch] text-[18px] leading-[1.55]"
                style={{ color: "var(--ink-2)" }}
              >
                Bug reports, feature requests, or just a thank-you — all welcome. I read
                every message myself.
              </p>
              <div className="mt-6 flex flex-wrap gap-3">
                <a
                  href="mailto:support@thecodebage.com"
                  className="inline-flex items-center gap-2 rounded-full bg-[color:var(--hub-accent)] px-5 py-2.5 text-sm font-medium text-white"
                >
                  support@thecodebage.com →
                </a>
                <a
                  href="https://github.com/malookshah4"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 rounded-full border border-[color:var(--line-strong)] px-5 py-2.5 text-sm font-medium hover:bg-[color:var(--chip-bg)]"
                >
                  GitHub →
                </a>
              </div>
            </div>
          </div>
        </section>
      </div>
    </main>
  );
}

const PRINCIPLES = [
  "Local-first. If the feature can run on-device or over LAN, it does. No round-trips to a server I rent.",
  "No telemetry. I don't ship analytics SDKs, crash reporters, or ad networks. What I don't collect can't leak.",
  "No accounts unless the feature literally requires one. Most utilities work the moment you install them.",
  "One thing well. Each app does a single job. Feature creep is how good apps turn into bloated apps.",
  "Earn the version number. v1.0 means I'd happily install it on my mom's phone. Nothing ships before that.",
  "Built by hand. No vibe-coded slop, no AI-generated app spam. Every line reviewed.",
];

const STACK = [
  "Flutter",
  "Kotlin",
  "Go",
  "Next.js",
  "TypeScript",
  "PowerShell",
  "Cloudflare Pages",
  "Google Play Console",
];

function Dot() {
  return (
    <span
      aria-hidden
      style={{
        width: 3,
        height: 3,
        borderRadius: "50%",
        background: "var(--ink-muted)",
        display: "inline-block",
      }}
    />
  );
}
