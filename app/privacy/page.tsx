import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Privacy Policy",
  description:
    "Privacy policy for the thecodebage.com website. Hosted on Cloudflare, no analytics of our own; ads are served by Google AdSense, which uses cookies. Each app has its own privacy policy.",
  alternates: { canonical: "/privacy/" },
};

const LAST_UPDATED = "October 11, 2026";
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
          This website is a static informational site with app pages and a blog. We
          do not run our own analytics or tracking pixels. The only third-party script
          is <strong>Google AdSense</strong>, which we use to show ads that help pay
          for the site (see sections 3 and 4).
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
          We do not set any cookies of our own. However, Google AdSense and its
          partners may set and read cookies, or use similar technologies such as web
          beacons and device identifiers, when you visit this site. These are used to
          serve and measure ads, limit how often you see the same ad, and prevent
          fraud. You can block or delete cookies in your browser settings at any time;
          the site still works without them.
        </p>

        <h2>4. Advertising</h2>
        <p>
          We use Google AdSense to display ads on this site. In line with Google&rsquo;s
          requirements:
        </p>
        <ul>
          <li>
            Third-party vendors, including Google, use cookies to serve ads based on
            your prior visits to this website or other websites.
          </li>
          <li>
            Google&rsquo;s use of advertising cookies enables it and its partners to
            serve ads to you based on your visits to this site and/or other sites on
            the Internet.
          </li>
          <li>
            You may opt out of personalized advertising by visiting{" "}
            <a href="https://adssettings.google.com/" target="_blank" rel="noopener noreferrer">
              Google Ads Settings
            </a>
            . You can also opt out of some third-party vendors&rsquo; use of cookies
            for personalized advertising at{" "}
            <a href="https://www.aboutads.info/choices/" target="_blank" rel="noopener noreferrer">
              aboutads.info
            </a>
            .
          </li>
        </ul>
        <p>
          To learn more, read{" "}
          <a
            href="https://policies.google.com/technologies/partner-sites"
            target="_blank"
            rel="noopener noreferrer"
          >
            how Google uses information from sites that use its services
          </a>
          . If you are in the European Economic Area, the UK or Switzerland, you will
          be asked for consent before personalized ads are shown, and you can change
          your choice at any time.
        </p>

        <h2>5. Email contact</h2>
        <p>
          When you email us at <a href="mailto:support@thecodebage.com">support@thecodebage.com</a>{" "}
          your message is forwarded by <strong>Cloudflare Email Routing</strong> to a
          standard inbox we monitor. We use the contents of your email only to respond
          to you and to improve our products. We do not add your email address to any
          marketing list.
        </p>

        <h2>6. Children</h2>
        <p>
          This website is not directed to children under 13. We do not knowingly
          collect personal information from children through this site.
        </p>

        <h2>7. Your rights</h2>
        <p>
          Because we do not collect or store personal data through this site, there is
          generally nothing for us to access, correct, or delete. Data collected by
          Google for advertising is controlled through the Google settings linked in
          section 4. If you have a privacy
          question or a request under GDPR, CCPA, or any other applicable law, contact
          us at <a href="mailto:support@thecodebage.com">support@thecodebage.com</a>{" "}
          and we will respond within 30 days.
        </p>

        <h2>8. Changes to this policy</h2>
        <p>
          If we change this policy in a meaningful way, we will update the &ldquo;Last
          updated&rdquo; date above and post the change on this page.
        </p>

        <h2>9. Contact</h2>
        <p>
          For any privacy-related question, contact:{" "}
          <a href="mailto:support@thecodebage.com">support@thecodebage.com</a>.
        </p>
      </div>
    </article>
  );
}
