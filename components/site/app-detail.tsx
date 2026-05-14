import Image from "next/image";
import Link from "next/link";
import { Stars } from "./stars";
import { PhoneShot, DesktopShot } from "./shots";
import { PhoneSlider } from "./phone-slider";
import { DetailCarousel } from "./detail-carousel";
import { ANDROID_APPS, WINDOWS_APPS, type AppEntry } from "@/lib/apps";

interface AppDetailProps {
  app: AppEntry;
}

function initials(title: string): string {
  return title
    .split(/[\s.·]+/)
    .slice(0, 2)
    .map((w) => w[0] ?? "")
    .join("")
    .slice(0, 2)
    .toUpperCase();
}

export function AppDetail({ app }: AppDetailProps) {
  const isAndroid = app.platform === "android";
  const Shot = isAndroid ? PhoneShot : DesktopShot;
  const carouselStep = isAndroid ? 256 : 496;
  const features = app.features ?? [];
  const reviews = app.recentReviews ?? [];
  const screenshots = app.screenshots ?? [];
  // Drop the first scraped image if there are more — Play Store often
  // returns a wide feature banner as screenshots[0].
  const phoneShotsForHero =
    isAndroid && screenshots.length > 1 ? screenshots.slice(1) : screenshots;
  const hasRealShots = isAndroid && screenshots.length > 0;
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
          <Link href={`/apps/${app.platform}/`}>/apps/{app.platform}/</Link>
          <span> / </span>
          <span style={{ color: "var(--ink-2)" }}>{app.slug}</span>
        </nav>

        {/* Hero */}
        <section className="grid items-center gap-14 py-14 md:grid-cols-2">
          <div>
            {app.iconUrl ? (
              <div
                style={{
                  width: 88,
                  height: 88,
                  borderRadius: 22,
                  overflow: "hidden",
                  position: "relative",
                  boxShadow: "var(--shadow-2)",
                }}
              >
                <Image
                  src={app.iconUrl}
                  alt={app.title}
                  fill
                  sizes="88px"
                  style={{ objectFit: "cover" }}
                  priority
                />
              </div>
            ) : (
              <div
                className={`tint-${app.accentTint}`}
                style={{
                  width: 88,
                  height: 88,
                  borderRadius: 22,
                  display: "grid",
                  placeItems: "center",
                  color: "white",
                  fontFamily: "var(--font-display)",
                  fontSize: 38,
                  boxShadow: "var(--shadow-2)",
                }}
              >
                {initials(app.title)}
              </div>
            )}
            <h1
              className="hub-display"
              style={{
                fontSize: "clamp(40px, 5vw, 64px)",
                lineHeight: 1.0,
                margin: "18px 0 12px",
              }}
            >
              {app.title}
            </h1>
            <p style={{ fontSize: 19, color: "var(--ink-2)", lineHeight: 1.5, maxWidth: "44ch", margin: "0 0 22px" }}>
              {app.summary}
            </p>
            <div
              className="flex flex-wrap items-center gap-3.5"
              style={{ color: "var(--ink-muted)", fontFamily: "var(--font-mono-stack)", fontSize: 12 }}
            >
              {isAndroid ? (
                <>
                  {app.score !== undefined && (
                    <span>
                      <Stars value={app.score} />{" "}
                      <b style={{ color: "var(--ink-2)" }}>{app.score.toFixed(1)}</b>
                    </span>
                  )}
                  {app.ratings !== undefined && (
                    <>
                      <Dot />
                      <span>{app.ratings.toLocaleString()} ratings</span>
                    </>
                  )}
                  {app.installs && (
                    <>
                      <Dot />
                      <span>{app.installs} installs</span>
                    </>
                  )}
                  {app.genre && (
                    <>
                      <Dot />
                      <span>
                        <b style={{ color: "var(--ink-2)" }}>{app.genre}</b>
                      </span>
                    </>
                  )}
                  <Dot />
                  <span>v{app.version}</span>
                </>
              ) : (
                <>
                  <span>
                    <b style={{ color: "var(--ink-2)" }}>v{app.version}</b>
                  </span>
                  {app.sizeMb !== undefined && (
                    <>
                      <Dot />
                      <span>{app.sizeMb} MB</span>
                    </>
                  )}
                  {app.requirements && (
                    <>
                      <Dot />
                      <span>{app.requirements}</span>
                    </>
                  )}
                  {app.sha256 && (
                    <>
                      <Dot />
                      <span>SHA-256 {app.sha256}</span>
                    </>
                  )}
                </>
              )}
            </div>
            <div className="mt-7 flex flex-wrap gap-3">
              {isAndroid ? (
                <>
                  {app.storeUrl ? (
                    <a
                      href={app.storeUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-2 rounded-full bg-[color:var(--hub-accent)] px-5 py-3 text-[15px] font-medium text-white"
                    >
                      Get on Google Play →
                    </a>
                  ) : (
                    <button
                      type="button"
                      disabled
                      className="inline-flex items-center gap-2 rounded-full bg-[color:var(--hub-accent)] px-5 py-3 text-[15px] font-medium text-white opacity-80 cursor-not-allowed"
                    >
                      Coming to Google Play →
                    </button>
                  )}
                  {app.paid && <span className="hub-chip hub-chip-accent">{app.paid}</span>}
                </>
              ) : (
                <>
                  <a
                    href={app.downloadUrl}
                    className="inline-flex items-center gap-2 rounded-full bg-[color:var(--hub-accent)] px-5 py-3 text-[15px] font-medium text-white"
                  >
                    Download Setup ({app.sizeMb} MB) →
                  </a>
                </>
              )}
            </div>
          </div>
          <div className="flex justify-center md:justify-end">
            {hasRealShots ? (
              <div
                style={{
                  width: 280,
                  aspectRatio: "9/19",
                  borderRadius: 36,
                  overflow: "hidden",
                  position: "relative",
                  boxShadow: "var(--shadow-2)",
                  background: "#111",
                }}
              >
                <PhoneSlider
                  screenshots={phoneShotsForHero}
                  alt={app.title}
                  sizes="280px"
                />
              </div>
            ) : (
              <Shot tint={app.accentTint} title={app.title} />
            )}
          </div>
        </section>

        {/* Screenshots carousel */}
        <section className="py-20">
          <div className="mb-8 flex items-end justify-between gap-8">
            <div>
              <div className="hub-mono text-[11px] uppercase text-[color:var(--ink-muted)]">
                Screenshots
              </div>
              <h2 className="hub-display" style={{ fontSize: "clamp(28px, 3.6vw, 44px)", marginTop: 6 }}>
                {isAndroid ? "On the phone." : "On the desktop."}
              </h2>
            </div>
          </div>
          <DetailCarousel step={carouselStep}>
            {hasRealShots
              ? screenshots.map((src, i) => (
                  <div
                    key={i}
                    style={{
                      flex: "0 0 auto",
                      width: 240,
                      aspectRatio: "9/19",
                      borderRadius: 24,
                      overflow: "hidden",
                      position: "relative",
                      background: "#111",
                      boxShadow: "var(--shadow-1)",
                    }}
                  >
                    <Image
                      src={src}
                      alt={`${app.title} screenshot ${i + 1}`}
                      fill
                      sizes="240px"
                      style={{ objectFit: "cover" }}
                    />
                  </div>
                ))
              : [0, 1, 2, 3, 4, 5].map((i) => (
                  <Shot key={i} tint={app.accentTint} title={app.title} />
                ))}
          </DetailCarousel>
        </section>

        {/* Features */}
        {features.length > 0 && (
          <section className="py-20">
            <div className="mb-8 flex items-end justify-between gap-8">
              <div>
                <div className="hub-mono text-[11px] uppercase text-[color:var(--ink-muted)]">
                  What it does
                </div>
                <h2 className="hub-display" style={{ fontSize: "clamp(28px, 3.6vw, 44px)", marginTop: 6 }}>
                  Everything you need.
                </h2>
              </div>
              <p className="max-w-[460px] text-[15px] text-[color:var(--ink-muted)]">
                {isAndroid
                  ? "Bullets parsed automatically from the store description; shown verbatim — no marketing rewriting."
                  : "Built and signed by the same studio. No installer wizardry, no bundled junk."}
              </p>
            </div>
            <div className="feature-grid">
              {features.map((f, i) => (
                <div key={i} className="feature-row">
                  <span className="feature-num">{String(i + 1).padStart(2, "0")}</span>
                  <span className="feature-text">{f}</span>
                </div>
              ))}
            </div>
          </section>
        )}

        {/* Recent changes */}
        {app.recentChanges && (
          <section className="py-20">
            <div className="changelog">
              <div className="changelog-tag">↳ Recent changes · {app.version}</div>
              <p className="changelog-body">{app.recentChanges}</p>
            </div>
          </section>
        )}

        {/* Recent reviews */}
        {isAndroid && reviews.length > 0 && (
          <section className="py-20">
            <div className="mb-8 flex items-end justify-between gap-8">
              <div>
                <div className="hub-mono text-[11px] uppercase text-[color:var(--ink-muted)]">
                  Recent reviews · Google Play
                </div>
                <h2 className="hub-display" style={{ fontSize: "clamp(28px, 3.6vw, 44px)", marginTop: 6 }}>
                  What people say.
                </h2>
              </div>
              <p className="max-w-[460px] text-[15px] text-[color:var(--ink-muted)]">
                Newest twelve reviews, refreshed on every deploy.
              </p>
            </div>
            <div>
              {reviews.map((r, i) => (
                <div
                  key={i}
                  className="grid gap-8 border-t border-[color:var(--line)] py-6 md:grid-cols-[160px_1fr]"
                >
                  <div>
                    <div>
                      <Stars value={r.score} />
                    </div>
                    <div
                      className="mt-1 hub-mono text-[12px]"
                      style={{ color: "var(--ink-muted)" }}
                    >
                      {r.author} · {r.date}
                    </div>
                  </div>
                  <p
                    className="m-0 max-w-[60ch] text-[16px] leading-[1.55]"
                    style={{ color: "var(--ink-2)" }}
                  >
                    &ldquo;{r.text}&rdquo;
                  </p>
                </div>
              ))}
            </div>
          </section>
        )}

        {/* About the developer */}
        <section className="py-20">
          <div
            className="grid gap-12 border-t border-[color:var(--line)] pt-10 md:grid-cols-[200px_1fr]"
          >
            <div className="hub-mono text-[11px] uppercase text-[color:var(--ink-muted)]">
              About the developer
            </div>
            <div>
              <p
                className="m-0 max-w-[56ch] text-[18px] leading-[1.55]"
                style={{ color: "var(--ink-2)" }}
              >
                <b>codeBage</b> is a one-person studio. {app.title} is one of {totalApps}{" "}
                utilit{totalApps === 1 ? "y" : "ies"} built around the same operating principle:{" "}
                <em style={{ color: "var(--hub-accent)" }}>
                  local-first, calm, no telemetry, no accounts unless the feature literally
                  requires one.
                </em>
              </p>
              <div className="mt-6 flex flex-wrap gap-3">
                <Link
                  href="/about/"
                  className="inline-flex items-center gap-2 rounded-full border border-[color:var(--line-strong)] px-5 py-2.5 text-sm font-medium hover:bg-[color:var(--chip-bg)]"
                >
                  About the developer →
                </Link>
                <Link
                  href={isAndroid ? "/apps/android/" : "/apps/windows/"}
                  className="inline-flex items-center gap-2 rounded-full border border-[color:var(--line-strong)] px-5 py-2.5 text-sm font-medium hover:bg-[color:var(--chip-bg)]"
                >
                  Browse all apps →
                </Link>
              </div>
            </div>
          </div>
        </section>
      </div>
    </main>
  );
}

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
