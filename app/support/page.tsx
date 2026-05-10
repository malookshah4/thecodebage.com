import type { Metadata } from "next";
import Link from "next/link";
import { buttonVariants } from "@/components/ui/button";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { cn } from "@/lib/utils";

export const metadata: Metadata = {
  title: "Support",
  description:
    "Help, troubleshooting, and FAQ for Remote Mouse Pro. Pairing issues, mDNS discovery, certificate warnings, subscription help.",
};

const FAQS: { q: string; a: string }[] = [
  {
    q: "My phone can't find my PC during pairing.",
    a: "Make sure both devices are on the same Wi-Fi network and that mDNS is allowed by your router. On the PC side, ensure the Remote Mouse Pro server is running (its tray icon should be visible). Windows Firewall must allow the server — if you saw a firewall prompt during install, click Allow access. Some routers (especially mesh systems with client isolation enabled) block device-to-device discovery — disable client isolation or AP isolation in the router settings, or use the manual IP entry fallback inside the app.",
  },
  {
    q: "Pairing PIN keeps timing out.",
    a: "The PIN expires after 30 seconds for security. Click Pair again on the PC tray menu to generate a fresh PIN, then enter it on the phone within the timeout. If your clock is way off on either device, that can also break the verification — sync your time and try again.",
  },
  {
    q: "I get a 'PC identity changed' warning when reconnecting.",
    a: "This means the PC's pinned certificate fingerprint changed since the last time you paired. The most common reason is reinstalling the server or a fresh Windows install. If you expect the change, accept it. If you do not, stop and verify nobody else is impersonating your PC on the same network — pair only after you confirm it is your PC.",
  },
  {
    q: "Mouse / keyboard input feels laggy.",
    a: "First check your Wi-Fi signal on the phone. Latency is dominated by the wireless link. Move closer to the router, switch to 5 GHz Wi-Fi if available, and avoid running large downloads on the same network. Inside the app, lowering touchpad sensitivity slightly can also feel snappier on weaker links.",
  },
  {
    q: "OCR scanned the wrong text or missed lines.",
    a: "Hold the phone steadier, increase lighting, and aim the rectangle exactly around the text you want. The on-device recognizer is best on printed Latin script — handwriting and curved/angled text are limitations of the underlying ML Kit library. Try cropping the rectangle smaller around just the relevant text.",
  },
  {
    q: "Voice macros aren't recognizing my command.",
    a: "Speech recognition uses Android's system speech-to-text. If your device has the offline language pack installed for your language, recognition works without internet. Otherwise it depends on Google's online speech service. Speak in a quiet environment and use the exact macro keyword you configured.",
  },
  {
    q: "How do I cancel my Pro subscription?",
    a: "All Pro subscriptions are billed by Google Play. Open the Google Play Store on your phone → tap your profile picture → Payments and subscriptions → Subscriptions → Remote Mouse Pro → Cancel. Your Pro features keep working until the end of the period you already paid for.",
  },
  {
    q: "I purchased Pro on one device — how do I restore it on another?",
    a: "Sign in to the Google Play Store on the new device with the same Google account that purchased Pro. Open Remote Mouse Pro and tap Restore Purchases in the settings. Pro features unlock automatically once Google Play confirms your subscription.",
  },
  {
    q: "I want a refund.",
    a: "Refunds are handled by Google Play under their refund policy. If you purchased within the last 48 hours you can usually self-refund directly from the Play Store. Beyond that, contact Google Play support. We cannot issue refunds on Google's behalf.",
  },
  {
    q: "Where can I report a bug or request a feature?",
    a: "Email support@thecodebage.com with as much detail as possible: phone model, Android version, Windows version, server version, and what you tried. Screenshots help. We read every message.",
  },
];

export default function SupportPage() {
  return (
    <div className="mx-auto max-w-3xl px-6 py-16 sm:py-24">
      <header className="mb-12 text-center">
        <h1 className="text-4xl font-semibold tracking-tight text-zinc-900 sm:text-5xl">
          Support
        </h1>
        <p className="mt-4 text-lg leading-relaxed text-zinc-600">
          Most questions are answered below. If yours isn&rsquo;t, we read every email.
        </p>
        <div className="mt-8 flex flex-col items-center gap-3 sm:flex-row sm:justify-center">
          <a
            href="mailto:support@thecodebage.com"
            className={cn(buttonVariants({ size: "lg" }))}
          >
            Email support
          </a>
          <span className="text-sm text-zinc-500">
            <a
              href="mailto:support@thecodebage.com"
              className="font-mono hover:text-zinc-900"
            >
              support@thecodebage.com
            </a>
          </span>
        </div>
      </header>

      <section>
        <h2 className="mb-6 text-2xl font-semibold tracking-tight text-zinc-900">
          Frequently asked questions
        </h2>
        <Accordion className="w-full">
          {FAQS.map((item, i) => (
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
      </section>

      <section className="mt-16 rounded-2xl border border-zinc-200 bg-zinc-50 p-8">
        <h3 className="text-lg font-semibold text-zinc-900">Still stuck?</h3>
        <p className="mt-2 text-zinc-600">
          Send us a note. Include your phone model, Android version, Windows version,
          and a description of what happened. Replies usually within 1–2 business days.
        </p>
        <div className="mt-4 flex flex-wrap gap-3">
          <a
            href="mailto:support@thecodebage.com"
            className={cn(buttonVariants())}
          >
            Email support
          </a>
          <Link
            href="/privacy/"
            className={cn(buttonVariants({ variant: "outline" }))}
          >
            Read privacy policy
          </Link>
        </div>
      </section>
    </div>
  );
}
