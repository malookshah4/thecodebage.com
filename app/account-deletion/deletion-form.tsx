"use client";

import { useState, type FormEvent } from "react";

const APPS = [
  "Remote Mouse Pro",
  "LifeOS",
  "Real or AI",
  "Other / not listed",
];

export function DeletionForm() {
  const [app, setApp] = useState(APPS[0]);
  const [email, setEmail] = useState("");
  const [accountId, setAccountId] = useState("");
  const [reason, setReason] = useState("");
  const [confirmed, setConfirmed] = useState(false);

  function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    if (!confirmed) return;

    const subject = `Account deletion request — ${app}`;
    const lines = [
      `App: ${app}`,
      `Account email: ${email}`,
      accountId ? `Account ID / username: ${accountId}` : null,
      "",
      "I am requesting permanent deletion of my account and the personal data",
      "associated with it under your data-deletion policy.",
      "",
      reason ? `Reason (optional): ${reason}` : null,
      "",
      "Thank you.",
    ].filter(Boolean);

    const body = lines.join("\n");
    const href = `mailto:support@thecodebage.com?subject=${encodeURIComponent(
      subject
    )}&body=${encodeURIComponent(body)}`;
    window.location.href = href;
  }

  const inputCls =
    "mt-2 block w-full rounded-md border border-zinc-300 bg-white px-3 py-2 text-sm text-zinc-900 placeholder:text-zinc-400 focus:border-zinc-900 focus:outline-none focus:ring-1 focus:ring-zinc-900";

  return (
    <form
      onSubmit={handleSubmit}
      className="not-prose mt-6 rounded-xl border border-zinc-200 bg-zinc-50 p-6"
      noValidate
    >
      <div>
        <label htmlFor="app" className="text-sm font-medium text-zinc-900">
          App
        </label>
        <select
          id="app"
          value={app}
          onChange={(e) => setApp(e.target.value)}
          className={inputCls}
          required
        >
          {APPS.map((a) => (
            <option key={a} value={a}>
              {a}
            </option>
          ))}
        </select>
      </div>

      <div className="mt-5">
        <label htmlFor="email" className="text-sm font-medium text-zinc-900">
          Account email
        </label>
        <input
          id="email"
          type="email"
          required
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="you@example.com"
          className={inputCls}
        />
        <p className="mt-1 text-xs text-zinc-500">
          Must match the email on the account so we can verify ownership.
        </p>
      </div>

      <div className="mt-5">
        <label htmlFor="account-id" className="text-sm font-medium text-zinc-900">
          Account ID or username{" "}
          <span className="font-normal text-zinc-500">(optional)</span>
        </label>
        <input
          id="account-id"
          type="text"
          value={accountId}
          onChange={(e) => setAccountId(e.target.value)}
          placeholder="If you know it"
          className={inputCls}
        />
      </div>

      <div className="mt-5">
        <label htmlFor="reason" className="text-sm font-medium text-zinc-900">
          Reason{" "}
          <span className="font-normal text-zinc-500">(optional)</span>
        </label>
        <textarea
          id="reason"
          rows={3}
          value={reason}
          onChange={(e) => setReason(e.target.value)}
          placeholder="Anything you want us to know"
          className={inputCls}
        />
      </div>

      <label className="mt-5 flex items-start gap-2 text-sm text-zinc-700">
        <input
          type="checkbox"
          checked={confirmed}
          onChange={(e) => setConfirmed(e.target.checked)}
          className="mt-1"
          required
        />
        <span>
          I understand this request is permanent and that account data cannot be
          recovered after deletion.
        </span>
      </label>

      <button
        type="submit"
        disabled={!confirmed || !email}
        className="mt-6 inline-flex items-center justify-center rounded-md bg-zinc-900 px-5 py-2.5 text-sm font-medium text-white transition hover:bg-zinc-800 disabled:cursor-not-allowed disabled:bg-zinc-400"
      >
        Request deletion
      </button>

      <p className="mt-4 text-xs text-zinc-500">
        This opens your default mail client with the request pre-filled. We process
        deletion requests within 30 days.
      </p>
    </form>
  );
}
