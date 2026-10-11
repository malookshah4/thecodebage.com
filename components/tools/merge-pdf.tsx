"use client";

import { useState } from "react";
import { ArrowDown, ArrowUp, Download, GripVertical, X } from "lucide-react";
import {
  Btn,
  Field,
  FileDrop,
  Notice,
  Progress,
  TextInput,
  downloadBlob,
  formatBytes,
} from "./ui";

type PdfLib = typeof import("pdf-lib");

interface Item {
  id: string;
  file: File;
  pages?: number;
  status: "reading" | "ready" | "error";
  error?: string;
}

let idCounter = 0;
const newId = () => `pdf-${Date.now().toString(36)}-${(idCounter++).toString(36)}`;

function isPdf(f: File) {
  return f.type === "application/pdf" || /\.pdf$/i.test(f.name);
}

function pdfBlob(bytes: Uint8Array) {
  // pdf-lib types the result as Uint8Array<ArrayBufferLike>; it is always a plain ArrayBuffer.
  return new Blob([bytes as Uint8Array<ArrayBuffer>], { type: "application/pdf" });
}

/** Load a PDF, tolerating encryption flags. Throws a friendly error if unusable. */
async function openPdf(lib: PdfLib, file: File) {
  let doc;
  try {
    const bytes = await file.arrayBuffer();
    doc = await lib.PDFDocument.load(bytes, { ignoreEncryption: true, updateMetadata: false });
  } catch {
    throw new Error("Could not read this file. It may be damaged or not a real PDF.");
  }
  if (doc.isEncrypted) {
    throw new Error(
      "This PDF is password protected or locked. Remove the protection first, then add it again.",
    );
  }
  if (doc.getPageCount() === 0) throw new Error("This PDF has no pages.");
  return doc;
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

export default function MergePdf() {
  const [items, setItems] = useState<Item[]>([]);
  const [outName, setOutName] = useState("merged");
  const [busy, setBusy] = useState(false);
  const [progress, setProgress] = useState(0);
  const [error, setError] = useState("");
  const [result, setResult] = useState<Blob | null>(null);
  const [dragId, setDragId] = useState<string | null>(null);
  const [skipped, setSkipped] = useState(0);

  const update = (id: string, patch: Partial<Item>) =>
    setItems((prev) => prev.map((i) => (i.id === id ? { ...i, ...patch } : i)));

  const addFiles = async (files: File[]) => {
    const pdfs = files.filter(isPdf);
    setSkipped(files.length - pdfs.length);
    if (!pdfs.length) return;
    setResult(null);
    setError("");
    const added: Item[] = pdfs.map((file) => ({ id: newId(), file, status: "reading" }));
    setItems((prev) => [...prev, ...added]);

    let lib: PdfLib;
    try {
      lib = await import("pdf-lib");
    } catch {
      setError("The PDF engine failed to load. Check your connection and reload the page.");
      added.forEach((i) => update(i.id, { status: "error", error: "Not loaded" }));
      return;
    }
    // One at a time so a stack of big files does not spike memory.
    for (const item of added) {
      try {
        const doc = await openPdf(lib, item.file);
        update(item.id, { status: "ready", pages: doc.getPageCount() });
      } catch (e) {
        update(item.id, {
          status: "error",
          error: e instanceof Error ? e.message : "Could not read this file.",
        });
      }
    }
  };

  const move = (from: number, to: number) => {
    if (to < 0 || to >= items.length || from === to) return;
    setResult(null);
    setItems((prev) => {
      const next = [...prev];
      const [it] = next.splice(from, 1);
      next.splice(to, 0, it);
      return next;
    });
  };

  const remove = (id: string) => {
    setResult(null);
    setItems((prev) => prev.filter((x) => x.id !== id));
  };

  const ready = items.filter((i) => i.status === "ready");
  const reading = items.some((i) => i.status === "reading");
  const totalPages = ready.reduce((s, i) => s + (i.pages ?? 0), 0);
  const totalSize = ready.reduce((s, i) => s + i.file.size, 0);
  const fileName = cleanName(outName, "merged");

  const merge = async () => {
    if (ready.length < 2) {
      setError("Add at least two readable PDFs to merge.");
      return;
    }
    setBusy(true);
    setError("");
    setResult(null);
    setProgress(0);
    try {
      const lib = await import("pdf-lib");
      const out = await lib.PDFDocument.create();
      for (let n = 0; n < ready.length; n++) {
        const item = ready[n];
        let src;
        try {
          src = await openPdf(lib, item.file);
        } catch (e) {
          throw new Error(`${item.file.name}: ${e instanceof Error ? e.message : "could not be read."}`);
        }
        const pages = await out.copyPages(src, src.getPageIndices());
        pages.forEach((p) => out.addPage(p));
        setProgress((n + 1) / (ready.length + 1));
        await tick();
      }
      const bytes = await out.save();
      const blob = pdfBlob(bytes);
      setProgress(1);
      setResult(blob);
      downloadBlob(blob, fileName);
    } catch (e) {
      setError(
        e instanceof Error
          ? `Merging failed. ${e.message}`
          : "Merging failed. One of the files may be damaged.",
      );
    } finally {
      setBusy(false);
    }
  };

  return (
    <div className="tool-stack">
      <FileDrop
        accept="application/pdf,.pdf"
        multiple
        onFiles={addFiles}
        label="Choose PDF files or drop them here"
        hint="Add two or more. You can add more files later."
      />

      {skipped > 0 && (
        <Notice tone="error">
          {skipped === 1 ? "1 file was" : `${skipped} files were`} skipped because{" "}
          {skipped === 1 ? "it is" : "they are"} not a PDF.
        </Notice>
      )}

      {items.length > 0 && (
        <div className="tool-list">
          {items.map((i, idx) => (
            <div
              key={i.id}
              className="tool-list-item"
              draggable={!busy}
              onDragStart={(e) => {
                setDragId(i.id);
                e.dataTransfer.effectAllowed = "move";
              }}
              onDragOver={(e) => {
                if (dragId) e.preventDefault();
              }}
              onDrop={(e) => {
                e.preventDefault();
                const from = items.findIndex((x) => x.id === dragId);
                if (from >= 0) move(from, idx);
                setDragId(null);
              }}
              onDragEnd={() => setDragId(null)}
              style={{ opacity: dragId === i.id ? 0.5 : 1 }}
            >
              <span
                className="merge-grip"
                aria-hidden
                style={{ color: "var(--ink-muted)", cursor: "grab", display: "inline-flex" }}
              >
                <GripVertical size={16} />
              </span>
              <span
                style={{
                  fontFamily: "var(--font-mono-stack)",
                  fontSize: 12,
                  color: "var(--ink-muted)",
                  minWidth: 18,
                }}
              >
                {idx + 1}
              </span>
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
                  {i.status === "reading" && "Reading..."}
                  {i.status === "ready" &&
                    `${i.pages} page${i.pages === 1 ? "" : "s"} · ${formatBytes(i.file.size)}`}
                  {i.status === "error" && <span style={{ color: "#b3261e" }}>{i.error}</span>}
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
                onClick={() => remove(i.id)}
                style={{ padding: "0 12px" }}
              >
                <X size={16} aria-hidden />
              </Btn>
            </div>
          ))}
        </div>
      )}

      {items.length > 1 && (
        <div className="tool-hint">
          Use the arrows to change the order{" "}
          <span className="merge-drag-hint">or drag the files</span>. Files are joined top to bottom.
        </div>
      )}

      {items.length > 0 && (
        <Field label="Output file name" htmlFor="merge-out-name" hint={`Saved as ${fileName}`}>
          <TextInput
            id="merge-out-name"
            value={outName}
            onChange={(e) => {
              setOutName(e.target.value);
              setResult(null);
            }}
            placeholder="merged"
          />
        </Field>
      )}

      {busy && <Progress value={progress} label="Merging" />}

      {error && <Notice tone="error">{error}</Notice>}

      <div className="tool-actions">
        <Btn onClick={merge} disabled={ready.length < 2 || busy || reading}>
          {busy
            ? "Merging..."
            : reading
              ? "Reading files..."
              : ready.length < 2
                ? "Merge PDFs"
                : `Merge ${ready.length} PDFs`}
        </Btn>
        {result && (
          <Btn variant="ghost" onClick={() => downloadBlob(result, fileName)}>
            <Download size={16} aria-hidden /> Download again
          </Btn>
        )}
        {items.length > 0 && (
          <Btn
            variant="ghost"
            disabled={busy}
            onClick={() => {
              setItems([]);
              setResult(null);
              setError("");
              setSkipped(0);
            }}
          >
            Clear
          </Btn>
        )}
      </div>

      {ready.length > 0 && !result && (
        <div className="tool-hint">
          {ready.length} file{ready.length === 1 ? "" : "s"} ready · {totalPages} page
          {totalPages === 1 ? "" : "s"} · {formatBytes(totalSize)}
        </div>
      )}

      {result && (
        <Notice tone="success">
          Done. {fileName} has {totalPages} page{totalPages === 1 ? "" : "s"} and is{" "}
          {formatBytes(result.size)}. The download should start on its own.
        </Notice>
      )}
      <style>{`@media (hover: none), (max-width: 639px) { .merge-grip, .merge-drag-hint { display: none !important; } }`}</style>
    </div>
  );
}
