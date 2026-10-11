"use client";

import { useEffect, useRef, useState } from "react";
import { ArrowDown, ArrowUp, Download, X } from "lucide-react";
import {
  Btn,
  Field,
  FileDrop,
  Notice,
  Progress,
  Segmented,
  TextInput,
  downloadBlob,
  formatBytes,
  loadImage,
} from "./ui";

type PageSize = "a4" | "letter" | "fit";
type Orientation = "auto" | "portrait" | "landscape";
type Margin = "none" | "small" | "large";

interface Item {
  id: string;
  file: File;
  url: string;
}

interface Prepared {
  bytes: Uint8Array;
  kind: "jpg" | "png";
}

let idCounter = 0;
const newId = () => `img-${Date.now().toString(36)}-${(idCounter++).toString(36)}`;

// Page sizes in PDF points (1 pt = 1/72 inch).
const SIZES: Record<Exclude<PageSize, "fit">, [number, number]> = {
  a4: [595.28, 841.89],
  letter: [612, 792],
};
const MARGINS: Record<Margin, number> = { none: 0, small: 24, large: 54 };

const MAX_SIDE_COMPRESSED = 2000;
const MAX_SIDE_CANVAS = 4096; // stay under mobile canvas limits when not compressing
const KEEP_IF_SMALLER = 1024 * 1024; // already small files are embedded as they are

/** EXIF orientation of a JPEG (1 = upright). pdf-lib ignores EXIF, so rotated photos need redrawing. */
function jpegOrientation(buf: ArrayBuffer): number {
  const v = new DataView(buf);
  if (v.byteLength < 4 || v.getUint16(0) !== 0xffd8) return 1;
  let off = 2;
  while (off + 4 <= v.byteLength) {
    const marker = v.getUint16(off);
    if ((marker & 0xff00) !== 0xff00 || marker === 0xffda) return 1;
    const len = v.getUint16(off + 2);
    if (marker === 0xffe1 && off + 18 <= v.byteLength && v.getUint32(off + 4) === 0x45786966) {
      const tiff = off + 10;
      const little = v.getUint16(tiff) === 0x4949;
      const ifd = tiff + v.getUint32(tiff + 4, little);
      if (ifd + 2 > v.byteLength) return 1;
      const count = v.getUint16(ifd, little);
      for (let i = 0; i < count; i++) {
        const e = ifd + 2 + i * 12;
        if (e + 12 > v.byteLength) return 1;
        if (v.getUint16(e, little) === 0x0112) return v.getUint16(e + 8, little);
      }
      return 1;
    }
    off += 2 + len;
  }
  return 1;
}

/** Decode with the browser (applies EXIF rotation), optionally downscale, and re-encode as JPEG. */
async function redraw(file: File, maxSide: number, quality: number): Promise<Prepared> {
  const img = await loadImage(file);
  try {
    let w = img.naturalWidth;
    let h = img.naturalHeight;
    if (!w || !h) throw new Error("This image has no size.");
    if (Math.max(w, h) > maxSide) {
      const k = maxSide / Math.max(w, h);
      w = Math.max(1, Math.round(w * k));
      h = Math.max(1, Math.round(h * k));
    }
    const canvas = document.createElement("canvas");
    canvas.width = w;
    canvas.height = h;
    const ctx = canvas.getContext("2d");
    if (!ctx) throw new Error("Your browser could not create an image canvas.");
    ctx.fillStyle = "#ffffff"; // JPEG has no transparency
    ctx.fillRect(0, 0, w, h);
    ctx.drawImage(img, 0, 0, w, h);
    const blob = await new Promise<Blob | null>((res) => canvas.toBlob(res, "image/jpeg", quality));
    if (!blob) throw new Error("This image is too large for your browser. Turn on Compress large photos.");
    return { bytes: new Uint8Array(await blob.arrayBuffer()), kind: "jpg" };
  } finally {
    URL.revokeObjectURL(img.src);
  }
}

async function prepare(file: File, compress: boolean): Promise<Prepared> {
  const buf = await file.arrayBuffer();
  const h = new Uint8Array(buf, 0, Math.min(8, buf.byteLength));
  const isJpg = h[0] === 0xff && h[1] === 0xd8 && h[2] === 0xff;
  const isPng = h[0] === 0x89 && h[1] === 0x50 && h[2] === 0x4e && h[3] === 0x47;
  const upright = !isJpg || jpegOrientation(buf) === 1;
  const canEmbedRaw = (isJpg || isPng) && upright;
  if (canEmbedRaw && (!compress || file.size <= KEEP_IF_SMALLER)) {
    return { bytes: new Uint8Array(buf), kind: isJpg ? "jpg" : "png" };
  }
  return compress ? redraw(file, MAX_SIDE_COMPRESSED, 0.85) : redraw(file, MAX_SIDE_CANVAS, 0.92);
}

