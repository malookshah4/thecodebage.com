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
    slug: "lifeos",
    platform: "windows",
    customPath: "https://lifeos.thecodebage.com/",
    title: "LifeOS",
    summary:
      "Your second brain — fully local. Quietly indexes your own screen, voice, and audio, OCR + transcribes it, lets you ask anything across your memory. Free + open-source.",
    accentTint: "indigo",
    featured: true,
    free: true,
    iconUrl: "/lifeos/icon-card.png",
    version: "0.1.0",
    updatedDate: "May 21, 2026",
    sizeMb: 180,
    requirements: "Windows 10 (1903+) or Windows 11 · 64-bit",
    downloadUrl:
      "https://github.com/malookshah4/LifeOS/releases/latest/download/LifeOS-Setup.exe",
    features: [
      "Always-on memory — screen, voice, system audio indexed locally",
      "OCR + Whisper transcription, fully on-device",
      "Local LLM Q&A across your indexed memory",
      "Air-gap mode — one toggle blocks all outbound traffic",
      "SQLite store you can open, delete, or wipe",
      "Free, no account, no telemetry, open-source on GitHub",
    ],
    recentChanges:
      "0.1.0 — first public build. Trefoil knot identity, dark themed marketing site at lifeos.thecodebage.com. Free and open-source — no license, no trial, no phone-home.",
  },
  {
    slug: "remote-mouse-pro-server",
    platform: "windows",
    customPath: "/apps/remote-mouse-pro/",
    title: "Remote Mouse Pro · Server",
    summary:
      "The PC half of Remote Mouse Pro. Lives in your tray, broadcasts on your LAN.",
    accentTint: "amber",
    featured: true,
    free: true,
    version: "0.2.1",
    updatedDate: "Jun 19, 2026",
    sizeMb: 8.53,
    sha256: "736247f83c734fb200131afc14ab70fb21f280967438388c25e838a3ce0e553f",
    requirements: "Windows 10 or later · 64-bit",
    downloadUrl:
      "https://github.com/malookshah4/remotmouse/releases/latest/download/RemotMouseSetup.exe",
    features: [
      "Tray-resident server, near-zero CPU at idle",
      "First-run companion window with Play Store QR + live pair-PIN",
      "Auto-discovery on your local network",
      "Pair-by-PIN handshake — no account, no cloud",
      "All input is delivered through native Windows APIs",
      "Logs stay on disk; nothing leaves your machine",
    ],
    recentChanges:
      "0.2.0 — new first-run onboarding window with Play Store QR and a live pair-PIN that lights up the moment your phone touches the server. codeBage branding across version-info and installer. Multi-monitor + DPI awareness, foreground-window tracking, file pull, snippet capture, voice macros under the hood.",
  },
];

export function getApp(platform: Platform, slug: string): AppEntry | undefined {
  const list = platform === "android" ? ANDROID_APPS : WINDOWS_APPS;
  return list.find((a) => a.slug === slug);
}

export function appHref(app: AppEntry): string {
  return app.customPath ?? `/apps/${app.platform}/${app.slug}/`;
}
