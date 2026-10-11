"use client";

import { useState } from "react";
import { Download, X } from "lucide-react";
import {
  Btn,
  Field,
  FileDrop,
  Notice,
  Segmented,
  downloadBlob,
  formatBytes,
  loadImage,
  renameFile,
} from "./ui";

type OutFormat = "image/jpeg" | "image/webp" | "keep";

interface Item {
  id: string;
  file: File;
  status: "waiting" | "working" | "done" | "error";
  result?: Blob;
  error?: string;
}

const EXT: Record<string, string> = { "image/jpeg": "jpg", "image/webp": "webp", "image/png": "png" };

async function compress(file: File, quality: number, format: OutFormat, maxSide: number) {
  const img = await loadImage(file);
  try {
    let { naturalWidth: w, naturalHeight: h } = img;
    if (maxSide > 0 && Math.max(w, h) > maxSide) {
      const k = maxSide / Math.max(w, h);
      w = Math.round(w * k);
      h = Math.round(h * k);
    }
    const canvas = document.createElement("canvas");
    canvas.width = w;
    canvas.height = h;
    const ctx = canvas.getContext("2d");
    if (!ctx) throw new Error("Your browser could not create an image canvas.");
    const type = format === "keep" ? (file.type === "image/png" ? "image/png" : file.type === "image/webp" ? "image/webp" : "image/jpeg") : format;
    if (type === "image/jpeg") {
      // JPG has no transparency, so paint white instead of black behind it.
      ctx.fillStyle = "#ffffff";
      ctx.fillRect(0, 0, w, h);
    }
    ctx.drawImage(img, 0, 0, w, h);
    const blob = await new Promise<Blob | null>((res) => canvas.toBlob(res, type, quality));
    if (!blob) throw new Error("Compression failed for this image.");
    return blob;
  } finally {
    URL.revokeObjectURL(img.src);
  }
}

export default function ImageCompressor() {
  const [items, setItems] = useState<Item[]>([]);
  const [quality, setQuality] = useState(0.75);
  const [format, setFormat] = useState<OutFormat>("keep");
  const [maxSide, setMaxSide] = useState(0);
  const [busy, setBusy] = useState(false);

  const addFiles = (files: File[]) => {
    const images = files.filter((f) => f.type.startsWith("image/"));
    setItems((prev) => [
      ...prev,
      ...images.map((file) => ({ id: crypto.randomUUID(), file, status: "waiting" as const })),
    ]);
  };

  const run = async () => {
    setBusy(true);
    for (const item of items) {
      setItems((prev) => prev.map((i) => (i.id === item.id ? { ...i, status: "working" } : i)));
      try {
        const result = await compress(item.file, quality, format, maxSide);
        setItems((prev) =>
          prev.map((i) => (i.id === item.id ? { ...i, status: "done", result, error: undefined } : i)),
        );
      } catch (e) {
        const error = e instanceof Error ? e.message : "Something went wrong.";
        setItems((prev) => prev.map((i) => (i.id === item.id ? { ...i, status: "error", error } : i)));
      }
    }
    setBusy(false);
  };

  const done = items.filter((i) => i.result);
  const before = done.reduce((s, i) => s + i.file.size, 0);
  const after = done.reduce((s, i) => s + (i.result?.size ?? 0), 0);

  const outName = (i: Item) =>
    renameFile(i.file.name, "-compressed", EXT[i.result?.type ?? "image/jpeg"] ?? "jpg");

  return (
    <div className="tool-stack">
      <FileDrop
        accept="image/jpeg,image/png,image/webp"
        multiple
        onFiles={addFiles}
        label="Choose images or drop them here"
        hint="JPG, PNG or WebP. Add as many as you like."
      />

      <div className="tool-grid cols-3">
        <Field label={`Quality: ${Math.round(quality * 100)}%`} hint="75% is a good balance for photos.">
          <input
            type="range"
            className="tool-range"
            min={0.3}
            max={0.95}
            step={0.05}
            value={quality}
            onChange={(e) => setQuality(Number(e.target.value))}
          />
        </Field>
        <Field label="Output format">
          <Segmented
            value={format}
            onChange={setFormat}
            ariaLabel="Output format"
            options={[
              { value: "keep", label: "Same" },
              { value: "image/jpeg", label: "JPG" },
              { value: "image/webp", label: "WebP" },
            ]}
          />
        </Field>
        <Field label="Max width/height">
          <Segmented
            value={String(maxSide)}
            onChange={(v) => setMaxSide(Number(v))}
            ariaLabel="Maximum size"
            options={[
              { value: "0", label: "Original" },
              { value: "2560", label: "2560" },
              { value: "1600", label: "1600" },
              { value: "1080", label: "1080" },
            ]}
          />
        </Field>
      </div>

      {format === "keep" && items.some((i) => i.file.type === "image/png") && (
        <Notice>
          PNG is lossless, so the quality slider does nothing for it. Pick JPG or WebP for much
          smaller files (WebP keeps transparency).
        </Notice>
      )}

      {items.length > 0 && (
        <div className="tool-list">
          {items.map((i) => (
            <div key={i.id} className="tool-list-item">
              <div style={{ flex: 1, minWidth: 0 }}>
                <div
                  style={{
                    fontSize: 14.5,
                    color: "var(--ink)",
                    overflow: "hidden",
                    textOverflow: "ellipsis",
                    whiteSpace: "nowrap",
                  }}
                >
                  {i.file.name}
                </div>
                <div className="tool-hint">
                  {formatBytes(i.file.size)}
                  {i.result && (
                    <>
                      {" → "}
                      <b style={{ color: "var(--ink)" }}>{formatBytes(i.result.size)}</b>
                      {" "}
                      ({Math.round((1 - i.result.size / i.file.size) * 100)}% smaller)
                    </>
                  )}
                  {i.status === "working" && " · compressing..."}
                  {i.error && <span style={{ color: "#b3261e" }}> · {i.error}</span>}
                </div>
              </div>
              {i.result && (
                <Btn variant="ghost" onClick={() => downloadBlob(i.result!, outName(i))} aria-label={`Download ${i.file.name}`}>
                  <Download size={16} aria-hidden />
                </Btn>
              )}
              <Btn
                variant="ghost"
                aria-label={`Remove ${i.file.name}`}
                disabled={busy}
                onClick={() => setItems((prev) => prev.filter((x) => x.id !== i.id))}
              >
                <X size={16} aria-hidden />
              </Btn>
            </div>
          ))}
        </div>
      )}

      <div className="tool-actions">
        <Btn onClick={run} disabled={!items.length || busy}>
          {busy ? "Compressing..." : `Compress ${items.length || ""} image${items.length === 1 ? "" : "s"}`}
        </Btn>
        {done.length > 1 && (
          <Btn variant="ghost" onClick={() => done.forEach((i) => downloadBlob(i.result!, outName(i)))}>
            <Download size={16} aria-hidden /> Download all
          </Btn>
        )}
        {items.length > 0 && (
          <Btn variant="ghost" disabled={busy} onClick={() => setItems([])}>
            Clear
          </Btn>
        )}
      </div>

      {done.length > 0 && after > 0 && (
        <Notice tone={after < before ? "success" : "info"}>
          {after < before
            ? `Saved ${formatBytes(before - after)} in total (${Math.round((1 - after / before) * 100)}% smaller).`
            : "These images were already well compressed. Try a lower quality, WebP, or a smaller max size."}
        </Notice>
      )}
    </div>
  );
}
