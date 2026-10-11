"use client";

import { useState } from "react";
import { Download, FileText, X } from "lucide-react";
import {
  Btn,
  Field,
  FileDrop,
  NumberInput,
  Notice,
  Progress,
  Segmented,
  TextInput,
  downloadBlob,
  formatBytes,
} from "./ui";

type PdfLib = typeof import("pdf-lib");
type PdfDoc = Awaited<ReturnType<PdfLib["PDFDocument"]["load"]>>;
type Mode = "extract" | "remove" | "every" | "chunks";

interface Loaded {
  file: File;
  pages: number;
}

interface Result {
  blob: Blob;
  name: string;
  files: number;
}

function pdfBlob(bytes: Uint8Array) {
  // pdf-lib types the result as Uint8Array<ArrayBufferLike>; it is always a plain ArrayBuffer.
  return new Blob([bytes as Uint8Array<ArrayBuffer>], { type: "application/pdf" });
}

async function openPdf(lib: PdfLib, file: File): Promise<PdfDoc> {
  let doc: PdfDoc;
  try {
    const bytes = await file.arrayBuffer();
    doc = await lib.PDFDocument.load(bytes, { ignoreEncryption: true, updateMetadata: false });
  } catch {
    throw new Error("Could not read this file. It may be damaged or not a real PDF.");
  }
  if (doc.isEncrypted) {
    throw new Error(
      "This PDF is password protected or locked, so its pages can't be copied. Remove the protection first, then try again.",
    );
  }
  if (doc.getPageCount() === 0) throw new Error("This PDF has no pages.");
  return doc;
}

/**
 * Parse "1-3, 5, 8-10" into 1-based page numbers in the order typed.
 * "7-" means 7 to the last page, "-3" means 1 to 3. "5-3" runs backwards.
 */
function parsePages(input: string, max: number): { pages: number[] } | { error: string } {
  const text = input
    .replace(/[‒-―−]/g, "-")
    .replace(/\s*-\s*/g, "-")
    .trim();
  if (!text) return { error: "Type the pages you want, for example 1-3, 5." };
  const pages: number[] = [];
  const seen = new Set<number>();
  const push = (n: number) => {
    if (!seen.has(n)) {
      seen.add(n);
      pages.push(n);
    }
  };
  const check = (n: number): string | null => {
    if (n < 1) return "Page numbers start at 1.";
    if (n > max) return `Page ${n} does not exist. This PDF has ${max} page${max === 1 ? "" : "s"}.`;
    return null;
  };
  for (const tok of text.split(/[,;\s]+/).filter(Boolean)) {
    const single = /^(\d+)$/.exec(tok);
    const range = /^(\d*)-(\d*)$/.exec(tok);
    if (single) {
      const n = Number(single[1]);
      const err = check(n);
      if (err) return { error: err };
      push(n);
    } else if (range && (range[1] || range[2])) {
      const a = range[1] ? Number(range[1]) : 1;
      const b = range[2] ? Number(range[2]) : max;
      const err = check(a) ?? check(b);
      if (err) return { error: err };
      const step = a <= b ? 1 : -1;
      for (let n = a; n !== b + step; n += step) push(n);
    } else {
      return { error: `"${tok}" is not a page number or range. Use something like 1-3, 5, 8-10.` };
    }
  }
  return { pages };
}

/** [1,2,3,5,7,8] -> "1-3, 5, 7-8" */
function describe(pages: number[]): string {
  const parts: string[] = [];
  let i = 0;
  while (i < pages.length) {
    let j = i;
    while (j + 1 < pages.length && pages[j + 1] === pages[j] + 1) j++;
    parts.push(j > i ? `${pages[i]}-${pages[j]}` : `${pages[i]}`);
    i = j + 1;
  }
  return parts.join(", ");
}

const tick = () => new Promise((r) => setTimeout(r, 0));

async function buildPdf(lib: PdfLib, src: PdfDoc, indices: number[]) {
  const out = await lib.PDFDocument.create();
  const copied = await out.copyPages(src, indices);
  copied.forEach((p) => out.addPage(p));
  return out.save();
}

