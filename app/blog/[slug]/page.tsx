import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { formatDate, getAllPosts, getPost } from "@/lib/blog";

interface PageProps {
  params: Promise<{ slug: string }>;
}

const SITE = "https://thecodebage.com";

export const dynamicParams = false;

export function generateStaticParams() {
  return getAllPosts().map((p) => ({ slug: p.slug }));
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params;
  const post = getPost(slug);
  if (!post) return {};
  return {
    title: post.title,
    description: post.description,
    alternates: { canonical: `/blog/${slug}/` },
    authors: [{ name: "Malook Shah", url: `${SITE}/about/` }],
    openGraph: {
      type: "article",
      url: `${SITE}/blog/${slug}/`,
      title: post.title,
      description: post.description,
      publishedTime: post.date,
      authors: ["Malook Shah"],
      images: [{ url: "/og.jpeg", width: 1200, height: 630, alt: "codeBage" }],
    },
  };
}

export default async function BlogPostPage({ params }: PageProps) {
  const { slug } = await params;
  const post = getPost(slug);
  if (!post) notFound();

  const others = getAllPosts().filter((p) => p.slug !== slug);
  const more = [
    ...others.filter((p) => p.category === post.category),
    ...others.filter((p) => p.category !== post.category),
  ].slice(0, 3);

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "BlogPosting",
    headline: post.title,
    description: post.description,
    datePublished: post.date,
    dateModified: post.date,
    author: { "@type": "Person", name: "Malook Shah", url: `${SITE}/about/` },
    publisher: { "@type": "Organization", name: "codeBage", url: SITE },
    mainEntityOfPage: `${SITE}/blog/${slug}/`,
  };

  const appIsExternal = post.appHref?.startsWith("http");

  return (
    <div className="mx-auto max-w-[1480px] px-5 sm:px-8">
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
        <Link href="/blog/" className="hover:text-[color:var(--ink)]">
          /blog/
        </Link>
        {slug}/
      </nav>

      <article className="mx-auto max-w-[720px] py-12 sm:py-14">
        <header>
          <span className="hub-chip hub-chip-accent">{post.category}</span>
          <h1
            className="hub-display"
            style={{
              fontFamily: "var(--font-fraunces), Georgia, serif",
              fontSize: "clamp(34px, 5vw, 54px)",
              lineHeight: 1.08,
              letterSpacing: "-0.02em",
              margin: "18px 0 0",
            }}
          >
            {post.title}
          </h1>
          <p
            style={{
              fontSize: 19,
              color: "var(--ink-2)",
              lineHeight: 1.55,
              margin: "16px 0 0",
            }}
          >
            {post.description}
          </p>
          <div
            className="mt-6 flex flex-wrap items-center gap-x-3 gap-y-1 border-b border-[color:var(--line)] pb-6"
            style={{
              color: "var(--ink-muted)",
              fontFamily: "var(--font-mono-stack)",
              fontSize: 12,
            }}
          >
            <span>
              By{" "}
              <Link href="/about/" style={{ color: "var(--ink-2)" }}>
                Malook Shah
              </Link>
            </span>
            <span aria-hidden>·</span>
            <time dateTime={post.date}>{formatDate(post.date)}</time>
            <span aria-hidden>·</span>
            <span>{post.readingMinutes} min read</span>
          </div>
        </header>

        <div className="article-body" dangerouslySetInnerHTML={{ __html: post.html }} />

        {post.appName && post.appHref && (
          <aside
            className="mt-12"
            style={{
              padding: 24,
              borderRadius: 18,
              background: "var(--paper-card)",
              border: "1px solid var(--line)",
              boxShadow: "var(--shadow-1)",
            }}
          >
            <div
              className="hub-mono"
              style={{ fontSize: 11, color: "var(--ink-muted)", textTransform: "uppercase" }}
            >
              Related app
            </div>
            <div className="mt-2 flex flex-wrap items-center justify-between gap-4">
              <div style={{ fontFamily: "var(--font-fraunces), Georgia, serif", fontSize: 22 }}>
                {post.appName}
              </div>
              {appIsExternal ? (
                <a
                  href={post.appHref}
                  className="inline-flex items-center gap-2 rounded-full bg-[color:var(--hub-accent)] px-5 py-2.5 text-sm font-medium text-white"
                >
                  See the app →
                </a>
              ) : (
                <Link
                  href={post.appHref}
                  className="inline-flex items-center gap-2 rounded-full bg-[color:var(--hub-accent)] px-5 py-2.5 text-sm font-medium text-white"
                >
                  See the app →
                </Link>
              )}
            </div>
          </aside>
        )}
      </article>

      {more.length > 0 && (
        <section className="pb-10">
          <div className="mb-6 border-t border-[color:var(--line)] pt-8">
            <h2 className="hub-display" style={{ fontSize: "clamp(24px, 3vw, 32px)" }}>
              Keep reading
            </h2>
          </div>
          <div className="grid gap-5 md:grid-cols-3">
            {more.map((p) => (
              <Link
                key={p.slug}
                href={`/blog/${p.slug}/`}
                className="hub-card block"
                style={{
                  padding: 22,
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
                  {p.category} · {p.readingMinutes} min
                </div>
                <div
                  style={{
                    fontFamily: "var(--font-fraunces), Georgia, serif",
                    fontSize: 20,
                    lineHeight: 1.3,
                    marginTop: 8,
                  }}
                >
                  {p.title}
                </div>
              </Link>
            ))}
          </div>
        </section>
      )}
    </div>
  );
}
