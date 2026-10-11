"use client";

import { useEffect, useRef, useState } from "react";
import { Download, X } from "lucide-react";
import {
  Btn,
  Field,
  FileDrop,
  Notice,
  NumberInput,
  Segmented,
  Select,
  downloadBlob,
  loadImage,
} from "./ui";

const DPI = 300;

type PresetKey = "35x45" | "2x2" | "33x48" | "35x35" | "custom";
type Sheet = "4x6" | "a4";

/** Size in mm plus where the head guide sits (fractions of the photo height). */
const PRESETS: Record<PresetKey, { label: string; w: number; h: number; top: number; chin: number; slug: string }> = {
  "35x45": { label: "35 × 45 mm (Pakistan, UK, EU and many others)", w: 35, h: 45, top: 0.1, chin: 0.82, slug: "35x45mm" },
  "2x2": { label: "2 × 2 inch, 51 × 51 mm (US, India)", w: 50.8, h: 50.8, top: 0.12, chin: 0.75, slug: "2x2in" },
  "33x48": { label: "33 × 48 mm (China)", w: 33, h: 48, top: 0.08, chin: 0.72, slug: "33x48mm" },
  "35x35": { label: "35 × 35 mm", w: 35, h: 35, top: 0.12, chin: 0.78, slug: "35x35mm" },
  custom: { label: "Custom size (mm)", w: 0, h: 0, top: 0.1, chin: 0.8, slug: "custom" },
};

const SHEETS: Record<Sheet, { label: string; w: number; h: number }> = {
  "4x6": { label: "4 × 6 inch photo paper", w: 1200, h: 1800 },
  a4: { label: "A4 paper", w: 2480, h: 3508 },
};

function mmToPx(mm: number): number {
  return Math.round((mm / 25.4) * DPI);
}

function num(s: string): number {
  return s.trim() === "" ? NaN : Number(s);
}

interface View {
  /** Output pixels per source pixel. */
  s: number;
  /** Source point shown at the centre of the frame (clamped). */
  cx: number;
  cy: number;
}

/**
 * The single source of truth for the crop. Both the on-screen preview and the
 * exported canvas are positioned from these numbers, so the file contains
 * exactly what the frame shows.
 */
function computeView(iw: number, ih: number, fw: number, fh: number, zoom: number, cx: number, cy: number): View {
  const s = Math.max(fw / iw, fh / ih) * zoom;
  const halfW = fw / (2 * s);
  const halfH = fh / (2 * s);
  return {
    s,
    cx: Math.min(Math.max(cx, halfW), iw - halfW),
    cy: Math.min(Math.max(cy, halfH), ih - halfH),
  };
}

function renderPhoto(img: HTMLImageElement, fw: number, fh: number, v: View, brightness: number): HTMLCanvasElement {
  const canvas = document.createElement("canvas");
  canvas.width = fw;
  canvas.height = fh;
  const ctx = canvas.getContext("2d");
  if (!ctx) throw new Error("Your browser could not create an image canvas.");
  ctx.fillStyle = "#ffffff";
  ctx.fillRect(0, 0, fw, fh);
  ctx.imageSmoothingEnabled = true;
  ctx.imageSmoothingQuality = "high";
  const dx = fw / 2 - v.cx * v.s;
  const dy = fh / 2 - v.cy * v.s;
  ctx.drawImage(img, dx, dy, img.naturalWidth * v.s, img.naturalHeight * v.s);
  if (brightness !== 1) {
    // Same maths as CSS brightness(), so the preview and file match.
    const data = ctx.getImageData(0, 0, fw, fh);
    const px = data.data;
    for (let i = 0; i < px.length; i += 4) {
      px[i] = Math.min(255, px[i] * brightness);
      px[i + 1] = Math.min(255, px[i + 1] * brightness);
      px[i + 2] = Math.min(255, px[i + 2] * brightness);
    }
    ctx.putImageData(data, 0, 0);
  }
  return canvas;
}

