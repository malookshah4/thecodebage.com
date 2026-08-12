import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Terms of Service",
  description: "Terms of service for thecodebage and Phone Mouse.",
  alternates: { canonical: "/terms/" },
};

const LAST_UPDATED = "May 10, 2026";

export default function TermsPage() {
  return (
    <article className="mx-auto max-w-3xl px-6 py-16 sm:py-24">
      <header className="mb-12 border-b border-zinc-200 pb-8">
        <h1 className="text-4xl font-semibold tracking-tight text-zinc-900 sm:text-5xl">
          Terms of Service
        </h1>
        <p className="mt-4 text-sm text-zinc-500">Last updated: {LAST_UPDATED}</p>
      </header>

      <div className="prose prose-zinc max-w-none text-zinc-700 [&_h2]:mt-12 [&_h2]:text-2xl [&_h2]:font-semibold [&_h2]:tracking-tight [&_h2]:text-zinc-900 [&_p]:mt-4 [&_p]:leading-relaxed [&_ul]:mt-4 [&_ul]:list-disc [&_ul]:pl-6 [&_ul]:space-y-2 [&_li]:leading-relaxed [&_a]:text-primary [&_a]:underline [&_a]:underline-offset-2 hover:[&_a]:text-primary/80 [&_strong]:font-semibold [&_strong]:text-zinc-900">
        <p>
          These Terms of Service (&ldquo;Terms&rdquo;) govern your use of the website at{" "}
          <a href="https://thecodebage.com">thecodebage.com</a>, the Phone Mouse
          Android app, and the Phone Mouse Windows server (collectively, the
          &ldquo;Service&rdquo;). By installing, opening, or using the Service you agree
          to these Terms. If you do not agree, do not use the Service.
        </p>

        <h2>1. License</h2>
        <p>
          Subject to these Terms, thecodebage grants you a personal, non-exclusive,
          non-transferable, revocable license to install and use the Service on devices
          you own or control, for your personal or internal business use.
        </p>

        <h2>2. Acceptable use</h2>
        <p>You agree not to:</p>
        <ul>
          <li>Use the Service to access a computer, network, or account that you are not authorized to access</li>
          <li>Reverse-engineer, decompile, or disassemble the Service except where permitted by applicable law</li>
          <li>Resell, redistribute, sublicense, or commercially host the Service without written permission</li>
          <li>Bypass or attempt to bypass the subscription verification, billing, or licensing mechanisms</li>
          <li>Use the Service in any way that violates applicable laws, including export control and computer-misuse laws</li>
        </ul>

        <h2>3. Subscriptions and billing</h2>
        <p>
          Phone Mouse offers an optional Pro subscription on a monthly or annual
          basis. All payments, renewals, cancellations, and refunds are handled by{" "}
          <strong>Google Play Billing</strong>. Subscription prices, billing intervals,
          and free-trial terms shown on the Google Play listing at the time of purchase
          control. Subscriptions automatically renew unless you cancel before the renewal
          date through your Google Play account.
        </p>

        <h2>4. Refunds</h2>
        <p>
          Refund requests for in-app purchases and subscriptions are governed by Google
          Play&rsquo;s refund policy. We do not issue refunds directly. Within 48 hours
          of purchase you can typically request a refund yourself through the Play
          Store. After that, contact Google Play support.
        </p>

        <h2>5. Updates</h2>
        <p>
          We may release updates that fix bugs, improve functionality, or change the
          Service. We may add, change, or remove features at any time. Material removals
          to paid Pro features will be communicated via the app or by email where
          practical.
        </p>

        <h2>6. Intellectual property</h2>
        <p>
          The Service, including its name, logos, source code, designs, and content, is
          owned by thecodebage and is protected by copyright, trademark, and other laws.
          These Terms do not transfer any ownership rights to you.
        </p>

        <h2>7. Disclaimer of warranties</h2>
        <p>
          THE SERVICE IS PROVIDED &ldquo;AS IS&rdquo; AND &ldquo;AS AVAILABLE&rdquo;
          WITHOUT WARRANTY OF ANY KIND, EXPRESS OR IMPLIED, INCLUDING WITHOUT LIMITATION
          ANY IMPLIED WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE,
          OR NON-INFRINGEMENT. WE DO NOT WARRANT THAT THE SERVICE WILL BE UNINTERRUPTED,
          ERROR-FREE, OR FREE OF HARMFUL COMPONENTS, OR THAT ANY DEFECTS WILL BE
          CORRECTED.
        </p>

        <h2>8. Limitation of liability</h2>
        <p>
          TO THE MAXIMUM EXTENT PERMITTED BY APPLICABLE LAW, IN NO EVENT WILL
          THECODEBAGE BE LIABLE FOR ANY INDIRECT, INCIDENTAL, SPECIAL, CONSEQUENTIAL,
          OR PUNITIVE DAMAGES, OR ANY LOSS OF PROFITS, REVENUE, DATA, OR USE, ARISING
          OUT OF OR RELATED TO THESE TERMS OR THE SERVICE. OUR TOTAL LIABILITY ARISING
          OUT OF OR RELATING TO THE SERVICE WILL NOT EXCEED THE GREATER OF (A) THE
          AMOUNT YOU PAID FOR THE SERVICE IN THE TWELVE MONTHS PRECEDING THE CLAIM, OR
          (B) USD 20.
        </p>

        <h2>9. Indemnification</h2>
        <p>
          You agree to indemnify, defend, and hold harmless thecodebage from and against
          any claims, liabilities, damages, losses, and expenses (including reasonable
          attorneys&rsquo; fees) arising out of or in any way connected with your misuse
          of the Service or violation of these Terms.
        </p>

        <h2>10. Termination</h2>
        <p>
          You may stop using the Service at any time by uninstalling it. We may suspend
          or terminate your access to the Service at any time, with or without notice,
          if we reasonably believe you have violated these Terms or for security or
          legal reasons.
        </p>

        <h2>11. Changes to these Terms</h2>
        <p>
          We may update these Terms from time to time. The &ldquo;Last updated&rdquo;
          date above will reflect the most recent version. Continued use of the Service
          after a change means you accept the revised Terms.
        </p>

        <h2>12. Governing law</h2>
        <p>
          These Terms are governed by the laws of the jurisdiction in which thecodebage
          is established, without regard to its conflict of laws rules. Disputes will be
          resolved in the courts of that jurisdiction, except where applicable
          consumer-protection law gives you the right to bring a claim where you live.
        </p>

        <h2>13. Contact</h2>
        <p>
          Questions about these Terms? Email{" "}
          <a href="mailto:support@thecodebage.com">support@thecodebage.com</a>.
        </p>
      </div>
    </article>
  );
}
