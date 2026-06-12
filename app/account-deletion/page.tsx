import type { Metadata } from "next";
import { DeletionForm } from "./deletion-form";

export const metadata: Metadata = {
  title: "Account & Data Deletion Request",
  description:
    "Request deletion of your account and associated data for any codeBage app. Submit the form and we will process your request within 30 days.",
  alternates: { canonical: "/account-deletion/" },
};

const LAST_UPDATED = "June 12, 2026";

export default function AccountDeletionPage() {
  return (
    <article className="mx-auto max-w-3xl px-6 py-16 sm:py-24">
      <header className="mb-12 border-b border-zinc-200 pb-8">
        <h1 className="text-4xl font-semibold tracking-tight text-zinc-900 sm:text-5xl">
          Account &amp; Data Deletion Request
        </h1>
        <p className="mt-4 text-sm text-zinc-500">Last updated: {LAST_UPDATED}</p>
      </header>

      <div className="prose prose-zinc max-w-none text-zinc-700 [&_h2]:mt-12 [&_h2]:text-2xl [&_h2]:font-semibold [&_h2]:tracking-tight [&_h2]:text-zinc-900 [&_p]:mt-4 [&_p]:leading-relaxed [&_ul]:mt-4 [&_ul]:list-disc [&_ul]:pl-6 [&_ul]:space-y-2 [&_li]:leading-relaxed [&_a]:text-primary [&_a]:underline [&_a]:underline-offset-2 hover:[&_a]:text-primary/80 [&_strong]:font-semibold [&_strong]:text-zinc-900">
        <p>
          Use the form below to request deletion of your account and the personal
          data associated with it for any codeBage app. After we receive your
          request, we will verify your ownership of the account and complete the
          deletion within 30 days.
        </p>

        <h2>What gets deleted</h2>
        <ul>
          <li>Your account record (email, account ID, sign-in credentials).</li>
          <li>
            Any profile information you provided in-app (display name, preferences).
          </li>
          <li>
            Any user-generated content tied to your account (saved settings, pairings,
            history) unless it has already been anonymized.
          </li>
        </ul>

        <h2>What we retain</h2>
        <ul>
          <li>
            Anonymized analytics events with no identifier tying them back to you.
          </li>
          <li>
            Records we are required to retain by law (tax invoices, fraud-prevention
            logs) for the period set by the applicable regulation.
          </li>
        </ul>

        <h2>Submit your request</h2>
        <p>
          Fill in the form and your default mail client will open with a pre-filled
          request to{" "}
          <a href="mailto:support@thecodebage.com">support@thecodebage.com</a>. If
          you cannot use a mail client, email us directly at that address with the
          same details.
        </p>

        <DeletionForm />

        <h2>After you submit</h2>
        <p>
          We will reply to confirm we received your request, verify your identity
          using the email on file, and complete the deletion within 30 days. If we
          need anything more from you we will reply to the same email thread.
        </p>

        <h2>Per-app notes</h2>

        <h3 className="mt-8 text-xl font-semibold tracking-tight text-zinc-900">
          Real or AI
        </h3>
        <p>
          <strong>App:</strong> Real or AI ·{" "}
          <strong>Developer:</strong> codeBage
        </p>
        <p>
          To request deletion of your Real or AI account and associated data, email{" "}
          <a href="mailto:support@thecodebage.com?subject=Delete%20my%20account">
            support@thecodebage.com
          </a>{" "}
          with the subject line <em>&ldquo;Delete my account&rdquo;</em> from the
          email address linked to your Google sign-in (if you used one). We will
          delete your account and the data we hold within 30 days.
        </p>
        <p>
          <strong>Data that is deleted:</strong>
        </p>
        <ul>
          <li>Your account identifier (anonymous and/or linked Google account ID).</li>
          <li>Your credit balance and usage records stored on our servers.</li>
        </ul>
        <p>
          <strong>Data that is kept:</strong>
        </p>
        <ul>
          <li>
            Purchase/transaction records, retained as required for legal, tax, and
            fraud-prevention purposes.
          </li>
          <li>
            On-device data: images and results saved in your app history are stored
            only on your device. Delete them anytime inside the app, or by
            uninstalling the app.
          </li>
        </ul>
      </div>
    </article>
  );
}
