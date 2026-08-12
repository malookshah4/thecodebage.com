import type { Metadata } from "next";
import { ANDROID_APPS, WINDOWS_APPS } from "@/lib/apps";
import { DeletionForm } from "./deletion-form";

export const metadata: Metadata = {
  title: "Account & Data Deletion Request",
  description:
    "Request deletion of your account and associated data for any codeBage app. Submit the form and we will process your request within 30 days.",
  alternates: { canonical: "/account-deletion/" },
};

const LAST_UPDATED = "June 12, 2026";

function buildAppList(): string[] {
  const featured = ["Phone Mouse", "LifeOS", "Real or AI"];
  const fromStore = ANDROID_APPS.map((a) => a.title).filter(
    (t) => !featured.includes(t)
  );
  const fromWin = WINDOWS_APPS.map((a) => a.title).filter(
    (t) => !featured.includes(t) && !fromStore.includes(t)
  );
  const rest = [...fromStore, ...fromWin].sort((a, b) => a.localeCompare(b));
  return [...featured, ...rest, "Other / not listed"];
}

export default function AccountDeletionPage() {
  const apps = buildAppList();

  return (
    <article className="mx-auto max-w-3xl px-6 py-16 sm:py-24">
      <header className="mb-12 border-b border-zinc-200 pb-8">
        <h1 className="text-4xl font-semibold tracking-tight text-zinc-900 sm:text-5xl">
          Account &amp; Data Deletion Request
        </h1>
        <p className="mt-4 text-sm text-zinc-500">Last updated: {LAST_UPDATED}</p>
      </header>

      <div className="prose prose-zinc max-w-none text-zinc-700 [&_h2]:mt-12 [&_h2]:text-2xl [&_h2]:font-semibold [&_h2]:tracking-tight [&_h2]:text-zinc-900 [&_h3]:mt-8 [&_h3]:text-xl [&_h3]:font-semibold [&_h3]:tracking-tight [&_h3]:text-zinc-900 [&_p]:mt-4 [&_p]:leading-relaxed [&_ul]:mt-4 [&_ul]:list-disc [&_ul]:pl-6 [&_ul]:space-y-2 [&_li]:leading-relaxed [&_a]:text-primary [&_a]:underline [&_a]:underline-offset-2 hover:[&_a]:text-primary/80 [&_strong]:font-semibold [&_strong]:text-zinc-900">
        <p>
          This page applies to <strong>every app published by codeBage</strong>.
          Use the form below to request deletion of your account and the personal
          data associated with it for any of our apps. After we receive your
          request, we will verify your ownership of the account and complete the
          deletion within 30 days.
        </p>

        <h2>Developer</h2>
        <p>
          <strong>codeBage</strong> — independent developer of small utilities and
          AI tools for Android and Windows. Contact:{" "}
          <a href="mailto:support@thecodebage.com">support@thecodebage.com</a>.
        </p>

        <h2>Apps covered</h2>
        <p>This deletion policy applies to all codeBage apps, including:</p>
        <ul>
          {apps
            .filter((a) => a !== "Other / not listed")
            .map((a) => (
              <li key={a}>{a}</li>
            ))}
        </ul>

        <h2>Data that is deleted</h2>
        <ul>
          <li>
            Your account identifier — anonymous user ID and/or linked Google
            sign-in ID.
          </li>
          <li>
            Server-side balances and usage records — credit balance, API usage
            counts, saved settings tied to your account.
          </li>
          <li>
            Any profile information you supplied in-app (display name,
            preferences) and account-linked user-generated content.
          </li>
        </ul>

        <h2>Data that is kept</h2>
        <ul>
          <li>
            <strong>Purchase / transaction records</strong> — retained as required
            for legal, tax, and fraud-prevention purposes.
          </li>
          <li>
            <strong>On-device data</strong> — images, results, history and other
            content saved inside the app are stored only on your device. Delete
            them from inside the app, or by uninstalling the app. We never
            receive a copy.
          </li>
          <li>
            <strong>Anonymized analytics events</strong> with no identifier tying
            them back to you.
          </li>
        </ul>

        <h2>Submit your request</h2>
        <p>
          Fill in the form and your default mail client will open with a
          pre-filled request to{" "}
          <a href="mailto:support@thecodebage.com">support@thecodebage.com</a>. If
          you cannot use a mail client, email us directly at that address with
          the same details — subject line{" "}
          <em>&ldquo;Delete my account&rdquo;</em>, sent from the email address
          linked to the account (e.g. your Google sign-in).
        </p>

        <DeletionForm apps={apps} />

        <h2>After you submit</h2>
        <p>
          We will reply to confirm we received your request, verify your identity
          using the email on file, and complete the deletion within 30 days. If
          we need anything more from you we will reply to the same email thread.
        </p>
      </div>
    </article>
  );
}
