"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { Download, X } from "lucide-react";
import type { Worker as OcrWorker } from "tesseract.js";
import {
  Btn,
  CopyButton,
  Field,
  FileDrop,
  Notice,
  Progress,
  Select,
  TextArea,
  downloadBlob,
  formatBytes,
  loadImage,
  renameFile,
} from "./ui";

const LANGS = [
  { value: "eng", label: "English" },
  { value: "urd", label: "Urdu" },
  { value: "eng+urd", label: "English + Urdu" },
  { value: "ara", label: "Arabic" },
  { value: "hin", label: "Hindi" },
  { value: "fra", label: "French" },
  { value: "spa", label: "Spanish" },
  { value: "deu", label: "German" },
];

const RTL = new Set(["urd", "ara"]);

const STATUS: Record<string, string> = {
  "loading tesseract core": "Loading the OCR engine",
  "initializing tesseract": "Starting the OCR engine",
  "loading language traineddata": "Loading language data",
  "loading language traineddata (from cache)": "Loading language data",
  "initializing api": "Getting ready",
  "recognizing text": "Reading text",
};

function friendlyStatus(s: string): string {
  return STATUS[s] ?? s.charAt(0).toUpperCase() + s.slice(1);
}

function errorMessage(e: unknown): string {
  const msg = e instanceof Error ? e.message : String(e);
  if (typeof navigator !== "undefined" && !navigator.onLine) {
    return "You seem to be offline. The first run needs internet to download the OCR engine and language data.";
  }
  if (/fetch|network|load|import|script/i.test(msg)) {
    return "Could not download the OCR engine or language data. Check your connection and try again.";
  }
  return "Text extraction failed for this image. Try a clearer or larger image.";
}

/**
 * Draw the image onto a canvas so any browser-readable format works (Tesseract
 * itself only reads a few) and small screenshots get upscaled, which helps
 * recognition a lot.
 */
async function prepare(file: File): Promise<HTMLCanvasElement> {
  const img = await loadImage(file);
  try {
    const w = img.naturalWidth;
    const h = img.naturalHeight;
    const maxSide = Math.max(w, h);
    const k = maxSide < 1000 ? 2 : maxSide > 4000 ? 4000 / maxSide : 1;
    const canvas = document.createElement("canvas");
    canvas.width = Math.max(1, Math.round(w * k));
    canvas.height = Math.max(1, Math.round(h * k));
    const ctx = canvas.getContext("2d");
    if (!ctx) throw new Error("Your browser could not create an image canvas.");
    ctx.fillStyle = "#ffffff";
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    ctx.imageSmoothingQuality = "high";
    ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
    return canvas;
  } finally {
    URL.revokeObjectURL(img.src);
  }
}

