"use client";

import { useState } from "react";
import { ArrowLeftRight } from "lucide-react";
import { Btn, Field, Notice, NumberInput, Segmented, Select } from "./ui";

type Category = "length" | "weight" | "temperature" | "area" | "volume" | "speed" | "data" | "time";

interface Unit {
  id: string;
  label: string;
  /** How many base units one of this unit is (linear units). */
  factor?: number;
  /** Non-linear units (temperature) convert through these. */
  toBase?: (v: number) => number;
  fromBase?: (v: number) => number;
}

const SQFT = 0.09290304; // m² per square foot, exact

const MARLA_SIZES = [
  { value: "225", label: "225 sq ft (Lahore, most housing societies)" },
  { value: "250", label: "250 sq ft" },
  { value: "272.25", label: "272.25 sq ft (revenue / government)" },
];

function unitsFor(cat: Category, marlaSqft: number): Unit[] {
  switch (cat) {
    case "length": // base: metre
      return [
        { id: "mm", label: "Millimetre (mm)", factor: 0.001 },
        { id: "cm", label: "Centimetre (cm)", factor: 0.01 },
        { id: "m", label: "Metre (m)", factor: 1 },
        { id: "km", label: "Kilometre (km)", factor: 1000 },
        { id: "in", label: "Inch (in)", factor: 0.0254 },
        { id: "ft", label: "Foot (ft)", factor: 0.3048 },
        { id: "yd", label: "Yard (yd, gaz)", factor: 0.9144 },
        { id: "mi", label: "Mile (mi)", factor: 1609.344 },
        { id: "nmi", label: "Nautical mile", factor: 1852 },
      ];
    case "weight": // base: gram
      return [
        { id: "mg", label: "Milligram (mg)", factor: 0.001 },
        { id: "g", label: "Gram (g)", factor: 1 },
        { id: "kg", label: "Kilogram (kg)", factor: 1000 },
        { id: "t", label: "Metric ton (tonne)", factor: 1_000_000 },
        { id: "ct", label: "Carat (ct)", factor: 0.2 },
        { id: "tola", label: "Tola (11.6638 g)", factor: 11.6638038 },
        { id: "seer", label: "Seer (1 kg, Pakistani standard)", factor: 1000 },
        { id: "maund", label: "Maund (40 kg, Pakistani standard)", factor: 40_000 },
        { id: "oz", label: "Ounce (oz)", factor: 28.349523125 },
        { id: "lb", label: "Pound (lb)", factor: 453.59237 },
        { id: "st", label: "Stone (st)", factor: 6350.29318 },
        { id: "ton-us", label: "US ton (short)", factor: 907_184.74 },
        { id: "ton-uk", label: "UK ton (long)", factor: 1_016_046.9088 },
      ];
    case "temperature": // base: Celsius
      return [
        { id: "c", label: "Celsius (°C)", toBase: (v) => v, fromBase: (v) => v },
        { id: "f", label: "Fahrenheit (°F)", toBase: (v) => ((v - 32) * 5) / 9, fromBase: (v) => (v * 9) / 5 + 32 },
        { id: "k", label: "Kelvin (K)", toBase: (v) => v - 273.15, fromBase: (v) => v + 273.15 },
      ];
    case "area": // base: square metre
      return [
        { id: "sqin", label: "Square inch", factor: 0.00064516 },
        { id: "sqft", label: "Square foot (sq ft)", factor: SQFT },
        { id: "sqyd", label: "Square yard (sq yd)", factor: 0.83612736 },
        { id: "sqm", label: "Square metre (m²)", factor: 1 },
        { id: "marla", label: `Marla (${marlaSqft} sq ft)`, factor: marlaSqft * SQFT },
        { id: "kanal", label: `Kanal (20 marla)`, factor: 20 * marlaSqft * SQFT },
        { id: "acre", label: "Acre", factor: 4046.8564224 },
        { id: "ha", label: "Hectare (ha)", factor: 10_000 },
        { id: "sqkm", label: "Square kilometre", factor: 1_000_000 },
        { id: "sqmi", label: "Square mile", factor: 2_589_988.110336 },
      ];
    case "volume": // base: litre
      return [
        { id: "ml", label: "Millilitre (ml)", factor: 0.001 },
        { id: "l", label: "Litre (l)", factor: 1 },
        { id: "m3", label: "Cubic metre (m³)", factor: 1000 },
        { id: "tsp", label: "Teaspoon (US)", factor: 0.00492892159375 },
        { id: "tbsp", label: "Tablespoon (US)", factor: 0.01478676478125 },
        { id: "floz", label: "Fluid ounce (US)", factor: 0.0295735295625 },
        { id: "cup", label: "Cup (US)", factor: 0.2365882365 },
        { id: "pt", label: "Pint (US)", factor: 0.473176473 },
        { id: "qt", label: "Quart (US)", factor: 0.946352946 },
        { id: "gal", label: "Gallon (US)", factor: 3.785411784 },
        { id: "pt-uk", label: "Pint (UK)", factor: 0.56826125 },
        { id: "gal-uk", label: "Gallon (UK)", factor: 4.54609 },
        { id: "in3", label: "Cubic inch", factor: 0.016387064 },
        { id: "ft3", label: "Cubic foot", factor: 28.316846592 },
      ];
    case "speed": // base: metre per second
      return [
        { id: "mps", label: "Metre per second (m/s)", factor: 1 },
        { id: "kmh", label: "Kilometre per hour (km/h)", factor: 1 / 3.6 },
        { id: "mph", label: "Mile per hour (mph)", factor: 0.44704 },
        { id: "kn", label: "Knot", factor: 1852 / 3600 },
        { id: "fps", label: "Foot per second (ft/s)", factor: 0.3048 },
      ];
    case "data": // base: byte
      return [
        { id: "bit", label: "Bit", factor: 0.125 },
        { id: "B", label: "Byte (B)", factor: 1 },
        { id: "kbit", label: "Kilobit (kb)", factor: 125 },
        { id: "mbit", label: "Megabit (Mb)", factor: 125_000 },
        { id: "gbit", label: "Gigabit (Gb)", factor: 125_000_000 },
        { id: "KB", label: "Kilobyte (KB, 1000)", factor: 1e3 },
        { id: "MB", label: "Megabyte (MB)", factor: 1e6 },
        { id: "GB", label: "Gigabyte (GB)", factor: 1e9 },
        { id: "TB", label: "Terabyte (TB)", factor: 1e12 },
        { id: "PB", label: "Petabyte (PB)", factor: 1e15 },
        { id: "KiB", label: "Kibibyte (KiB, 1024)", factor: 1024 },
        { id: "MiB", label: "Mebibyte (MiB)", factor: 1024 ** 2 },
        { id: "GiB", label: "Gibibyte (GiB)", factor: 1024 ** 3 },
        { id: "TiB", label: "Tebibyte (TiB)", factor: 1024 ** 4 },
      ];
    case "time": // base: second
      return [
        { id: "ms", label: "Millisecond (ms)", factor: 0.001 },
        { id: "s", label: "Second (s)", factor: 1 },
        { id: "min", label: "Minute", factor: 60 },
        { id: "h", label: "Hour", factor: 3600 },
        { id: "d", label: "Day", factor: 86_400 },
        { id: "wk", label: "Week", factor: 604_800 },
        { id: "mo", label: "Month (average, 30.44 days)", factor: 2_629_746 },
        { id: "yr", label: "Year (365.2425 days)", factor: 31_556_952 },
      ];
  }
}