/** Best grid for a sheet: tries both orientations and a few gap sizes. */
function sheetLayout(sheet: Sheet, pw: number, ph: number) {
  const base = SHEETS[sheet];
  let best = { count: 0, cols: 0, rows: 0, sw: base.w, sh: base.h, gap: 0 };
  const spacings = sheet === "a4" ? [60, 36, 24] : [36, 24, 12, 0];
  for (const gap of spacings) {
    for (const [sw, sh] of [
      [base.w, base.h],
      [base.h, base.w],
    ]) {
      const margin = gap;
      const cols = Math.floor((sw - 2 * margin + gap) / (pw + gap));
      const rows = Math.floor((sh - 2 * margin + gap) / (ph + gap));
      const count = Math.max(0, cols) * Math.max(0, rows);
      if (count > best.count) best = { count, cols, rows, sw, sh, gap };
    }
  }
  return best;
}

function renderSheet(photo: HTMLCanvasElement, sheet: Sheet): HTMLCanvasElement {
  const pw = photo.width;
  const ph = photo.height;
  const l = sheetLayout(sheet, pw, ph);
  if (!l.count) throw new Error("This photo size is too big for the chosen paper.");
  const canvas = document.createElement("canvas");
  canvas.width = l.sw;
  canvas.height = l.sh;
  const ctx = canvas.getContext("2d");
  if (!ctx) throw new Error("Your browser could not create an image canvas.");
  ctx.fillStyle = "#ffffff";
  ctx.fillRect(0, 0, l.sw, l.sh);
  const gridW = l.cols * pw + (l.cols - 1) * l.gap;
  const gridH = l.rows * ph + (l.rows - 1) * l.gap;
  const x0 = Math.round((l.sw - gridW) / 2);
  const y0 = Math.round((l.sh - gridH) / 2);
  for (let r = 0; r < l.rows; r++) {
    for (let c = 0; c < l.cols; c++) {
      ctx.drawImage(photo, x0 + c * (pw + l.gap), y0 + r * (ph + l.gap));
    }
  }
  // Thin cut lines halfway into the gaps (on the photo edge when there is no gap).
  ctx.strokeStyle = "#a0a0a0";
  ctx.lineWidth = 2;
  const half = l.gap / 2;
  for (let r = 0; r < l.rows; r++) {
    for (let c = 0; c < l.cols; c++) {
      const x = x0 + c * (pw + l.gap);
      const y = y0 + r * (ph + l.gap);
      ctx.strokeRect(x - half, y - half, pw + l.gap, ph + l.gap);
    }
  }
  return canvas;
}

function toJpeg(canvas: HTMLCanvasElement): Promise<Blob> {
  return new Promise((resolve, reject) =>
    canvas.toBlob(
      (b) => (b ? resolve(b) : reject(new Error("Your browser could not save the image."))),
      "image/jpeg",
      0.95,
    ),
  );
}

/** Write 300 DPI into the JPG header so printers and Windows use the right size. */
async function withDpi(blob: Blob, dpi: number): Promise<Blob> {
  const buf = new Uint8Array(await blob.arrayBuffer());
  if (buf[0] !== 0xff || buf[1] !== 0xd8) return blob;
  const hi = dpi >> 8;
  const lo = dpi & 0xff;
  const hasJfif =
    buf[2] === 0xff && buf[3] === 0xe0 && buf[6] === 0x4a && buf[7] === 0x46 && buf[8] === 0x49 && buf[9] === 0x46 && buf[10] === 0;
  if (hasJfif) {
    buf[13] = 1; // units: dots per inch
    buf[14] = hi;
    buf[15] = lo;
    buf[16] = hi;
    buf[17] = lo;
    return new Blob([buf], { type: "image/jpeg" });
  }
  const app0 = new Uint8Array([0xff, 0xe0, 0, 16, 0x4a, 0x46, 0x49, 0x46, 0, 1, 1, 1, hi, lo, hi, lo, 0, 0]);
  const out = new Uint8Array(buf.length + app0.length);
  out.set(buf.subarray(0, 2), 0);
  out.set(app0, 2);
  out.set(buf.subarray(2), 2 + app0.length);
  return new Blob([out], { type: "image/jpeg" });
}