export default function SplitPdf() {
  const [doc, setDoc] = useState<Loaded | null>(null);
  const [loading, setLoading] = useState(false);
  const [mode, setMode] = useState<Mode>("extract");
  const [range, setRange] = useState("1-3");
  const [removeText, setRemoveText] = useState("1");
  const [chunk, setChunk] = useState("2");
  const [busy, setBusy] = useState(false);
  const [progress, setProgress] = useState(0);
  const [error, setError] = useState("");
  const [result, setResult] = useState<Result | null>(null);

  const pick = async (files: File[]) => {
    const file = files[0];
    if (!file) return;
    setError("");
    setResult(null);
    if (!(file.type === "application/pdf" || /\.pdf$/i.test(file.name))) {
      setError("That file is not a PDF. Pick a file ending in .pdf.");
      return;
    }
    setLoading(true);
    try {
      const lib = await import("pdf-lib");
      const d = await openPdf(lib, file);
      const pages = d.getPageCount();
      setDoc({ file, pages });
      setRange(pages >= 3 ? "1-3" : "1");
      setRemoveText(pages > 1 ? "1" : "");
      setChunk(String(Math.max(1, Math.min(2, pages))));
    } catch (e) {
      setDoc(null);
      setError(e instanceof Error ? e.message : "Could not read this PDF.");
    } finally {
      setLoading(false);
    }
  };

  const max = doc?.pages ?? 0;
  const base = doc ? doc.file.name.replace(/\.pdf$/i, "") || "document" : "document";

  // Live validation for the current mode, so errors show while typing.
  let plan: { groups: number[][]; summary: string } | { error: string } | null = null;
  if (doc) {
    if (mode === "extract") {
      const r = parsePages(range, max);
      plan =
        "error" in r
          ? r
          : {
              groups: [r.pages],
              summary: `Makes 1 PDF with ${r.pages.length} page${r.pages.length === 1 ? "" : "s"}: ${describe(r.pages)}.`,
            };
    } else if (mode === "remove") {
      const r = parsePages(removeText, max);
      if ("error" in r) plan = r;
      else {
        const drop = new Set(r.pages);
        const keep = Array.from({ length: max }, (_, i) => i + 1).filter((n) => !drop.has(n));
        plan = keep.length
          ? {
              groups: [keep],
              summary: `Removes ${drop.size} page${drop.size === 1 ? "" : "s"} and keeps ${keep.length}: ${describe(keep)}.`,
            }
          : { error: "That would remove every page. Leave at least one." };
      }
    } else if (mode === "every") {
      plan = {
        groups: Array.from({ length: max }, (_, i) => [i + 1]),
        summary:
          max === 1
            ? "This PDF has only one page, so you get one file."
            : `Makes ${max} PDFs, one per page, in a ZIP file.`,
      };
    } else {
      const n = Number(chunk);
      if (!Number.isInteger(n) || n < 1) plan = { error: "Pages per file must be a whole number, 1 or more." };
      else {
        const groups: number[][] = [];
        for (let s = 1; s <= max; s += n) {
          groups.push(Array.from({ length: Math.min(n, max - s + 1) }, (_, i) => s + i));
        }
        plan = {
          groups,
          summary:
            groups.length === 1
              ? `That covers the whole PDF in one file. Pick a smaller number to split it.`
              : `Makes ${groups.length} PDFs: ${groups
                  .slice(0, 6)
                  .map((g) => describe(g))
                  .join(" | ")}${groups.length > 6 ? " | ..." : ""}`,
        };
      }
    }
  }

  const run = async () => {
    if (!doc || !plan || "error" in plan) return;
    const { groups } = plan;
    setBusy(true);
    setError("");
    setResult(null);
    setProgress(0);
    try {
      const lib = await import("pdf-lib");
      const src = await openPdf(lib, doc.file);
      let res: Result;
      if (groups.length === 1) {
        const bytes = await buildPdf(lib, src, groups[0].map((p) => p - 1));
        setProgress(0.95);
        const suffix =
          mode === "remove" ? "-edited" : mode === "extract" ? `-pages-${describe(groups[0]).replace(/, /g, "_")}` : "-split";
        const name = `${base}${suffix.length > 60 ? "-extracted" : suffix}.pdf`;
        res = { blob: pdfBlob(bytes), name, files: 1 };
      } else {
        const JSZip = (await import("jszip")).default;
        const zip = new JSZip();
        const pad = String(max).length;
        for (let g = 0; g < groups.length; g++) {
          const pages = groups[g];
          const bytes = await buildPdf(lib, src, pages.map((p) => p - 1));
          const label =
            pages.length === 1
              ? `page-${String(pages[0]).padStart(pad, "0")}`
              : `pages-${String(pages[0]).padStart(pad, "0")}-${String(pages[pages.length - 1]).padStart(pad, "0")}`;
          zip.file(`${base}-${label}.pdf`, bytes);
          setProgress(((g + 1) / groups.length) * 0.85);
          if (g % 5 === 4) await tick();
        }
        const blob = await zip.generateAsync({ type: "blob", compression: "STORE" }, (meta) =>
          setProgress(0.85 + (meta.percent / 100) * 0.15),
        );
        res = { blob, name: `${base}-${mode === "every" ? "pages" : "parts"}.zip`, files: groups.length };
      }
      setProgress(1);
      setResult(res);
      downloadBlob(res.blob, res.name);
    } catch (e) {
      setError(e instanceof Error ? `Splitting failed. ${e.message}` : "Splitting failed.");
    } finally {
      setBusy(false);
    }
  };

  const changeMode = (m: Mode) => {
    setMode(m);
    setResult(null);
  };

  return (
    <div className="tool-stack">
      {!doc ? (
        <FileDrop
          accept="application/pdf,.pdf"
          onFiles={pick}
          label={loading ? "Reading PDF..." : "Choose a PDF or drop it here"}
          hint="One file at a time. Nothing is uploaded."
        />
      ) : (
        <div className="tool-list-item">
          <FileText size={20} aria-hidden style={{ color: "var(--ink-muted)", flexShrink: 0 }} />
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
              {doc.file.name}
            </div>
            <div className="tool-hint">
              {doc.pages} page{doc.pages === 1 ? "" : "s"} · {formatBytes(doc.file.size)}
            </div>
          </div>
          <Btn
            variant="ghost"
            aria-label="Remove this PDF"
            disabled={busy}
            onClick={() => {
              setDoc(null);
              setResult(null);
              setError("");
            }}
            style={{ padding: "0 12px" }}
          >
            <X size={16} aria-hidden />
          </Btn>
        </div>
      )}

      {doc && (
        <>
          <Field label="What do you want to do?">
            <Segmented
              value={mode}
              onChange={changeMode}
              ariaLabel="Split mode"
              options={[
                { value: "extract", label: "Extract pages" },
                { value: "remove", label: "Remove pages" },
                { value: "every", label: "Split every page" },
                { value: "chunks", label: "Split into chunks" },
              ]}
            />
          </Field>

          {mode === "extract" && (
            <Field
              label="Pages to keep"
              htmlFor="split-range"
              hint={`Pages 1 to ${max}. Use commas and ranges like 1-3, 5, 8-10. "7-" means page 7 to the end.`}
            >
              <TextInput
                id="split-range"
                value={range}
                inputMode="text"
                autoComplete="off"
                onChange={(e) => {
                  setRange(e.target.value);
                  setResult(null);
                }}
              />
            </Field>
          )}

          {mode === "remove" && (
            <Field
              label="Pages to remove"
              htmlFor="split-remove"
              hint={`Pages 1 to ${max}. For example 2, 4-6. Everything else is kept.`}
            >
              <TextInput
                id="split-remove"
                value={removeText}
                autoComplete="off"
                onChange={(e) => {
                  setRemoveText(e.target.value);
                  setResult(null);
                }}
              />
            </Field>
          )}

          {mode === "chunks" && (
            <Field label="Pages per file" htmlFor="split-chunk" hint="The last file may have fewer pages.">
              <NumberInput
                id="split-chunk"
                min={1}
                max={max}
                step={1}
                inputMode="numeric"
                value={chunk}
                onChange={(e) => {
                  setChunk(e.target.value);
                  setResult(null);
                }}
              />
            </Field>
          )}

          {plan && ("error" in plan ? <Notice tone="error">{plan.error}</Notice> : <Notice>{plan.summary}</Notice>)}
        </>
      )}

      {busy && <Progress value={progress} label="Splitting" />}
      {error && <Notice tone="error">{error}</Notice>}

      {doc && (
        <div className="tool-actions">
          <Btn onClick={run} disabled={busy || !plan || "error" in plan}>
            {busy
              ? "Working..."
              : mode === "extract"
                ? "Extract pages"
                : mode === "remove"
                  ? "Remove pages"
                  : "Split PDF"}
          </Btn>
          {result && (
            <Btn variant="ghost" onClick={() => downloadBlob(result.blob, result.name)}>
              <Download size={16} aria-hidden /> Download again
            </Btn>
          )}
        </div>
      )}

      {result && (
        <Notice tone="success">
          Done. {result.name} ({formatBytes(result.blob.size)})
          {result.files > 1 ? ` holds ${result.files} PDFs.` : "."} The download should start on its own.
        </Notice>
      )}
    </div>
  );
}
