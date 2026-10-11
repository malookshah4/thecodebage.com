"use client";

import { useState } from "react";
import { Download, X } from "lucide-react";
import {
  Btn,
  Field,
  FileDrop,
  Notice,
  NumberInput,
  Segmented,
  Select,
  TextInput,
  downloadBlob,
  formatBytes,
  loadImage,
  renameFile,
} from "./ui";

type Mode = "pixels" | "percent";
type Fit = "cover" | "contain" | "stretch";
type OutFormat = "keep" | "image/jpeg" | "image/png" | "image/webp";

interface Item {
  id: string;
  file: File;
  w: number;
  h: number;
  status: "waiting" | "working" | "done" | "error";
  result?: { blob: Blob; w: number; h: number };
  error?: string;
}

interface Settings {
  mode: Mode;
  width: number;
  height: number;
  lock: boolean;
  percent: number;
  fit: Fit;
  bg: string;
  format: OutFormat;
  quality: number;
  targetBytes: number;
}

const PRESETS = [
  { value: "custom", label: "Custom size", w: 0, h: 0 },
  { value: "ig-post", label: "Instagram post (1080 × 1080)", w: 1080, h: 1080 },
  { value: "ig-portrait", label: "Instagram portrait (1080 × 1350)", w: 1080, h: 1350 },
  { value: "story", label: "Story or Reels (1080 × 1920)", w: 1080, h: 1920 },
  { value: "yt-thumb", label: "YouTube thumbnail (1280 × 720)", w: 1280, h: 720 },
  { value: "wa-dp", label: "WhatsApp DP (500 × 500)", w: 500, h: 500 },
  { value: "fb-cover", label: "Facebook cover (851 × 315)", w: 851, h: 315 },
];

const EXT: Record<string, string> = { "image/jpeg": "jpg", "image/webp": "webp", "image/png": "png" };
const MAX_SIDE = 10000;
const MIN_QUALITY = 0.2;

function num(s: string): number {
  return s.trim() === "" ? NaN : Number(s);
}

function outType(file: File, format: OutFormat): string {
  if (format !== "keep") return format;
  if (file.type === "image/png") return "image/png";
  if (file.type === "image/webp") return "image/webp";
  return "image/jpeg";
}

/** Output size and how to fit the source into it. */
function targetSize(iw: number, ih: number, s: Settings): { w: number; h: number; fit: Fit } {
  if (s.mode === "percent") {
    const k = s.percent / 100;
    return { w: Math.max(1, Math.round(iw * k)), h: Math.max(1, Math.round(ih * k)), fit: "stretch" };
  }
  if (s.lock) {
    // Keep each image's own shape and fit it inside the width x height box.
    const k = Math.min(s.width / iw, s.height / ih);
    return { w: Math.max(1, Math.round(iw * k)), h: Math.max(1, Math.round(ih * k)), fit: "stretch" };
  }
  return { w: Math.round(s.width), h: Math.round(s.height), fit: s.fit };
}

function draw(img: HTMLImageElement, w: number, h: number, fit: Fit, bg: string | null): HTMLCanvasElement {
  const canvas = document.createElement("canvas");
  canvas.width = w;
  canvas.height = h;
  const ctx = canvas.getContext("2d");
  if (!ctx) throw new Error("Your browser could not create an image canvas.");
  if (bg) {
    ctx.fillStyle = bg;
    ctx.fillRect(0, 0, w, h);
  }
  ctx.imageSmoothingEnabled = true;
  ctx.imageSmoothingQuality = "high";
  const iw = img.naturalWidth;
  const ih = img.naturalHeight;
  if (fit === "cover") {
    // Scale up until the box is filled, then take the centre.
    const k = Math.max(w / iw, h / ih);
    const sw = w / k;
    const sh = h / k;
    ctx.drawImage(img, (iw - sw) / 2, (ih - sh) / 2, sw, sh, 0, 0, w, h);
  } else if (fit === "contain") {
    const k = Math.min(w / iw, h / ih);
    const dw = iw * k;
    const dh = ih * k;
    ctx.drawImage(img, (w - dw) / 2, (h - dh) / 2, dw, dh);
  } else {
    ctx.drawImage(img, 0, 0, w, h);
  }
  return canvas;
}

function encode(canvas: HTMLCanvasElement, type: string, quality: number): Promise<Blob> {
  return new Promise((resolve, reject) =>
    canvas.toBlob(
      (b) => (b ? resolve(b) : reject(new Error("Your browser could not save this image."))),
      type,
      quality,
    ),
  );
}

