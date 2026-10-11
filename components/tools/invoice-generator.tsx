"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import type { PDFFont, PDFPage, RGB } from "pdf-lib";
import { Download, ImagePlus, Plus, RotateCcw, X } from "lucide-react";
import {
  Btn,
  Field,
  NumberInput,
  Notice,
  Segmented,
  Select,
  TextArea,
  TextInput,
  downloadBlob,
  loadImage,
} from "./ui";

/* ===== Data ===== */

type Currency = "PKR" | "USD" | "EUR" | "GBP" | "AED" | "SAR" | "INR" | "CUSTOM";

// `screen` is what the form shows; `pdf` is what the PDF font can actually print.
const CURRENCIES: Record<Exclude<Currency, "CUSTOM">, { label: string; screen: string; pdf: string }> = {
  PKR: { label: "PKR (Rs)", screen: "Rs", pdf: "Rs" },
  USD: { label: "USD ($)", screen: "$", pdf: "$" },
  EUR: { label: "EUR (€)", screen: "€", pdf: "€" },
  GBP: { label: "GBP (£)", screen: "£", pdf: "£" },
  AED: { label: "AED", screen: "AED", pdf: "AED" },
  SAR: { label: "SAR", screen: "SAR", pdf: "SAR" },
  INR: { label: "INR (₹)", screen: "₹", pdf: "INR" },
};

interface LineItem {
  id: string;
  description: string;
  qty: string;
  rate: string;
}

interface Invoice {
  logo: string;
  fromName: string;
  fromAddress: string;
  fromContact: string;
  toName: string;
  toAddress: string;
  toContact: string;
  number: string;
  issueDate: string;
  dueDate: string;
  currency: Currency;
  customSymbol: string;
  items: LineItem[];
  taxPct: string;
  discountType: "amount" | "percent";
  discount: string;
  shipping: string;
  notes: string;
}

const STORAGE_KEY = "codebage-invoice-draft-v1";

const START: Invoice = {
  logo: "",
  fromName: "",
  fromAddress: "",
  fromContact: "",
  toName: "",
  toAddress: "",
  toContact: "",
  number: "INV-001",
  issueDate: "",
  dueDate: "",
  currency: "PKR",
  customSymbol: "",
  items: [
    { id: "s1", description: "Logo design, 3 concepts and 2 revisions", qty: "1", rate: "15000" },
    { id: "s2", description: "Business card design", qty: "2", rate: "3500" },
  ],
  taxPct: "0",
  discountType: "amount",
  discount: "0",
  shipping: "0",
  notes: "",
};

let idCounter = 0;
const newId = () => `li-${Date.now().toString(36)}-${(idCounter++).toString(36)}`;
const blankItem = (): LineItem => ({ id: newId(), description: "", qty: "1", rate: "" });

function num(s: string): number {
  const n = parseFloat(s);
  return Number.isFinite(n) ? n : 0;
}

function isoDate(d: Date) {
  const p = (n: number) => String(n).padStart(2, "0");
  return `${d.getFullYear()}-${p(d.getMonth() + 1)}-${p(d.getDate())}`;
}

function defaultDates() {
  const now = new Date();
  const due = new Date(now);
  due.setDate(due.getDate() + 14);
  return { issueDate: isoDate(now), dueDate: isoDate(due) };
}

const MONTHS = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
function prettyDate(iso: string) {
  const m = /^(\d{4})-(\d{2})-(\d{2})$/.exec(iso);
  if (!m) return iso;
  return `${Number(m[3])} ${MONTHS[Number(m[2]) - 1] ?? m[2]} ${m[1]}`;
}

/** "INV-009" -> "INV-010", keeps zero padding. */
function nextNumber(n: string) {
  const m = /^(.*?)(\d+)(\D*)$/.exec(n);
  if (!m) return n ? `${n}-2` : "INV-001";
  const next = String(Number(m[2]) + 1).padStart(m[2].length, "0");
  return `${m[1]}${next}${m[3]}`;
}

/** Accept only a well-formed draft; fill anything missing from defaults. */
function readDraft(raw: string | null): Invoice | null {
  if (!raw) return null;
  try {
    const d = JSON.parse(raw) as Partial<Invoice>;
    if (!d || typeof d !== "object") return null;
    const str = (v: unknown, fb: string) => (typeof v === "string" ? v : fb);
    const items = Array.isArray(d.items)
      ? d.items
          .filter((i): i is LineItem => !!i && typeof i === "object")
          .map((i) => ({
            id: newId(),
            description: str(i.description, ""),
            qty: str(i.qty, "1"),
            rate: str(i.rate, ""),
          }))
      : [];
    const currency = (Object.keys(CURRENCIES) as string[]).concat("CUSTOM").includes(String(d.currency))
      ? (d.currency as Currency)
      : "PKR";
    return {
      logo: str(d.logo, "").startsWith("data:image/") ? str(d.logo, "") : "",
      fromName: str(d.fromName, ""),
      fromAddress: str(d.fromAddress, ""),
      fromContact: str(d.fromContact, ""),
      toName: str(d.toName, ""),
      toAddress: str(d.toAddress, ""),
      toContact: str(d.toContact, ""),
      number: str(d.number, START.number),
      issueDate: str(d.issueDate, ""),
      dueDate: str(d.dueDate, ""),
      currency,
      customSymbol: str(d.customSymbol, ""),
      items: items.length ? items : [blankItem()],
      taxPct: str(d.taxPct, "0"),
      discountType: d.discountType === "percent" ? "percent" : "amount",
      discount: str(d.discount, "0"),
      shipping: str(d.shipping, "0"),
      notes: str(d.notes, ""),
    };
  } catch {
    return null;
  }
}

