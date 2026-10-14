"use client";

import { useRef, useState } from "react";
import { Check, Copy, Upload } from "lucide-react";

// Shared building blocks for every tool in components/tools/*. Styling lives
// in the "Tools UI" block of app/globals.css so all tools look the same.

export function Field({
  label,
  hint,
  htmlFor,
  children,
}: {
  label: string;
  hint?: React.ReactNode;
  htmlFor?: string;
  children: React.ReactNode;
}) {
  return (
    <div className="tool-field">
      <label className="tool-label" htmlFor={htmlFor}>
        {label}
      </label>
      {children}
      {hint && <div className="tool-hint">{hint}</div>}
    </div>
  );
}

export function TextInput(props: React.InputHTMLAttributes<HTMLInputElement>) {
  return <input type="text" {...props} className={`tool-input ${props.className ?? ""}`} />;
}

export function NumberInput(props: React.InputHTMLAttributes<HTMLInputElement>) {
  return (
    <input
      type="number"
      inputMode="decimal"
      {...props}
      className={`tool-input ${props.className ?? ""}`}
    />
  );
}

export function TextArea(props: React.TextareaHTMLAttributes<HTMLTextAreaElement>) {
  return <textarea {...props} className={`tool-input tool-textarea ${props.className ?? ""}`} />;
}

export function Select({
  options,
  ...props
}: React.SelectHTMLAttributes<HTMLSelectElement> & {
  options: { value: string; label: string }[];
}) {
  return (
    <select {...props} className={`tool-input tool-select ${props.className ?? ""}`}>
      {options.map((o) => (
        <option key={o.value} value={o.value}>
          {o.label}
        </option>
      ))}
    </select>
  );
}

export function Btn({
  variant = "primary",
  className = "",
  ...props
}: React.ButtonHTMLAttributes<HTMLButtonElement> & { variant?: "primary" | "ghost" }) {
  return (
    <button
      type="button"
      {...props}
      className={`tool-btn ${variant === "ghost" ? "tool-btn-ghost" : "tool-btn-primary"} ${className}`}
    />
  );
}

/** Pill-style option switcher. */
export function Segmented<T extends string>({
  value,
  onChange,
  options,
  ariaLabel,
}: {
  value: T;
  onChange: (v: T) => void;
  options: { value: T; label: string }[];
  ariaLabel?: string;
}) {
  return (
    <div className="tool-segmented" role="radiogroup" aria-label={ariaLabel}>
      {options.map((o) => (
        <button
          key={o.value}
          type="button"
          role="radio"
          aria-checked={value === o.value}
          className={value === o.value ? "is-active" : ""}
          onClick={() => onChange(o.value)}
        >
          {o.label}
        </button>
      ))}
    </div>
  );
}

/** Drag-and-drop or click-to-pick file input. */
export function FileDrop({
  accept,
  multiple = false,
  onFiles,
  label = "Choose a file or drop it here",
  hint,
}: {
  accept: string;
  multiple?: boolean;
  onFiles: (files: File[]) => void;
  label?: string;
  hint?: string;
}) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [over, setOver] = useState(false);

  return (
    <div
      className={`tool-drop ${over ? "is-over" : ""}`}
      role="button"
      tabIndex={0}
      onClick={() => inputRef.current?.click()}
      onKeyDown={(e) => {
        if (e.key === "Enter" || e.key === " ") {
          e.preventDefault();
          inputRef.current?.click();
        }
      }}
      onDragOver={(e) => {
        e.preventDefault();
        setOver(true);
      }}
      onDragLeave={() => setOver(false)}
      onDrop={(e) => {
        e.preventDefault();
        setOver(false);
        const files = Array.from(e.dataTransfer.files);
        if (files.length) onFiles(multiple ? files : files.slice(0, 1));
      }}
    >
      <Upload size={22} aria-hidden />
      <div className="tool-drop-label">{label}</div>
      {hint && <div className="tool-hint">{hint}</div>}
      <input
        ref={inputRef}
        type="file"
        accept={accept}
        multiple={multiple}
        hidden
        onChange={(e) => {
          const files = Array.from(e.target.files ?? []);
          if (files.length) onFiles(files);
          e.target.value = "";
        }}
      />
    </div>
  );
}