const DEFAULTS: Record<Category, { from: string; to: string; value: string }> = {
  length: { from: "m", to: "ft", value: "1" },
  weight: { from: "kg", to: "lb", value: "1" },
  temperature: { from: "c", to: "f", value: "37" },
  area: { from: "marla", to: "sqft", value: "5" },
  volume: { from: "l", to: "gal", value: "1" },
  speed: { from: "kmh", to: "mph", value: "100" },
  data: { from: "GB", to: "GiB", value: "1" },
  time: { from: "h", to: "min", value: "1" },
};

const CATEGORIES: { value: Category; label: string }[] = [
  { value: "length", label: "Length" },
  { value: "weight", label: "Weight" },
  { value: "temperature", label: "Temperature" },
  { value: "area", label: "Area" },
  { value: "volume", label: "Volume" },
  { value: "speed", label: "Speed" },
  { value: "data", label: "Data" },
  { value: "time", label: "Time" },
];

function convert(v: number, from: Unit, to: Unit): number {
  const base = from.toBase ? from.toBase(v) : v * (from.factor ?? 1);
  return to.fromBase ? to.fromBase(base) : base / (to.factor ?? 1);
}

/** Round away floating point noise (0.1 + 0.2) without losing real precision. */
function clean(n: number): number {
  return Number(n.toPrecision(12));
}

function display(n: number): string {
  if (!Number.isFinite(n)) return "-";
  const c = clean(n);
  const abs = Math.abs(c);
  if (c === 0) return "0";
  if (abs >= 1e15 || abs < 1e-9) return c.toExponential(6).replace(/\.?0+e/, "e");
  return c.toLocaleString("en-US", { maximumSignificantDigits: 10 });
}

/** Plain string for an input box (no thousands separators). */
function plain(n: number): string {
  if (!Number.isFinite(n)) return "";
  return String(Number(n.toPrecision(10)));
}

