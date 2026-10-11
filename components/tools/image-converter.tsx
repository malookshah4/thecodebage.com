"use client";

import { useState } from "react";
import { Download, X } from "lucide-react";
import {
  Btn,
  Field,
  FileDrop,
  Notice,
  Segmented,
  TextInput,
  downloadBlob,
  formatBytes,
  loadImage,
  renameFile,
} from "./ui";

type Target = "image/jpeg" | "image/png" | "image/webp";

interface Item {
  id: string;
  file: File;
  status: "waiting" | "working" | "done" | "error";
  result?: Blob;
  error?: string;
}

const EXT: Record<string, string> = { "image/jpeg": "jpg", "image/webp": "webp", "image/png": "png" };
const LABEL: Record<Target, string> = { "image/jpeg": "JPG", "image/png": "PNG", "image/webp": "WebP" };

function isHeic(file: File): boolean {
  return /image\/hei[cf]/i.test(file.type) || /\.(heic|heif)$/i.test(file.name);
}

function isImage(file: File): boolean {
  return file.type.startsWith("image/") || /\.(heic|heif|avif|jfif)$/i.test(file.name);
}

async function convert(file: File, target: Target, quality: number, bg: string): Promise<Blob> {
  let img: HTMLImageElement;
  try {
    img = await loadImage(file);
  } catch {
    throw new Error(
      isHeic(file)
        ? "This browser cannot open HEIC photos. Open this page in Safari, or set your iPhone camera to Most Compatible (Settings, Camera, Formats) so it saves JPG."
        : "This image could not be opened. The file may be damaged or in a format your browser cannot read.",
    );
  }
  try {
    const w = img.naturalWidth;
    const h = img.naturalHeight;
    if (!w || !h) throw new Error("This image has no size (some SVG files do). Try another file.");
    const canvas = document.createElement("canvas");
    canvas.width = w;
    canvas.height = h;
    const ctx = canvas.getContext("2d");
    if (!ctx) throw new Error("Your browser could not create an image canvas.");
    if (target === "image/jpeg") {
      // JPG cannot store transparency, so paint the chosen colour behind it.
      ctx.fillStyle = bg;
      ctx.fillRect(0, 0, w, h);
    }
    ctx.drawImage(img, 0, 0, w, h);
    const blob = await new Promise<Blob | null>((res) => canvas.toBlob(res, target, quality));
    if (!blob) throw new Error("Conversion failed for this image. It may be too large for your browser.");
    if (blob.type !== target) throw new Error(`Your browser cannot save ${LABEL[target]} files. Try another format.`);
    return blob;
  } finally {
    URL.revokeObjectURL(img.src);
  }
}