async function resize(item: Item, s: Settings): Promise<{ blob: Blob; w: number; h: number }> {
  const img = await loadImage(item.file);
  try {
    const t = targetSize(img.naturalWidth, img.naturalHeight, s);
    const type = outType(item.file, s.format);
    const bg = type === "image/jpeg" || t.fit === "contain" ? s.bg : null;
    const make = (k: number) =>
      draw(img, Math.max(1, Math.round(t.w * k)), Math.max(1, Math.round(t.h * k)), t.fit, bg);

    if (!s.targetBytes || type === "image/png") {
      const c = make(1);
      return { blob: await encode(c, type, s.quality), w: c.width, h: c.height };
    }

    // Target size: find the highest quality that fits. If even the lowest
    // quality is too big, shrink the pixel size and try again.
    let k = 1;
    for (let attempt = 0; attempt < 10; attempt++) {
      const c = make(k);
      const high = await encode(c, type, s.quality);
      if (high.size <= s.targetBytes) return { blob: high, w: c.width, h: c.height };
      const low = await encode(c, type, MIN_QUALITY);
      if (low.size > s.targetBytes) {
        if (c.width <= 16 || c.height <= 16) break;
        k *= Math.max(0.5, Math.min(0.95, Math.sqrt(s.targetBytes / low.size) * 0.95));
        continue;
      }
      let lo = MIN_QUALITY;
      let hi = s.quality;
      let best = low;
      for (let i = 0; i < 7; i++) {
        const q = (lo + hi) / 2;
        const b = await encode(c, type, q);
        if (b.size <= s.targetBytes) {
          best = b;
          lo = q;
        } else {
          hi = q;
        }
      }
      return { blob: best, w: c.width, h: c.height };
    }
    throw new Error("Could not get this image under the target size. Try a larger target.");
  } finally {
    URL.revokeObjectURL(img.src);
  }
}