/* ===== Totals ===== */

interface Totals {
  subtotal: number;
  discount: number;
  tax: number;
  shipping: number;
  total: number;
}

function computeTotals(inv: Invoice): Totals {
  const subtotal = inv.items.reduce((s, i) => s + num(i.qty) * num(i.rate), 0);
  const rawDiscount =
    inv.discountType === "percent" ? (subtotal * num(inv.discount)) / 100 : num(inv.discount);
  const discount = Math.min(Math.max(0, rawDiscount), Math.max(0, subtotal));
  const tax = ((subtotal - discount) * num(inv.taxPct)) / 100;
  const shipping = num(inv.shipping);
  return { subtotal, discount, tax, shipping, total: subtotal - discount + tax + shipping };
}

function fmt(n: number) {
  return n.toLocaleString("en-US", { minimumFractionDigits: 2, maximumFractionDigits: 2 });
}

function money(sym: string, n: number) {
  const neg = n < 0 ? "-" : "";
  const body = fmt(Math.abs(n));
  if (!sym) return `${neg}${body}`;
  // Single-character symbols hug the number ($12.00); codes get a space (Rs 12.00).
  return [...sym].length === 1 ? `${neg}${sym}${body}` : `${neg}${sym} ${body}`;
}

/* ===== PDF text safety ===== */

// pdf-lib's standard fonts use WinAnsi encoding. Anything outside it throws, so every
// string is cleaned before drawing.
const WIN_ANSI_EXTRA = [
  0x20ac, 0x201a, 0x0192, 0x201e, 0x2026, 0x2020, 0x2021, 0x02c6, 0x2030, 0x0160, 0x2039, 0x0152,
  0x017d, 0x2018, 0x2019, 0x201c, 0x201d, 0x2022, 0x2013, 0x2014, 0x02dc, 0x2122, 0x0161, 0x203a,
  0x0153, 0x017e, 0x0178,
];
const WIN_ANSI = new Set<number>(WIN_ANSI_EXTRA);
for (let c = 0x20; c <= 0x7e; c++) WIN_ANSI.add(c);
for (let c = 0xa0; c <= 0xff; c++) WIN_ANSI.add(c);

const SWAPS: Record<number, string> = {
  0x20b9: "Rs", // Indian rupee sign
  0x20a8: "Rs", // rupee sign
  0x09f3: "Tk", // taka
  0x20ba: "TL",
  0x20a6: "NGN",
  0x20b1: "PHP",
  0x20a9: "KRW",
  0x20bd: "RUB",
  0x20ab: "VND",
  0xfdfc: "SAR",
  0x2212: "-",
  0x2010: "-",
  0x2011: "-",
  0x2032: "'",
  0x2033: '"',
  0x2009: " ",
  0x2002: " ",
  0x2003: " ",
  0x202f: " ",
  0x200b: "",
  0x200c: "",
  0x200d: "",
  0xfeff: "",
  0x09: "  ",
};

function cleanChar(ch: string): string {
  const cp = ch.codePointAt(0) ?? 0;
  if (WIN_ANSI.has(cp)) return ch;
  if (cp in SWAPS) return SWAPS[cp];
  if (cp < 0x20) return "";
  // Letters with accents not in WinAnsi (for example "ő") fall back to the base letter.
  const base = ch.normalize("NFKD").replace(/[̀-ͯ]/g, "");
  if (base && [...base].every((c) => WIN_ANSI.has(c.codePointAt(0) ?? 0))) return base;
  return "?";
}

/** Make a single line safe for the PDF font. */
function clean(s: string): string {
  let out = "";
  for (const ch of s.normalize("NFC").replace(/[\r\n]+/g, " ")) out += cleanChar(ch);
  return out;
}

/** Same as clean but keeps line breaks. */
function cleanMulti(s: string): string {
  return s
    .replace(/\r\n?/g, "\n")
    .split("\n")
    .map(clean)
    .join("\n");
}

