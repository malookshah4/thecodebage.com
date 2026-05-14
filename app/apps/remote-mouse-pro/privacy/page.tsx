import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Privacy Policy — Remote Mouse Pro",
  description:
    "Privacy policy for the Remote Mouse Pro Android application. LAN-only operation, no analytics, on-device OCR and voice processing, no third-party SDKs.",
  alternates: { canonical: "/apps/remote-mouse-pro/privacy/" },
};

const LAST_UPDATED = "May 10, 2026";
const EFFECTIVE = "May 10, 2026";

export default function RemoteMouseProPrivacyPage() {
  return (
    <article className="mx-auto max-w-3xl px-6 py-16 sm:py-24">
      <header className="mb-12 border-b border-zinc-200 pb-8">
        <p className="text-sm font-medium text-primary">
          <Link href="/apps/remote-mouse-pro/" className="hover:underline">
            ← Remote Mouse Pro
          </Link>
        </p>
        <h1 className="mt-4 text-4xl font-semibold tracking-tight text-zinc-900 sm:text-5xl">
          Remote Mouse Pro — Privacy Policy
        </h1>
        <p className="mt-4 text-sm text-zinc-500">
          Effective date: {EFFECTIVE} · Last updated: {LAST_UPDATED}
        </p>
      </header>

      <div className="prose prose-zinc max-w-none text-zinc-700 [&_h2]:mt-12 [&_h2]:text-2xl [&_h2]:font-semibold [&_h2]:tracking-tight [&_h2]:text-zinc-900 [&_h3]:mt-8 [&_h3]:text-lg [&_h3]:font-semibold [&_h3]:text-zinc-900 [&_p]:mt-4 [&_p]:leading-relaxed [&_ul]:mt-4 [&_ul]:list-disc [&_ul]:pl-6 [&_ul]:space-y-2 [&_li]:leading-relaxed [&_a]:text-primary [&_a]:underline [&_a]:underline-offset-2 hover:[&_a]:text-primary/80 [&_strong]:font-semibold [&_strong]:text-zinc-900">
        <p>
          This Privacy Policy describes how <strong>thecodebage</strong> (&ldquo;we&rdquo;,
          &ldquo;us&rdquo;, &ldquo;our&rdquo;) handles information in connection with the{" "}
          <strong>Remote Mouse Pro</strong> Android application and its accompanying
          Windows server (collectively, the &ldquo;App&rdquo;). This policy is specific
          to Remote Mouse Pro. For our umbrella website policy, see{" "}
          <Link href="/privacy/">thecodebage.com/privacy</Link>.
        </p>
        <p>
          Our guiding principle is simple: we collect as little data as physically
          possible. Remote Mouse Pro operates entirely over your local network. We do
          not run analytics, advertising, tracking pixels, or third-party SDKs in the
          app.
        </p>

        <h2>1. Summary</h2>
        <ul>
          <li>
            <strong>No analytics, no tracking, no advertising SDKs.</strong> We do not
            know who installs or uses the app.
          </li>
          <li>
            <strong>LAN-only operation.</strong> All control data flows directly between
            your phone and your PC over your Wi-Fi network. None of it touches our
            servers — we don&rsquo;t operate any.
          </li>
          <li>
            <strong>On-device processing.</strong> OCR (camera) and voice (microphone)
            features run locally on your phone. Captured images and audio never leave
            the device and are not stored after processing.
          </li>
          <li>
            <strong>Subscriptions are billed by Google Play.</strong> We never see your
            payment details.
          </li>
          <li>
            <strong>You can contact us</strong> at{" "}
            <a href="mailto:support@thecodebage.com">support@thecodebage.com</a>.
          </li>
        </ul>

        <h2>2. Information we do not collect</h2>
        <p>We deliberately do not collect or transmit:</p>
        <ul>
          <li>Personal identifiers (name, email, phone number, account, device ID)</li>
          <li>Advertising identifiers (Google Advertising ID, etc.)</li>
          <li>Location data (precise or coarse)</li>
          <li>Contacts, calendar, photos, or other personal content from your device</li>
          <li>Crash logs, telemetry, or usage analytics</li>
          <li>The content of anything you type, click, or speak through Remote Mouse Pro</li>
        </ul>

        <h2>3. Information processed locally on your device</h2>

        <h3>3.1 Camera (CAMERA permission)</h3>
        <p>
          Remote Mouse Pro&rsquo;s OCR (Text Scan) feature uses your phone&rsquo;s camera
          to capture images you point at, and Google&rsquo;s on-device ML Kit Text
          Recognition library to extract text from those images. The image and recognized
          text:
        </p>
        <ul>
          <li>Are processed entirely on your device</li>
          <li>Are <strong>never uploaded</strong> to thecodebage or any third party</li>
          <li>Are not stored after the scan completes — only the recognized text is sent over your local network to your paired PC, where you can paste it</li>
          <li>The camera is only active while you are inside the OCR Text Scan screen</li>
        </ul>

        <h3>3.2 Microphone (RECORD_AUDIO permission)</h3>
        <p>
          Remote Mouse Pro&rsquo;s Voice Macros feature uses Android&rsquo;s built-in
          speech-to-text engine to listen for short voice commands. The audio:
        </p>
        <ul>
          <li>Is captured only while you hold the voice button</li>
          <li>Is processed by Android&rsquo;s on-device speech recognizer where supported by your device; on older devices Android may use Google&rsquo;s speech service to perform the conversion. We do not control or receive that audio — it is governed by Google&rsquo;s privacy policy</li>
          <li>Is not stored or uploaded by Remote Mouse Pro</li>
          <li>Only the resulting recognized text command is forwarded over your local network to your paired PC</li>
        </ul>

        <h3>3.3 Network access (INTERNET, ACCESS_NETWORK_STATE, ACCESS_WIFI_STATE)</h3>
        <p>
          Remote Mouse Pro uses local network access to:
        </p>
        <ul>
          <li>Discover your PC server via mDNS / Bonjour</li>
          <li>Establish a WebSocket connection (LAN only) to send mouse, keyboard, and command events</li>
          <li>Verify your subscription status via Google Play Billing</li>
        </ul>
        <p>
          The app does not contact any thecodebage server. There are no thecodebage
          servers in this product&rsquo;s data flow.
        </p>

        <h3>3.4 Storage</h3>
        <p>
          The app stores the following on your device only:
        </p>
        <ul>
          <li>Pairing certificate fingerprints, so we can warn you if your PC&rsquo;s identity changes (Android secure storage / Keystore)</li>
          <li>Your saved snippets, voice macros, and pairing history (local app storage)</li>
          <li>Cached subscription state from Google Play (so the app works briefly offline)</li>
        </ul>

        <h2>4. Subscriptions and billing</h2>
        <p>
          Remote Mouse Pro offers an optional Pro subscription. All payments are
          processed by <strong>Google Play Billing</strong>. We never see your card,
          billing address, or any financial information. We only receive the
          subscription token Google Play hands the app, which we use to unlock Pro
          features on your device.
        </p>
        <p>
          To manage, change, or cancel your subscription, use the Google Play Store
          subscriptions screen. Refund requests are governed by Google&rsquo;s refund
          policy.
        </p>

        <h2>5. Third parties</h2>
        <p>The app uses these third-party platforms, but only as required to function:</p>
        <ul>
          <li>
            <strong>Google Play Billing</strong> — to validate your subscription. Subject
            to Google&rsquo;s privacy policy.
          </li>
          <li>
            <strong>Google ML Kit (on-device Text Recognition)</strong> — runs locally on
            your phone; no images are sent to Google.
          </li>
          <li>
            <strong>Android Speech Recognizer</strong> — Android&rsquo;s system-level
            speech-to-text. On some devices Google performs the recognition; we do not
            receive that audio. Subject to Google&rsquo;s privacy policy.
          </li>
        </ul>
        <p>
          We do not embed Firebase Analytics, Crashlytics, advertising SDKs, Facebook
          SDK, or any other third-party tracking or advertising library.
        </p>

        <h2>6. Children</h2>
        <p>
          Remote Mouse Pro is not directed to children under 13 (or the equivalent
          minimum age in your jurisdiction). We do not knowingly collect personal
          information from children.
        </p>

        <h2>7. Your rights</h2>
        <p>
          Because we do not collect or store personal data on our infrastructure, there
          is generally nothing for us to access, correct, or delete on your behalf. To
          remove all app-related data, simply uninstall the app — Android will clear its
          local storage. To remove subscription billing data, manage it through your
          Google Play account.
        </p>
        <p>
          If you have any privacy question or request under GDPR, CCPA, or any other
          applicable law, contact us at{" "}
          <a href="mailto:support@thecodebage.com">support@thecodebage.com</a> and we
          will respond within 30 days.
        </p>

        <h2>8. Security</h2>
        <p>
          The phone-to-PC connection uses TLS over WebSocket on your local network with
          certificate pinning after the initial pairing. We strongly recommend running
          Remote Mouse Pro only on a Wi-Fi network you trust.
        </p>

        <h2>9. Changes to this policy</h2>
        <p>
          If we change this policy in a meaningful way, we will update the &ldquo;Last
          updated&rdquo; date above and post the change on this page. Continued use of
          the app after the change is acceptance of the revised policy.
        </p>

        <h2>10. Contact</h2>
        <p>
          For any privacy-related question, contact:{" "}
          <a href="mailto:support@thecodebage.com">support@thecodebage.com</a>.
        </p>
      </div>
    </article>
  );
}
