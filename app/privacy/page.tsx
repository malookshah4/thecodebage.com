import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Privacy Policy",
  description:
    "Privacy policy for the thecodebage.com website. This site is hosted on Cloudflare with no analytics, no tracking, and no third-party scripts. Each app has its own privacy policy.",
  alternates: { canonical: "/privacy/" },
};

const LAST_UPDATED = "May 10, 2026";
const EFFECTIVE = "May 10, 2026";

export default function PrivacyPage() {
  return (
    <article className="mx-auto max-w-3xl px-6 py-16 sm:py-24">
      <header className="mb-12 border-b border-zinc-200 pb-8">
        <h1 className="text-4xl font-semibold tracking-tight text-zinc-900 sm:text-5xl">
          Privacy Policy
        </h1>
        <p className="mt-4 text-sm text-zinc-500">
          Effective date: {EFFECTIVE} · Last updated: {LAST_UPDATED}
        </p>
      </header>

      <div className="prose prose-zinc max-w-none text-zinc-700 [&_h2]:mt-12 [&_h2]:text-2xl [&_h2]:font-semibold [&_h2]:tracking-tight [&_h2]:text-zinc-900 [&_p]:mt-4 [&_p]:leading-relaxed [&_ul]:mt-4 [&_ul]:list-disc [&_ul]:pl-6 [&_ul]:space-y-2 [&_li]:leading-relaxed [&_a]:text-primary [&_a]:underline [&_a]:underline-offset-2 hover:[&_a]:text-primary/80 [&_strong]:font-semibold [&_strong]:text-zinc-900">
        <p>
          This Privacy Policy describes how <strong>thecodebage</strong>{" "}
          (&ldquo;we&rdquo;, &ldquo;us&rdquo;, &ldquo;our&rdquo;) handles information in
          connection with the website at{" "}
          <a href="https://thecodebage.com">thecodebage.com</a>. Each application we
          publish has its own dedicated privacy policy linked below — that
          app-specific policy controls how the app handles your information.
        </p>

        <h2>1. App-specific privacy policies</h2>
        <p>
          For information about how a particular app collects, uses, and protects
          information, read its dedicated privacy policy:
        </p>
        <ul>
          <li>
            <Link href="/apps/remote-mouse-pro/privacy/">
              Phone Mouse — Privacy Policy
            </Link>
          </li>
        </ul>

        <h2>2. The website itself</h2>
        <p>
          This website is a static informational site. We do not run any analytics,
          tracking pixels, advertising, or third-party scripts on this site.
        </p>
        <p>
          The site is hosted by <strong>Cloudflare</strong>. Cloudflare may
          automatically log standard server data (your IP address, user agent, the URL
          you requested, and the timestamp) for basic security and abuse prevention.
          We do not have access to that log data unless we specifically request it for
          a security incident, and Cloudflare retains it only as long as needed for
          those operational purposes. See Cloudflare&rsquo;s privacy policy for full
          details.
        </p>

        <h2>3. Cookies</h2>
        <p>
          We do not set any cookies on this site for analytics, advertising, or
          personalization.
        </p>

        <h2>4. Email contact</h2>
        <p>
          When you email us at <a href="mailto:support@thecodebage.com">support@thecodebage.com</a>{" "}
          your message is forwarded by <strong>Cloudflare Email Routing</strong> to a
          standard inbox we monitor. We use the contents of your email only to respond
          to you and to improve our products. We do not add your email address to any
          marketing list.
        </p>

        <h2>5. Children</h2>
        <p>
          This website is not directed to children under 13. We do not knowingly
          collect personal information from children through this site.
        </p>

        <h2>6. Your rights</h2>
        <p>
          Because we do not collect or store personal data through this site, there is
          generally nothing for us to access, correct, or delete. If you have a privacy
          question or a request under GDPR, CCPA, or any other applicable law, contact
          us at <a href="mailto:support@thecodebage.com">support@thecodebage.com</a>{" "}
          and we will respond within 30 days.
        </p>

        <h2>7. Changes to this policy</h2>
        <p>
          If we change this policy in a meaningful way, we will update the &ldquo;Last
          updated&rdquo; date above and post the change on this page.
        </p>

        <h2>8. Contact</h2>
        <p>
          For any privacy-related question, contact:{" "}
          <a href="mailto:support@thecodebage.com">support@thecodebage.com</a>.
        </p>
      </div>
    </article>
  );
}