function hasUnprintable(s: string): boolean {
  for (const ch of s.normalize("NFC")) {
    if (ch === "\n" || ch === "\r") continue;
    if (cleanChar(ch) === "?" && ch !== "?") return true;
  }
  return false;
}

function pdfSymbol(inv: Invoice): string {
  if (inv.currency !== "CUSTOM") return CURRENCIES[inv.currency].pdf;
  const raw = inv.customSymbol.trim();
  const c = clean(raw);
  if (!hasUnprintable(raw)) return c;
  return c.replace(/\?/g, "").trim();
}

function screenSymbol(inv: Invoice): string {
  return inv.currency === "CUSTOM" ? inv.customSymbol.trim() : CURRENCIES[inv.currency].screen;
}

/** Word-wrap already-cleaned text to a width; breaks very long words too. */
function wrap(text: string, f: PDFFont, size: number, maxW: number): string[] {
  const out: string[] = [];
  for (const para of text.split("\n")) {
    let line = "";
    for (let w of para.split(/ +/)) {
      while (w && f.widthOfTextAtSize(w, size) > maxW) {
        let cut = w.length - 1;
        while (cut > 1 && f.widthOfTextAtSize(w.slice(0, cut), size) > maxW) cut--;
        if (line) {
          out.push(line);
          line = "";
        }
        out.push(w.slice(0, cut));
        w = w.slice(cut);
      }
      const test = line ? `${line} ${w}` : w;
      if (f.widthOfTextAtSize(test, size) <= maxW) line = test;
      else {
        out.push(line);
        line = w;
      }
    }
    out.push(line);
  }
  return out;
}

/* ===== PDF builder ===== */

