import type { Metadata } from "next";
import Link from "next/link";
import { CATEGORIES, formatDate, getAllPosts } from "@/lib/blog";

export const metadata: Metadata = {
  title: "Blog",
  description:
    "Practical guides from codeBage: using your phone as a PC mouse, spotting AI images, fact-checking viral videos, reseller profit math, creator tips and notes from building apps.",
  alternates: { canonical: "/blog/" },
};

export default function BlogIndexPage() {
  const posts = getAllPosts();
  const categories = CATEGORIES.filter((c) => posts.some((p) => p.category === c));

  return (
    <div className="mx-auto max-w-[1480px] px-5 sm:px-8">
      <nav
        style={{
          paddingTop: 28,
          fontFamily: "var(--font-mono-stack)",
          fontSize: 12,
          color: "var(--ink-muted)",
        }}
      >
        /blog/
      </nav>

      <section className="py-12 sm:py-14">
        <div
          className="hub-mono"
          style={{ fontSize: 12, color: "var(--ink-muted)", textTransform: "uppercase" }}
        >
          ↳ notes from the workbench
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
          Guides &amp; notes.
        </h1>
        <p
          style={{
            fontSize: 18,
            color: "var(--ink-2)",
            lineHeight: 1.55,
            maxWidth: "58ch",
            margin: "18px 0 0",
          }}
        >
          How-tos, explainers and honest notes from building small apps. Written by me,
          Malook, for people who&apos;d rather understand a thing than just tap a button.
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
        <section key={c} id={slugify(c)} className="scroll-mt-24 pb-14">
          <div className="mb-6 border-t border-[color:var(--line)] pt-8">
            <h2 className="hub-display" style={{ fontSize: "clamp(26px, 3vw, 36px)" }}>
              {c}
            </h2>
          </div>
          <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-3">
            {posts
              .filter((p) => p.category === c)
              .map((p) => (
                <Link
                  key={p.slug}
                  href={`/blog/${p.slug}/`}
                  className="hub-card flex flex-col"
                  style={{
                    padding: 24,
                    borderRadius: 18,
                    background: "var(--paper-card)",
                    border: "1px solid var(--line)",
                    boxShadow: "var(--shadow-1)",
                    textDecoration: "none",
                    color: "inherit",
                  }}
                >
                  <div
                    className="hub-mono"
                    style={{ fontSize: 11, color: "var(--ink-muted)", textTransform: "uppercase" }}
                  >
                    {formatDate(p.date)} · {p.readingMinutes} min read
                  </div>
                  <h3
                    style={{
                      fontFamily: "var(--font-fraunces), Georgia, serif",
                      fontSize: 22,
                      lineHeight: 1.25,
                      letterSpacing: "-0.01em",
                      margin: "10px 0 0",
                    }}
                  >
                    {p.title}
                  </h3>
                  <p
                    style={{
                      color: "var(--ink-muted)",
                      fontSize: 15,
                      lineHeight: 1.55,
                      margin: "10px 0 0",
                      flex: 1,
                    }}
                  >
                    {p.description}
                  </p>
                  <span
                    style={{ color: "var(--hub-accent)", fontSize: 14, marginTop: 16 }}
                  >
                    Read →
                  </span>
                </Link>
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
