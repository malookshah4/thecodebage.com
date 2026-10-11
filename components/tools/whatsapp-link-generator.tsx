"use client";

import { useEffect, useState } from "react";
import { Download, ExternalLink } from "lucide-react";
import { Btn, CopyButton, Field, Notice, Select, TextArea, TextInput, downloadBlob } from "./ui";

interface Country {
  iso: string;
  name: string;
  dial: string;
}

// Pakistan first, the rest alphabetical. "Other" means the user types the full
// international number themselves.
const COUNTRIES: Country[] = [
  { iso: "PK", name: "Pakistan", dial: "92" },
  ...[
    { iso: "AF", name: "Afghanistan", dial: "93" },
    { iso: "DZ", name: "Algeria", dial: "213" },
    { iso: "AR", name: "Argentina", dial: "54" },
    { iso: "AU", name: "Australia", dial: "61" },
    { iso: "AT", name: "Austria", dial: "43" },
    { iso: "AZ", name: "Azerbaijan", dial: "994" },
    { iso: "BH", name: "Bahrain", dial: "973" },
    { iso: "BD", name: "Bangladesh", dial: "880" },
    { iso: "BE", name: "Belgium", dial: "32" },
    { iso: "BR", name: "Brazil", dial: "55" },
    { iso: "CN", name: "China", dial: "86" },
    { iso: "DK", name: "Denmark", dial: "45" },
    { iso: "EG", name: "Egypt", dial: "20" },
    { iso: "ET", name: "Ethiopia", dial: "251" },
    { iso: "FI", name: "Finland", dial: "358" },
    { iso: "FR", name: "France", dial: "33" },
    { iso: "DE", name: "Germany", dial: "49" },
    { iso: "GH", name: "Ghana", dial: "233" },
    { iso: "GR", name: "Greece", dial: "30" },
    { iso: "HK", name: "Hong Kong", dial: "852" },
    { iso: "IN", name: "India", dial: "91" },
    { iso: "ID", name: "Indonesia", dial: "62" },
    { iso: "IR", name: "Iran", dial: "98" },
    { iso: "IQ", name: "Iraq", dial: "964" },
    { iso: "IE", name: "Ireland", dial: "353" },
    { iso: "IT", name: "Italy", dial: "39" },
    { iso: "JP", name: "Japan", dial: "81" },
    { iso: "JO", name: "Jordan", dial: "962" },
    { iso: "KE", name: "Kenya", dial: "254" },
    { iso: "KW", name: "Kuwait", dial: "965" },
    { iso: "LB", name: "Lebanon", dial: "961" },
    { iso: "MY", name: "Malaysia", dial: "60" },
    { iso: "MV", name: "Maldives", dial: "960" },
    { iso: "MX", name: "Mexico", dial: "52" },
    { iso: "MA", name: "Morocco", dial: "212" },
    { iso: "NP", name: "Nepal", dial: "977" },
    { iso: "NL", name: "Netherlands", dial: "31" },
    { iso: "NZ", name: "New Zealand", dial: "64" },
    { iso: "NG", name: "Nigeria", dial: "234" },
    { iso: "NO", name: "Norway", dial: "47" },
    { iso: "OM", name: "Oman", dial: "968" },
    { iso: "PH", name: "Philippines", dial: "63" },
    { iso: "PL", name: "Poland", dial: "48" },
    { iso: "PT", name: "Portugal", dial: "351" },
    { iso: "QA", name: "Qatar", dial: "974" },
    { iso: "RO", name: "Romania", dial: "40" },
    { iso: "RU", name: "Russia / Kazakhstan", dial: "7" },
    { iso: "SA", name: "Saudi Arabia", dial: "966" },
    { iso: "SG", name: "Singapore", dial: "65" },
    { iso: "ZA", name: "South Africa", dial: "27" },
    { iso: "KR", name: "South Korea", dial: "82" },
    { iso: "ES", name: "Spain", dial: "34" },
    { iso: "LK", name: "Sri Lanka", dial: "94" },
    { iso: "SE", name: "Sweden", dial: "46" },
    { iso: "CH", name: "Switzerland", dial: "41" },
    { iso: "TZ", name: "Tanzania", dial: "255" },
    { iso: "TH", name: "Thailand", dial: "66" },
    { iso: "TR", name: "Turkey", dial: "90" },
    { iso: "UG", name: "Uganda", dial: "256" },
    { iso: "UA", name: "Ukraine", dial: "380" },
    { iso: "AE", name: "United Arab Emirates", dial: "971" },
    { iso: "GB", name: "United Kingdom", dial: "44" },
    { iso: "US", name: "United States / Canada", dial: "1" },
    { iso: "UZ", name: "Uzbekistan", dial: "998" },
    { iso: "VN", name: "Vietnam", dial: "84" },
    { iso: "YE", name: "Yemen", dial: "967" },
  ].sort((a, b) => a.name.localeCompare(b.name)),
  { iso: "XX", name: "Other (type the full number with +)", dial: "" },
];

