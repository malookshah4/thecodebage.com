"use client";

import { useEffect, useState } from "react";
import { Download } from "lucide-react";
import {
  Btn,
  Field,
  Notice,
  Segmented,
  Select,
  TextArea,
  TextInput,
  downloadBlob,
} from "./ui";

type QrType = "url" | "text" | "wifi" | "phone" | "email" | "sms" | "contact";
type Ecc = "L" | "M" | "Q" | "H";
type WifiSec = "WPA" | "WEP" | "nopass";

interface Values {
  url: string;
  text: string;
  ssid: string;
  wifiPass: string;
  wifiSec: WifiSec;
  wifiHidden: boolean;
  phone: string;
  emailTo: string;
  emailSubject: string;
  emailBody: string;
  smsNumber: string;
  smsMessage: string;
  first: string;
  last: string;
  org: string;
  cPhone: string;
  cEmail: string;
  cUrl: string;
}

const DEFAULTS: Values = {
  url: "https://thecodebage.com/",
  text: "Hello! Scan me.",
  ssid: "",
  wifiPass: "",
  wifiSec: "WPA",
  wifiHidden: false,
  phone: "",
  emailTo: "",
  emailSubject: "",
  emailBody: "",
  smsNumber: "",
  smsMessage: "",
  first: "",
  last: "",
  org: "",
  cPhone: "",
  cEmail: "",
  cUrl: "",
};

const TYPES: { value: QrType; label: string }[] = [
  { value: "url", label: "Website link (URL)" },
  { value: "text", label: "Plain text" },
  { value: "wifi", label: "WiFi network" },
  { value: "phone", label: "Phone number" },
  { value: "email", label: "Email" },
  { value: "sms", label: "SMS message" },
  { value: "contact", label: "Contact card (vCard)" },
];