export default function ImageConverter() {
  const [items, setItems] = useState<Item[]>([]);
  const [target, setTarget] = useState<Target>("image/jpeg");
  const [quality, setQuality] = useState(0.9);
  const [bg, setBg] = useState("#ffffff");
  const [busy, setBusy] = useState(false);
  const [zipping, setZipping] = useState(false);
  const [error, setError] = useState("");

  const addFiles = (files: File[]) => {
    const images = files.filter(isImage);
    setError(images.length ? "" : "Those files are not images.");
    setItems((prev) => [
      ...prev,
      ...images.map((file) => ({ id: crypto.randomUUID(), file, status: "waiting" as const })),
    ]);
  };

  const run = async () => {
    setBusy(true);
    setError("");
    for (const item of items) {
      setItems((prev) => prev.map((i) => (i.id === item.id ? { ...i, status: "working" } : i)));
      try {
        const result = await convert(item.file, target, quality, bg);
        setItems((prev) =>
          prev.map((i) => (i.id === item.id ? { ...i, status: "done", result, error: undefined } : i)),
        );
      } catch (e) {
        const error = e instanceof Error ? e.message : "Something went wrong.";
        setItems((prev) =>
          prev.map((i) => (i.id === item.id ? { ...i, status: "error", result: undefined, error } : i)),
        );
      }
    }
    setBusy(false);
  };

  const done = items.filter((i) => i.result);
  const outName = (i: Item) => renameFile(i.file.name, "", EXT[i.result?.type ?? target] ?? "jpg");

  const downloadZip = async () => {
    setZipping(true);
    try {
      const JSZip = (await import("jszip")).default;
      const zip = new JSZip();
      const used = new Set<string>();
      for (const i of done) {
        let name = outName(i);
        for (let n = 2; used.has(name); n++) name = outName(i).replace(/(\.[^.]+)$/, `-${n}$1`);
        used.add(name);
        zip.file(name, i.result!);
      }
      downloadBlob(await zip.generateAsync({ type: "blob" }), "converted-images.zip");
    } catch {
      setError("Could not build the zip file. Download the images one by one instead.");
    } finally {
      setZipping(false);
    }
  };

  const hasHeic = items.some((i) => isHeic(i.file));

  return (
    <div className="tool-stack">
      <FileDrop
        accept="image/*,.heic,.heif"
        multiple
        onFiles={addFiles}
        label="Choose images or drop them here"
        hint="JPG, PNG, WebP, GIF, BMP, AVIF and more. Add as many as you like."
      />

      <div className="tool-grid cols-3">
        <Field label="Convert to">
          <Segmented
            value={target}
            onChange={setTarget}
            ariaLabel="Convert to"
            options={[
              { value: "image/jpeg", label: "JPG" },
              { value: "image/png", label: "PNG" },
              { value: "image/webp", label: "WebP" },
            ]}
          />
        </Field>
        {target !== "image/png" && (
          <Field label={`Quality: ${Math.round(quality * 100)}%`} hint="90% keeps photos looking like the original.">
            <input
              type="range"
              className="tool-range"
              min={0.5}
              max={1}
              step={0.05}
              value={quality}
              onChange={(e) => setQuality(Number(e.target.value))}
            />
          </Field>
        )}
        {target === "image/jpeg" && (
          <Field label="Background color" htmlFor="ic-bg" hint="Fills transparent areas, since JPG has no transparency.">
            <TextInput id="ic-bg" type="color" value={bg} onChange={(e) => setBg(e.target.value)} style={{ padding: 4 }} />
          </Field>
        )}
      </div>

      {target === "image/png" && (
        <Notice>PNG is lossless and keeps transparency, but photos saved as PNG are often several times bigger than JPG.</Notice>
      )}
      {hasHeic && (
        <Notice>
          iPhone HEIC photos only open in browsers that can read them, which mostly means Safari. If
          a HEIC file fails here, try Safari or export it as JPG from the Photos app.
        </Notice>
      )}
      {error && <Notice tone="error">{error}</Notice>}

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
                      <b style={{ color: "var(--ink)" }}>
                        {EXT[i.result.type]?.toUpperCase()}, {formatBytes(i.result.size)}
                      </b>
                    </>
                  )}
                  {i.status === "working" && " · converting..."}
                  {i.error && <span style={{ color: "#b3261e" }}> · {i.error}</span>}
                </div>
              </div>
              {i.result && (
                <Btn variant="ghost" onClick={() => downloadBlob(i.result!, outName(i))} aria-label={`Download ${outName(i)}`}>
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
          {busy ? "Converting..." : items.length ? `Convert ${items.length} to ${LABEL[target]}` : `Convert to ${LABEL[target]}`}
        </Btn>
        {done.length > 1 && (
          <Btn variant="ghost" onClick={downloadZip} disabled={zipping}>
            <Download size={16} aria-hidden /> {zipping ? "Zipping..." : "Download all (.zip)"}
          </Btn>
        )}
        {done.length === 1 && (
          <Btn variant="ghost" onClick={() => downloadBlob(done[0].result!, outName(done[0]))}>
            <Download size={16} aria-hidden /> Download
          </Btn>
        )}
        {items.length > 0 && (
          <Btn variant="ghost" disabled={busy} onClick={() => setItems([])}>
            Clear
          </Btn>
        )}
      </div>
    </div>
  );
}
