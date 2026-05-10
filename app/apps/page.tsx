import type { Metadata } from "next";
import Link from "next/link";
import { ANDROID_APPS, WINDOWS_APPS } from "@/lib/apps";

export const metadata: Metadata = {
  title: "Apps",
  description: "Pick your platform — Android via Google Play or Windows direct download.",
};

export default function AppsHubPage() {
  return (
    <main>
      <section className="mx-auto max-w-[1240px] px-8 pt-18 pb-12">
        <div
          className="hub-mono"
          style={{ fontSize: 12, color: "var(--ink-muted)", textTransform: "uppercase" }}
        >
          /apps/
        </div>
        <h1
          className="hub-display"
          style={{ fontSize: "clamp(48px, 7.6vw, 108px)", lineHeight: 0.96, margin: "16px 0 0" }}
        >
          Pick your platform.
        </h1>
        <p
          style={{
            color: "var(--ink-muted)",
            fontSize: "clamp(16px, 1.4vw, 19px)",
            margin: "22px 0 0",
            maxWidth: 640,
            lineHeight: 1.55,
          }}
        >
          Two surfaces, two release cadences. Android updates ship through Google Play;
          Windows binaries are signed and served from{" "}
          <code
            style={{
              fontFamily: "var(--font-mono-stack)",
              fontSize: 14,
              color: "var(--ink-2)",
              background: "var(--chip-bg)",
              padding: "1px 6px",
              borderRadius: 4,
            }}
          >
            dl.thecodebage.com
          </code>
          .
        </p>
      </section>

      <section className="mx-auto max-w-[1240px] px-8 platform-pick">
        <Link href="/apps/android/" className="platform-card">
          <div className="hub-mono text-[11px] uppercase text-[color:var(--ink-muted)]">
            01 / Android
          </div>
          <h2
            className="hub-display"
            style={{ fontSize: 56, lineHeight: 1, margin: 0, letterSpacing: "-0.025em" }}
          >
            For your phone.
          </h2>
          <p style={{ color: "var(--ink-muted)", maxWidth: "30ch", margin: 0 }}>
            {ANDROID_APPS.length} app{ANDROID_APPS.length === 1 ? "" : "s"} on Google Play.
            Productivity, tools, light finance.
          </p>
          <div
            className="mt-auto hub-mono text-[12px]"
            style={{ color: "var(--ink-muted)" }}
          >
            {ANDROID_APPS.length} app{ANDROID_APPS.length === 1 ? "" : "s"} · live ratings
            &amp; reviews
          </div>
          <div style={{ color: "var(--hub-accent)", fontSize: 14 }}>Browse Android →</div>
        </Link>
        <Link href="/apps/windows/" className="platform-card">
          <div className="hub-mono text-[11px] uppercase text-[color:var(--ink-muted)]">
            02 / Windows
          </div>
          <h2
            className="hub-display"
            style={{ fontSize: 56, lineHeight: 1, margin: 0, letterSpacing: "-0.025em" }}
          >
            For your PC.
          </h2>
          <p style={{ color: "var(--ink-muted)", maxWidth: "30ch", margin: 0 }}>
            {WINDOWS_APPS.length} app{WINDOWS_APPS.length === 1 ? "" : "s"} as direct downloads.
            Signed installers, SHA-256 checksums.
          </p>
          <div
            className="mt-auto hub-mono text-[12px]"
            style={{ color: "var(--ink-muted)" }}
          >
            {WINDOWS_APPS.length} app{WINDOWS_APPS.length === 1 ? "" : "s"} · served from
            dl.thecodebage.com
          </div>
          <div style={{ color: "var(--hub-accent)", fontSize: 14 }}>Browse Windows →</div>
        </Link>
      </section>
    </main>
  );
}