/** Big number result tile. */
export function Stat({
  label,
  value,
  sub,
  accent = false,
}: {
  label: string;
  value: React.ReactNode;
  sub?: React.ReactNode;
  accent?: boolean;
}) {
  return (
    <div className={`tool-stat ${accent ? "is-accent" : ""}`}>
      <div className="tool-stat-label">{label}</div>
      <div className="tool-stat-value">{value}</div>
      {sub && <div className="tool-hint">{sub}</div>}
    </div>
  );
}

export function CopyButton({ text, label = "Copy" }: { text: string; label?: string }) {
  const [copied, setCopied] = useState(false);
  return (
    <Btn
      variant="ghost"
      disabled={!text}
      onClick={async () => {
        try {
          await navigator.clipboard.writeText(text);
          setCopied(true);
          setTimeout(() => setCopied(false), 1500);
        } catch {
          // Clipboard can be blocked (http, iframe); nothing useful to do.
        }
      }}
    >
      {copied ? <Check size={16} aria-hidden /> : <Copy size={16} aria-hidden />}
      {copied ? "Copied" : label}
    </Btn>
  );
}

export function Notice({
  tone = "info",
  children,
}: {
  tone?: "info" | "error" | "success";
  children: React.ReactNode;
}) {
  return (
    <div className={`tool-notice tool-notice-${tone}`} role={tone === "error" ? "alert" : "status"}>
      {children}
    </div>
  );
}

export function Progress({ value, label }: { value: number; label?: string }) {
  const pct = Math.max(0, Math.min(100, Math.round(value * 100)));
  return (
    <div className="tool-progress-wrap">
      {label && (
        <div className="tool-hint" style={{ marginBottom: 6 }}>
          {label} · {pct}%
        </div>
      )}
      <div className="tool-progress" role="progressbar" aria-valuenow={pct} aria-valuemin={0} aria-valuemax={100}>
        <div style={{ width: `${pct}%` }} />
      </div>
    </div>
  );
}

export interface ToolDownloadDetail {
  url: string;
  filename: string;
  size: number;
}

/** Event fired on window for every download, so <DownloadHelper> can offer a manual link. */
export const TOOL_DOWNLOAD_EVENT = "codebage:tool-download";

export function downloadBlob(blob: Blob, filename: string) {
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = filename;
  a.rel = "noopener";
  document.body.appendChild(a);
  a.click();
  a.remove();
  // Some browsers block a download that starts after async work (no recent
  // tap), and iPhone Safari asks "Download?" first. Keep the file alive and
  // let the helper show a link the user can tap themselves.
  window.dispatchEvent(
    new CustomEvent<ToolDownloadDetail>(TOOL_DOWNLOAD_EVENT, {
      detail: { url, filename, size: blob.size },
    }),
  );
  setTimeout(() => URL.revokeObjectURL(url), 10 * 60_000);
}

/**
 * In-app browsers (Instagram, Facebook, TikTok, Snapchat, LinkedIn, Android
 * WebViews) can't save files made in the page. Detect them so we can say so.
 */
export function isInAppBrowser(ua: string): boolean {
  return /FBAN|FBAV|FB_IAB|Instagram|Snapchat|TikTok|musical_ly|BytedanceWebview|LinkedInApp|Line\/|; wv\)/i.test(ua);
}

export function formatBytes(n: number): string {
  if (n < 1024) return `${n} B`;
  if (n < 1024 * 1024) return `${(n / 1024).toFixed(1)} KB`;
  return `${(n / (1024 * 1024)).toFixed(2)} MB`;
}

/** Strip extension and append a new one: "photo.jpeg" -> "photo-small.webp" */
export function renameFile(name: string, suffix: string, ext: string): string {
  const base = name.replace(/\.[^.]+$/, "");
  return `${base}${suffix}.${ext}`;
}

export function formatNumber(n: number, maxFractionDigits = 2): string {
  if (!Number.isFinite(n)) return "-";
  return n.toLocaleString("en-US", { maximumFractionDigits: maxFractionDigits });
}

/** Load a File/Blob into an HTMLImageElement. */
export function loadImage(file: Blob): Promise<HTMLImageElement> {
  return new Promise((resolve, reject) => {
    const url = URL.createObjectURL(file);
    const img = new Image();
    img.onload = () => resolve(img);
    img.onerror = () => {
      URL.revokeObjectURL(url);
      reject(new Error("This image could not be opened. Try a JPG, PNG or WebP file."));
    };
    img.src = url;
  });
}
