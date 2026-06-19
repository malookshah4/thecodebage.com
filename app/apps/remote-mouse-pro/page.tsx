import type { Metadata } from "next";
import Link from "next/link";
import Image from "next/image";
import { PhoneSlider } from "@/components/site/phone-slider";
import { buttonVariants } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { cn } from "@/lib/utils";
import { getApp } from "@/lib/apps";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";

export const metadata: Metadata = {
  title: "Remote Mouse Pro â€” Use your full PC from your phone",
  description:
    "Turn your Android phone into a wireless trackpad, keyboard, voice macro pad, OCR scanner, and snippet manager for your Windows PC. LAN-only. Privacy-first. By codeBage.",
  alternates: { canonical: "/apps/remote-mouse-pro/" },
};

const APP_VERSION = "0.2.1"; // display only — download URL tracks latest release
const EXE_URL =
  "https://github.com/malookshah4/remotmouse/releases/latest/download/RemotMouseSetup.exe";
const PLAY_URL =
  "https://play.google.com/store/apps/details?id=com.codebage.remotemousepro";

const FEATURES = [
  {
    title: "Smooth touchpad",
    body: "Multi-touch trackpad with two-finger scroll, right-click tap, and tunable sensitivity. Feels native because it reports straight to Windows input.",
  },
  {
    title: "Full keyboard",
    body: "Type on your phone â€” keystrokes hit your PC instantly. Modifier chord support (Ctrl+Shift+T, Alt+F4, etc.) and a function-key strip.",
  },
  {
    title: "Voice macros",
    body: "Long-press a button and say a phrase to fire a custom keystroke combo. Speech is processed on-device â€” audio never leaves your phone.",
  },
  {
    title: "OCR text scan",
    body: "Point at any printed text â€” book page, screen, sticky note â€” and Remote Mouse Pro extracts it on-device and pastes it on your PC.",
  },
  {
    title: "Snippet manager",
    body: "Save frequently-used text â€” emails, addresses, code blocks â€” and paste them on your PC with one tap.",
  },
  {
    title: "File transfer",
    body: "Drop a file from your phone straight into the focused window on your PC. Works the other direction too.",
  },
];

const FAQ = [
  {
    q: "Do I need an internet connection?",
    a: "No. Remote Mouse Pro works entirely over your local Wi-Fi network. Nothing flows through our servers â€” we don't run any.",
  },
  {
    q: "Is the connection secure?",
    a: "Yes. The phone-to-PC channel is TLS over WebSocket with certificate pinning after the first pairing. The app warns you if your PC's certificate fingerprint changes.",
  },
  {
    q: "Which Windows versions are supported?",
    a: "Windows 10 (1909+) and Windows 11. ARM64 Windows builds are coming.",
  },
  {
    q: "Is my data sent anywhere?",
    a: "No analytics, no telemetry, no third-party SDKs. OCR images and voice audio are processed on-device and discarded immediately. See the privacy policy for the full breakdown.",
  },
  {
    q: "How does the Pro free trial work?",
    a: "3-day free trial via Google Play. You're not charged until the trial ends, and you can cancel anytime through your Google Play subscriptions.",
  },
  {
    q: "Will I be charged after the trial?",
    a: "Yes â€” unless you cancel before the trial ends. The first paid period kicks in automatically (monthly: $1.99, yearly: $14.99). Cancel from Google Play subscriptions and you keep Pro features through the end of the trial with no charge.",
  },
  {
    q: "Can I use the free tier forever?",
    a: "Yes. Touchpad and keyboard are free forever. Voice macros, OCR scan, snippets, and file transfer are Pro-only.",
  },
];

