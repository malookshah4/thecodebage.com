import rawApps from "@/data/playstore.json";
import type { AccentTint, AppEntry, AppReview } from "./apps";

interface ScrapedReview {
  id?: string;
  userName?: string;
  userImage?: string;
  date?: string;
  score?: number;
  text?: string;
}

interface ScrapedApp {
  appId: string;
  slug: string;
  title: string;
  summary?: string;
  description?: string;
  descriptionHTML?: string;
  icon?: string;
  iconRemote?: string;
  headerImage?: string | null;
  screenshots?: string[];
  video?: unknown;
  score?: number;
  scoreText?: string;
  ratings?: number;
  reviews?: number;
  installs?: string;
  minInstalls?: number;
  maxInstalls?: number;
  price?: number;
  free?: boolean;
  currency?: string;
  genre?: string;
  genreId?: string;
  contentRating?: string;
  released?: string;
  updated?: number;
  updatedDate?: string;
  version?: string;
  recentChanges?: string;
  url?: string;
  developer?: string;
  developerId?: string;
  developerWebsite?: string;
  developerEmail?: string;
  privacyPolicy?: string;
  androidVersion?: string;
  features?: string[];
  recentReviews?: ScrapedReview[];
}

const TINT_CYCLE: AccentTint[] = [
  "teal",
  "violet",
  "rose",
  "indigo",
  "cyan",
  "green",
  "amber",
  "slate",
];

function pickTint(appId: string): AccentTint {
  let h = 0;
  for (let i = 0; i < appId.length; i++) h = (h * 31 + appId.charCodeAt(i)) >>> 0;
  return TINT_CYCLE[h % TINT_CYCLE.length];
}

function formatDate(iso?: string): string {
  if (!iso) return "";
  const d = new Date(iso);
  if (Number.isNaN(d.getTime())) return iso;
  return d.toLocaleDateString("en-US", {
    year: "numeric",
    month: "short",
    day: "numeric",
  });
}

function decodeEntities(s?: string): string {
  if (!s) return "";
  return s
    .replace(/&amp;/g, "&")
    .replace(/&#39;/g, "'")
    .replace(/&quot;/g, '"')
    .replace(/&lt;/g, "<")
    .replace(/&gt;/g, ">");
}

function toReview(r: ScrapedReview): AppReview {
  return {
    author: r.userName ?? "anonymous",
    score: typeof r.score === "number" ? r.score : 0,
    text: decodeEntities(r.text ?? ""),
    date: formatDate(r.date),
    authorImage: r.userImage,
  };
}

function isLocal(p?: string): boolean {
  return !!p && p.startsWith("/apps/");
}

function toEntry(a: ScrapedApp): AppEntry {
  return {
    slug: a.slug,
    platform: "android",
    title: a.title,
    summary: decodeEntities(a.summary) || a.title,
    description: decodeEntities(a.description),
    accentTint: pickTint(a.appId),
    free: a.free !== false,
    score: typeof a.score === "number" ? a.score : undefined,
    ratings: typeof a.ratings === "number" ? a.ratings : undefined,
    installs: a.installs,
    genre: a.genre,
    storeUrl: a.url,
    version: a.version || "—",
    released: a.released,
    updatedDate: a.updatedDate,
    features: (a.features ?? []).map(decodeEntities),
    recentChanges: decodeEntities(a.recentChanges),
    recentReviews: (a.recentReviews ?? []).map(toReview),
    iconUrl: isLocal(a.icon) ? a.icon : undefined,
    screenshots: (a.screenshots ?? []).filter(isLocal),
  };
}

export const PLAYSTORE_APPS: AppEntry[] = (rawApps as ScrapedApp[]).map(toEntry);
