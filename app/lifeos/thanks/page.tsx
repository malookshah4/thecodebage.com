import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Thanks for buying LifeOS Pro",
  description:
    "Your LifeOS Pro purchase is confirmed. Find your license key in the Polar receipt email and activate inside the app.",
  alternates: { canonical: "https://lifeos.thecodebage.com/thanks/" },
  robots: { index: false, follow: false },
};

export default function ThanksPage() {
  return (
    <article className="mx-auto max-w-3xl px-6 py-20 sm:py-28">
      <header className="mb-10 border-b border-zinc-200 pb-8">
        <div className="hub-mono text-[11px] uppercase text-[color:var(--ink-muted)]">
          ✓ Payment received
        </div>
        <h1 className="mt-3 text-4xl font-semibold tracking-tight text-zinc-900 sm:text-5xl">
          Thanks for buying LifeOS Pro.
        </h1>
        <p className="mt-4 text-lg leading-relaxed text-zinc-600">
          Your lifetime license is on its way to your inbox right now.
        </p>
      </header>

      <section className="space-y-10 text-zinc-700">
        <div>
          <h2 className="text-2xl font-semibold tracking-tight text-zinc-900">
            1. Find your license key
          </h2>
          <p className="mt-3 leading-relaxed">
            Polar just emailed you a receipt with your license key — format{" "}
            <span className="font-mono text-zinc-900">LIFEOS-XXXX-XXXX-XXXX-XXXX</span>.
            Subject line is &ldquo;Your LifeOS Pro license&rdquo;. If it&rsquo;s not in
            your inbox within a couple of minutes, check Spam or Promotions.
          </p>
        </div>

        <div>
          <h2 className="text-2xl font-semibold tracking-tight text-zinc-900">
            2. Install LifeOS (if you haven&rsquo;t)
          </h2>
          <p className="mt-3 leading-relaxed">
            Already running the trial? Skip to step 3. Otherwise grab the installer:
          </p>
          <div className="mt-5">
            <Link
              href="/lifeos/#download"
              className="inline-flex items-center gap-2 rounded-full bg-[color:var(--hub-accent)] px-6 py-3 text-[15px] font-medium text-white"
            >
              Download LifeOS for Windows
            </Link>
          </div>
        </div>

        <div>
          <h2 className="text-2xl font-semibold tracking-tight text-zinc-900">
            3. Activate inside the app
          </h2>
          <ol className="mt-3 list-decimal space-y-2 pl-6 leading-relaxed">
            <li>Open LifeOS.</li>
            <li>Go to <strong>Settings → License</strong>.</li>
            <li>Paste your key and click <strong>Activate</strong>.</li>
            <li>Pro features unlock instantly. Your local data is untouched.</li>
          </ol>
          <p className="mt-4 text-sm text-zinc-500">
            Your license unlocks up to 2 devices. Need to swap machines later? Click{" "}
            <em>Deactivate this device</em> first, then activate on the new one.
          </p>
        </div>

        <div className="rounded-2xl border border-zinc-200 bg-zinc-50 p-6">
          <h3 className="text-lg font-semibold text-zinc-900">Something off?</h3>
          <p className="mt-2 text-zinc-600">
            No email after 10 minutes, or activation throws an error? Forward your Polar
            receipt to{" "}
            <a
              href="mailto:lifeos@thecodebage.com"
              className="text-primary underline underline-offset-2"
            >
              lifeos@thecodebage.com
            </a>
            {" "}and I&rsquo;ll sort it out same day.
          </p>
        </div>

        <div className="flex flex-wrap gap-3 pt-2">
          <a
            href="https://thecodebage.com/support/"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 rounded-full border border-[color:var(--line-strong)] px-5 py-2.5 text-sm font-medium hover:bg-[color:var(--chip-bg)]"
          >
            Support &amp; FAQ ↗
          </a>
          <Link
            href="/lifeos/"
            className="inline-flex items-center gap-2 rounded-full border border-[color:var(--line-strong)] px-5 py-2.5 text-sm font-medium hover:bg-[color:var(--chip-bg)]"
          >
            Back to LifeOS
          </Link>
        </div>
      </section>
    </article>
  );
}