export default function PassportPhotoMaker() {
  const [img, setImg] = useState<HTMLImageElement | null>(null);
  const [preset, setPreset] = useState<PresetKey>("35x45");
  const [customW, setCustomW] = useState("35");
  const [customH, setCustomH] = useState("45");
  const [zoom, setZoom] = useState(1);
  const [center, setCenter] = useState({ x: 0, y: 0 });
  const [brightness, setBrightness] = useState(1);
  const [guide, setGuide] = useState(true);
  const [sheet, setSheet] = useState<Sheet>("4x6");
  const [busy, setBusy] = useState<"" | "photo" | "sheet">("");
  const [error, setError] = useState("");
  const [dragging, setDragging] = useState(false);

  const urlRef = useRef<string | null>(null);
  const dragRef = useRef<{ id: number; x: number; y: number; cx: number; cy: number } | null>(null);

  useEffect(() => {
    const urls = urlRef;
    return () => {
      if (urls.current) URL.revokeObjectURL(urls.current);
    };
  }, []);

  const p = PRESETS[preset];
  const mmW = preset === "custom" ? num(customW) : p.w;
  const mmH = preset === "custom" ? num(customH) : p.h;
  const sizeOk = mmW >= 10 && mmW <= 150 && mmH >= 10 && mmH <= 150;
  const fw = sizeOk ? mmToPx(mmW) : 413;
  const fh = sizeOk ? mmToPx(mmH) : 531;

  // Head guide position. Custom sizes borrow from the closest common shape.
  const g = preset === "custom" ? (fh / fw > 1.1 ? PRESETS["35x45"] : PRESETS["35x35"]) : p;
  const headTop = g.top * fh;
  const headH = (g.chin - g.top) * fh;
  const eyeY = headTop + headH * 0.48;

  const view = img ? computeView(img.naturalWidth, img.naturalHeight, fw, fh, zoom, center.x, center.y) : null;
  const lowRes = view ? view.s > 1.6 : false;
  const layout = sizeOk ? sheetLayout(sheet, fw, fh) : null;

  const pick = async (files: File[]) => {
    const file = files[0];
    if (!file) return;
    setError("");
    try {
      const next = await loadImage(file);
      if (urlRef.current) URL.revokeObjectURL(urlRef.current);
      urlRef.current = next.src;
      setImg(next);
      setZoom(1);
      setBrightness(1);
      setCenter({ x: next.naturalWidth / 2, y: next.naturalHeight / 2 });
    } catch {
      setError(
        /\.(heic|heif)$/i.test(file.name)
          ? "This browser cannot open HEIC photos. Try Safari, or save the photo as JPG first."
          : "This photo could not be opened. Try a JPG or PNG file.",
      );
    }
  };

  const clear = () => {
    if (urlRef.current) URL.revokeObjectURL(urlRef.current);
    urlRef.current = null;
    setImg(null);
  };

  const moveBy = (dxOut: number, dyOut: number, from = view) => {
    if (!img || !from) return;
    const next = computeView(
      img.naturalWidth,
      img.naturalHeight,
      fw,
      fh,
      zoom,
      from.cx - dxOut / from.s,
      from.cy - dyOut / from.s,
    );
    setCenter({ x: next.cx, y: next.cy });
  };

  const onPointerDown = (e: React.PointerEvent<HTMLDivElement>) => {
    if (!view) return;
    e.currentTarget.setPointerCapture(e.pointerId);
    dragRef.current = { id: e.pointerId, x: e.clientX, y: e.clientY, cx: view.cx, cy: view.cy };
    setDragging(true);
  };

  const onPointerMove = (e: React.PointerEvent<HTMLDivElement>) => {
    const d = dragRef.current;
    if (!d || d.id !== e.pointerId || !img || !view) return;
    // Screen pixels to output pixels, based on how big the frame is drawn.
    const k = fw / e.currentTarget.clientWidth;
    moveBy((e.clientX - d.x) * k, (e.clientY - d.y) * k, { s: view.s, cx: d.cx, cy: d.cy });
  };

  const endDrag = (e: React.PointerEvent<HTMLDivElement>) => {
    if (dragRef.current?.id === e.pointerId) {
      dragRef.current = null;
      setDragging(false);
    }
  };

  const onKeyDown = (e: React.KeyboardEvent<HTMLDivElement>) => {
    const step = fw * 0.02;
    const moves: Record<string, [number, number]> = {
      ArrowLeft: [-step, 0],
      ArrowRight: [step, 0],
      ArrowUp: [0, -step],
      ArrowDown: [0, step],
    };
    const m = moves[e.key];
    if (!m) return;
    e.preventDefault();
    moveBy(m[0], m[1]);
  };

  const download = async (kind: "photo" | "sheet") => {
    if (!img || !view || !sizeOk) return;
    setBusy(kind);
    setError("");
    try {
      const photo = renderPhoto(img, fw, fh, view, brightness);
      const size = preset === "custom" ? `${mmW}x${mmH}mm` : p.slug;
      if (kind === "photo") {
        downloadBlob(await withDpi(await toJpeg(photo), DPI), `passport-photo-${size}.jpg`);
      } else {
        const out = renderSheet(photo, sheet);
        downloadBlob(await withDpi(await toJpeg(out), DPI), `passport-photos-${size}-${sheet}-sheet.jpg`);
      }
    } catch (e) {
      setError(e instanceof Error ? e.message : "Something went wrong while saving.");
    } finally {
      setBusy("");
    }
  };

  return (
    <div className="tool-stack">
      {!img && (
        <FileDrop
          accept="image/jpeg,image/png,image/webp,image/heic,.heic"
          onFiles={pick}
          label="Choose a photo or drop it here"
          hint="A sharp, front-facing photo against a plain light wall works best."
        />
      )}

      <div className="tool-grid cols-2">
        <Field label="Photo size" htmlFor="pp-size">
          <Select
            id="pp-size"
            value={preset}
            onChange={(e) => setPreset(e.target.value as PresetKey)}
            options={(Object.keys(PRESETS) as PresetKey[]).map((k) => ({ value: k, label: PRESETS[k].label }))}
          />
        </Field>
        {preset === "custom" ? (
          <div className="tool-grid cols-2">
            <Field label="Width (mm)" htmlFor="pp-w">
              <NumberInput id="pp-w" min={10} max={150} value={customW} onChange={(e) => setCustomW(e.target.value)} />
            </Field>
            <Field label="Height (mm)" htmlFor="pp-h">
              <NumberInput id="pp-h" min={10} max={150} value={customH} onChange={(e) => setCustomH(e.target.value)} />
            </Field>
          </div>
        ) : (
          <Field label="Output">
            <div className="tool-hint" style={{ fontSize: 14, paddingTop: 10 }}>
              {fw} × {fh} pixels at {DPI} DPI
            </div>
          </Field>
        )}
      </div>

      {!sizeOk && <Notice tone="error">Enter a width and height between 10 and 150 mm.</Notice>}
      {error && <Notice tone="error">{error}</Notice>}

      {img && view && (
        <>
          <div
            role="application"
            aria-label="Photo crop. Drag the photo or use the arrow keys to position it."
            tabIndex={0}
            onPointerDown={onPointerDown}
            onPointerMove={onPointerMove}
            onPointerUp={endDrag}
            onPointerCancel={endDrag}
            onKeyDown={onKeyDown}
            style={{
              position: "relative",
              width: "100%",
              maxWidth: 300,
              aspectRatio: `${fw} / ${fh}`,
              margin: "18px auto 0",
              overflow: "hidden",
              borderRadius: 4,
              background: "#ffffff",
              boxShadow: "0 0 0 1px var(--line-strong)",
              touchAction: "none",
              cursor: dragging ? "grabbing" : "grab",
              userSelect: "none",
            }}
          >
            {/* eslint-disable-next-line @next/next/no-img-element -- local object URL, positioned by crop maths */}
            <img
              src={img.src}
              alt="Photo being cropped"
              draggable={false}
              style={{
                position: "absolute",
                left: `${((fw / 2 - view.cx * view.s) / fw) * 100}%`,
                top: `${((fh / 2 - view.cy * view.s) / fh) * 100}%`,
                width: `${((img.naturalWidth * view.s) / fw) * 100}%`,
                height: `${((img.naturalHeight * view.s) / fh) * 100}%`,
                maxWidth: "none",
                pointerEvents: "none",
                filter: brightness !== 1 ? `brightness(${brightness})` : undefined,
              }}
            />
            {guide && (
              <svg
                viewBox={`0 0 ${fw} ${fh}`}
                preserveAspectRatio="none"
                aria-hidden
                style={{ position: "absolute", inset: 0, width: "100%", height: "100%", pointerEvents: "none" }}
              >
                <ellipse
                  cx={fw / 2}
                  cy={headTop + headH / 2}
                  rx={headH * 0.37}
                  ry={headH / 2}
                  fill="none"
                  stroke="rgba(0,0,0,0.35)"
                  strokeWidth={3}
                  vectorEffect="non-scaling-stroke"
                />
                <ellipse
                  cx={fw / 2}
                  cy={headTop + headH / 2}
                  rx={headH * 0.37}
                  ry={headH / 2}
                  fill="none"
                  stroke="rgba(255,255,255,0.85)"
                  strokeWidth={1.5}
                  strokeDasharray="6 4"
                  vectorEffect="non-scaling-stroke"
                />
                <line
                  x1={fw * 0.12}
                  x2={fw * 0.88}
                  y1={eyeY}
                  y2={eyeY}
                  stroke="rgba(255,255,255,0.8)"
                  strokeWidth={1}
                  strokeDasharray="4 4"
                  vectorEffect="non-scaling-stroke"
                />
              </svg>
            )}
          </div>
          <div className="tool-hint" style={{ textAlign: "center", marginTop: 8 }}>
            Drag to move. Fit the face inside the oval with the eyes near the dotted line.
          </div>

          <div className="tool-grid cols-2">
            <Field label={`Zoom: ${Math.round(zoom * 100)}%`}>
              <input
                type="range"
                className="tool-range"
                min={1}
                max={4}
                step={0.01}
                value={zoom}
                onChange={(e) => setZoom(Number(e.target.value))}
                aria-label="Zoom"
              />
            </Field>
            <Field label={`Brightness: ${Math.round(brightness * 100)}%`}>
              <input
                type="range"
                className="tool-range"
                min={0.7}
                max={1.4}
                step={0.01}
                value={brightness}
                onChange={(e) => setBrightness(Number(e.target.value))}
                aria-label="Brightness"
              />
            </Field>
          </div>

          <div className="tool-actions">
            <label className="tool-checkbox">
              <input type="checkbox" checked={guide} onChange={(e) => setGuide(e.target.checked)} />
              Show face guide
            </label>
            <Btn variant="ghost" onClick={clear}>
              <X size={16} aria-hidden /> Use another photo
            </Btn>
          </div>

          {lowRes && (
            <Notice>
              This photo is low resolution for this crop, so the print may look soft. Zoom out a
              little or use a larger original photo.
            </Notice>
          )}

          <hr style={{ border: 0, borderTop: "1px solid var(--line)" }} />

          <Field
            label="Print sheet"
            hint={
              layout && layout.count > 0
                ? `${layout.count} copies fit on ${sheet === "4x6" ? "a 4 × 6 inch sheet" : "an A4 page"}, with thin cut lines. Print at 100% (actual size), not "fit to page".`
                : "This photo size does not fit on the chosen paper."
            }
          >
            <Segmented
              value={sheet}
              onChange={setSheet}
              ariaLabel="Print sheet size"
              options={(Object.keys(SHEETS) as Sheet[]).map((k) => ({ value: k, label: SHEETS[k].label }))}
            />
          </Field>

          <div className="tool-actions">
            <Btn onClick={() => download("sheet")} disabled={Boolean(busy) || !sizeOk || !layout?.count}>
              <Download size={16} aria-hidden /> {busy === "sheet" ? "Saving..." : "Download print sheet (JPG)"}
            </Btn>
            <Btn variant="ghost" onClick={() => download("photo")} disabled={Boolean(busy) || !sizeOk}>
              <Download size={16} aria-hidden /> {busy === "photo" ? "Saving..." : "Download single photo"}
            </Btn>
          </div>
        </>
      )}

      <Notice>
        Use a plain light background and even light on your face. This tool crops and sizes the
        photo but does not remove backgrounds, so check your country&apos;s official photo rules
        before you print.
      </Notice>
    </div>
  );
}
