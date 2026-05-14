import { PLAYSTORE_APPS } from "./playstore";

export type Platform = "android" | "windows";

export type AccentTint =
  | "amber"
  | "teal"
  | "violet"
  | "green"
  | "rose"
  | "indigo"
  | "slate"
  | "cyan";

export interface AppReview {
  author: string;
  score: number;
  text: string;
  date: string;
  authorImage?: string;
}

export interface AppEntry {
  slug: string;
  platform: Platform;
  customPath?: string;
  title: string;
  summary: string;
  accentTint: AccentTint;
  featured?: boolean;
  free: boolean;
  paid?: string;

  /** Android-only */
  score?: number;
  ratings?: number;
  installs?: string;
  genre?: string;
  storeUrl?: string;
  description?: string;

  /** Windows-only */
  sizeMb?: number;
  sha256?: string;
  requirements?: string;
  downloadUrl?: string;

  /** Shared */
  version: string;
  released?: string;
  updatedDate?: string;
  features?: string[];
  recentChanges?: string;
  recentReviews?: AppReview[];
  /** Local public path or remote URL — used when present in place of initials avatar */
  iconUrl?: string;
  /** Local public paths or remote URLs — phone screenshots */
  screenshots?: string[];
}

// Scraper writes a slug like "remote-mouse-pro-use-full-pc" — match by prefix
// so future renames don't break the merge. Real Play Store data (icon,
// screenshots, version, ratings) overrides the hard-coded placeholders.
const SCRAPED_RMP = PLAYSTORE_APPS.find((a) => a.slug.startsWith("remote-mouse-pro"));

const hasRealRatings = (SCRAPED_RMP?.ratings ?? 0) > 0;
const hasRealInstalls = !!SCRAPED_RMP?.installs && SCRAPED_RMP.installs !== "0+";

const REMOTE_MOUSE_PRO: AppEntry = {
  slug: "remote-mouse-pro",
  platform: "android",
  customPath: "/apps/remote-mouse-pro/",
  title: "Remote Mouse Pro",
  summary:
    "Use your full PC from your phone. Trackpad, keyboard, voice macros, OCR, snippets.",
  accentTint: "amber",
  featured: true,
  free: true,
  paid: "Pro $1.99/mo",
  score: hasRealRatings ? SCRAPED_RMP?.score : undefined,
  ratings: hasRealRatings ? SCRAPED_RMP?.ratings : undefined,
  installs: hasRealInstalls ? SCRAPED_RMP?.installs : undefined,
  genre: SCRAPED_RMP?.genre ?? "Productivity",
  storeUrl: SCRAPED_RMP?.storeUrl,
  iconUrl: SCRAPED_RMP?.iconUrl,
  screenshots: SCRAPED_RMP?.screenshots?.length ? SCRAPED_RMP.screenshots : undefined,
  version: SCRAPED_RMP?.version ?? "0.1.0",
  released: SCRAPED_RMP?.released ?? "May 2026",
  updatedDate: SCRAPED_RMP?.updatedDate ?? "May 10, 2026",
  features: [
    "Multi-touch trackpad with two-finger scroll",
    "Full keyboard with modifier chord support",
    "Voice macros — long-press to fire keystrokes",
    "OCR text scan from camera, on-device",
    "Snippet manager for frequent paste blocks",
    "File transfer phone ↔ PC over LAN",
  ],
  recentChanges:
    SCRAPED_RMP?.recentChanges ||
    "0.1.0 — first public build. Voice macros stabilised. OCR now handles low-contrast print. Pair-by-PIN UI tightened.",
  recentReviews: SCRAPED_RMP?.recentReviews,
};

export const ANDROID_APPS: AppEntry[] = [
  REMOTE_MOUSE_PRO,
  ...PLAYSTORE_APPS.filter((a) => !a.slug.startsWith("remote-mouse-pro")),
];

export const WINDOWS_APPS: AppEntry[] = [
  {
    slug: "remote-mouse-pro-server",
    platform: "windows",
    title: "Remote Mouse Pro · Server",
    summary:
      "The PC half of Remote Mouse Pro. Lives in your tray, broadcasts on your LAN.",
    accentTint: "amber",
    featured: true,
    free: true,
    version: "0.1.0",
    updatedDate: "May 10, 2026",
    sizeMb: 6.96,
    sha256: "091dbab762c69f4124a202a1643dbac49c3cdf020deea0e259fa15544e63a795",
    requirements: "Windows 10 or later · 64-bit",
    downloadUrl:
      "https://dl.thecodebage.com/remot-mouse-pro/v0.1.0/RemotMouseSetup.exe",
    features: [
      "Tray-resident server, near-zero CPU at idle",
      "Auto-discovery on your local network",
      "Pair-by-PIN handshake — no account, no cloud",
      "All input is delivered through native Windows APIs",
      "Logs stay on disk; nothing leaves your machine",
    ],
    recentChanges:
      "0.1.0 — initial public build. Pairing UI redesigned. Tray menu now exposes a network probe.",
  },
];

export function getApp(platform: Platform, slug: string): AppEntry | undefined {
  const list = platform === "android" ? ANDROID_APPS : WINDOWS_APPS;
  return list.find((a) => a.slug === slug);
}

export function appHref(app: AppEntry): string {
  return app.customPath ?? `/apps/${app.platform}/${app.slug}/`;
}
