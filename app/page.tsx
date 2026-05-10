import Link from "next/link";
import { ANDROID_APPS, WINDOWS_APPS, appHref } from "@/lib/apps";
import { AppCard } from "@/components/site/app-card";
import { AppIcon } from "@/components/site/app-icon";
import { Stars } from "@/components/site/stars";
import { PhoneShot } from "@/components/site/shots";

export default function Home() {
  const featured = ANDROID_APPS.find((a) => a.featured) ?? ANDROID_APPS[0];
  const others = ANDROID_APPS.filter((a) => a.slug !== featured.slug).slice(0, 6);
  const winApp = WINDOWS_APPS[0];

  return (
    <>
      {/* Hero — constellation variant */}
      <section className="mx-auto max-w-[1240px] px-8 pt-18 pb-12">
        <div
          className="hub-mono"
          style={{ fontSize: 12, color: "var(--ink-muted)", textTransform: "uppercase" }}
        >
          ↳ thecodebage · est. 2024 · two platforms · solo studio
        </div>
        <h1
          className="hub-display"
          style={{
            fontSize: "clamp(48px, 7.6vw, 108px)",
            lineHeight: 0.96,
            margin: "16px 0 0",
          }}
        >
          A shelf of <em>quiet</em> tools
          <br />
          for everyday computing.
        </h1>
        <p
          style={{
            color: "var(--ink-muted)",
            fontSize: "clamp(16px, 1.4vw, 19px)",
            margin: "22px 0 0",
            maxWidth: 580,
            lineHeight: 1.55,
          }}
        >
          A small studio publishing privacy-first utilities for Android and Windows.
          LAN-only by default. No accounts unless required. Built in spare hours;
          released when they earn the version number.
        </p>
        <div className="mt-8 flex flex-wrap gap-3">
          <Link
            href="/apps/android/"
            className="inline-flex items-center gap-2 rounded-full bg-[color:var(--ink)] px-5 py-3.5 text-[15px] font-medium text-[color:var(--paper)] transition-transform hover:-translate-y-px"
          >
            Browse Android <span aria-hidden>→</span>
          </Link>
          <Link
            href="/apps/windows/"
            className="inline-flex items-center gap-2 rounded-full border border-[color:var(--line-strong)] px-5 py-3.5 text-[15px] font-medium hover:bg-[color:var(--chip-bg)]"
          >
            Windows downloads
          </Link>
        </div>

        {/* Constellation */}
        <div className="hero-art-grid" style={{ marginTop: 56 }}>
          {ANDROID_APPS.slice(0, 8).map((a) => (
            <div key={a.slug} className="hero-art-tile">
              <AppIcon title={a.title} tint={a.accentTint} size={56} />
            </div>
          ))}
          {/* Padding placeholder tiles when catalog is small */}
          {Array.from({ length: Math.max(0, 8 - ANDROID_APPS.length) }).map((_, i) => (
            <div
              key={`empty-${i}`}
              className="hero-art-tile"
              style={{ opacity: 0.5, fontFamily: "var(--font-mono-stack)", fontSize: 11, color: "var(--ink-muted)" }}
            >
              soon
            </div>
          ))}
        </div>
      </section>

      {/* Featured app */}
      <section className="mx-auto max-w-[1240px] px-8 py-20">
        <div className="mb-8 flex items-end justify-between gap-8">
          <div>
            <div className="hub-mono text-[11px] uppercase text-[color:var(--ink-muted)]">
              Featured · {featured.featured ? "flagship" : "this month"}
            </div>
            <h2 className="hub-display" style={{ fontSize: "clamp(28px, 3.6vw, 44px)", marginTop: 6 }}>
              {featured.title}
            </h2>
          </div>
          <p className="max-w-[460px] text-[15px] text-[color:var(--ink-muted)]">
            The tool the studio is best known for. Front-and-center on the homepage; equal-footed in the catalog.
          </p>
        </div>
        <div className="featured-hero">
          <div className="featured-hero-text">
            <div>
              <AppIcon title={featured.title} tint={featured.accentTint} size={72} />
              <h3
                className="hub-display"
                style={{ fontSize: 36, lineHeight: 1.05, margin: "20px 0 8px" }}
              >
                {featured.summary}
              </h3>
              <p style={{ color: "var(--ink-muted)", maxWidth: "44ch", lineHeight: 1.55 }}>
                Trackpad, keyboard, voice macros, OCR scan, snippet manager, file transfer.
                All over your local Wi-Fi. No internet round-trip.
              </p>
            </div>
            <div className="flex flex-wrap items-center gap-2.5">
              <Link
                href={appHref(featured)}
                className="inline-flex items-center gap-2 rounded-full bg-[color:var(--hub-accent)] px-5 py-2.5 text-[14px] font-medium text-white"
              >
                See the page <span aria-hidden>→</span>
              </Link>
              {featured.score !== undefined && featured.ratings !== undefined && (
                <span className="hub-chip">
                  <Stars value={featured.score} /> &nbsp;{featured.score.toFixed(1)} ·{" "}
                  {featured.ratings.toLocaleString()} ratings
                </span>
              )}
            </div>
          </div>
          <div className="featured-hero-art">
            <PhoneShot tint={featured.accentTint} title={featured.title} />
          </div>
        </div>
      </section>

      {/* Android grid teaser */}
      {others.length > 0 && (
        <section className="mx-auto max-w-[1240px] px-8 py-20">
          <div className="mb-8 flex items-end justify-between gap-8">
            <div>
              <div className="hub-mono text-[11px] uppercase text-[color:var(--ink-muted)]">
                Android · Google Play
              </div>
              <h2 className="hub-display" style={{ fontSize: "clamp(28px, 3.6vw, 44px)", marginTop: 6 }}>
                On your phone
              </h2>
            </div>
            <Link
              href="/apps/android/"
              className="inline-flex items-center gap-2 rounded-full border border-[color:var(--line-strong)] px-5 py-2.5 text-sm font-medium hover:bg-[color:var(--chip-bg)]"
            >
              All {ANDROID_APPS.length} Android app{ANDROID_APPS.length === 1 ? "" : "s"}{" "}
              <span aria-hidden>→</span>
            </Link>
          </div>
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {others.slice(0, 6).map((a) => (
              <AppCard key={a.slug} app={a} />
            ))}
          </div>
        </section>
      )}

      {/* Windows row */}
      <section className="mx-auto max-w-[1240px] px-8 py-20">
        <div className="mb-8 flex items-end justify-between gap-8">
          <div>
            <div className="hub-mono text-[11px] uppercase text-[color:var(--ink-muted)]">
              Windows · Direct download
            </div>
            <h2 className="hub-display" style={{ fontSize: "clamp(28px, 3.6vw, 44px)", marginTop: 6 }}>
              On your PC
            </h2>
          </div>
          <Link
            href="/apps/windows/"
            className="inline-flex items-center gap-2 rounded-full border border-[color:var(--line-strong)] px-5 py-2.5 text-sm font-medium hover:bg-[color:var(--chip-bg)]"
          >
            All Windows app{WINDOWS_APPS.length === 1 ? "" : "s"} <span aria-hidden>→</span>
          </Link>
        </div>
        {winApp && (
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            <AppCard app={winApp} />
          </div>
        )}
      </section>

      {/* Manifesto strip */}
      <section className="mx-auto max-w-[1240px] px-8 py-20">
        <div
          className="grid gap-12 py-14 md:grid-cols-[200px_1fr]"
          style={{ borderTop: "1px solid var(--line)", borderBottom: "1px solid var(--line)" }}
        >
          <div className="hub-mono self-start text-[11px] uppercase text-[color:var(--ink-muted)]">
            Operating principles
          </div>
          <div>
            <p
              className="hub-display m-0"
              style={{ fontSize: 28, lineHeight: 1.3, maxWidth: "28ch" }}
            >
              Local first. Tiny by default. No telemetry, no accounts unless the feature
              literally requires one, no dark patterns,
              <em style={{ color: "var(--hub-accent)" }}> ever.</em>
            </p>
          </div>
        </div>
      </section>
    </>
  );
}
