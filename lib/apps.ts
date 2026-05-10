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
}

export const ANDROID_APPS: AppEntry[] = [
  {
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
    score: 4.8,
    ratings: 1240,
    installs: "10K+",
    genre: "Productivity",
    version: "0.1.0",
    released: "Mar 2025",
    updatedDate: "Apr 22, 2026",
    features: [
      "Multi-touch trackpad with two-finger scroll",
      "Full keyboard with modifier chord support",
      "Voice macros — long-press to fire keystrokes",
      "OCR text scan from camera, on-device",
      "Snippet manager for frequent paste blocks",
      "File transfer phone ↔ PC over LAN",
    ],
    recentChanges:
      "0.1.0 — first public build. Voice macros stabilised. OCR now handles low-contrast print. Pair-by-PIN UI tightened.",
  },
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
    updatedDate: "Apr 22, 2026",
    sizeMb: 14.2,
    sha256: "9c3f…a71e",
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
