import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "LifeOS — Privacy Policy",
  description:
    "Privacy policy for the LifeOS Windows app. Free, local-first. Indexed data stays on your PC; no mandatory outbound traffic, no telemetry, no account.",
  alternates: { canonical: "https://lifeos.thecodebage.com/privacy/" },
};

const LAST_UPDATED = "May 21, 2026";
const EFFECTIVE = "May 21, 2026";

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
          This policy describes how <strong>LifeOS</strong>, the free,
          open-source Windows desktop app published by <strong>thecodebage</strong>,
          handles your information. LifeOS is designed local-first: it indexes
          and answers questions across your own screen, voice, and system audio —
          entirely on your PC. You control what is indexed; you can pause or
          wipe at any time.
        </p>

        <h2>1. What LifeOS indexes on your machine</h2>
        <p>When you grant the relevant Windows permissions, LifeOS may read and index, locally:</p>
        <ul>
          <li>Frames of your own display (used for OCR text extraction)</li>
          <li>Your microphone input (used for Whisper transcription)</li>
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
          <strong>Nothing, by default.</strong> LifeOS makes zero mandatory
          outbound network calls. No license server, no update server, no
          telemetry endpoint. Every call that does happen is recorded in{" "}
          <em>Settings → Network</em> with timestamp, host, and byte count so
          you can verify yourself.
        </p>
        <p>
          The only outbound traffic LifeOS can make is to an{" "}
          <strong>AI endpoint you explicitly configure</strong> (e.g., your own
          local Ollama at <span className="font-mono">127.0.0.1</span>, or a remote
          OpenAI-compatible URL) in <em>Settings → AI</em>. We never default to
          any external AI service.
        </p>
        <p>
          The <strong>Air-gap mode</strong> toggle (<em>Settings → Network</em>) blocks
          every outbound byte unconditionally.
        </p>

        <h2>3. No account, no identifier</h2>
        <p>
          LifeOS does not require an account, email address, or any signup. It
          does not send a hardware identifier, machine ID, MAC address, or IP
          address anywhere — because it does not phone home at all.
        </p>

        <h2>4. Email contact</h2>
        <p>
          When you email{" "}
          <a href="mailto:support@thecodebage.com">support@thecodebage.com</a>,
          your message is forwarded by Cloudflare Email Routing to a private
          inbox we read. We use the contents only to respond and to improve
          the product. We do not add your email to any marketing list.
        </p>

        <h2>5. Crash reports and telemetry</h2>
        <p>
          LifeOS does <strong>not</strong> send crash reports, usage analytics,
          performance traces, or any kind of background telemetry. If you choose
          to send us a log file with a bug report, that&rsquo;s explicit and
          one-time.
        </p>

        <h2>6. Children</h2>
        <p>
          LifeOS is not directed to children under 13. We do not knowingly collect
          personal information from children.
        </p>

        <h2>7. Your rights</h2>
        <p>
          Because virtually all your data stays on your machine, you have direct
          control: open the SQLite file, export, delete, or wipe entirely. For
          any data we do hold (support emails on our side), contact us at{" "}
          <a href="mailto:support@thecodebage.com">support@thecodebage.com</a> for
          access, correction, or deletion under GDPR / CCPA / equivalent law. We
          respond within 30 days.
        </p>

        <h2>8. Changes to this policy</h2>
        <p>
          If we change this policy in a meaningful way, we will update the
          &ldquo;Last updated&rdquo; date and post the change on this page.
        </p>

        <h2>9. Contact</h2>
        <p>
          Privacy questions:{" "}
          <a href="mailto:support@thecodebage.com">support@thecodebage.com</a>.
        </p>

        <p className="mt-12 text-sm text-zinc-500">
          See also: <Link href="https://lifeos.thecodebage.com/terms/">LifeOS Terms of Service</Link> ·{" "}
          <Link href="https://thecodebage.com/privacy/">Website-wide privacy policy</Link>.
        </p>
      </div>
    </article>
  );
}
