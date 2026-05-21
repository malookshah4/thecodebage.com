import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "LifeOS — Terms of Service",
  description:
    "Terms of service for LifeOS for Windows. Free, open-source. No license fee, no warranty.",
  alternates: { canonical: "https://lifeos.thecodebage.com/terms/" },
};

const LAST_UPDATED = "May 21, 2026";

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
          <strong>LifeOS</strong>, the free, open-source Windows desktop
          application published by <strong>thecodebage</strong> (&ldquo;we&rdquo;,
          &ldquo;us&rdquo;). By installing, opening, or using LifeOS you agree
          to these Terms. If you do not agree, do not use LifeOS.
        </p>

        <h2>1. Free software</h2>
        <p>
          LifeOS is provided <strong>free of charge</strong>, with all features
          unlocked. There is no license fee, subscription, trial period, device
          limit, or account requirement. Source code is published on GitHub
          under the project&rsquo;s open-source license — see the repository
          for the specific license text that governs your use, modification,
          and redistribution rights.
        </p>

        <h2>2. Acceptable use</h2>
        <p>You agree not to:</p>
        <ul>
          <li>Use LifeOS to index screen or audio on devices you do not own or do not have explicit permission to use</li>
          <li>Use LifeOS to index content where local law requires consent from other parties you have not obtained consent from</li>
          <li>Misrepresent your modified or redistributed builds as official thecodebage releases</li>
        </ul>

        <h2>3. Consent and your responsibility</h2>
        <p>
          LifeOS indexes audio and screen content on your own machine at your
          direction, for your own personal recall. <strong>You are solely
          responsible</strong> for complying with all laws in your jurisdiction
          regarding consent of any third parties whose voice or likeness may be
          incidentally indexed, employee privacy, and any applicable
          workplace policies. We provide the tool; how you use it is on you.
        </p>

        <h2>4. Updates and feature changes</h2>
        <p>
          We may release updates that fix bugs, improve functionality, or change
          LifeOS. We may add, change, or remove features at any time. As free
          software, no specific feature is guaranteed across versions.
        </p>

        <h2>5. Intellectual property</h2>
        <p>
          The LifeOS name, logos, and branding belong to thecodebage. The
          source code is published under the open-source license stated in the
          GitHub repository. These Terms do not transfer ownership of the
          marks. Use of the LifeOS name or logos for redistributed builds
          requires written permission.
        </p>

        <h2>6. Disclaimer of warranties</h2>
        <p>
          LIFEOS IS PROVIDED &ldquo;AS IS&rdquo; AND &ldquo;AS AVAILABLE&rdquo;
          WITHOUT WARRANTY OF ANY KIND, EXPRESS OR IMPLIED, INCLUDING WITHOUT
          LIMITATION ANY IMPLIED WARRANTIES OF MERCHANTABILITY, FITNESS FOR A
          PARTICULAR PURPOSE, OR NON-INFRINGEMENT. WE DO NOT WARRANT THAT LIFEOS
          WILL BE UNINTERRUPTED, ERROR-FREE, OR FREE OF HARMFUL COMPONENTS, OR
          THAT ANY DEFECTS WILL BE CORRECTED.
        </p>

        <h2>7. Limitation of liability</h2>
        <p>
          TO THE MAXIMUM EXTENT PERMITTED BY APPLICABLE LAW, IN NO EVENT WILL
          THECODEBAGE BE LIABLE FOR ANY INDIRECT, INCIDENTAL, SPECIAL,
          CONSEQUENTIAL, OR PUNITIVE DAMAGES, OR ANY LOSS OF PROFITS, REVENUE,
          DATA, OR USE, ARISING OUT OF OR RELATED TO THESE TERMS OR LIFEOS. AS
          LIFEOS IS FREE SOFTWARE, OUR TOTAL LIABILITY ARISING OUT OF OR
          RELATING TO LIFEOS IS ZERO.
        </p>

        <h2>8. Indemnification</h2>
        <p>
          You agree to indemnify, defend, and hold harmless thecodebage from any
          claims, liabilities, damages, losses, and expenses (including reasonable
          attorneys&rsquo; fees) arising out of your misuse of LifeOS or
          violation of these Terms — including any claim arising from your
          indexing of third parties without lawful basis.
        </p>

        <h2>9. Termination</h2>
        <p>
          You may stop using LifeOS at any time by uninstalling it. Your local
          indexed data remains under your control.
        </p>

        <h2>10. Changes to these Terms</h2>
        <p>
          We may update these Terms from time to time. The &ldquo;Last
          updated&rdquo; date above reflects the most recent version. Continued
          use of LifeOS after a change means you accept the revised Terms.
        </p>

        <h2>11. Governing law</h2>
        <p>
          These Terms are governed by the laws of the jurisdiction in which
          thecodebage is established, without regard to its conflict of laws
          rules. Disputes will be resolved in the courts of that jurisdiction,
          except where applicable consumer-protection law gives you the right to
          bring a claim where you live.
        </p>

        <h2>12. Contact</h2>
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