async function buildPdf(inv: Invoice, t: Totals): Promise<Uint8Array> {
  const { PDFDocument, StandardFonts, rgb } = await import("pdf-lib");
  const pdf = await PDFDocument.create();
  const font = await pdf.embedFont(StandardFonts.Helvetica);
  const bold = await pdf.embedFont(StandardFonts.HelveticaBold);

  const W = 595.28;
  const H = 841.89;
  const M = 48;
  const BOTTOM = M + 28; // keep clear of the footer
  const ink = rgb(0.11, 0.12, 0.14);
  const muted = rgb(0.43, 0.45, 0.49);
  const rule = rgb(0.86, 0.87, 0.89);
  const headFill = rgb(0.94, 0.95, 0.96);
  const accent = rgb(0.12, 0.23, 0.4);
  const sym = pdfSymbol(inv);
  const number = clean(inv.number.trim());

  let page: PDFPage = pdf.addPage([W, H]);

  // clean() is idempotent, so running it again here is a cheap last line of defence.
  const text = (s: string, x: number, y: number, size: number, f: PDFFont = font, color: RGB = ink) => {
    const c = clean(s);
    if (c) page.drawText(c, { x, y, size, font: f, color });
  };
  const right = (s: string, xr: number, y: number, size: number, f: PDFFont = font, color: RGB = ink) =>
    text(s, xr - f.widthOfTextAtSize(clean(s), size), y, size, f, color);

  /* Header: logo left, title right */
  let leftY = H - M;
  if (inv.logo) {
    try {
      const img = inv.logo.startsWith("data:image/png")
        ? await pdf.embedPng(inv.logo)
        : await pdf.embedJpg(inv.logo);
      const k = Math.min(160 / img.width, 64 / img.height, 1);
      const dw = img.width * k;
      const dh = img.height * k;
      page.drawImage(img, { x: M, y: H - M - dh, width: dw, height: dh });
      leftY = H - M - dh - 22;
    } catch {
      // A broken logo should not stop the invoice; carry on without it.
      leftY = H - M - 4;
    }
  } else {
    leftY = H - M - 4;
  }

  right("INVOICE", W - M, H - M - 24, 26, bold, accent);

  /* From block (left) */
  const colW = 250;
  const from = [clean(inv.fromName.trim())].filter(Boolean);
  if (from.length) {
    leftY -= 10;
    text(from[0], M, leftY, 13, bold);
    leftY -= 16;
  }
  for (const l of wrap(cleanMulti(inv.fromAddress.trim()), font, 10, colW).filter(Boolean)) {
    text(l, M, leftY, 10, font, muted);
    leftY -= 13.5;
  }
  for (const l of wrap(cleanMulti(inv.fromContact.trim()), font, 10, colW).filter(Boolean)) {
    text(l, M, leftY, 10, font, muted);
    leftY -= 13.5;
  }

  /* Meta block (right) */
  let rightY = H - M - 58;
  const metaL = W - M - 210;
  const meta: [string, string][] = [
    ["Invoice no.", number || "-"],
    ["Issue date", clean(prettyDate(inv.issueDate)) || "-"],
    ["Due date", clean(prettyDate(inv.dueDate)) || "-"],
  ];
  for (const [label, value] of meta) {
    text(label, metaL, rightY, 10, font, muted);
    right(value, W - M, rightY, 10, font, ink);
    rightY -= 16;
  }
  rightY -= 4;
  page.drawRectangle({ x: metaL - 8, y: rightY - 7, width: W - M - metaL + 8, height: 22, color: headFill });
  text("Amount due", metaL, rightY, 10.5, bold, ink);
  right(money(sym, t.total), W - M - 6, rightY, 10.5, bold, accent);
  rightY -= 22;

  let y = Math.min(leftY, rightY) - 18;

  /* Bill to */
  const toName = clean(inv.toName.trim());
  const toAddr = wrap(cleanMulti(inv.toAddress.trim()), font, 10, 300).filter(Boolean);
  const toContact = wrap(cleanMulti(inv.toContact.trim()), font, 10, 300).filter(Boolean);
  if (toName || toAddr.length || toContact.length) {
    text("BILL TO", M, y, 8.5, bold, muted);
    y -= 16;
    if (toName) {
      text(toName, M, y, 12, bold);
      y -= 15;
    }
    for (const l of [...toAddr, ...toContact]) {
      text(l, M, y, 10, font, muted);
      y -= 13.5;
    }
    y -= 14;
  }

  /* Items table */
  const amountR = W - M - 8;
  const rateR = amountR - 100;
  const qtyR = rateR - 90;
  const descX = M + 8;
  const descW = qtyR - 50 - descX;

  const tableHeader = () => {
    page.drawRectangle({ x: M, y: y - 22, width: W - M * 2, height: 22, color: headFill });
    const ty = y - 14.5;
    text("DESCRIPTION", descX, ty, 8.5, bold, muted);
    right("QTY", qtyR, ty, 8.5, bold, muted);
    right("RATE", rateR, ty, 8.5, bold, muted);
    right("AMOUNT", amountR, ty, 8.5, bold, muted);
    y -= 22;
  };
  const newPage = () => {
    page = pdf.addPage([W, H]);
    y = H - M;
  };

  tableHeader();
  const rows = inv.items.filter((i) => i.description.trim() || num(i.rate) !== 0);
  for (const item of rows) {
    const lines = wrap(cleanMulti(item.description.trim()), font, 10, descW);
    const rowH = lines.length * 13 + 14;
    if (y - rowH < BOTTOM) {
      newPage();
      tableHeader();
    }
    let ly = y - 17;
    const qty = num(item.qty);
    const rate = num(item.rate);
    right(clean(String(Number(qty.toFixed(4)))), qtyR, ly, 10);
    right(clean(money(sym, rate)), rateR, ly, 10);
    right(clean(money(sym, qty * rate)), amountR, ly, 10);
    for (const l of lines) {
      text(l, descX, ly, 10);
      ly -= 13;
    }
    y -= rowH;
    page.drawLine({ start: { x: M, y }, end: { x: W - M, y }, thickness: 0.6, color: rule });
  }

  /* Totals */
  const totalRows: [string, string][] = [["Subtotal", money(sym, t.subtotal)]];
  if (t.discount > 0) {
    const label = inv.discountType === "percent" ? `Discount (${clean(inv.discount.trim())}%)` : "Discount";
    totalRows.push([label, money(sym, -t.discount)]);
  }
  if (num(inv.taxPct) !== 0) totalRows.push([`Tax (${clean(inv.taxPct.trim())}%)`, money(sym, t.tax)]);
  if (t.shipping !== 0) totalRows.push(["Shipping", money(sym, t.shipping)]);
  const blockH = totalRows.length * 18 + 52;
  if (y - blockH < BOTTOM) newPage();
  y -= 20;
  const totL = W - M - 230;
  for (const [label, value] of totalRows) {
    text(label, totL, y, 10, font, muted);
    right(value, amountR, y, 10);
    y -= 18;
  }
  y -= 10;
  page.drawRectangle({ x: totL - 10, y: y - 9, width: W - M - totL + 10, height: 27, color: accent });
  const white = rgb(1, 1, 1);
  text("Total", totL, y, 12, bold, white);
  right(money(sym, t.total), amountR, y, 12, bold, white);
  y -= 40;

  /* Notes */
  const notes = cleanMulti(inv.notes.trim());
  if (notes) {
    const lines = wrap(notes, font, 10, W - M * 2);
    if (y - 40 < BOTTOM) newPage();
    text("NOTES AND PAYMENT DETAILS", M, y, 8.5, bold, muted);
    y -= 16;
    for (const l of lines) {
      if (y < BOTTOM) newPage();
      text(l, M, y, 10);
      y -= 13.5;
    }
  }

  /* Footer on every page */
  const pages = pdf.getPages();
  const fromName = clean(inv.fromName.trim());
  pages.forEach((p, i) => {
    const parts = [fromName, number ? `Invoice ${number}` : "", pages.length > 1 ? `Page ${i + 1} of ${pages.length}` : ""];
    const s = parts.filter(Boolean).join("   ·   ");
    if (!s) return;
    p.drawLine({ start: { x: M, y: M + 6 }, end: { x: W - M, y: M + 6 }, thickness: 0.6, color: rule });
    const w = font.widthOfTextAtSize(s, 8.5);
    p.drawText(s, { x: (W - w) / 2, y: M - 8, size: 8.5, font, color: muted });
  });

  pdf.setTitle(number ? `Invoice ${number}` : "Invoice");
  if (fromName) pdf.setAuthor(fromName);
  pdf.setCreator("thecodebage.com invoice generator");
  return pdf.save();
}