export default function ImageToText() {
  const [image, setImage] = useState<{ file: File; url: string } | null>(null);
  const [lang, setLang] = useState("eng");
  const [text, setText] = useState("");
  const [busy, setBusy] = useState(false);
  const [progress, setProgress] = useState<{ label: string; value: number } | null>(null);
  const [error, setError] = useState("");
  const [empty, setEmpty] = useState(false);
  const [hasResult, setHasResult] = useState(false);

  const urlRef = useRef<string | null>(null);
  const workerRef = useRef<OcrWorker | null>(null);
  const runRef = useRef(0);

  const pick = useCallback((file: File) => {
    if (!file.type.startsWith("image/")) {
      setError("That file is not an image. Pick a JPG, PNG or WebP.");
      return;
    }
    if (urlRef.current) URL.revokeObjectURL(urlRef.current);
    const url = URL.createObjectURL(file);
    urlRef.current = url;
    setImage({ file, url });
    setText("");
    setError("");
    setEmpty(false);
    setHasResult(false);
  }, []);

  // Paste an image from the clipboard anywhere on the page.
  useEffect(() => {
    const onPaste = (e: ClipboardEvent) => {
      const items = Array.from(e.clipboardData?.items ?? []);
      const item = items.find((i) => i.kind === "file" && i.type.startsWith("image/"));
      const file = item?.getAsFile();
      if (!file) return;
      e.preventDefault();
      const ext = file.type.split("/")[1] ?? "png";
      pick(new File([file], file.name && file.name !== "image.png" ? file.name : `pasted-image.${ext}`, { type: file.type }));
    };
    window.addEventListener("paste", onPaste);
    return () => window.removeEventListener("paste", onPaste);
  }, [pick]);

  // Clean up on unmount.
  useEffect(() => {
    const urls = urlRef;
    const workers = workerRef;
    return () => {
      if (urls.current) URL.revokeObjectURL(urls.current);
      workers.current?.terminate().catch(() => {});
    };
  }, []);

  const clear = () => {
    runRef.current++;
    workerRef.current?.terminate().catch(() => {});
    workerRef.current = null;
    if (urlRef.current) URL.revokeObjectURL(urlRef.current);
    urlRef.current = null;
    setImage(null);
    setText("");
    setError("");
    setEmpty(false);
    setHasResult(false);
    setBusy(false);
    setProgress(null);
  };

  const cancel = () => {
    runRef.current++;
    workerRef.current?.terminate().catch(() => {});
    workerRef.current = null;
    setBusy(false);
    setProgress(null);
  };

  const run = async () => {
    if (!image) return;
    const id = ++runRef.current;
    setBusy(true);
    setError("");
    setEmpty(false);
    setProgress({ label: "Starting", value: 0 });
    let worker: OcrWorker | null = null;
    try {
      const canvas = await prepare(image.file);
      const { createWorker } = await import("tesseract.js");
      worker = await createWorker(lang.split("+"), 1, {
        logger: (m) => {
          if (runRef.current === id) setProgress({ label: friendlyStatus(m.status), value: m.progress });
        },
      });
      if (runRef.current !== id) return;
      workerRef.current = worker;
      const { data } = await worker.recognize(canvas);
      if (runRef.current !== id) return;
      const out = data.text.replace(/\n{3,}/g, "\n\n").trim();
      setText(out);
      setEmpty(!out);
      setHasResult(Boolean(out));
    } catch (e) {
      if (runRef.current === id) setError(errorMessage(e));
    } finally {
      worker?.terminate().catch(() => {});
      if (workerRef.current === worker) workerRef.current = null;
      if (runRef.current === id) {
        setBusy(false);
        setProgress(null);
      }
    }
  };

  const words = text.trim() ? text.trim().split(/\s+/).length : 0;
  const dir = RTL.has(lang) ? "rtl" : lang.includes("+") ? "auto" : "ltr";

  return (
    <div className="tool-stack">
      <FileDrop
        accept="image/*"
        onFiles={(files) => files[0] && pick(files[0])}
        label="Choose an image, drop it here, or paste it"
        hint="Screenshots, photos of documents and scans. You can also press Ctrl+V to paste a copied image."
      />

      {image && (
        <div className="tool-list-item" style={{ alignItems: "flex-start" }}>
          {/* eslint-disable-next-line @next/next/no-img-element -- local object URL preview */}
          <img
            src={image.url}
            alt="Selected image"
            style={{
              width: 96,
              height: 96,
              objectFit: "contain",
              borderRadius: 8,
              background: "var(--paper-2)",
              flexShrink: 0,
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
              {image.file.name}
            </div>
            <div className="tool-hint">{formatBytes(image.file.size)}</div>
          </div>
          <Btn variant="ghost" aria-label="Remove image" onClick={clear}>
            <X size={16} aria-hidden />
          </Btn>
        </div>
      )}

      <Field
        label="Language of the text"
        htmlFor="ocr-lang"
        hint="The first run downloads the language data (a few MB). After that it is cached in your browser and starts faster."
      >
        <Select id="ocr-lang" value={lang} onChange={(e) => setLang(e.target.value)} options={LANGS} disabled={busy} />
      </Field>

      <div className="tool-actions">
        <Btn onClick={run} disabled={!image || busy}>
          {busy ? "Extracting..." : "Extract text"}
        </Btn>
        {busy && (
          <Btn variant="ghost" onClick={cancel}>
            Cancel
          </Btn>
        )}
      </div>

      {progress && <Progress value={progress.value} label={progress.label} />}
      {error && <Notice tone="error">{error}</Notice>}
      {empty && (
        <Notice>
          No text was found. Make sure the language is right and the text is sharp, straight and
          not too small. Cropping to just the text area often helps.
        </Notice>
      )}

      {hasResult && (
        <>
          <Field label="Extracted text" htmlFor="ocr-text" hint={`${words} words, ${text.length} characters. You can edit the text here before copying.`}>
            <TextArea id="ocr-text" rows={12} dir={dir} value={text} onChange={(e) => setText(e.target.value)} />
          </Field>
          <div className="tool-actions">
            <CopyButton text={text} label="Copy text" />
            <Btn
              variant="ghost"
              disabled={!text}
              onClick={() =>
                downloadBlob(
                  new Blob([text], { type: "text/plain;charset=utf-8" }),
                  renameFile(image?.file.name ?? "image", "-text", "txt"),
                )
              }
            >
              <Download size={16} aria-hidden /> Download .txt
            </Btn>
          </div>
        </>
      )}
    </div>
  );
}