const OPTIONS = COUNTRIES.map((c) => ({
  value: c.iso,
  label: c.dial ? `${c.name} (+${c.dial})` : c.name,
}));

interface Parsed {
  digits: string;
  note?: string;
  problem?: string;
}

function parseNumber(raw: string, country: Country): Parsed {
  const trimmed = raw.trim();
  if (!trimmed) return { digits: "" };
  if (/[a-z]/i.test(trimmed)) return { digits: "", problem: "A phone number can only contain digits." };

  const digitsOnly = trimmed.replace(/\D/g, "");
  let full: string;
  let note: string | undefined;

  if (trimmed.startsWith("+")) {
    full = digitsOnly;
    if (country.dial) note = "You typed a full international number, so the country picker was ignored.";
  } else if (digitsOnly.startsWith("00")) {
    full = digitsOnly.slice(2);
    if (country.dial) note = "The 00 prefix was read as an international number, so the country picker was ignored.";
  } else if (!country.dial) {
    full = digitsOnly;
  } else if (
    !digitsOnly.startsWith("0") &&
    digitsOnly.startsWith(country.dial) &&
    digitsOnly.length >= 11 &&
    digitsOnly.length - country.dial.length >= 8
  ) {
    // Looks like "923001234567": the code is already there, don't add it twice.
    full = digitsOnly;
    note = `This number already starts with ${country.dial}, so it was not added again.`;
  } else {
    full = country.dial + digitsOnly.replace(/^0/, "");
  }

  let problem: string | undefined;
  if (full.length < 8) problem = "This number looks too short. Check you typed all the digits.";
  else if (full.length > 15) problem = "This number looks too long. International numbers have at most 15 digits.";
  else if (full.startsWith("92") && full.length !== 12) {
    note = "Pakistani mobile numbers have 10 digits after +92 (for example 300 1234567). Double check this one.";
  }
  return { digits: full, note, problem };
}

function prettyNumber(digits: string): string {
  return digits ? `+${digits}` : "";
}

