import type { Metadata } from "next";

// Always points at the latest GitHub Release asset.
// Make sure the release uploads an asset literally named LifeOS-Setup.exe.
const DOWNLOAD_URL =
  "https://github.com/malookshah4/LifeOS/releases/latest/download/LifeOS-Setup.exe";
const RELEASES_URL = "https://github.com/malookshah4/LifeOS/releases";
const SOURCE_URL = "https://github.com/malookshah4/LifeOS";

export const metadata: Metadata = {
  title: "LifeOS — Your second brain, fully local",
  description:
    "Free, local-first Windows app. Quietly indexes your screen, voice, and system audio, OCR + transcribes it, and lets you ask anything across your own memory. Open-source.",
  alternates: { canonical: "https://lifeos.thecodebage.com/" },
  openGraph: {
    type: "website",
    url: "https://lifeos.thecodebage.com/",
    siteName: "LifeOS",
    title: "LifeOS — Your second brain, fully local",
    description:
      "Index, transcribe, recall. Free, local-first, open-source.",
  },
};

const FEATURES: { title: string; body: string; glyph: string }[] = [
  {
    title: "Always-on memory",
    body: "Indexes your screen, voice, and system audio locally. Tiny ring buffer; nothing leaves your machine.",
    glyph: "◐",
  },
  {
    title: "OCR + Whisper transcription",
    body: "Every word on your screen, every word you say or hear — indexed and searchable.",
    glyph: "⟁",
  },
  {
    title: "Ask anything",
    body: "Local LLM answers questions across your indexed memory. Daily digest, mood timeline, patterns.",
    glyph: "✦",
  },
  {
    title: "Air-gap mode",
    body: "One toggle blocks every outbound byte. Verify in the live network log.",
    glyph: "◇",
  },
];

const SCREENSHOTS: { n: string; caption: string; alt: string }[] = [
  {
    n: "01",
    caption: "Memory · screen, voice, and system audio quietly indexed.",
    alt: "LifeOS main memory view showing live indexing",
  },
  {
    n: "02",
    caption: "Ask · local LLM answers across your indexed memory.",
    alt: "LifeOS Ask interface — question and answer over indexed snippets",
  },
  {
    n: "03",
    caption: "Timeline · scrub your day. Every frame, every word, every window.",
    alt: "LifeOS timeline of indexed memory entries",
  },
  {
    n: "04",
    caption: "Network log · every outbound byte, listed with timestamp.",
    alt: "LifeOS Settings → Network log showing privacy verification",
  },
  {
    n: "05",
    caption: "Settings · storage, air-gap mode, AI endpoint — all local.",
    alt: "LifeOS Settings panel with storage and network controls",
  },
];

const VALUES: { label: string; body: string; featured?: boolean }[] = [
  { label: "Free, forever", body: "No license. No trial. No account. Download and run.", featured: true },
  { label: "Local-first", body: "Everything indexes and stays on your own PC. No cloud, no upload." },
  { label: "Open source", body: "Full source on GitHub. The build that ships is the build you can read." },
  { label: "No telemetry", body: "Zero analytics, zero phone-home. Air-gap mode kills every outbound byte." },
];