/* ===== Logo ===== */

async function logoToDataUrl(file: File): Promise<string> {
  const img = await loadImage(file);
  try {
    const max = 600;
    let w = img.naturalWidth;
    let h = img.naturalHeight;
    if (!w || !h) throw new Error("This image has no size.");
    if (Math.max(w, h) > max) {
      const k = max / Math.max(w, h);
      w = Math.max(1, Math.round(w * k));
      h = Math.max(1, Math.round(h * k));
    }
    const canvas = document.createElement("canvas");
    canvas.width = w;
    canvas.height = h;
    const ctx = canvas.getContext("2d");
    if (!ctx) throw new Error("Your browser could not create an image canvas.");
    const jpg = file.type === "image/jpeg";
    if (jpg) {
      ctx.fillStyle = "#ffffff";
      ctx.fillRect(0, 0, w, h);
    }
    ctx.drawImage(img, 0, 0, w, h);
    return canvas.toDataURL(jpg ? "image/jpeg" : "image/png", 0.9);
  } finally {
    URL.revokeObjectURL(img.src);
  }
}

/* ===== Component ===== */

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <section>
      <h2 style={{ fontSize: 16, fontWeight: 600, color: "var(--ink)", marginBottom: 12 }}>{title}</h2>
      {children}
    </section>
  );
}

const hr = <hr style={{ border: 0, borderTop: "1px solid var(--line)" }} />;