export default function WhatsAppLinkGenerator() {
  const [iso, setIso] = useState("PK");
  const [phone, setPhone] = useState("");
  const [message, setMessage] = useState("");
  const [qr, setQr] = useState<string | null>(null);
  const [qrError, setQrError] = useState<string | null>(null);

  const country = COUNTRIES.find((c) => c.iso === iso) ?? COUNTRIES[0];
  const parsed = parseNumber(phone, country);
  const link = parsed.digits
    ? `https://wa.me/${parsed.digits}${message.trim() ? `?text=${encodeURIComponent(message)}` : ""}`
    : "";

  useEffect(() => {
    if (!link) return;
    let cancelled = false;
    const timer = setTimeout(async () => {
      try {
        const QRCode = await import("qrcode");
        const url = await QRCode.toDataURL(link, { width: 512, margin: 2, errorCorrectionLevel: "M" });
        if (!cancelled) {
          setQr(url);
          setQrError(null);
        }
      } catch {
        if (!cancelled) setQrError("The QR code could not be made. The message may be too long.");
      }
    }, 250);
    return () => {
      cancelled = true;
      clearTimeout(timer);
    };
  }, [link]);

  const downloadQr = async () => {
    if (!qr) return;
    const blob = await (await fetch(qr)).blob();
    downloadBlob(blob, `whatsapp-${parsed.digits}.png`);
  };

  return (
    <div className="tool-stack">
      <div className="tool-grid cols-2">
        <Field label="Country code" htmlFor="wa-country">
          <Select id="wa-country" value={iso} onChange={(e) => setIso(e.target.value)} options={OPTIONS} />
        </Field>
        <Field
          label="Phone number"
          htmlFor="wa-phone"
          hint={country.dial ? "With or without the leading 0. Spaces and dashes are fine." : "Start with + and the country code."}
        >
          <TextInput
            id="wa-phone"
            type="tel"
            inputMode="tel"
            autoComplete="tel"
            placeholder={country.iso === "PK" ? "0300 1234567" : country.dial ? "Number" : "+44 7911 123456"}
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
          />
        </Field>
      </div>

      <Field label="Message (optional)" htmlFor="wa-msg" hint="This text will be typed into the chat for you. You can still edit it before sending.">
        <TextArea
          id="wa-msg"
          rows={3}
          style={{ minHeight: 96 }}
          placeholder="Assalam o Alaikum, I saw your ad and wanted to ask about the price."
          value={message}
          onChange={(e) => setMessage(e.target.value)}
        />
      </Field>

      {parsed.problem && <Notice tone="error">{parsed.problem}</Notice>}
      {parsed.note && !parsed.problem && <Notice>{parsed.note}</Notice>}

      {!link ? (
        <Notice>Type a phone number above and your WhatsApp link and QR code will appear here.</Notice>
      ) : (
        <div className="tool-grid cols-2">
          <div className="tool-stack">
            <Field label={`Your link for ${prettyNumber(parsed.digits)}`}>
              <div
                className="tool-stat is-accent"
                style={{ fontFamily: "var(--font-mono-stack)", fontSize: 14, overflowWrap: "anywhere", color: "var(--ink)" }}
              >
                {link}
              </div>
            </Field>
            <div className="tool-actions">
              <CopyButton text={link} label="Copy link" />
              <a className="tool-btn tool-btn-primary" href={link} target="_blank" rel="noopener noreferrer">
                <ExternalLink size={16} aria-hidden />
                Open WhatsApp
              </a>
            </div>
            <p className="tool-hint">
              On a phone the link opens the WhatsApp app. On a computer it opens WhatsApp Web or the desktop app.
              The number has to be registered on WhatsApp for the chat to open.
            </p>
          </div>
          <div className="tool-stack" style={{ textAlign: "center" }}>
            {qrError ? (
              <Notice tone="error">{qrError}</Notice>
            ) : qr ? (
              <>
                {/* eslint-disable-next-line @next/next/no-img-element -- data URL, nothing to optimize */}
                <img
                  src={qr}
                  alt="QR code for the WhatsApp link"
                  width={220}
                  height={220}
                  style={{ margin: "0 auto", borderRadius: 12, background: "#fff", maxWidth: "100%", height: "auto" }}
                />
                <div className="tool-actions" style={{ justifyContent: "center" }}>
                  <Btn variant="ghost" onClick={downloadQr}>
                    <Download size={16} aria-hidden />
                    Download QR (PNG)
                  </Btn>
                </div>
                <p className="tool-hint">Print it on a shop counter or a flyer. Scanning it opens the same chat.</p>
              </>
            ) : (
              <p className="tool-hint">Making QR code...</p>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