/** WiFi QR format needs \ ; , : " escaped with a backslash. */
function escWifi(s: string): string {
  return s.replace(/([\\;,:"])/g, "\\$1");
}

/** vCard 3.0 text values: escape backslash, comma, semicolon and newlines. */
function escVcard(s: string): string {
  return s.replace(/\\/g, "\\\\").replace(/([,;])/g, "\\$1").replace(/\r?\n/g, "\\n");
}

function cleanPhone(s: string): string {
  const t = s.trim();
  return (t.startsWith("+") ? "+" : "") + t.replace(/[^\d]/g, "");
}

function buildPayload(type: QrType, v: Values): string {
  switch (type) {
    case "url": {
      const u = v.url.trim();
      if (!u) return "";
      return /^[a-z][a-z\d+.-]*:/i.test(u) ? u : `https://${u}`;
    }
    case "text":
      return v.text;
    case "wifi": {
      if (!v.ssid) return "";
      const pass = v.wifiSec === "nopass" ? "" : `P:${escWifi(v.wifiPass)};`;
      return `WIFI:T:${v.wifiSec};S:${escWifi(v.ssid)};${pass}H:${v.wifiHidden ? "true" : "false"};;`;
    }
    case "phone": {
      const p = cleanPhone(v.phone);
      return p.replace("+", "") ? `tel:${p}` : "";
    }
    case "email": {
      const to = v.emailTo.trim();
      if (!to) return "";
      const params: string[] = [];
      if (v.emailSubject) params.push(`subject=${encodeURIComponent(v.emailSubject)}`);
      if (v.emailBody) params.push(`body=${encodeURIComponent(v.emailBody)}`);
      return `mailto:${to}${params.length ? `?${params.join("&")}` : ""}`;
    }
    case "sms": {
      const n = cleanPhone(v.smsNumber);
      if (!n.replace("+", "")) return "";
      return `SMSTO:${n}:${v.smsMessage}`;
    }
    case "contact": {
      const first = v.first.trim();
      const last = v.last.trim();
      if (!first && !last && !v.org.trim()) return "";
      const lines = [
        "BEGIN:VCARD",
        "VERSION:3.0",
        `N:${escVcard(last)};${escVcard(first)};;;`,
        `FN:${escVcard([first, last].filter(Boolean).join(" ") || v.org.trim())}`,
      ];
      if (v.org.trim()) lines.push(`ORG:${escVcard(v.org.trim())}`);
      if (v.cPhone.trim()) lines.push(`TEL;TYPE=CELL:${cleanPhone(v.cPhone)}`);
      if (v.cEmail.trim()) lines.push(`EMAIL:${escVcard(v.cEmail.trim())}`);
      if (v.cUrl.trim()) lines.push(`URL:${escVcard(v.cUrl.trim())}`);
      lines.push("END:VCARD");
      return lines.join("\r\n");
    }
  }
}

function luminance(hex: string): number {
  const m = /^#?([\da-f]{6})$/i.exec(hex);
  if (!m) return 0;
  const n = parseInt(m[1], 16);
  const ch = [(n >> 16) & 255, (n >> 8) & 255, n & 255].map((c) => {
    const s = c / 255;
    return s <= 0.03928 ? s / 12.92 : Math.pow((s + 0.055) / 1.055, 2.4);
  });
  return 0.2126 * ch[0] + 0.7152 * ch[1] + 0.0722 * ch[2];
}

function friendlyError(e: unknown): string {
  const msg = e instanceof Error ? e.message : String(e);
  if (/too big|amount of data/i.test(msg)) {
    return "This is too much data for one QR code. Shorten the text, or lower the error correction level.";
  }
  return "Could not make the QR code. Check the fields and try again.";
}

export default function QrCodeGenerator() {
  const [type, setType] = useState<QrType>("url");
  const [v, setV] = useState<Values>(DEFAULTS);
  const [fg, setFg] = useState("#000000");
  const [bg, setBg] = useState("#ffffff");
  const [size, setSize] = useState("512");
  const [ecc, setEcc] = useState<Ecc>("M");
  const [margin, setMargin] = useState("4");
  const [dataUrl, setDataUrl] = useState("");
  const [error, setError] = useState("");

  const payload = buildPayload(type, v);

  const set =
    (k: keyof Values) =>
    (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) =>
      setV((prev) => ({ ...prev, [k]: e.target.value }));

  const options = {
    errorCorrectionLevel: ecc,
    margin: Number(margin),
    width: Number(size),
    color: { dark: fg, light: bg },
  };

  useEffect(() => {
    let cancelled = false;
    const timer = setTimeout(async () => {
      if (!payload) {
        setDataUrl("");
        setError("");
        return;
      }
      try {
        const QR = await import("qrcode");
        const url = await QR.toDataURL(payload, {
          errorCorrectionLevel: ecc,
          margin: Number(margin),
          width: Number(size),
          color: { dark: fg, light: bg },
        });
        if (!cancelled) {
          setDataUrl(url);
          setError("");
        }
      } catch (e) {
        if (!cancelled) {
          setDataUrl("");
          setError(friendlyError(e));
        }
      }
    }, 180);
    return () => {
      cancelled = true;
      clearTimeout(timer);
    };
  }, [payload, ecc, margin, size, fg, bg]);

  const downloadPng = async () => {
    if (!dataUrl) return;
    const blob = await (await fetch(dataUrl)).blob();
    downloadBlob(blob, `qr-${type}.png`);
  };

  const downloadSvg = async () => {
    if (!payload) return;
    try {
      const QR = await import("qrcode");
      const svg = await QR.toString(payload, { ...options, type: "svg" });
      downloadBlob(new Blob([svg], { type: "image/svg+xml" }), `qr-${type}.svg`);
    } catch (e) {
      setError(friendlyError(e));
    }
  };

  const lf = luminance(fg);
  const lb = luminance(bg);
  const contrast = (Math.max(lf, lb) + 0.05) / (Math.min(lf, lb) + 0.05);
  const inverted = lf > lb;

  return (
    <div className="tool-stack">
      <Field label="QR code type" htmlFor="qr-type">
        <Select
          id="qr-type"
          value={type}
          onChange={(e) => setType(e.target.value as QrType)}
          options={TYPES}
        />
      </Field>

      <div className="tool-grid cols-2">
        <div className="tool-stack">
          {type === "url" && (
            <Field label="Website address" htmlFor="qr-url" hint="We add https:// if you leave it out.">
              <TextInput
                id="qr-url"
                type="url"
                inputMode="url"
                value={v.url}
                onChange={set("url")}
                placeholder="https://example.com"
              />
            </Field>
          )}

          {type === "text" && (
            <Field label="Text" htmlFor="qr-text">
              <TextArea id="qr-text" value={v.text} onChange={set("text")} rows={5} />
            </Field>
          )}

          {type === "wifi" && (
            <>
              <Field label="Network name (SSID)" htmlFor="qr-ssid" hint="Must match exactly, including capital letters.">
                <TextInput id="qr-ssid" value={v.ssid} onChange={set("ssid")} placeholder="MyHomeWiFi" />
              </Field>
              <Field label="Security" htmlFor="qr-sec">
                <Select
                  id="qr-sec"
                  value={v.wifiSec}
                  onChange={set("wifiSec")}
                  options={[
                    { value: "WPA", label: "WPA / WPA2 / WPA3" },
                    { value: "WEP", label: "WEP (old)" },
                    { value: "nopass", label: "None (open network)" },
                  ]}
                />
              </Field>
              {v.wifiSec !== "nopass" && (
                <Field label="Password" htmlFor="qr-pass">
                  <TextInput id="qr-pass" value={v.wifiPass} onChange={set("wifiPass")} autoComplete="off" />
                </Field>
              )}
              <label className="tool-checkbox">
                <input
                  type="checkbox"
                  checked={v.wifiHidden}
                  onChange={(e) => setV((p) => ({ ...p, wifiHidden: e.target.checked }))}
                />
                Hidden network
              </label>
            </>
          )}

          {type === "phone" && (
            <Field label="Phone number" htmlFor="qr-phone" hint="Include the country code, like +92 300 1234567.">
              <TextInput id="qr-phone" type="tel" value={v.phone} onChange={set("phone")} placeholder="+92 300 1234567" />
            </Field>
          )}

          {type === "email" && (
            <>
              <Field label="Email address" htmlFor="qr-to">
                <TextInput id="qr-to" type="email" value={v.emailTo} onChange={set("emailTo")} placeholder="name@example.com" />
              </Field>
              <Field label="Subject (optional)" htmlFor="qr-subj">
                <TextInput id="qr-subj" value={v.emailSubject} onChange={set("emailSubject")} />
              </Field>
              <Field label="Message (optional)" htmlFor="qr-body">
                <TextArea id="qr-body" value={v.emailBody} onChange={set("emailBody")} rows={3} />
              </Field>
            </>
          )}

          {type === "sms" && (
            <>
              <Field label="Phone number" htmlFor="qr-smsn">
                <TextInput id="qr-smsn" type="tel" value={v.smsNumber} onChange={set("smsNumber")} placeholder="+92 300 1234567" />
              </Field>
              <Field label="Message (optional)" htmlFor="qr-smsm">
                <TextArea id="qr-smsm" value={v.smsMessage} onChange={set("smsMessage")} rows={3} />
              </Field>
            </>
          )}

          {type === "contact" && (
            <>
              <div className="tool-grid cols-2">
                <Field label="First name" htmlFor="qr-first">
                  <TextInput id="qr-first" value={v.first} onChange={set("first")} autoComplete="given-name" />
                </Field>
                <Field label="Last name" htmlFor="qr-last">
                  <TextInput id="qr-last" value={v.last} onChange={set("last")} autoComplete="family-name" />
                </Field>
              </div>
              <Field label="Company (optional)" htmlFor="qr-org">
                <TextInput id="qr-org" value={v.org} onChange={set("org")} />
              </Field>
              <Field label="Phone" htmlFor="qr-cphone">
                <TextInput id="qr-cphone" type="tel" value={v.cPhone} onChange={set("cPhone")} placeholder="+92 300 1234567" />
              </Field>
              <Field label="Email" htmlFor="qr-cemail">
                <TextInput id="qr-cemail" type="email" value={v.cEmail} onChange={set("cEmail")} />
              </Field>
              <Field label="Website" htmlFor="qr-curl">
                <TextInput id="qr-curl" type="url" inputMode="url" value={v.cUrl} onChange={set("cUrl")} />
              </Field>
            </>
          )}

          <div className="tool-grid cols-2">
            <Field label="Foreground" htmlFor="qr-fg">
              <input
                id="qr-fg"
                type="color"
                className="tool-input"
                style={{ padding: 4, cursor: "pointer" }}
                value={fg}
                onChange={(e) => setFg(e.target.value)}
              />
            </Field>
            <Field label="Background" htmlFor="qr-bg">
              <input
                id="qr-bg"
                type="color"
                className="tool-input"
                style={{ padding: 4, cursor: "pointer" }}
                value={bg}
                onChange={(e) => setBg(e.target.value)}
              />
            </Field>
          </div>

          <Field label="Image size (pixels)">
            <Segmented
              value={size}
              onChange={setSize}
              ariaLabel="Image size"
              options={[
                { value: "256", label: "256" },
                { value: "512", label: "512" },
                { value: "1024", label: "1024" },
              ]}
            />
          </Field>
          <Field label="Error correction" hint="Higher levels survive scratches or a logo on top, but make the code denser.">
            <Segmented
              value={ecc}
              onChange={setEcc}
              ariaLabel="Error correction"
              options={[
                { value: "L", label: "L 7%" },
                { value: "M", label: "M 15%" },
                { value: "Q", label: "Q 25%" },
                { value: "H", label: "H 30%" },
              ]}
            />
          </Field>
          <Field label="Margin (quiet zone)" hint="4 modules is the standard. Less can confuse some scanners.">
            <Segmented
              value={margin}
              onChange={setMargin}
              ariaLabel="Margin"
              options={[
                { value: "0", label: "0" },
                { value: "2", label: "2" },
                { value: "4", label: "4" },
                { value: "6", label: "6" },
              ]}
            />
          </Field>
        </div>

        <div className="tool-stack">
          <div
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              padding: 16,
              borderRadius: 16,
              border: "1px solid var(--line)",
              background: "var(--paper-2)",
              minHeight: 240,
            }}
          >
            {dataUrl ? (
              // eslint-disable-next-line @next/next/no-img-element -- data URL preview, next/image adds nothing here
              <img
                src={dataUrl}
                alt="QR code preview"
                style={{ width: "100%", maxWidth: 280, height: "auto", imageRendering: "pixelated" }}
              />
            ) : (
              <div className="tool-hint" style={{ textAlign: "center" }}>
                {error ? "No preview" : "Fill in the fields to see your QR code."}
              </div>
            )}
          </div>

          {error && <Notice tone="error">{error}</Notice>}

          {contrast < 4 && (
            <Notice tone="error">
              The two colors are too close (contrast {contrast.toFixed(1)}:1). Many scanners will fail.
              Use a dark foreground on a light background.
            </Notice>
          )}
          {contrast >= 4 && inverted && (
            <Notice>
              Light code on a dark background is inverted. Newer phone cameras read it, but some
              scanner apps do not. Dark on light is safest.
            </Notice>
          )}

          <div className="tool-actions">
            <Btn onClick={downloadPng} disabled={!dataUrl}>
              <Download size={16} aria-hidden /> PNG
            </Btn>
            <Btn variant="ghost" onClick={downloadSvg} disabled={!dataUrl}>
              <Download size={16} aria-hidden /> SVG
            </Btn>
          </div>
          <p className="tool-hint">
            These are static codes: the data sits inside the image, so they never expire and do not
            track scans. Test it with your phone before printing.
          </p>
        </div>
      </div>
    </div>
  );
}
