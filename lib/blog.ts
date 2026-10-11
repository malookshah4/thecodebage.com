import fs from "node:fs";
import path from "node:path";
import { marked } from "marked";

// Articles live as markdown files in content/blog/<slug>.md with a small
// frontmatter block. Everything is read at build time (static export).
const BLOG_DIR = path.join(process.cwd(), "content", "blog");

export const CATEGORIES = [
  "Guides",
  "Creators",
  "Sellers",
  "Fun & safety",
  "Behind the build",
] as const;

export type Category = (typeof CATEGORIES)[number];

export interface PostMeta {
  slug: string;
  title: string;
  description: string;
  date: string;
  category: Category;
  appName?: string;
  appHref?: string;
  readingMinutes: number;
}

export interface Post extends PostMeta {
  html: string;
}

function parseFrontmatter(raw: string): { data: Record<string, string>; body: string } {
  const match = raw.match(/^---\r?\n([\s\S]*?)\r?\n---\r?\n?([\s\S]*)$/);
  if (!match) return { data: {}, body: raw };
  const data: Record<string, string> = {};
  for (const line of match[1].split(/\r?\n/)) {
    const m = line.match(/^(\w+):\s*(.*)$/);
    if (!m) continue;
    data[m[1]] = m[2].trim().replace(/^"(.*)"$/, "$1").replace(/\\"/g, '"');
  }
  return { data, body: match[2] };
}

function readPost(slug: string): Post {
  const raw = fs.readFileSync(path.join(BLOG_DIR, `${slug}.md`), "utf8");
  const { data, body } = parseFrontmatter(raw);
  const words = body.split(/\s+/).filter(Boolean).length;
  return {
    slug,
    title: data.title ?? slug,
    description: data.description ?? "",
    date: data.date ?? "",
    category: (CATEGORIES as readonly string[]).includes(data.category)
      ? (data.category as Category)
      : "Guides",
    appName: data.appName || undefined,
    appHref: data.appHref || undefined,
    readingMinutes: Math.max(1, Math.round(words / 220)),
    html: marked.parse(body, { async: false }),
  };
}

export function getAllPosts(): PostMeta[] {
  if (!fs.existsSync(BLOG_DIR)) return [];
  return fs
    .readdirSync(BLOG_DIR)
    .filter((f) => f.endsWith(".md"))
    .map((f) => {
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      const { html, ...meta } = readPost(f.replace(/\.md$/, ""));
      return meta;
    })
    .sort((a, b) => (a.date === b.date ? a.title.localeCompare(b.title) : b.date.localeCompare(a.date)));
}

export function getPost(slug: string): Post | undefined {
  if (!fs.existsSync(path.join(BLOG_DIR, `${slug}.md`))) return undefined;
  return readPost(slug);
}

export function formatDate(iso: string): string {
  const d = new Date(`${iso}T00:00:00Z`);
  if (Number.isNaN(d.getTime())) return iso;
  return d.toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
    timeZone: "UTC",
  });
}