function cleanName(name: string, fallback: string) {
  const base = name
    .trim()
    .replace(/\.pdf$/i, "")
    .replace(/[\\/:*?"<>|]+/g, "-")
    .trim();
  return `${base || fallback}.pdf`;
}

const tick = () => new Promise((r) => setTimeout(r, 0));

export default function ImagesToPdf() {
  const [items, setItems] = useState<Item[]>([]);
  const [pageSize, setPageSize] = useState<PageSize>("a4");
  const [orientation, setOrientation] = useState<Orientation>("auto");
  const [margin, setMargin] = useState<Margin>("small");
  const [compress, setCompress] = useState(true);
  const [outName, setOutName] = useState("images");
  const [busy, setBusy] = useState(false);
  const [progress, setProgress] = useState(0);
  const [error, setError] = useState("");
  const [skipped, setSkipped] = useState(0);
  const [result, setResult] = useState<Blob | null>(null);

  // Object URLs for thumbnails, revoked on remove, clear and unmount.
  const urls = useRef<Set<string>>(new Set());
  useEffect(() => {
    const set = urls.current;
    return () => {
      set.forEach((u) => URL.revokeObjectURL(u));
      set.clear();
    };
  }, []);

  const revoke = (u: string) => {
    URL.revokeObjectURL(u);
    urls.current.delete(u);
  };

  const addFiles = (files: File[]) => {
    const images = files.filter((f) => f.type.startsWith("image/") || /\.(jpe?g|png|webp)$/i.test(f.name));
    setSkipped(files.length - images.length);
    if (!images.length) return;
    setResult(null);
    setError("");
    const added = images.map((file) => {
      const url = URL.createObjectURL(file);
      urls.current.add(url);
      return { id: newId(), file, url };
    });
    setItems((prev) => [...prev, ...added]);
  };

  const move = (from: number, to: number) => {
    if (to < 0 || to >= items.length) return;
    setResult(null);
    setItems((prev) => {
      const next = [...prev];
      const [it] = next.splice(from, 1);
      next.splice(to, 0, it);
      return next;
    });
  };

  const remove = (item: Item) => {
    revoke(item.url);
    setResult(null);
    setItems((prev) => prev.filter((x) => x.id !== item.id));
  };

  const clear = () => {
    items.forEach((i) => revoke(i.url));
    setItems([]);
    setResult(null);
    setError("");
    setSkipped(0);
  };

  const fileName = cleanName(outName, "images");
  const totalSize = items.reduce((s, i) => s + i.file.size, 0);

  const build = async () => {
    if (!items.length) return;
    setBusy(true);
    setError("");
    setResult(null);
    setProgress(0);
    try {
      const lib = await import("pdf-lib");
      const pdf = await lib.PDFDocument.create();
      const m = MARGINS[margin];
      for (let n = 0; n < items.length; n++) {
        const item = items[n];
        let image;
        try {
          let prep = await prepare(item.file, compress);
          try {
            image = prep.kind === "jpg" ? await pdf.embedJpg(prep.bytes) : await pdf.embedPng(prep.bytes);
          } catch {
            // Some unusual JPG/PNG variants trip pdf-lib; let the browser redraw them.
            prep = await redraw(item.file, compress ? MAX_SIDE_COMPRESSED : MAX_SIDE_CANVAS, 0.9);
            image = await pdf.embedJpg(prep.bytes);
          }
        } catch (e) {
          const why = e instanceof Error ? e.message : "it could not be read.";
          throw new Error(`${item.file.name}: ${why}`);
        }

        const iw = image.width;
        const ih = image.height;
        let pw: number;
        let ph: number;
        if (pageSize === "fit") {
          // Treat pixels as 96 dpi so the page prints at a sensible size.
          pw = iw * 0.75 + m * 2;
          ph = ih * 0.75 + m * 2;
        } else {
          const [a, b] = SIZES[pageSize];
          const landscape = orientation === "landscape" || (orientation === "auto" && iw > ih);
          pw = landscape ? b : a;
          ph = landscape ? a : b;
        }
        const page = pdf.addPage([pw, ph]);
        const boxW = pw - m * 2;
        const boxH = ph - m * 2;
        const k = Math.min(boxW / iw, boxH / ih);
        const dw = iw * k;
        const dh = ih * k;
        page.drawImage(image, { x: (pw - dw) / 2, y: (ph - dh) / 2, width: dw, height: dh });

        setProgress((n + 1) / (items.length + 1));
        await tick();
      }
      pdf.setTitle(fileName.replace(/\.pdf$/i, ""));
      const bytes = await pdf.save();
      // pdf-lib types the result as Uint8Array<ArrayBufferLike>; it is always a plain ArrayBuffer.
      const blob = new Blob([bytes as Uint8Array<ArrayBuffer>], { type: "application/pdf" });
      setProgress(1);
      setResult(blob);
      downloadBlob(blob, fileName);
    } catch (e) {
      setError(e instanceof Error ? `Could not make the PDF. ${e.message}` : "Could not make the PDF.");
    } finally {
      setBusy(false);
    }
  };

  const changed = () => setResult(null);

  return (
    <div className="tool-stack">
      <FileDrop
        accept="image/jpeg,image/png,image/webp"
        multiple
        onFiles={addFiles}
        label="Choose images or drop them here"
        hint="JPG, PNG or WebP. Each image becomes one page."
      />

      {skipped > 0 && (
        <Notice tone="error">
          {skipped === 1 ? "1 file was" : `${skipped} files were`} skipped because{" "}
          {skipped === 1 ? "it is" : "they are"} not an image.
        </Notice>
      )}

      {items.length > 0 && (
        <div className="tool-list">
          {items.map((i, idx) => (
            <div key={i.id} className="tool-list-item">
              {/* Object URL preview; next/image can't optimise local blobs. */}
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={i.url}
                alt=""
                width={44}
                height={44}
                style={{
                  width: 44,
                  height: 44,
                  objectFit: "cover",
                  borderRadius: 8,
                  border: "1px solid var(--line)",
                  flexShrink: 0,
                  background: "var(--chip-bg)",
                }}
              />
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
                  Page {idx + 1} · {formatBytes(i.file.size)}
                </div>
              </div>
              <Btn
                variant="ghost"
                aria-label={`Move ${i.file.name} up`}
                disabled={busy || idx === 0}
                onClick={() => move(idx, idx - 1)}
                style={{ padding: "0 12px" }}
              >
                <ArrowUp size={16} aria-hidden />
              </Btn>
              <Btn
                variant="ghost"
                aria-label={`Move ${i.file.name} down`}
                disabled={busy || idx === items.length - 1}
                onClick={() => move(idx, idx + 1)}
                style={{ padding: "0 12px" }}
              >
                <ArrowDown size={16} aria-hidden />
              </Btn>
              <Btn
                variant="ghost"
                aria-label={`Remove ${i.file.name}`}
                disabled={busy}
                onClick={() => remove(i)}
                style={{ padding: "0 12px" }}
              >
                <X size={16} aria-hidden />
              </Btn>
            </div>
          ))}
        </div>
      )}

      <div className="tool-grid cols-3">
        <Field label="Page size">
          <Segmented
            value={pageSize}
            onChange={(v) => {
              setPageSize(v);
              changed();
            }}
            ariaLabel="Page size"
            options={[
              { value: "a4", label: "A4" },
              { value: "letter", label: "Letter" },
              { value: "fit", label: "Fit to image" },
            ]}
          />
        </Field>
        <Field label="Orientation" hint={pageSize === "fit" ? "Not used with Fit to image." : "Auto turns wide photos sideways."}>
          <Segmented
            value={orientation}
            onChange={(v) => {
              setOrientation(v);
              changed();
            }}
            ariaLabel="Orientation"
            options={[
              { value: "auto", label: "Auto" },
              { value: "portrait", label: "Portrait" },
              { value: "landscape", label: "Landscape" },
            ]}
          />
        </Field>
        <Field label="Margin">
          <Segmented
            value={margin}
            onChange={(v) => {
              setMargin(v);
              changed();
            }}
            ariaLabel="Margin"
            options={[
              { value: "none", label: "None" },
              { value: "small", label: "Small" },
              { value: "large", label: "Large" },
            ]}
          />
        </Field>
      </div>

      <div className="tool-grid cols-2">
        <Field label="Options" hint="Shrinks big photos to 2000 px on the long side. Keeps the PDF small enough to email.">
          <label className="tool-checkbox" style={{ minHeight: 44 }}>
            <input
              type="checkbox"
              checked={compress}
              onChange={(e) => {
                setCompress(e.target.checked);
                changed();
              }}
            />
            Compress large photos
          </label>
        </Field>
        <Field label="File name" htmlFor="img-pdf-name" hint={`Saved as ${fileName}`}>
          <TextInput
            id="img-pdf-name"
            value={outName}
            onChange={(e) => {
              setOutName(e.target.value);
              changed();
            }}
            placeholder="images"
          />
        </Field>
      </div>

      {!compress && totalSize > 15 * 1024 * 1024 && (
        <Notice>
          These images add up to {formatBytes(totalSize)}. Without compression the PDF will be about that
          big, which is too large for most email.
        </Notice>
      )}

      {busy && <Progress value={progress} label="Building PDF" />}
      {error && <Notice tone="error">{error}</Notice>}

      <div className="tool-actions">
        <Btn onClick={build} disabled={!items.length || busy}>
          {busy ? "Building..." : items.length ? `Make PDF (${items.length} page${items.length === 1 ? "" : "s"})` : "Make PDF"}
        </Btn>
        {result && (
          <Btn variant="ghost" onClick={() => downloadBlob(result, fileName)}>
            <Download size={16} aria-hidden /> Download again
          </Btn>
        )}
        {items.length > 0 && (
          <Btn variant="ghost" disabled={busy} onClick={clear}>
            Clear
          </Btn>
        )}
      </div>

      {result && (
        <Notice tone="success">
          Done. {fileName} is {formatBytes(result.size)} with {items.length} page{items.length === 1 ? "" : "s"}.
          The download should start on its own.
        </Notice>
      )}
    </div>
  );
}
