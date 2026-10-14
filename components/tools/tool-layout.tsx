import fs from "node:fs";
import path from "node:path";
import type { Metadata } from "next";
import Link from "next/link";
import { marked } from "marked";
import { ShieldCheck, Wifi } from "lucide-react";
import { TOOLS, getTool } from "@/lib/tools";
import { getPost } from "@/lib/blog";
import { ToolIcon } from "./tool-icon";
import { DownloadHelper } from "./download-helper";

const SITE = "https://thecodebage.com";

export function toolMetadata(slug: string): Metadata {
  const tool = getTool(slug);
  if (!tool) return {};
  return {
    title: { absolute: `${tool.seoTitle} · codeBage` },
    description: tool.description,
    alternates: { canonical: `/tools/${slug}/` },
    openGraph: {
      type: "website",
      url: `${SITE}/tools/${slug}/`,
      title: tool.seoTitle,
      description: tool.description,
      images: [{ url: "/og.jpeg", width: 1200, height: 630, alt: "codeBage" }],
    },
  };
}

function readGuide(slug: string): string | null {
  const file = path.join(process.cwd(), "content", "tools", `${slug}.md`);
  if (!fs.existsSync(file)) return null;
  return marked.parse(fs.readFileSync(file, "utf8"), { async: false });
}

export function ToolLayout({ slug, children }: { slug: string; children: React.ReactNode }) {
  const tool = getTool(slug);
  if (!tool) throw new Error(`Unknown tool: ${slug}`);

  const guide = readGuide(slug);
  const post = tool.blogSlug ? getPost(tool.blogSlug) : undefined;
  const related = [
    ...TOOLS.filter((t) => t.slug !== slug && t.category === tool.category),
    ...TOOLS.filter((t) => t.slug !== slug && t.category !== tool.category),
  ].slice(0, 6);

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "WebApplication",
    name: tool.name,
    description: tool.description,
    url: `${SITE}/tools/${slug}/`,
    applicationCategory: "UtilitiesApplication",
    operatingSystem: "Any (runs in the browser)",
    offers: { "@type": "Offer", price: "0", priceCurrency: "USD" },
    publisher: { "@type": "Organization", name: "codeBage", url: SITE },
  };

  return (
    <div className="mx-auto max-w-[1480px] px-4 sm:px-8">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <nav
        style={{
          paddingTop: 28,
          fontFamily: "var(--font-mono-stack)",
          fontSize: 12,
          color: "var(--ink-muted)",
          overflowWrap: "anywhere",
        }}
      >
        <Link href="/tools/" className="hover:text-[color:var(--ink)]">
          /tools/
        </Link>
        {slug}/
      </nav>

      <div className="mx-auto max-w-[880px]">
        <header className="pb-6 pt-8 sm:pt-10">
          <div className="flex items-center gap-4">
            <ToolIcon name={tool.icon} />
            <span className="hub-chip">{tool.category}</span>
          </div>
          <h1
            className="hub-display"
            style={{
              fontFamily: "var(--font-fraunces), Georgia, serif",
              fontSize: "clamp(32px, 5vw, 52px)",
              lineHeight: 1.08,
              letterSpacing: "-0.02em",
              margin: "18px 0 0",
            }}
          >
            {tool.name}
          </h1>
          <p style={{ fontSize: 18, color: "var(--ink-2)", lineHeight: 1.5, margin: "12px 0 0" }}>
            {tool.tagline}
          </p>
          <div
            className="mt-4 inline-flex items-center gap-2"
            style={{ fontSize: 13, color: "var(--ink-muted)" }}
          >
            {tool.local ? (
              <>
                <ShieldCheck size={16} aria-hidden style={{ color: "#228b54" }} />
                Runs in your browser. Your files and text are never uploaded.
              </>
            ) : (
              <>
                <Wifi size={16} aria-hidden />
                Free, no sign-up. Only the exchange rates are fetched online.
              </>
            )}
          </div>
        </header>

        <DownloadHelper />
        <section className="tool-panel" aria-label={tool.name}>
          {children}
        </section>

        {guide && <div className="article-body" dangerouslySetInnerHTML={{ __html: guide }} />}

        {(tool.appName || post) && (
          <div className="mt-12 grid gap-4 sm:grid-cols-2">
            {tool.appName && tool.appHref && (
              <Link href={tool.appHref} className="hub-card block" style={cardStyle}>
                <div className="hub-mono" style={eyebrowStyle}>
                  Related app
                </div>
                <div style={cardTitleStyle}>{tool.appName} →</div>
              </Link>
            )}
            {post && (
              <Link href={`/blog/${post.slug}/`} className="hub-card block" style={cardStyle}>
                <div className="hub-mono" style={eyebrowStyle}>
                  Related guide
                </div>
                <div style={cardTitleStyle}>{post.title} →</div>
              </Link>
            )}
          </div>
        )}
      </div>

      <section className="pb-10 pt-14">
        <div className="mb-6 border-t border-[color:var(--line)] pt-8">
          <h2 className="hub-display" style={{ fontSize: "clamp(24px, 3vw, 32px)" }}>
            More free tools
          </h2>
        </div>
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {related.map((t) => (
            <ToolCard key={t.slug} slug={t.slug} />
          ))}
        </div>
      </section>
    </div>
  );
}

export function ToolCard({ slug }: { slug: string }) {
  const t = getTool(slug);
  if (!t) return null;
  return (
    <Link
      href={`/tools/${t.slug}/`}
      className="hub-card flex items-start gap-4"
      style={{ ...cardStyle, padding: 18 }}
    >
      <ToolIcon name={t.icon} size={20} />
      <div style={{ minWidth: 0 }}>
        <div style={{ fontWeight: 600, fontSize: 16, color: "var(--ink)" }}>{t.name}</div>
        <div style={{ fontSize: 14, color: "var(--ink-muted)", lineHeight: 1.45, marginTop: 4 }}>
          {t.tagline}
        </div>
      </div>
    </Link>
  );
}

const cardStyle: React.CSSProperties = {
  padding: 20,
  borderRadius: 16,
  background: "var(--paper-card)",
  border: "1px solid var(--line)",
  boxShadow: "var(--shadow-1)",
  textDecoration: "none",
  color: "inherit",
};

const eyebrowStyle: React.CSSProperties = {
  fontSize: 11,
  color: "var(--ink-muted)",
  textTransform: "uppercase",
};

const cardTitleStyle: React.CSSProperties = {
  fontFamily: "var(--font-fraunces), Georgia, serif",
  fontSize: 19,
  lineHeight: 1.3,
  marginTop: 6,
};
