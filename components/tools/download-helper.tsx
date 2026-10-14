"use client";

import { useEffect, useState, useSyncExternalStore } from "react";
import { Download, X } from "lucide-react";
import { TOOL_DOWNLOAD_EVENT, formatBytes, isInAppBrowser, type ToolDownloadDetail } from "./ui";

const noopSubscribe = () => () => {};

/**
 * Mounted once per tool page. Warns in-app browser users up front, and after
 * every download shows a real link the user can tap if the browser blocked or
 * swallowed the automatic one.
 */
export function DownloadHelper() {
  const ua = useSyncExternalStore(noopSubscribe, () => navigator.userAgent, () => "");
  const inApp = ua !== "" && isInAppBrowser(ua);
  const [last, setLast] = useState<ToolDownloadDetail | null>(null);

  useEffect(() => {
    const onDownload = (e: Event) => setLast((e as CustomEvent<ToolDownloadDetail>).detail);
    window.addEventListener(TOOL_DOWNLOAD_EVENT, onDownload);
    return () => window.removeEventListener(TOOL_DOWNLOAD_EVENT, onDownload);
  }, []);

  return (
    <>
      {inApp && (
        <div className="tool-notice tool-notice-error" role="alert" style={{ marginBottom: 16 }}>
          <b>Open this page in Chrome or Safari to save files.</b> You&apos;re viewing it inside an
          app (like Instagram, Facebook or TikTok), and those built-in browsers can&apos;t save
          downloads. Tap the <b>⋮</b> or <b>…</b> menu and choose <b>Open in browser</b>.
        </div>
      )}

      {last && (
        <div className="tool-download-toast" role="status">
          <div style={{ minWidth: 0, flex: 1 }}>
            <div className="tool-download-name">{last.filename}</div>
            <div className="tool-hint">
              {formatBytes(last.size)} · Download didn&apos;t start? Tap the button.
            </div>
          </div>
          <a className="tool-btn tool-btn-primary" href={last.url} download={last.filename}>
            <Download size={16} aria-hidden /> Save
          </a>
          <button
            type="button"
            className="tool-btn tool-btn-ghost"
            aria-label="Close"
            style={{ padding: "0 12px" }}
            onClick={() => setLast(null)}
          >
            <X size={16} aria-hidden />
          </button>
        </div>
      )}
    </>
  );
}
