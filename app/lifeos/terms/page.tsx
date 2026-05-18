import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "LifeOS — Terms of Service",
  description:
    "Terms of service for LifeOS for Windows. Perpetual license, 2-device limit, 14-day refund window.",
  alternates: { canonical: "https://lifeos.thecodebage.com/terms/" },
};

const LAST_UPDATED = "May 17, 2026";

export default function LifeOSTermsPage() {
  return (
    <article className="mx-auto max-w-3xl px-6 py-16 sm:py-24">
      <header className="mb-12 border-b border-zinc-200 pb-8">
        <div className="hub-mono text-[11px] uppercase text-[color:var(--ink-muted)]">
          LifeOS for Windows
        </div>
        <h1 className="mt-3 text-4xl font-semibold tracking-tight text-zinc-900 sm:text-5xl">
          Terms of Service
        </h1>
        <p className="mt-4 text-sm text-zinc-500">Last updated: {LAST_UPDATED}</p>
      </header>

      <div className="prose prose-zinc max-w-none text-zinc-700 [&_h2]:mt-12 [&_h2]:text-2xl [&_h2]:font-semibold [&_h2]:tracking-tight [&_h2]:text-zinc-900 [&_p]:mt-4 [&_p]:leading-relaxed [&_ul]:mt-4 [&_ul]:list-disc [&_ul]:pl-6 [&_ul]:space-y-2 [&_li]:leading-relaxed [&_a]:text-primary [&_a]:underline [&_a]:underline-offset-2 hover:[&_a]:text-primary/80 [&_strong]:font-semibold [&_strong]:text-zinc-900">
        <p>
          These Terms of Service (&ldquo;Terms&rdquo;) govern your use of{" "}
          <strong>LifeOS</strong>, the Windows desktop application published by{" "}
          <strong>thecodebage</strong> (&ldquo;we&rdquo;, &ldquo;us&rdquo;).
          By installing, opening, or using LifeOS you agree to these Terms. If you do
          not agree, do not use LifeOS.
        </p>

        <h2>1. License grant</h2>
        <p>
          Subject to these Terms and to payment of any applicable fee, we grant
          you a personal, non-exclusive, non-transferable, revocable license to
          install and run LifeOS on devices you own or control, for your personal
          or internal business use.
        </p>
        <p>
          The <strong>LifeOS Pro</strong> license is a one-time, perpetual license
          covering up to <strong>2 active devices</strong> at a time. You may
          deactivate the license on one device and reactivate on another from
          inside the app (<em>Settings → License → Deactivate this device</em>).
          Free updates are included for the major version you purchased; future
          major versions may require a paid upgrade.
        </p>

        <h2>2. Free trial</h2>
        <p>
          LifeOS includes a <strong>7-day free trial</strong> with all Pro
          features unlocked. No payment information is required to start the
          trial. After the trial period ends, indexing and AI features lock until
          you activate a Pro license; data indexed during the trial remains
          accessible.
        </p>

        <h2>3. Acceptable use</h2>
        <p>You agree not to:</p>
        <ul>
          <li>Use LifeOS to index screen or audio on devices you do not own or do not have explicit permission to use</li>
          <li>Use LifeOS to index content where local law requires consent from other parties you have not obtained consent from</li>
          <li>Reverse-engineer, decompile, or disassemble LifeOS, except where applicable law expressly permits it</li>
          <li>Resell, redistribute, sublicense, or commercially host LifeOS or any license key without written permission</li>
          <li>Bypass or attempt to bypass the license verification, device-limit, or update mechanisms</li>
          <li>Share a single license key with users beyond your own devices</li>
        </ul>

        <h2>4. Payments and refunds</h2>
        <p>
          Payments are processed by <strong>Polar Software Inc.</strong> Pricing,
          taxes, and supported payment methods shown at checkout control.
        </p>
        <p>
          You may request a full refund within <strong>14 days</strong> of
          purchase, for any reason, by emailing{" "}
          <a href="mailto:support@thecodebage.com">support@thecodebage.com</a> with
          your Polar order ID. Upon refund, your license key is revoked and Pro
          features lock on next re-check; your local indexed data is not
          touched.
        </p>

        <h2>5. Consent and your responsibility</h2>
        <p>
          LifeOS indexes audio and screen content on your own machine at your
          direction, for your own personal recall. <strong>You are solely
          responsible</strong> for complying with all laws in your jurisdiction
          regarding consent of any third parties whose voice or likeness may be
          incidentally indexed, employee privacy, and any applicable
          workplace policies. We provide the tool; how you use it is on you.
        </p>

        <h2>6. Updates and feature changes</h2>
        <p>
          We may release updates that fix bugs, improve functionality, or change
          LifeOS. We may add, change, or remove features at any time. Material
          removals from paid Pro features within the major version you purchased
          will be communicated in-app where practical.
        </p>

        <h2>7. Intellectual property</h2>
        <p>
          LifeOS, including its name, logos, source code, designs, and content, is
          owned by thecodebage and protected by copyright, trademark, and other
          laws. These Terms do not transfer any ownership rights to you.
        </p>

        <h2>8. Disclaimer of warranties</h2>
        <p>
          LIFEOS IS PROVIDED &ldquo;AS IS&rdquo; AND &ldquo;AS AVAILABLE&rdquo;
          WITHOUT WARRANTY OF ANY KIND, EXPRESS OR IMPLIED, INCLUDING WITHOUT
          LIMITATION ANY IMPLIED WARRANTIES OF MERCHANTABILITY, FITNESS FOR A
          PARTICULAR PURPOSE, OR NON-INFRINGEMENT. WE DO NOT WARRANT THAT LIFEOS
          WILL BE UNINTERRUPTED, ERROR-FREE, OR FREE OF HARMFUL COMPONENTS, OR
          THAT ANY DEFECTS WILL BE CORRECTED.
        </p>

        <h2>9. Limitation of liability</h2>
        <p>
          TO THE MAXIMUM EXTENT PERMITTED BY APPLICABLE LAW, IN NO EVENT WILL
          THECODEBAGE BE LIABLE FOR ANY INDIRECT, INCIDENTAL, SPECIAL,
          CONSEQUENTIAL, OR PUNITIVE DAMAGES, OR ANY LOSS OF PROFITS, REVENUE,
          DATA, OR USE, ARISING OUT OF OR RELATED TO THESE TERMS OR LIFEOS. OUR
          TOTAL LIABILITY ARISING OUT OF OR RELATING TO LIFEOS WILL NOT EXCEED
          THE AMOUNT YOU PAID FOR THE LICENSE IN THE TWELVE MONTHS PRECEDING THE
          CLAIM.
        </p>

        <h2>10. Indemnification</h2>
        <p>
          You agree to indemnify, defend, and hold harmless thecodebage from any
          claims, liabilities, damages, losses, and expenses (including reasonable
          attorneys&rsquo; fees) arising out of your misuse of LifeOS or
          violation of these Terms — including any claim arising from your
          indexing of third parties without lawful basis.
        </p>

        <h2>11. Termination</h2>
        <p>
          You may stop using LifeOS at any time by uninstalling it. We may
          suspend or revoke your license at any time, with or without notice, if
          we reasonably believe you have violated these Terms or for security or
          legal reasons. Upon termination you must uninstall LifeOS; your local
          indexed data remains under your control.
        </p>

        <h2>12. Changes to these Terms</h2>
        <p>
          We may update these Terms from time to time. The &ldquo;Last
          updated&rdquo; date above reflects the most recent version. Continued
          use of LifeOS after a change means you accept the revised Terms.
        </p>

        <h2>13. Governing law</h2>
        <p>
          These Terms are governed by the laws of the jurisdiction in which
          thecodebage is established, without regard to its conflict of laws
          rules. Disputes will be resolved in the courts of that jurisdiction,
          except where applicable consumer-protection law gives you the right to
          bring a claim where you live.
        </p>

        <h2>14. Contact</h2>
        <p>
          Questions about these Terms?{" "}
          <a href="mailto:support@thecodebage.com">support@thecodebage.com</a>.
        </p>

        <p className="mt-12 text-sm text-zinc-500">
          See also: <Link href="https://lifeos.thecodebage.com/privacy/">LifeOS Privacy Policy</Link>.
        </p>
      </div>
    </article>
  );
}