export default function RemoteMouseProPage() {
  const app = getApp("android", "remote-mouse-pro");
  const iconSrc = app?.iconUrl ?? "/favicon.png";
  // Play scraper returns a wide feature/banner image at index 0 â€” drop it
  // when real phone shots follow.
  const allShots = app?.screenshots ?? [];
  const phoneShots = allShots.length > 1 ? allShots.slice(1) : allShots;
  return (
    <>
      {/* Hero */}
      <section className="border-b border-zinc-200/80">
        <div className="mx-auto grid max-w-6xl gap-12 px-6 py-20 sm:py-28 lg:grid-cols-2 lg:items-center lg:gap-16">
          <div className="flex flex-col items-start gap-6">
            <Badge variant="secondary" className="rounded-full px-3 py-1 text-xs font-medium">
              By codeBage Â· v{APP_VERSION}
            </Badge>
            <h1 className="text-balance text-5xl font-semibold leading-[1.05] tracking-tight text-zinc-900 sm:text-6xl">
              Use your full PC from your phone.
            </h1>
            <p className="max-w-xl text-lg leading-relaxed text-zinc-600 sm:text-xl">
              Trackpad, keyboard, voice macros, OCR scanner, and snippet manager â€” all
              over your local Wi-Fi. No internet round-trip. No data collection.
              Privacy by design.
            </p>
            <div className="mt-2 flex flex-col gap-3 sm:flex-row">
              <a
                href={PLAY_URL}
                target="_blank"
                rel="noopener noreferrer"
                className={cn(buttonVariants({ size: "lg" }))}
              >
                Get on Google Play
              </a>
              <a
                href={EXE_URL}
                className={cn(buttonVariants({ size: "lg", variant: "outline" }))}
              >
                Download Windows server
              </a>
            </div>
            <p className="text-xs text-zinc-500">
              Windows server is required and free. Phone app handles control + Pro
              features. Pro trial is 3 days, billed by Google Play.
            </p>
            <div className="mt-3 rounded-lg border border-amber-200 bg-amber-50/60 px-3 py-2.5 text-xs leading-relaxed text-amber-900">
              <strong className="font-semibold">First-time install heads-up.</strong>{" "}
              Windows shows <em>&ldquo;Windows protected your PC&rdquo;</em> and
              Chrome may scan the file â€” we&rsquo;re not code-signed yet. Click
              <strong> More info â†’ Run anyway</strong> on the Windows dialog. The
              installer is the exact file linked above from the GitHub release â€”
              SHA-256 starts with <code className="rounded bg-amber-100 px-1">b0468234â€¦</code>.
            </div>
          </div>

          <div className="flex justify-center lg:justify-end">
            {phoneShots.length > 0 ? (
              <div className="relative aspect-[9/19.5] w-full max-w-[320px] overflow-hidden rounded-3xl border border-zinc-200 bg-zinc-900 shadow-md">
                <PhoneSlider
                  screenshots={phoneShots}
                  alt="Remote Mouse Pro"
                  sizes="(min-width: 1024px) 320px, 80vw"
                />
              </div>
            ) : (
              <div className="relative aspect-[3/4] w-full max-w-sm rounded-3xl border border-zinc-200 bg-gradient-to-b from-zinc-50 to-white p-8 shadow-sm">
                <div className="flex h-full flex-col items-center justify-center text-center">
                  <Image
                    src={iconSrc}
                    alt="Remote Mouse Pro"
                    width={120}
                    height={120}
                    className="rounded-3xl shadow-md"
                    priority
                  />
                  <p className="mt-6 text-sm font-medium text-zinc-900">Remote Mouse Pro</p>
                  <p className="mt-1 text-xs text-zinc-500">v{APP_VERSION}</p>
                </div>
              </div>
            )}
          </div>
        </div>
      </section>

      {/* Features */}
      <section>
        <div className="mx-auto max-w-6xl px-6 py-20 sm:py-28">
          <div className="mb-12 max-w-2xl">
            <h2 className="text-3xl font-semibold tracking-tight text-zinc-900 sm:text-4xl">
              Everything you need.
              <br />
              Nothing you don&rsquo;t.
            </h2>
            <p className="mt-4 text-zinc-600">
              Six focused tools that work together â€” each one designed to disappear into
              your workflow.
            </p>
          </div>

          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {FEATURES.map((f) => (
              <Card key={f.title} className="border-zinc-200">
                <CardHeader>
                  <CardTitle className="text-lg">{f.title}</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-zinc-600 leading-relaxed">{f.body}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Desktop server preview */}
      <section className="border-t border-zinc-200/80 bg-zinc-50/40">
        <div className="mx-auto grid max-w-6xl gap-12 px-6 py-20 sm:py-28 lg:grid-cols-[1fr_1.1fr] lg:items-center lg:gap-16">
          <div>
            <Badge variant="secondary" className="rounded-full px-3 py-1 text-xs font-medium">
              Windows Â· v{APP_VERSION}
            </Badge>
            <h2 className="mt-4 text-balance text-3xl font-semibold tracking-tight text-zinc-900 sm:text-4xl">
              Lives in your tray. Stays out of the way.
            </h2>
            <p className="mt-4 text-zinc-600 leading-relaxed">
              First launch opens a small companion window â€” a QR for the Android
              app, install steps, and a live pair-PIN that lights up the moment
              your phone touches the server. Auto-closes 3 seconds after the
              first connect. After that, just a tray icon.
            </p>
            <ul className="mt-6 space-y-3 text-sm text-zinc-600">
              <li className="flex items-start gap-2.5">
                <span className="mt-1.5 inline-block size-1.5 shrink-0 rounded-full bg-primary" />
                <span>Tray-resident. Near-zero CPU at idle.</span>
              </li>
              <li className="flex items-start gap-2.5">
                <span className="mt-1.5 inline-block size-1.5 shrink-0 rounded-full bg-primary" />
                <span>Auto-discovery on your LAN â€” phone finds the PC by itself.</span>
              </li>
              <li className="flex items-start gap-2.5">
                <span className="mt-1.5 inline-block size-1.5 shrink-0 rounded-full bg-primary" />
                <span>Pair-by-PIN once. No accounts, no cloud, no telemetry.</span>
              </li>
              <li className="flex items-start gap-2.5">
                <span className="mt-1.5 inline-block size-1.5 shrink-0 rounded-full bg-primary" />
                <span>All input goes through native Windows APIs.</span>
              </li>
            </ul>
            <div className="mt-7 flex flex-col gap-3 sm:flex-row">
              <a
                href={EXE_URL}
                className={cn(buttonVariants({ size: "lg" }))}
              >
                Download Windows server
              </a>
              <span className="self-center text-xs text-zinc-500">
                Windows 10 / 11 Â· 64-bit Â· ~7.2 MB
              </span>
            </div>
          </div>
          <div className="flex justify-center lg:justify-end">
            <div className="relative w-full max-w-[480px] overflow-hidden rounded-2xl border border-zinc-200 bg-white shadow-md">
              <Image
                src="/screenshots/server-onboarding.png"
                alt="Remote Mouse Pro server â€” first-run companion window"
                width={1280}
                height={1720}
                className="h-auto w-full"
              />
            </div>
          </div>
        </div>
      </section>

      {/* How it works */}
      <section className="border-y border-zinc-200/80 bg-zinc-50/50">
        <div className="mx-auto max-w-5xl px-6 py-20 sm:py-28">
          <h2 className="text-3xl font-semibold tracking-tight text-zinc-900 sm:text-4xl">
            How it works
          </h2>
          <div className="mt-10 grid gap-8 sm:grid-cols-3">
            <div>
              <div className="text-sm font-medium text-primary">Step 1</div>
              <h3 className="mt-2 text-lg font-semibold text-zinc-900">
                Install the PC server
              </h3>
              <p className="mt-2 text-zinc-600 leading-relaxed">
                Run the Windows installer on your PC. The server lives in the system
                tray and broadcasts itself on your Wi-Fi network.
              </p>
            </div>
            <div>
              <div className="text-sm font-medium text-primary">Step 2</div>
              <h3 className="mt-2 text-lg font-semibold text-zinc-900">
                Install the phone app
              </h3>
              <p className="mt-2 text-zinc-600 leading-relaxed">
                Get Remote Mouse Pro from the Google Play Store. Open it on a phone that
                shares the same Wi-Fi network as your PC.
              </p>
            </div>
            <div>
              <div className="text-sm font-medium text-primary">Step 3</div>
              <h3 className="mt-2 text-lg font-semibold text-zinc-900">
                Pair via PIN
              </h3>
              <p className="mt-2 text-zinc-600 leading-relaxed">
                Tap your PC in the discovery list, enter the 6-digit PIN shown by the
                tray icon, and you&rsquo;re paired. The app remembers your PC after that.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Pricing */}
      <section>
        <div className="mx-auto max-w-5xl px-6 py-20 sm:py-28">
          <div className="mb-12 text-center">
            <h2 className="text-3xl font-semibold tracking-tight text-zinc-900 sm:text-4xl">
              Pricing
            </h2>
            <p className="mt-3 text-zinc-600">
              Free forever for the basics. Pro unlocks the power tools.
            </p>
          </div>

          <div className="grid gap-6 sm:grid-cols-2">
            <Card className="border-zinc-200">
              <CardHeader>
                <CardTitle className="text-2xl">Free</CardTitle>
                <CardDescription>For casual use</CardDescription>
                <div className="mt-4">
                  <span className="text-4xl font-semibold tracking-tight">$0</span>
                  <span className="ml-2 text-zinc-500">forever</span>
                </div>
              </CardHeader>
              <CardContent>
                <ul className="space-y-3 text-sm text-zinc-700">
                  <li>âœ“ Touchpad with multi-touch</li>
                  <li>âœ“ Full keyboard</li>
                  <li>âœ“ Pair unlimited PCs</li>
                  <li>âœ“ All updates</li>
                </ul>
              </CardContent>
            </Card>

            <Card className="border-2 border-primary shadow-md">
              <CardHeader>
                <div className="mb-2 flex items-center gap-2">
                  <CardTitle className="text-2xl">Pro</CardTitle>
                  <Badge>3-day free trial</Badge>
                </div>
                <CardDescription>For power users</CardDescription>
                <div className="mt-4 space-y-1">
                  <div>
                    <span className="text-4xl font-semibold tracking-tight">$1.99</span>
                    <span className="ml-2 text-zinc-500">/ month</span>
                  </div>
                  <div className="text-sm text-zinc-500">
                    or <strong className="text-zinc-900">$14.99/year</strong> â€” save 37%
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <ul className="space-y-3 text-sm text-zinc-700">
                  <li>âœ“ Everything in Free</li>
                  <li>âœ“ Voice macros</li>
                  <li>âœ“ OCR text scan</li>
                  <li>âœ“ Snippet manager</li>
                  <li>âœ“ File transfer</li>
                  <li>âœ“ Priority support</li>
                </ul>
              </CardContent>
            </Card>
          </div>

          <p className="mt-8 text-center text-xs text-zinc-500">
            Subscriptions billed by Google Play. Cancel anytime in your Play Store
            subscriptions.
          </p>
        </div>
      </section>

      {/* FAQ */}
      <section className="border-t border-zinc-200/80 bg-zinc-50/50">
        <div className="mx-auto max-w-3xl px-6 py-20 sm:py-28">
          <h2 className="text-3xl font-semibold tracking-tight text-zinc-900 sm:text-4xl">
            Common questions
          </h2>
          <Accordion className="mt-10 w-full">
            {FAQ.map((item, i) => (
              <AccordionItem key={i} value={`item-${i}`}>
                <AccordionTrigger className="text-left text-base font-medium text-zinc-900 hover:no-underline">
                  {item.q}
                </AccordionTrigger>
                <AccordionContent className="text-zinc-600 leading-relaxed">
                  {item.a}
                </AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
          <Separator className="my-10" />
          <div className="text-center">
            <p className="text-zinc-600">Need help that isn&rsquo;t covered above?</p>
            <Link
              href="/support/"
              className={cn(buttonVariants({ className: "mt-4" }))}
            >
              Visit support
            </Link>
          </div>
        </div>
      </section>

      {/* Final CTA */}
      <section>
        <div className="mx-auto max-w-3xl px-6 py-20 text-center sm:py-28">
          <h2 className="text-balance text-4xl font-semibold tracking-tight text-zinc-900 sm:text-5xl">
            Ready to get your phone working as hard as your PC?
          </h2>
          <div className="mt-8 flex flex-col items-center justify-center gap-3 sm:flex-row">
            <a
              href={PLAY_URL}
              target="_blank"
              rel="noopener noreferrer"
              className={cn(buttonVariants({ size: "lg" }))}
            >
              Get on Google Play
            </a>
            <a
              href={EXE_URL}
              className={cn(buttonVariants({ size: "lg", variant: "outline" }))}
            >
              Download Windows server
            </a>
          </div>
        </div>
      </section>
    </>
  );
}
