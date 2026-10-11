import type { Metadata } from "next";
import { TOOLS, TOOL_CATEGORIES } from "@/lib/tools";
import { ToolCard } from "@/components/tools/tool-layout";

export const metadata: Metadata = {
  title: "Free Online Tools",
  description:
    "Free, private browser tools: compress and convert images, merge PDFs, image to text, QR codes, WhatsApp links, currency and loan calculators, and more. No uploads.",
  alternates: { canonical: "/tools/" },
};

export default function ToolsIndexPage() {
  const categories = TOOL_CATEGORIES.filter((c) => TOOLS.some((t) => t.category === c));

  return (
    <div className="mx-auto max-w-[1480px] px-4 sm:px-8">
      <nav
        style={{
          paddingTop: 28,
          fontFamily: "var(--font-mono-stack)",
          fontSize: 12,
          color: "var(--ink-muted)",
        }}
      >
        /tools/
      </nav>

      <section className="py-12 sm:py-14">
        <div
          className="hub-mono"
          style={{ fontSize: 12, color: "var(--ink-muted)", textTransform: "uppercase" }}
        >
          ↳ {TOOLS.length} free tools · no sign-up
        </div>
        <h1
          className="hub-display"
          style={{
            fontFamily: "var(--font-fraunces), Georgia, serif",
            fontSize: "clamp(44px, 6.4vw, 84px)",
            lineHeight: 1,
            letterSpacing: "-0.025em",
            margin: "14px 0 0",
          }}
        >
          Small tools, <em>no uploads.</em>
        </h1>
        <p
          style={{
            fontSize: 18,
            color: "var(--ink-2)",
            lineHeight: 1.55,
            maxWidth: "60ch",
            margin: "18px 0 0",
          }}
        >
          Everyday tools that run right in your browser. Your photos, PDFs and text stay on
          your device, because there&apos;s no server on the other end to send them to.
        </p>
        <div className="mt-6 flex flex-wrap gap-2">
          {categories.map((c) => (
            <a key={c} href={`#${slugify(c)}`} className="hub-chip">
              {c}
            </a>
          ))}
        </div>
      </section>

      {categories.map((c) => (
        <section key={c} id={slugify(c)} className="scroll-mt-24 pb-12">
          <div className="mb-5 border-t border-[color:var(--line)] pt-8">
            <h2 className="hub-display" style={{ fontSize: "clamp(26px, 3vw, 36px)" }}>
              {c}
            </h2>
          </div>
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {TOOLS.filter((t) => t.category === c).map((t) => (
              <ToolCard key={t.slug} slug={t.slug} />
            ))}
          </div>
        </section>
      ))}
    </div>
  );
}

function slugify(s: string) {
  return s.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "");
}
