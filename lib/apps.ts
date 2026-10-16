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

  /** iOS App Store link — same app on Apple. Pinned in IOS_LINKS, not scraped. */
  appStoreUrl?: string;

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
  title: "Phone Mouse",
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
  iconUrl: SCRAPED_RMP?.iconUrl ?? "/phone-mouse-icon.png",
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

// MuscleLit (com.codebage.musclelit): live on Play since Oct 2026. Icon, screenshots,
// description, version and ratings come from the scraped Play Store data; the hard-coded
// values below are only fallbacks if the scrape ever misses it.
const SCRAPED_ML = PLAYSTORE_APPS.find((a) => a.slug.startsWith("musclelit"));
const mlRatings = (SCRAPED_ML?.ratings ?? 0) > 0;
const mlInstalls = !!SCRAPED_ML?.installs && SCRAPED_ML.installs !== "0+";

const MUSCLELIT: AppEntry = {
  slug: "musclelit",
  platform: "android",
  title: "MuscleLit: 3D Workout Anatomy",
  summary:
    "Gym & home workout planner with 3D muscle anatomy, camera rep counter and form check.",
  accentTint: "rose",
  featured: true,
  free: true,
  paid: "Pro from $4.99/mo · 7-day free trial",
  score: mlRatings ? SCRAPED_ML?.score : undefined,
  ratings: mlRatings ? SCRAPED_ML?.ratings : undefined,
  installs: mlInstalls ? SCRAPED_ML?.installs : undefined,
  genre: SCRAPED_ML?.genre ?? "Health & Fitness",
  storeUrl: SCRAPED_ML?.storeUrl,
  description:
    SCRAPED_ML?.description ??
    "MuscleLit is a gym and home workout app built around a real 3D body. Watch every exercise on the 3D muscle model from any angle, see exactly which muscles each workout trains, and follow a strength training plan built for your goal. The camera counts your reps and checks your form, hands-free, with nothing leaving your phone.",
  iconUrl: SCRAPED_ML?.iconUrl ?? "/apps/musclelit/icon.png",
  screenshots: SCRAPED_ML?.screenshots?.length
    ? SCRAPED_ML.screenshots
    : [1, 2, 3, 4, 5, 6, 7].map((n) => `/apps/musclelit/screenshot-${n}.jpg`),
  version: SCRAPED_ML?.version ?? "1.0.0",
  released: SCRAPED_ML?.released ?? "Oct 13, 2026",
  updatedDate: SCRAPED_ML?.updatedDate ?? "Oct 13, 2026",
  features: [
    "140+ gym and bodyweight exercises on a real 3D anatomy body",
    "Camera rep counter and form check, on-device, hands-free",
    "Weekly workout plan for your goal, sport and equipment",
    "Recovery map and muscle balance on your own body",
    "Your week in 3D: a recap video and share cards",
    "Learn what every muscle does, with a quiz",
  ],
  recentChanges:
    SCRAPED_ML?.recentChanges ||
    "1.0.0 — first release. 3D exercise library, camera rep counter, workout planner, recovery map, muscle balance, week recap video, anatomy quiz and gym tools.",
  recentReviews: SCRAPED_ML?.recentReviews,
};

// Manually curated App Store links, keyed by slug prefix. Play Store data is
// re-scraped on every build (overwriting data/playstore.json), so iOS links
// can't live in the JSON — they're pinned here and merged onto matching apps.
// Add a new app: paste its App Store URL against the Play Store slug prefix.
const IOS_LINKS: Array<{ prefix: string; url: string }> = [
  {
    prefix: "go-viral-ai",
    url: "https://apps.apple.com/us/app/go-viral-ai-get-more-views/id6784648543",
  },
  {
    prefix: "truecheck",
    url: "https://apps.apple.com/us/app/truecheck-ai-verify-fact/id6785342221",
  },
  {
    prefix: "real-or-ai",
    url: "https://apps.apple.com/us/app/real-or-ai-ai-detector/id6786508103",
  },
  {
    prefix: "artanimator",
    url: "https://apps.apple.com/us/app/art-animator/id6791156107",
  },
];

function withIosLink(app: AppEntry): AppEntry {
  const url = IOS_LINKS.find((l) => app.slug.startsWith(l.prefix))?.url;
  return url ? { ...app, appStoreUrl: url } : app;
}

export const ANDROID_APPS: AppEntry[] = [
  MUSCLELIT,
  REMOTE_MOUSE_PRO,
  ...PLAYSTORE_APPS.filter(
    (a) => !a.slug.startsWith("remote-mouse-pro") && !a.slug.startsWith("musclelit"),
  ),
].map(withIosLink);

export const WINDOWS_APPS: AppEntry[] = ([
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
    title: "Phone Mouse · Server",
    summary:
      "The PC half of Phone Mouse. Lives in your tray, broadcasts on your LAN.",
    accentTint: "amber",
    featured: true,
    free: true,
    version: "0.2.2",
    updatedDate: "Aug 12, 2026",
    sizeMb: 8.53,
    sha256: "c238da68db0b43c5c582a2fdc443b0d7f786d4c7317dea79bddad127837a1295",
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
      "0.2.2 — rebranded to Phone Mouse. Same LAN-only tray server: first-run onboarding with Play Store QR + live pair-PIN, multi-monitor + DPI awareness, foreground-window tracking, file pull, snippet capture, and voice macros under the hood.",
  },
] as AppEntry[]).map(withIosLink);

export function getApp(platform: Platform, slug: string): AppEntry | undefined {
  const list = platform === "android" ? ANDROID_APPS : WINDOWS_APPS;
  return list.find((a) => a.slug === slug);
}

export function appHref(app: AppEntry): string {
  return app.customPath ?? `/apps/${app.platform}/${app.slug}/`;
}