export default function ImageResizer() {
  const [items, setItems] = useState<Item[]>([]);
  const [mode, setMode] = useState<Mode>("pixels");
  const [preset, setPreset] = useState("custom");
  const [width, setWidth] = useState("1080");
  const [height, setHeight] = useState("1080");
  const [lock, setLock] = useState(true);
  const [percent, setPercent] = useState("50");
  const [fit, setFit] = useState<Fit>("cover");
  const [bg, setBg] = useState("#ffffff");
  const [format, setFormat] = useState<OutFormat>("keep");
  const [quality, setQuality] = useState(0.85);
  const [targetKb, setTargetKb] = useState("");
  const [busy, setBusy] = useState(false);
  const [zipping, setZipping] = useState(false);
  const [error, setError] = useState("");

  const first = items.find((i) => i.w > 0);
  const ratio = (fallbackW: number, fallbackH: number) =>
    first ? first.w / first.h : fallbackW > 0 && fallbackH > 0 ? fallbackW / fallbackH : 1;

  const addFiles = async (files: File[]) => {
    setError("");
    const images = files.filter((f) => f.type.startsWith("image/"));
    if (!images.length) {
      setError("Those files are not images. Pick JPG, PNG or WebP files.");
      return;
    }
    const loaded: Item[] = await Promise.all(
      images.map(async (file) => {
        const id = crypto.randomUUID();
        try {
          const img = await loadImage(file);
          const w = img.naturalWidth;
          const h = img.naturalHeight;
          URL.revokeObjectURL(img.src);
          return { id, file, w, h, status: "waiting" as const };
        } catch (e) {
          const error = e instanceof Error ? e.message : "This image could not be opened.";
          return { id, file, w: 0, h: 0, status: "error" as const, error };
        }
      }),
    );
    const firstNew = loaded.find((i) => i.w > 0);
    if (!first && firstNew && preset === "custom") {
      setWidth(String(firstNew.w));
      setHeight(String(firstNew.h));
    }
    setItems((prev) => [...prev, ...loaded]);
  };

  const onWidth = (v: string) => {
    setPreset("custom");
    if (lock && mode === "pixels") {
      const r = ratio(num(width), num(height));
      const w = num(v);
      if (Number.isFinite(w) && w > 0) setHeight(String(Math.max(1, Math.round(w / r))));
    }
    setWidth(v);
  };

  const onHeight = (v: string) => {
    setPreset("custom");
    if (lock && mode === "pixels") {
      const r = ratio(num(width), num(height));
      const h = num(v);
      if (Number.isFinite(h) && h > 0) setWidth(String(Math.max(1, Math.round(h * r))));
    }
    setHeight(v);
  };

  const onLock = (on: boolean) => {
    setLock(on);
    if (on) {
      setPreset("custom");
      const w = num(width);
      if (first && Number.isFinite(w) && w > 0) setHeight(String(Math.max(1, Math.round(w / ratio(w, num(height))))));
    }
  };

  const onPreset = (v: string) => {
    setPreset(v);
    const p = PRESETS.find((x) => x.value === v);
    if (p && p.w > 0) {
      setMode("pixels");
      setLock(false);
      setWidth(String(p.w));
      setHeight(String(p.h));
    }
  };

  const tkb = num(targetKb);
  const settings: Settings = {
    mode,
    width: num(width),
    height: num(height),
    lock,
    percent: num(percent),
    fit,
    bg,
    format,
    quality,
    targetBytes: Number.isFinite(tkb) && tkb > 0 ? tkb * 1024 : 0,
  };

  let invalid = "";
  if (mode === "pixels") {
    if (!(settings.width >= 1 && settings.height >= 1)) invalid = "Enter a width and height of at least 1 pixel.";
    else if (settings.width > MAX_SIDE || settings.height > MAX_SIDE) invalid = `Width and height can be at most ${MAX_SIDE} pixels.`;
  } else if (!(settings.percent > 0 && settings.percent <= 400)) {
    invalid = "Enter a percentage between 1 and 400.";
  }
  if (!invalid && items.length) {
    const tooBig = items.some((i) => {
      if (!i.w) return false;
      const t = targetSize(i.w, i.h, settings);
      return t.w > MAX_SIDE || t.h > MAX_SIDE;
    });
    if (tooBig) invalid = `The result would be wider or taller than ${MAX_SIDE} pixels. Use a smaller size.`;
  }

  const run = async () => {
    if (invalid) return;
    setBusy(true);
    setError("");
    for (const item of items) {
      if (!item.w) continue;
      setItems((prev) => prev.map((i) => (i.id === item.id ? { ...i, status: "working" } : i)));
      try {
        const result = await resize(item, settings);
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
  const outName = (i: Item) =>
    renameFile(i.file.name, `-${i.result?.w}x${i.result?.h}`, EXT[i.result?.blob.type ?? "image/jpeg"] ?? "jpg");

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
        zip.file(name, i.result!.blob);
      }
      downloadBlob(await zip.generateAsync({ type: "blob" }), "resized-images.zip");
    } catch {
      setError("Could not build the zip file. Download the images one by one instead.");
    } finally {
      setZipping(false);
    }
  };

  const lossy = format === "image/jpeg" || format === "image/webp" || (format === "keep" && items.some((i) => i.file.type !== "image/png"));
  const pngWithTarget = settings.targetBytes > 0 && items.some((i) => outType(i.file, format) === "image/png");
  const showBg = (mode === "pixels" && !lock && fit === "contain") || format === "image/jpeg" || (format === "keep" && items.some((i) => outType(i.file, "keep") === "image/jpeg"));

  return (
    <div className="tool-stack">
      <FileDrop
        accept="image/jpeg,image/png,image/webp,image/gif,image/bmp,image/avif"
        multiple
        onFiles={addFiles}
        label="Choose images or drop them here"
        hint="JPG, PNG or WebP. One image or a whole batch."
      />

      <div className="tool-grid cols-2">
        <Field label="Resize by">
          <Segmented
            value={mode}
            onChange={setMode}
            ariaLabel="Resize by"
            options={[
              { value: "pixels", label: "Pixels" },
              { value: "percent", label: "Percent" },
            ]}
          />
        </Field>
        {mode === "pixels" && (
          <Field label="Preset" htmlFor="rs-preset">
            <Select
              id="rs-preset"
              value={preset}
              onChange={(e) => onPreset(e.target.value)}
              options={PRESETS.map((p) => ({ value: p.value, label: p.label }))}
            />
          </Field>
        )}
      </div>

      {mode === "pixels" ? (
        <>
          <div className="tool-grid cols-2">
            <Field label="Width (px)" htmlFor="rs-w">
              <NumberInput id="rs-w" min={1} max={MAX_SIDE} value={width} onChange={(e) => onWidth(e.target.value)} />
            </Field>
            <Field label="Height (px)" htmlFor="rs-h">
              <NumberInput id="rs-h" min={1} max={MAX_SIDE} value={height} onChange={(e) => onHeight(e.target.value)} />
            </Field>
          </div>
          <label className="tool-checkbox">
            <input type="checkbox" checked={lock} onChange={(e) => onLock(e.target.checked)} />
            Lock aspect ratio (each image keeps its shape and fits inside this size)
          </label>
          {!lock && (
            <Field
              label="If the shape is different"
              hint={
                fit === "cover"
                  ? "Fills the whole size and trims the edges evenly from the centre."
                  : fit === "contain"
                    ? "Shows the whole image and fills the empty space with the background color."
                    : "Squeezes the image to the exact size. Faces and text may look stretched."
              }
            >
              <Segmented
                value={fit}
                onChange={setFit}
                ariaLabel="Fit mode"
                options={[
                  { value: "cover", label: "Crop to fill" },
                  { value: "contain", label: "Fit with background" },
                  { value: "stretch", label: "Stretch" },
                ]}
              />
            </Field>
          )}
        </>
      ) : (
        <Field label="Scale (%)" htmlFor="rs-pct" hint="50% halves the width and height. Over 100% enlarges, which can look soft.">
          <NumberInput id="rs-pct" min={1} max={400} value={percent} onChange={(e) => setPercent(e.target.value)} />
        </Field>
      )}

      <div className="tool-grid cols-2">
        <Field label="Output format">
          <Segmented
            value={format}
            onChange={setFormat}
            ariaLabel="Output format"
            options={[
              { value: "keep", label: "Same" },
              { value: "image/jpeg", label: "JPG" },
              { value: "image/png", label: "PNG" },
              { value: "image/webp", label: "WebP" },
            ]}
          />
        </Field>
        {showBg && (
          <Field label="Background color" htmlFor="rs-bg" hint="Used for empty space and behind transparent areas in JPG.">
            <TextInput id="rs-bg" type="color" value={bg} onChange={(e) => setBg(e.target.value)} style={{ padding: 4 }} />
          </Field>
        )}
      </div>

      {lossy && (
        <div className="tool-grid cols-2">
          <Field label={`Quality: ${Math.round(quality * 100)}%`} hint="85% looks the same as the original for most photos.">
            <input
              type="range"
              className="tool-range"
              min={0.4}
              max={1}
              step={0.05}
              value={quality}
              onChange={(e) => setQuality(Number(e.target.value))}
            />
          </Field>
          <Field
            label="Target file size in KB (optional)"
            htmlFor="rs-kb"
            hint="For online forms, e.g. 100. Lowers quality first, then the pixel size if needed. JPG and WebP only."
          >
            <NumberInput id="rs-kb" min={1} placeholder="No limit" value={targetKb} onChange={(e) => setTargetKb(e.target.value)} />
          </Field>
        </div>
      )}

      {pngWithTarget && (
        <Notice>PNG files ignore the target size because PNG has no quality setting. Pick JPG or WebP to hit a size limit.</Notice>
      )}
      {invalid && <Notice tone="error">{invalid}</Notice>}
      {error && <Notice tone="error">{error}</Notice>}

      {items.length > 0 && (
        <div className="tool-list">
          {items.map((i) => {
            const planned = i.w && !invalid ? targetSize(i.w, i.h, settings) : null;
            return (
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
                    {i.w > 0 && `${i.w} × ${i.h}, `}
                    {formatBytes(i.file.size)}
                    {i.result ? (
                      <>
                        {" → "}
                        <b style={{ color: "var(--ink)" }}>
                          {i.result.w} × {i.result.h}, {formatBytes(i.result.blob.size)}
                        </b>
                      </>
                    ) : (
                      planned && i.status === "waiting" && ` → ${planned.w} × ${planned.h}`
                    )}
                    {i.status === "working" && " · resizing..."}
                    {i.error && <span style={{ color: "#b3261e" }}> · {i.error}</span>}
                  </div>
                </div>
                {i.result && (
                  <Btn variant="ghost" onClick={() => downloadBlob(i.result!.blob, outName(i))} aria-label={`Download ${i.file.name}`}>
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
            );
          })}
        </div>
      )}

      <div className="tool-actions">
        <Btn onClick={run} disabled={!items.some((i) => i.w > 0) || busy || Boolean(invalid)}>
          {busy ? "Resizing..." : items.length > 1 ? `Resize ${items.length} images` : "Resize image"}
        </Btn>
        {done.length > 1 && (
          <Btn variant="ghost" onClick={downloadZip} disabled={zipping}>
            <Download size={16} aria-hidden /> {zipping ? "Zipping..." : "Download all (.zip)"}
          </Btn>
        )}
        {done.length === 1 && (
          <Btn variant="ghost" onClick={() => downloadBlob(done[0].result!.blob, outName(done[0]))}>
            <Download size={16} aria-hidden /> Download
          </Btn>
        )}
        {items.length > 0 && (
          <Btn variant="ghost" disabled={busy} onClick={() => setItems([])}>
            Clear
          </Btn>
        )}
      </div>

      {settings.targetBytes > 0 &&
        done.some((i) => i.result!.blob.size <= settings.targetBytes && (i.result!.w < targetSize(i.w, i.h, settings).w)) && (
          <Notice>Some images were made a little smaller in pixels to fit under {formatNumberKb(settings.targetBytes)}.</Notice>
        )}
    </div>
  );
}

function formatNumberKb(bytes: number): string {
  return `${Math.round(bytes / 1024)} KB`;
}
