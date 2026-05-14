import type { Metadata } from "next";
import { WINDOWS_APPS } from "@/lib/apps";
import { AppCard } from "@/components/site/app-card";

export const metadata: Metadata = {
  title: "Windows apps",
  description:
    "Every Windows utility we ship. Signed installers served from dl.thecodebage.com.",
  alternates: { canonical: "/apps/windows/" },
};

export default function WindowsGridPage() {
  const apps = WINDOWS_APPS;
  return (
    <main>
      <section className="mx-auto max-w-[1480px] px-8 pt-18 pb-12">
        <div
          className="hub-mono"
          style={{ fontSize: 12, color: "var(--ink-muted)", textTransform: "uppercase" }}
        >
          /apps/windows/
        </div>
        <h1
          className="hub-display"
          style={{ fontSize: "clamp(48px, 7.6vw, 108px)", lineHeight: 0.96, margin: "16px 0 0" }}
        >
          On Windows.
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
          Every Windows utility we ship. Signed installers served from
          dl.thecodebage.com. SHA-256 published next to each download.
        </p>
        <div className="mt-6 flex flex-wrap gap-2.5">
          <span className="hub-chip">
            {apps.length} {apps.length === 1 ? "app" : "apps"}
          </span>
          <span className="hub-chip">Direct download</span>
        </div>
      </section>

      <section className="mx-auto max-w-[1480px] px-8 py-20">
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {apps.map((a) => (
            <AppCard key={a.slug} app={a} />
          ))}
        </div>
      </section>
    </main>
  );
}