export default function UnitConverter() {
  const [cat, setCat] = useState<Category>("length");
  const [fromId, setFromId] = useState(DEFAULTS.length.from);
  const [toId, setToId] = useState(DEFAULTS.length.to);
  const [input, setInput] = useState(DEFAULTS.length.value);
  const [editing, setEditing] = useState<"from" | "to">("from");
  const [marla, setMarla] = useState("225");

  const units = unitsFor(cat, Number(marla));
  const fromUnit = units.find((u) => u.id === fromId) ?? units[0];
  const toUnit = units.find((u) => u.id === toId) ?? units[1];
  const options = units.map((u) => ({ value: u.id, label: u.label }));

  const typed = input.trim() === "" ? NaN : Number(input);
  const fromValue = editing === "from" ? typed : convert(typed, toUnit, fromUnit);
  const toValue = editing === "to" ? typed : convert(typed, fromUnit, toUnit);

  const fromText = editing === "from" ? input : plain(fromValue);
  const toText = editing === "to" ? input : plain(toValue);

  const changeCategory = (c: Category) => {
    setCat(c);
    setFromId(DEFAULTS[c].from);
    setToId(DEFAULTS[c].to);
    setInput(DEFAULTS[c].value);
    setEditing("from");
  };

  const swap = () => {
    setFromId(toUnit.id);
    setToId(fromUnit.id);
    setInput(fromText);
    setEditing("from");
  };

  const kelvin = cat === "temperature" && Number.isFinite(fromValue) ? convert(fromValue, fromUnit, units[2]) : NaN;
  const belowZero = cat === "temperature" && kelvin < 0;
  const negative = cat !== "temperature" && Number.isFinite(typed) && typed < 0;
  const bad = input.trim() !== "" && !Number.isFinite(typed);

  return (
    <div className="tool-stack">
      <Segmented value={cat} onChange={changeCategory} options={CATEGORIES} ariaLabel="Unit type" />

      {cat === "area" && (
        <Field
          label="Marla size"
          htmlFor="uc-marla"
          hint="A kanal is always 20 marla, so this changes both. Check which size your society or land record uses."
        >
          <Select id="uc-marla" value={marla} onChange={(e) => setMarla(e.target.value)} options={MARLA_SIZES} />
        </Field>
      )}

      <div className="tool-swap-row">
        <div className="tool-stack" style={{ minWidth: 0 }}>
          <Field label="From" htmlFor="uc-from-val">
            <NumberInput
              id="uc-from-val"
              step="any"
              value={fromText}
              onChange={(e) => {
                setEditing("from");
                setInput(e.target.value);
              }}
            />
          </Field>
          <Select aria-label="From unit" value={fromUnit.id} onChange={(e) => setFromId(e.target.value)} options={options} />
        </div>
        <Btn variant="ghost" aria-label="Swap units" title="Swap" style={{ padding: "0 12px" }} onClick={swap}>
          <ArrowLeftRight size={16} aria-hidden />
        </Btn>
        <div className="tool-stack" style={{ minWidth: 0 }}>
          <Field label="To" htmlFor="uc-to-val">
            <NumberInput
              id="uc-to-val"
              step="any"
              value={toText}
              onChange={(e) => {
                setEditing("to");
                setInput(e.target.value);
              }}
            />
          </Field>
          <Select aria-label="To unit" value={toUnit.id} onChange={(e) => setToId(e.target.value)} options={options} />
        </div>
      </div>

      {bad && <Notice tone="error">Enter a number, like 12 or 3.5.</Notice>}
      {belowZero && <Notice tone="error">That is below absolute zero (−273.15 °C), which is not physically possible.</Notice>}
      {negative && <Notice>Negative values are converted, but they rarely make sense for this unit type.</Notice>}

      {Number.isFinite(fromValue) && Number.isFinite(toValue) && (
        <div className="tool-stat is-accent">
          <div className="tool-stat-value" style={{ fontSize: 22 }}>
            {display(fromValue)} {fromUnit.label.replace(/ \(.*\)$/, "")} = {display(toValue)} {toUnit.label.replace(/ \(.*\)$/, "")}
          </div>
        </div>
      )}

      <div>
        <h2 style={{ fontSize: 16, fontWeight: 600, color: "var(--ink)", marginBottom: 12 }}>
          {Number.isFinite(fromValue) ? `${display(fromValue)} ${fromUnit.label} in every unit` : "All units"}
        </h2>
        <div className="tool-scroll-x">
          <table className="tool-table">
            <thead>
              <tr>
                <th>Unit</th>
                <th>Value</th>
              </tr>
            </thead>
            <tbody>
              {units.map((u) => (
                <tr key={u.id} style={u.id === fromUnit.id ? { color: "var(--hub-accent)" } : undefined}>
                  <td style={{ whiteSpace: "normal" }}>{u.label}</td>
                  <td>{display(convert(fromValue, fromUnit, u))}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        {cat === "weight" && (
          <p className="tool-hint" style={{ marginTop: 8 }}>
            Maund and seer use the Pakistani standard (1 maund = 40 seer = 40 kg). Older and regional maunds differed, so check
            when reading old records.
          </p>
        )}
        {cat === "data" && (
          <p className="tool-hint" style={{ marginTop: 8 }}>
            KB, MB and GB use 1000 (how drives are sold). KiB, MiB and GiB use 1024 (how Windows reports size).
          </p>
        )}
      </div>
    </div>
  );
}
