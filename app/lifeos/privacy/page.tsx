import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "LifeOS — Privacy Policy",
  description:
    "Privacy policy for the LifeOS Windows app. Capture data stays local; only outbound traffic is license re-check and optional version check.",
  alternates: { canonical: "https://lifeos.thecodebage.com/privacy/" },
};

const LAST_UPDATED = "May 17, 2026";
const EFFECTIVE = "May 17, 2026";

export default function LifeOSPrivacyPage() {
  return (
    <article className="mx-auto max-w-3xl px-6 py-16 sm:py-24">
      <header className="mb-12 border-b border-zinc-200 pb-8">
        <div className="hub-mono text-[11px] uppercase text-[color:var(--ink-muted)]">
          LifeOS for Windows
        </div>
        <h1 className="mt-3 text-4xl font-semibold tracking-tight text-zinc-900 sm:text-5xl">
          Privacy Policy
        </h1>
        <p className="mt-4 text-sm text-zinc-500">
          Effective date: {EFFECTIVE} · Last updated: {LAST_UPDATED}
        </p>
      </header>

      <div className="prose prose-zinc max-w-none text-zinc-700 [&_h2]:mt-12 [&_h2]:text-2xl [&_h2]:font-semibold [&_h2]:tracking-tight [&_h2]:text-zinc-900 [&_p]:mt-4 [&_p]:leading-relaxed [&_ul]:mt-4 [&_ul]:list-disc [&_ul]:pl-6 [&_ul]:space-y-2 [&_li]:leading-relaxed [&_a]:text-primary [&_a]:underline [&_a]:underline-offset-2 hover:[&_a]:text-primary/80 [&_strong]:font-semibold [&_strong]:text-zinc-900">
        <p>
          This policy describes how <strong>LifeOS</strong>, the Windows desktop
          app published by <strong>thecodebage</strong>, handles your information.
          LifeOS is designed local-first: it captures, indexes, and answers questions
          across your own screen, microphone, and system audio — entirely on your
          PC.
        </p>

        <h2>1. What LifeOS captures on your machine</h2>
        <p>When you grant the relevant Windows permissions, LifeOS may capture:</p>
        <ul>
          <li>Screenshots of your display (used for OCR text extraction)</li>
          <li>Microphone audio (used for Whisper transcription)</li>
          <li>System / loopback audio (used for Whisper transcription)</li>
          <li>Active window title and process name (used for tagging memory snippets)</li>
        </ul>
        <p>
          These artifacts are stored on your local disk in a SQLite database under
          your Windows user profile. They are <strong>not uploaded</strong> to any
          server, ours or anyone else&rsquo;s. You can browse, delete, or wipe the
          database at any time from <em>Settings → Storage</em>.
        </p>

        <h2>2. What leaves your machine</h2>
        <p>
          By default, LifeOS makes outbound network calls only to the following
          endpoints. Every call is recorded in <em>Settings → Network</em> with
          timestamp, host, and byte count so you can verify yourself.
        </p>
        <ul>
          <li>
            <strong>License server</strong> (<span className="font-mono">api.polar.sh</span>) —
            on activation, on re-validation every 7 days, and on deactivation. The
            request includes a hashed machine identifier and your license key.
          </li>
          <li>
            <strong>Update check</strong> (optional, <span className="font-mono">thecodebage.com</span>) —
            sends only the app version number. Off by default; turn on in
            <em> Settings → Updates</em>.
          </li>
          <li>
            <strong>External AI endpoint</strong> (optional) — only if you
            explicitly configure one (e.g., your own local Ollama or a remote
            OpenAI-compatible URL) in <em>Settings → AI</em>. We never default to
            any external AI service.
          </li>
        </ul>
        <p>
          The <strong>Air-gap mode</strong> toggle (<em>Settings → Network</em>) blocks
          everything except the license re-check, which remains allowed so that
          license revocations propagate.
        </p>

        <h2>3. The hashed machine identifier</h2>
        <p>
          To enforce the device limit on your license (default: 2 devices), LifeOS
          sends a stable but privacy-preserving identifier to the license server.
          We derive it as SHA-256 of your Windows MachineGuid plus an internal
          salt, then truncate. We never send your raw MachineGuid, computer name,
          MAC address, IP address, or any directly identifying hardware data.
        </p>

        <h2>4. Payment processing</h2>
        <p>
          Payments are processed by <strong>Polar Software Inc.</strong> (
          <a href="https://polar.sh/legal/privacy">Polar privacy policy</a>).
          When you purchase LifeOS Pro, your name, email, billing country, and
          payment details are handled by Polar (and Polar&rsquo;s payment processor,
          typically Stripe). We receive a notification of purchase and your
          license key; we do not receive or store your card details.
        </p>

        <h2>5. Email contact</h2>
        <p>
          When you email{" "}
          <a href="mailto:support@thecodebage.com">support@thecodebage.com</a>,
          your message is forwarded by Cloudflare Email Routing to an inbox we
          monitor. We use the contents only to respond and to improve the
          product. We do not add your email to any marketing list.
        </p>

        <h2>6. Crash reports and telemetry</h2>
        <p>
          LifeOS does <strong>not</strong> send crash reports, usage analytics,
          performance traces, or any kind of background telemetry. If you choose
          to send us a log file with a bug report, that&rsquo;s explicit and
          one-time.
        </p>

        <h2>7. Children</h2>
        <p>
          LifeOS is not directed to children under 13. We do not knowingly collect
          personal information from children.
        </p>

        <h2>8. Your rights</h2>
        <p>
          Because virtually all your data stays on your machine, you have direct
          control: open the SQLite file, export, delete, or wipe entirely. For data
          we do hold (license records on the Polar side, support emails on our
          side), contact us at{" "}
          <a href="mailto:support@thecodebage.com">support@thecodebage.com</a> for
          access, correction, or deletion under GDPR / CCPA / equivalent law. We
          respond within 30 days.
        </p>

        <h2>9. Changes to this policy</h2>
        <p>
          If we change this policy in a meaningful way, we will update the
          &ldquo;Last updated&rdquo; date and post the change on this page.
        </p>

        <h2>10. Contact</h2>
        <p>
          Privacy questions:{" "}
          <a href="mailto:support@thecodebage.com">support@thecodebage.com</a>.
        </p>

        <p className="mt-12 text-sm text-zinc-500">
          See also: <Link href="/lifeos/terms/">LifeOS Terms of Service</Link> ·{" "}
          <Link href="/privacy/">Website-wide privacy policy</Link>.
        </p>
      </div>
    </article>
  );
}