export default function LifeOSPage() {
  return (
    <>
      {/* Hero */}
      <section className="mx-auto max-w-[1200px] px-6 pt-20 pb-16 sm:px-8 sm:pt-28">
        <div className="lifeos-hero-logo mb-8">
          <img src="/lifeos/logo-256.png" alt="LifeOS logo" />
        </div>

        <div
          className="hub-mono"
          style={{
            fontSize: 11,
            color: "var(--ink-muted)",
            textTransform: "uppercase",
            letterSpacing: "0.14em",
          }}
        >
          ◦ Windows · local-first · open-source · 2026
        </div>

        <h1
          style={{
            fontFamily: "var(--font-fraunces), Georgia, serif",
            fontSize: "clamp(44px, 7vw, 96px)",
            lineHeight: 0.98,
            letterSpacing: "-0.03em",
            margin: "20px 0 0",
            fontWeight: 400,
            color: "var(--ink)",
          }}
        >
          Your second brain,
          <br />
          <em
            style={{
              backgroundImage:
                "linear-gradient(135deg, #F59E0B 0%, #FCD34D 60%, #FBBF24 100%)",
              WebkitBackgroundClip: "text",
              backgroundClip: "text",
              color: "transparent",
              fontStyle: "italic",
            }}
          >
            fully local.
          </em>
        </h1>

        <p
          style={{
            color: "var(--ink-muted)",
            fontSize: "clamp(16px, 1.15vw, 19px)",
            margin: "28px 0 0",
            maxWidth: 640,
            lineHeight: 1.6,
          }}
        >
          LifeOS quietly indexes your own screen, voice, and system audio on
          Windows. It OCRs every frame and transcribes every word — then lets
          you ask anything across your own memory. Free. Open-source. Nothing
          leaves your PC.
        </p>

        <div className="mt-10 flex flex-wrap items-center gap-3">
          <a
            href={DOWNLOAD_URL}
            className="lifeos-btn-primary inline-flex items-center gap-2 rounded-full px-7 py-3.5 text-[15px]"
          >
            Download free
          </a>
          <a
            href={SOURCE_URL}
            target="_blank"
            rel="noopener noreferrer"
            className="lifeos-btn-ghost inline-flex items-center gap-2 rounded-full px-6 py-3.5 text-[15px] font-medium"
          >
            Source on GitHub ↗
          </a>
          <span className="lifeos-chip">
            Free · Windows 10/11 · no account
          </span>
        </div>
      </section>

      {/* Features */}
      <section
        id="features"
        className="mx-auto max-w-[1200px] px-6 py-24 sm:px-8 scroll-mt-20"
      >
        <div className="mb-12">
          <div
            className="hub-mono"
            style={{
              fontSize: 11,
              color: "var(--ink-muted)",
              textTransform: "uppercase",
              letterSpacing: "0.14em",
            }}
          >
            ◦ What it does
          </div>
          <h2
            style={{
              fontFamily: "var(--font-fraunces), Georgia, serif",
              fontSize: "clamp(32px, 4vw, 52px)",
              letterSpacing: "-0.025em",
              marginTop: 8,
              fontWeight: 400,
              color: "var(--ink)",
            }}
          >
            Index. Transcribe. <em style={{ color: "var(--hub-accent)" }}>Recall.</em>
          </h2>
        </div>
        <div className="grid gap-5 sm:grid-cols-2">
          {FEATURES.map((f) => (
            <div key={f.title} className="lifeos-card p-7">
              <div
                style={{
                  fontSize: 28,
                  lineHeight: 1,
                  color: "var(--hub-accent)",
                  marginBottom: 14,
                }}
                aria-hidden
              >
                {f.glyph}
              </div>
              <h3
                style={{
                  fontFamily: "var(--font-fraunces), Georgia, serif",
                  fontSize: 22,
                  letterSpacing: "-0.01em",
                  color: "var(--ink)",
                  margin: 0,
                  fontWeight: 500,
                }}
              >
                {f.title}
              </h3>
              <p
                style={{
                  marginTop: 10,
                  color: "var(--ink-muted)",
                  lineHeight: 1.65,
                  fontSize: 15,
                }}
              >
                {f.body}
              </p>
            </div>
          ))}
        </div>
      </section>

      <div className="mx-auto max-w-[1200px] px-6 sm:px-8">
        <div className="lifeos-divider" />
      </div>

      {/* Screenshots */}
      <section
        id="screenshots"
        className="py-24 scroll-mt-20"
      >
        <div className="mx-auto max-w-[1200px] px-6 sm:px-8">
          <div className="mb-12">
            <div
              className="hub-mono"
              style={{
                fontSize: 11,
                color: "var(--ink-muted)",
                textTransform: "uppercase",
                letterSpacing: "0.14em",
              }}
            >
              ◦ Inside the app
            </div>
            <h2
              style={{
                fontFamily: "var(--font-fraunces), Georgia, serif",
                fontSize: "clamp(32px, 4vw, 52px)",
                letterSpacing: "-0.025em",
                marginTop: 8,
                fontWeight: 400,
                color: "var(--ink)",
              }}
            >
              See it <em style={{ color: "var(--hub-accent)" }}>in action.</em>
            </h2>
          </div>
        </div>

        <div className="lifeos-shot-carousel">
          {SCREENSHOTS.map((s) => (
            <figure key={s.n} className="lifeos-shot">
              <div className="lifeos-shot-frame">
                <picture>
                  <source
                    srcSet={`/lifeos/screenshots/screenshot-${s.n}.webp`}
                    type="image/webp"
                  />
                  <img
                    src={`/lifeos/screenshots/screenshot-${s.n}.png`}
                    alt={s.alt}
                    loading="lazy"
                    decoding="async"
                  />
                </picture>
              </div>
              <figcaption className="lifeos-shot-caption">
                <span className="lifeos-shot-num">{s.n}</span>
                {s.caption}
              </figcaption>
            </figure>
          ))}
        </div>
      </section>

      <div className="mx-auto max-w-[1200px] px-6 sm:px-8">
        <div className="lifeos-divider" />
      </div>

      {/* Values (replaces pricing) */}
      <section
        id="values"
        className="mx-auto max-w-[1200px] px-6 py-24 sm:px-8 scroll-mt-20"
      >
        <div className="mb-12">
          <div
            className="hub-mono"
            style={{
              fontSize: 11,
              color: "var(--ink-muted)",
              textTransform: "uppercase",
              letterSpacing: "0.14em",
            }}
          >
            ◦ What you get
          </div>
          <h2
            style={{
              fontFamily: "var(--font-fraunces), Georgia, serif",
              fontSize: "clamp(32px, 4vw, 52px)",
              letterSpacing: "-0.025em",
              marginTop: 8,
              fontWeight: 400,
              color: "var(--ink)",
            }}
          >
            Free. <em style={{ color: "var(--hub-accent)" }}>Open. Yours.</em>
          </h2>
        </div>
        <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
          {VALUES.map((p) => (
            <div
              key={p.label}
              className={p.featured ? "lifeos-card-accent p-7" : "lifeos-card p-7"}
            >
              <div
                style={{
                  fontFamily: "var(--font-fraunces), Georgia, serif",
                  fontSize: 22,
                  lineHeight: 1.15,
                  letterSpacing: "-0.01em",
                  margin: 0,
                  color: p.featured ? "var(--hub-accent)" : "var(--ink)",
                  fontWeight: 500,
                }}
              >
                {p.label}
              </div>
              <p
                style={{
                  marginTop: 12,
                  color: "var(--ink-muted)",
                  lineHeight: 1.55,
                  fontSize: 14,
                }}
              >
                {p.body}
              </p>
            </div>
          ))}
        </div>
      </section>

      <div className="mx-auto max-w-[1200px] px-6 sm:px-8">
        <div className="lifeos-divider" />
      </div>

      {/* Download */}
      <section
        id="download"
        className="mx-auto max-w-[1200px] px-6 py-24 sm:px-8 scroll-mt-20"
      >
        <div className="mb-10">
          <div
            className="hub-mono"
            style={{
              fontSize: 11,
              color: "var(--ink-muted)",
              textTransform: "uppercase",
              letterSpacing: "0.14em",
            }}
          >
            ◦ Download · free
          </div>
          <h2
            style={{
              fontFamily: "var(--font-fraunces), Georgia, serif",
              fontSize: "clamp(32px, 4vw, 52px)",
              letterSpacing: "-0.025em",
              marginTop: 8,
              fontWeight: 400,
              color: "var(--ink)",
            }}
          >
            Get the <em style={{ color: "var(--hub-accent)" }}>installer.</em>
          </h2>
        </div>

        <div className="grid gap-5 sm:grid-cols-[1fr_320px]">
          <div className="lifeos-card p-7">
            <div
              style={{
                fontFamily: "var(--font-fraunces), Georgia, serif",
                fontSize: 24,
                color: "var(--ink)",
                margin: 0,
                fontWeight: 500,
              }}
            >
              LifeOS for Windows
            </div>
            <p
              style={{
                marginTop: 12,
                color: "var(--ink-muted)",
                lineHeight: 1.65,
                fontSize: 15,
              }}
            >
              All features unlocked, forever. No license, no trial, no account.
              Free and open-source.
            </p>
            <div className="mt-7 flex flex-wrap items-center gap-3">
              <a
                href={DOWNLOAD_URL}
                className="lifeos-btn-primary inline-flex items-center gap-2 rounded-full px-7 py-3.5 text-[15px]"
              >
                Download LifeOS-Setup.exe
              </a>
              <a
                href={RELEASES_URL}
                target="_blank"
                rel="noopener noreferrer"
                className="lifeos-btn-ghost inline-flex items-center gap-2 rounded-full px-5 py-3 text-[14px] font-medium"
              >
                All releases ↗
              </a>
              <span className="lifeos-chip">x64 · ~180 MB · signed</span>
            </div>
            <div
              style={{
                marginTop: 18,
                fontFamily: "var(--font-mono-stack)",
                fontSize: 11,
                color: "var(--ink-muted-2)",
              }}
            >
              SHA-256 + changelog published on the GitHub release page above.
            </div>
          </div>

          <div className="lifeos-card p-7">
            <div
              className="hub-mono"
              style={{
                fontSize: 11,
                color: "var(--ink-muted)",
                textTransform: "uppercase",
                letterSpacing: "0.14em",
              }}
            >
              ◦ Requirements
            </div>
            <ul
              className="mt-3 list-disc pl-5 text-sm leading-relaxed"
              style={{ color: "var(--ink-muted)" }}
            >
              <li>Windows 10 (1903+) or Windows 11</li>
              <li>x64 CPU · 8 GB RAM recommended</li>
              <li>~2 GB free disk for index + bundled model</li>
              <li>Microphone + screen access permission</li>
            </ul>
          </div>
        </div>
      </section>

      {/* Privacy stance */}
      <section className="mx-auto max-w-[1200px] px-6 pb-24 sm:px-8">
        <div className="lifeos-card-accent p-10 sm:p-14">
          <div
            className="hub-mono"
            style={{
              fontSize: 11,
              color: "var(--hub-accent)",
              textTransform: "uppercase",
              letterSpacing: "0.14em",
            }}
          >
            ◦ Privacy stance
          </div>
          <p
            style={{
              fontFamily: "var(--font-fraunces), Georgia, serif",
              fontSize: "clamp(20px, 2vw, 28px)",
              lineHeight: 1.45,
              maxWidth: "52ch",
              marginTop: 14,
              color: "var(--ink)",
              fontWeight: 400,
            }}
          >
            Indexed data stays on your machine — in a SQLite file you can open,
            delete, or wipe. Zero mandatory outbound traffic. Every byte that
            does leave (only if you point it at an LLM) is listed in <em style={{ color: "var(--hub-accent)" }}>Settings → Network</em> with timestamp and byte count.
            <em
              style={{
                color: "var(--hub-accent)",
                fontStyle: "italic",
                display: "block",
                marginTop: 12,
              }}
            >
              No telemetry. No account. No cloud.
            </em>
          </p>
        </div>
      </section>
    </>
  );
}