export default function InvoiceGenerator() {
  const [inv, setInv] = useState<Invoice>(START);
  const [loaded, setLoaded] = useState(false);
  const [saveState, setSaveState] = useState<"idle" | "saved" | "nologo" | "failed">("idle");
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");
  const [logoError, setLogoError] = useState("");
  const logoInput = useRef<HTMLInputElement>(null);

  // Restore the saved draft (or fill today's dates) once we are in the browser.
  useEffect(() => {
    let draft: Invoice | null = null;
    try {
      draft = readDraft(localStorage.getItem(STORAGE_KEY));
    } catch {
      // Storage blocked (private mode, strict settings). Start fresh.
    }
    const restored = draft ?? { ...START, ...defaultDates() };
    // Deferred so the first client render matches the static HTML.
    const t = setTimeout(() => {
      setInv(restored);
      setLoaded(true);
    }, 0);
    return () => clearTimeout(t);
  }, []);

  // Autosave, debounced.
  useEffect(() => {
    if (!loaded) return;
    const t = setTimeout(() => {
      try {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(inv));
        setSaveState("saved");
      } catch {
        // Usually the logo pushed it over the storage quota; save the rest.
        try {
          localStorage.setItem(STORAGE_KEY, JSON.stringify({ ...inv, logo: "" }));
          setSaveState("nologo");
        } catch {
          setSaveState("failed");
        }
      }
    }, 400);
    return () => clearTimeout(t);
  }, [inv, loaded]);

  const set = <K extends keyof Invoice>(key: K, value: Invoice[K]) =>
    setInv((prev) => ({ ...prev, [key]: value }));

  const setItem = (id: string, patch: Partial<LineItem>) =>
    setInv((prev) => ({ ...prev, items: prev.items.map((i) => (i.id === id ? { ...i, ...patch } : i)) }));

  const addItem = () => setInv((prev) => ({ ...prev, items: [...prev.items, blankItem()] }));

  const removeItem = (id: string) =>
    setInv((prev) => {
      const items = prev.items.filter((i) => i.id !== id);
      return { ...prev, items: items.length ? items : [blankItem()] };
    });

  const totals = useMemo(() => computeTotals(inv), [inv]);
  const sym = screenSymbol(inv);

  const unprintable = useMemo(() => {
    const fields = [
      inv.fromName,
      inv.fromAddress,
      inv.fromContact,
      inv.toName,
      inv.toAddress,
      inv.toContact,
      inv.number,
      inv.notes,
      ...inv.items.map((i) => i.description),
    ];
    return fields.some(hasUnprintable);
  }, [inv]);
  const customSymbolBad = inv.currency === "CUSTOM" && hasUnprintable(inv.customSymbol);

  const pickLogo = async (file: File | undefined) => {
    if (!file) return;
    setLogoError("");
    if (!/^image\/(png|jpeg|webp)$/.test(file.type)) {
      setLogoError("Use a PNG or JPG image for the logo.");
      return;
    }
    try {
      const url = await logoToDataUrl(file);
      set("logo", url);
    } catch (e) {
      setLogoError(e instanceof Error ? e.message : "This image could not be used.");
    }
  };

  const download = async () => {
    setError("");
    const hasItems = inv.items.some((i) => i.description.trim() || num(i.rate) !== 0);
    if (!hasItems) {
      setError("Add at least one line item with a description or a rate.");
      return;
    }
    setBusy(true);
    try {
      const bytes = await buildPdf(inv, totals);
      // pdf-lib types the result as Uint8Array<ArrayBufferLike>; it is always a plain ArrayBuffer.
      const blob = new Blob([bytes as Uint8Array<ArrayBuffer>], { type: "application/pdf" });
      const safe = clean(inv.number.trim()).replace(/[^A-Za-z0-9._-]+/g, "-").replace(/^-+|-+$/g, "");
      downloadBlob(blob, `Invoice${safe ? `-${safe}` : ""}.pdf`);
    } catch (e) {
      setError(
        e instanceof Error ? `Could not build the PDF. ${e.message}` : "Could not build the PDF. Please try again.",
      );
    } finally {
      setBusy(false);
    }
  };

  const newInvoice = () => {
    const ok = window.confirm(
      "Start a new invoice? Your business details, logo, currency, tax and notes are kept. The client and items are cleared.",
    );
    if (!ok) return;
    setError("");
    setInv((prev) => ({
      ...prev,
      ...defaultDates(),
      number: nextNumber(prev.number.trim()),
      toName: "",
      toAddress: "",
      toContact: "",
      items: [blankItem()],
      discount: "0",
      shipping: "0",
    }));
  };

  return (
    <div className="tool-stack">
      <Section title="Your business">
        <div className="tool-stack">
          <div className="inv-logo-row">
            {inv.logo ? (
              <>
                {/* Data URL preview; next/image can't optimise it. */}
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={inv.logo} alt="Your logo" className="inv-logo" />
                <Btn variant="ghost" onClick={() => set("logo", "")}>
                  <X size={16} aria-hidden /> Remove logo
                </Btn>
              </>
            ) : (
              <Btn variant="ghost" onClick={() => logoInput.current?.click()}>
                <ImagePlus size={16} aria-hidden /> Add logo (optional)
              </Btn>
            )}
            <input
              ref={logoInput}
              type="file"
              accept="image/png,image/jpeg,image/webp"
              hidden
              onChange={(e) => {
                void pickLogo(e.target.files?.[0]);
                e.target.value = "";
              }}
            />
          </div>
          {logoError && <Notice tone="error">{logoError}</Notice>}
          <div className="tool-grid cols-2">
            <Field label="Business or your name" htmlFor="inv-from-name">
              <TextInput
                id="inv-from-name"
                value={inv.fromName}
                onChange={(e) => set("fromName", e.target.value)}
                placeholder="Your business name"
                autoComplete="organization"
              />
            </Field>
            <Field label="Email / phone" htmlFor="inv-from-contact">
              <TextInput
                id="inv-from-contact"
                value={inv.fromContact}
                onChange={(e) => set("fromContact", e.target.value)}
                placeholder="hello@example.com, 0300 1234567"
              />
            </Field>
          </div>
          <Field label="Address" htmlFor="inv-from-address">
            <TextArea
              id="inv-from-address"
              value={inv.fromAddress}
              onChange={(e) => set("fromAddress", e.target.value)}
              placeholder={"Office 4, Main Boulevard\nLahore, Pakistan"}
              style={{ minHeight: 84 }}
            />
          </Field>
        </div>
      </Section>

      {hr}

      <Section title="Bill to">
        <div className="tool-stack">
          <div className="tool-grid cols-2">
            <Field label="Client name" htmlFor="inv-to-name">
              <TextInput
                id="inv-to-name"
                value={inv.toName}
                onChange={(e) => set("toName", e.target.value)}
                placeholder="Client or company name"
              />
            </Field>
            <Field label="Client email / phone" htmlFor="inv-to-contact">
              <TextInput
                id="inv-to-contact"
                value={inv.toContact}
                onChange={(e) => set("toContact", e.target.value)}
                placeholder="Optional"
              />
            </Field>
          </div>
          <Field label="Client address" htmlFor="inv-to-address">
            <TextArea
              id="inv-to-address"
              value={inv.toAddress}
              onChange={(e) => set("toAddress", e.target.value)}
              placeholder="Optional"
              style={{ minHeight: 84 }}
            />
          </Field>
        </div>
      </Section>

      {hr}

      <Section title="Invoice details">
        <div className="tool-stack">
          <div className="tool-grid cols-4">
            <Field label="Invoice number" htmlFor="inv-number">
              <TextInput id="inv-number" value={inv.number} onChange={(e) => set("number", e.target.value)} />
            </Field>
            <Field label="Issue date" htmlFor="inv-issue">
              <TextInput
                id="inv-issue"
                type="date"
                value={inv.issueDate}
                onChange={(e) => set("issueDate", e.target.value)}
              />
            </Field>
            <Field label="Due date" htmlFor="inv-due">
              <TextInput id="inv-due" type="date" value={inv.dueDate} onChange={(e) => set("dueDate", e.target.value)} />
            </Field>
            <Field label="Currency" htmlFor="inv-currency">
              <Select
                id="inv-currency"
                value={inv.currency}
                onChange={(e) => set("currency", e.target.value as Currency)}
                options={[
                  ...Object.entries(CURRENCIES).map(([value, c]) => ({ value, label: c.label })),
                  { value: "CUSTOM", label: "Other (type a symbol)" },
                ]}
              />
            </Field>
          </div>
          {inv.currency === "CUSTOM" && (
            <Field
              label="Currency symbol or code"
              htmlFor="inv-custom-symbol"
              hint="For example Tk, CAD, QAR or KWD. Letters work best in the PDF."
            >
              <TextInput
                id="inv-custom-symbol"
                value={inv.customSymbol}
                maxLength={8}
                onChange={(e) => set("customSymbol", e.target.value)}
              />
            </Field>
          )}
          {customSymbolBad && (
            <Notice tone="error">
              The PDF font can&apos;t print that symbol. Type a code in letters instead, like Tk or BDT.
            </Notice>
          )}
          {inv.currency === "INR" && (
            <div className="tool-hint">The PDF font has no rupee sign, so amounts print as INR.</div>
          )}
        </div>
      </Section>

      {hr}

      <Section title="Items">
        <div className="inv-items">
          <div className="inv-row inv-head" aria-hidden>
            <span>Description</span>
            <span className="inv-num">Qty</span>
            <span className="inv-num">Rate</span>
            <span className="inv-num">Amount</span>
            <span />
          </div>
          {inv.items.map((item, idx) => (
            <div key={item.id} className="inv-row">
              <label className="inv-desc">
                <span className="inv-cell-label">Description</span>
                <TextInput
                  value={item.description}
                  onChange={(e) => setItem(item.id, { description: e.target.value })}
                  placeholder="What you did or sold"
                  aria-label={`Item ${idx + 1} description`}
                />
              </label>
              <label>
                <span className="inv-cell-label">Qty</span>
                <NumberInput
                  value={item.qty}
                  min={0}
                  onChange={(e) => setItem(item.id, { qty: e.target.value })}
                  aria-label={`Item ${idx + 1} quantity`}
                />
              </label>
              <label>
                <span className="inv-cell-label">Rate</span>
                <NumberInput
                  value={item.rate}
                  onChange={(e) => setItem(item.id, { rate: e.target.value })}
                  placeholder="0"
                  aria-label={`Item ${idx + 1} rate`}
                />
              </label>
              <div className="inv-amount">
                <span className="inv-cell-label">Amount</span>
                <span className="inv-amount-value">{money(sym, num(item.qty) * num(item.rate))}</span>
              </div>
              <Btn
                variant="ghost"
                className="inv-remove"
                aria-label={`Remove item ${idx + 1}`}
                onClick={() => removeItem(item.id)}
                style={{ padding: "0 12px" }}
              >
                <X size={16} aria-hidden />
              </Btn>
            </div>
          ))}
        </div>
        <div className="tool-actions" style={{ marginTop: 12 }}>
          <Btn variant="ghost" onClick={addItem}>
            <Plus size={16} aria-hidden /> Add item
          </Btn>
        </div>
      </Section>

      {hr}

      <div className="tool-grid cols-2">
        <div className="tool-stack">
          <Field label="Tax (%)" htmlFor="inv-tax" hint="Applied after the discount. Use 0 for none.">
            <NumberInput id="inv-tax" value={inv.taxPct} min={0} onChange={(e) => set("taxPct", e.target.value)} />
          </Field>
          <Field label="Discount" htmlFor="inv-discount">
            <div style={{ display: "flex", gap: 8, alignItems: "center", flexWrap: "wrap" }}>
              <Segmented
                value={inv.discountType}
                onChange={(v) => set("discountType", v)}
                ariaLabel="Discount type"
                options={[
                  { value: "amount", label: sym || "Amount" },
                  { value: "percent", label: "%" },
                ]}
              />
              <div style={{ flex: 1, minWidth: 120 }}>
                <NumberInput
                  id="inv-discount"
                  value={inv.discount}
                  min={0}
                  onChange={(e) => set("discount", e.target.value)}
                />
              </div>
            </div>
          </Field>
          <Field label="Shipping" htmlFor="inv-shipping">
            <NumberInput id="inv-shipping" value={inv.shipping} min={0} onChange={(e) => set("shipping", e.target.value)} />
          </Field>
        </div>
        <div className="inv-totals" aria-live="polite">
          <div className="inv-total-row">
            <span>Subtotal</span>
            <span>{money(sym, totals.subtotal)}</span>
          </div>
          {totals.discount > 0 && (
            <div className="inv-total-row">
              <span>Discount{inv.discountType === "percent" ? ` (${inv.discount}%)` : ""}</span>
              <span>{money(sym, -totals.discount)}</span>
            </div>
          )}
          {num(inv.taxPct) !== 0 && (
            <div className="inv-total-row">
              <span>Tax ({inv.taxPct}%)</span>
              <span>{money(sym, totals.tax)}</span>
            </div>
          )}
          {totals.shipping !== 0 && (
            <div className="inv-total-row">
              <span>Shipping</span>
              <span>{money(sym, totals.shipping)}</span>
            </div>
          )}
          <div className="inv-total-row inv-grand">
            <span>Total</span>
            <span>{money(sym, totals.total)}</span>
          </div>
        </div>
      </div>

      <Field label="Notes / payment details" htmlFor="inv-notes" hint="Bank name, account title, IBAN, payment terms or a thank-you line.">
        <TextArea
          id="inv-notes"
          value={inv.notes}
          onChange={(e) => set("notes", e.target.value)}
          placeholder={"Bank: Your bank name\nAccount title: Your name\nIBAN: PK00 XXXX 0000 0000 0000 0000\nPayment due within 14 days."}
          style={{ minHeight: 120 }}
        />
      </Field>

      {unprintable && (
        <Notice>
          Some characters (for example Urdu, Arabic or Hindi script, or emoji) can&apos;t be printed with
          the PDF&apos;s built-in font. They will show as ? in the PDF, so write those parts in English letters.
        </Notice>
      )}
      {error && <Notice tone="error">{error}</Notice>}

      <div className="tool-actions">
        <Btn onClick={download} disabled={busy}>
          <Download size={16} aria-hidden /> {busy ? "Building PDF..." : "Download PDF"}
        </Btn>
        <Btn variant="ghost" onClick={newInvoice} disabled={busy}>
          <RotateCcw size={16} aria-hidden /> New invoice
        </Btn>
      </div>

      <div className="tool-hint">
        {saveState === "saved" && "Draft saved in this browser only. It is never sent anywhere."}
        {saveState === "nologo" && "Draft saved in this browser, but the logo was too big to keep. Add it again next time."}
        {saveState === "failed" && "Your browser blocked saving, so this draft will be lost if you close the tab."}
        {saveState === "idle" && "Your draft is saved in this browser as you type."}
      </div>

      <style>{`
        .inv-logo-row { display: flex; align-items: center; gap: 12px; flex-wrap: wrap; }
        .inv-logo { max-width: 160px; max-height: 64px; width: auto; height: auto; object-fit: contain; border-radius: 6px; border: 1px solid var(--line); background: #fff; padding: 4px; }
        .inv-items { display: flex; flex-direction: column; gap: 8px; }
        .inv-row { display: grid; grid-template-columns: minmax(0, 1fr) 76px 120px 120px 44px; gap: 8px; align-items: center; }
        .inv-row > label, .inv-row > div { min-width: 0; display: block; }
        .inv-head { font-size: 12.5px; font-weight: 500; color: var(--ink-muted); padding: 0 2px; }
        .inv-num { text-align: right; }
        .inv-cell-label { display: none; }
        .inv-amount { text-align: right; font-variant-numeric: tabular-nums; font-size: 14.5px; color: var(--ink); overflow-wrap: anywhere; }
        .inv-totals { padding: 16px; border-radius: 14px; background: var(--paper); border: 1px solid var(--line); align-self: start; font-variant-numeric: tabular-nums; }
        .inv-total-row { display: flex; justify-content: space-between; gap: 12px; padding: 6px 0; font-size: 14.5px; color: var(--ink-2); }
        .inv-total-row span:last-child { text-align: right; overflow-wrap: anywhere; }
        .inv-grand { margin-top: 6px; padding-top: 12px; border-top: 1px solid var(--line); font-size: 20px; font-weight: 600; color: var(--ink); }
        .inv-grand span:last-child { color: var(--hub-accent); }
        @media (max-width: 639px) {
          .inv-head { display: none; }
          .inv-row { grid-template-columns: minmax(0, 1fr) minmax(0, 1fr); padding: 12px; border: 1px solid var(--line); border-radius: 12px; background: var(--paper); }
          .inv-desc { grid-column: 1 / -1; }
          .inv-cell-label { display: block; font-size: 12.5px; font-weight: 500; color: var(--ink-2); margin-bottom: 6px; }
          .inv-amount { text-align: left; align-self: center; }
          .inv-remove { justify-self: end; align-self: end; }
        }
      `}</style>
    </div>
  );
}
