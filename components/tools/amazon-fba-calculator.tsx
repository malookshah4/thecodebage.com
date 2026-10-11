"use client";

import { useState } from "react";
import { Field, Notice, NumberInput, Segmented, Select, Stat, formatNumber } from "./ui";

type Channel = "fba" | "fbm";

// ---------------------------------------------------------------------------
// Fee data, US marketplace. Last checked October 2026.
// Referral fees: Amazon's public pricing page (sell.amazon.com/pricing).
// FBA fulfillment: rate card effective January 15, 2026 (non-peak, non-apparel),
// plus the 3.5% fuel and logistics surcharge in effect since April 17, 2026.
// Update these tables when Amazon publishes new rates.
// ---------------------------------------------------------------------------

interface Tier {
  /** Upper bound of this band in dollars (Infinity for the last one) */
  upTo: number;
  pct: number;
}

interface RefCategory {
  value: string;
  label: string;
  tiers: Tier[];
  /**
   * "portion": each band's rate applies to the part of the price inside it
   * (e.g. Furniture). "whole": the band the total price falls in sets one rate
   * for the whole price (e.g. Beauty at $10 or less).
   */
  mode: "portion" | "whole";
  min: number;
  closing?: number;
}

const flat = (pct: number): Tier[] => [{ upTo: Infinity, pct }];

const CATEGORIES: RefCategory[] = [
  { value: "everything", label: "Everything else", tiers: flat(15), mode: "whole", min: 0.3 },
  { value: "amazon-device-acc", label: "Amazon device accessories", tiers: flat(45), mode: "whole", min: 0.3 },
  { value: "appliances-compact", label: "Appliances, compact (15% to $300, 8% above)", tiers: [{ upTo: 300, pct: 15 }, { upTo: Infinity, pct: 8 }], mode: "portion", min: 0.3 },
  { value: "appliances-full", label: "Appliances, full-size", tiers: flat(8), mode: "whole", min: 0.3 },
  { value: "automotive", label: "Automotive and powersports", tiers: flat(12), mode: "whole", min: 0.3 },
  { value: "baby", label: "Baby products (8% at $10 or less, else 15%)", tiers: [{ upTo: 10, pct: 8 }, { upTo: Infinity, pct: 15 }], mode: "whole", min: 0.3 },
  { value: "bags", label: "Backpacks, handbags and luggage", tiers: flat(15), mode: "whole", min: 0.3 },
  { value: "power-tools", label: "Base equipment power tools", tiers: flat(12), mode: "whole", min: 0.3 },
  { value: "beauty", label: "Beauty, health and personal care (8% at $10 or less, else 15%)", tiers: [{ upTo: 10, pct: 8 }, { upTo: Infinity, pct: 15 }], mode: "whole", min: 0.3 },
  { value: "industrial", label: "Business, industrial and scientific", tiers: flat(12), mode: "whole", min: 0.3 },
  { value: "clothing", label: "Clothing and accessories (5% / 10% / 17%)", tiers: [{ upTo: 15, pct: 5 }, { upTo: 20, pct: 10 }, { upTo: Infinity, pct: 17 }], mode: "whole", min: 0.3 },
  { value: "computers", label: "Computers", tiers: flat(8), mode: "whole", min: 0.3 },
  { value: "electronics", label: "Consumer electronics", tiers: flat(8), mode: "whole", min: 0.3 },
  { value: "electronics-acc", label: "Electronics accessories (15% to $100, 8% above)", tiers: [{ upTo: 100, pct: 15 }, { upTo: Infinity, pct: 8 }], mode: "portion", min: 0.3 },
  { value: "eyewear", label: "Eyewear", tiers: flat(15), mode: "whole", min: 0.3 },
  { value: "footwear", label: "Footwear", tiers: flat(15), mode: "whole", min: 0.3 },
  { value: "furniture", label: "Furniture (15% to $200, 10% above)", tiers: [{ upTo: 200, pct: 15 }, { upTo: Infinity, pct: 10 }], mode: "portion", min: 0.3 },
  { value: "grocery", label: "Grocery and gourmet (8% at $15 or less, else 15%)", tiers: [{ upTo: 15, pct: 8 }, { upTo: Infinity, pct: 15 }], mode: "whole", min: 0 },
  { value: "home-kitchen", label: "Home and kitchen", tiers: flat(15), mode: "whole", min: 0.3 },
  { value: "jewelry", label: "Jewelry (20% to $250, 5% above)", tiers: [{ upTo: 250, pct: 20 }, { upTo: Infinity, pct: 5 }], mode: "portion", min: 0.3 },
  { value: "lawn-garden", label: "Lawn and garden", tiers: flat(15), mode: "whole", min: 0.3 },
  { value: "mattresses", label: "Mattresses", tiers: flat(15), mode: "whole", min: 0.3 },
  { value: "media", label: "Media: books, music, video, software (+$1.80 closing fee)", tiers: flat(15), mode: "whole", min: 0, closing: 1.8 },
  { value: "musical", label: "Musical instruments and AV", tiers: flat(15), mode: "whole", min: 0.3 },
  { value: "office", label: "Office products", tiers: flat(15), mode: "whole", min: 0.3 },
  { value: "pet", label: "Pet supplies", tiers: flat(15), mode: "whole", min: 0.3 },
  { value: "sports", label: "Sports and outdoors", tiers: flat(15), mode: "whole", min: 0.3 },
  { value: "tires", label: "Tires", tiers: flat(10), mode: "whole", min: 0.3 },
  { value: "tools", label: "Tools and home improvement", tiers: flat(15), mode: "whole", min: 0.3 },
  { value: "toys", label: "Toys and games", tiers: flat(15), mode: "whole", min: 0.3 },
  { value: "video-games", label: "Video games and accessories", tiers: flat(15), mode: "whole", min: 0 },
  { value: "consoles", label: "Video game consoles", tiers: flat(8), mode: "whole", min: 0 },
  { value: "watches", label: "Watches (16% to $1,500, 3% above)", tiers: [{ upTo: 1500, pct: 16 }, { upTo: Infinity, pct: 3 }], mode: "portion", min: 0.3 },
  { value: "custom", label: "Custom rate", tiers: flat(15), mode: "whole", min: 0 },
];

function referralFor(cat: RefCategory, price: number, customPct: number) {
  if (cat.value === "custom") return { fee: (price * customPct) / 100, minApplied: false };
  let fee = 0;
  if (cat.mode === "whole") {
    const tier = cat.tiers.find((t) => price <= t.upTo) ?? cat.tiers[cat.tiers.length - 1];
    fee = (price * tier.pct) / 100;
  } else {
    let lower = 0;
    for (const t of cat.tiers) {
      if (price <= lower) break;
      fee += ((Math.min(price, t.upTo) - lower) * t.pct) / 100;
      lower = t.upTo;
    }
  }
  const minApplied = fee < cat.min;
  return { fee: Math.max(fee, cat.min) + (cat.closing ?? 0), minApplied };
}

// 2026 non-peak fulfillment fees by shipping weight. Columns: price under $10,
// $10 to $50, over $50. Weight bounds are in ounces.
const SMALL_STANDARD: [number, number, number, number][] = [
  [2, 2.43, 3.32, 3.58],
  [4, 2.49, 3.42, 3.68],
  [6, 2.56, 3.45, 3.71],
  [8, 2.66, 3.54, 3.8],
  [10, 2.77, 3.68, 3.94],
  [12, 2.82, 3.78, 4.04],
  [14, 2.92, 3.91, 4.17],
  [16, 2.95, 3.96, 4.22],
];
const LARGE_STANDARD: [number, number, number, number][] = [
  [4, 2.91, 3.73, 3.99],
  [8, 3.13, 3.95, 4.21],
  [12, 3.38, 4.2, 4.46],
  [16, 3.78, 4.6, 4.86],
  [20, 4.22, 5.04, 5.3],
  [24, 4.6, 5.42, 5.68],
  [28, 4.75, 5.57, 5.83],
  [32, 5.0, 5.82, 6.08],
  [36, 5.1, 5.92, 6.18],
  [40, 5.28, 6.1, 6.36],
  [44, 5.44, 6.26, 6.52],
  [48, 5.85, 6.67, 6.93],
];
// 3 lb to 20 lb: base plus $0.08 for each 4 oz above the first 3 lb.
const LARGE_HEAVY_BASE = [6.15, 6.97, 7.23];
const SURCHARGE = 0.035;
const PEAK_AVG = 0.32; // Amazon's stated average peak increase, Oct 15 2026 to Jan 14 2027
const STORAGE_RATE = { offPeak: 0.78, peak: 2.4 }; // standard size, per cubic foot per month

type SizeTier = "small" | "large" | "bulky";

function sizeTier(dims: number[], weightOz: number): SizeTier {
  const [l, w, h] = [...dims].sort((a, b) => b - a);
  if (l <= 15 && w <= 12 && h <= 0.75 && weightOz <= 16) return "small";
  if (l <= 18 && w <= 14 && h <= 8 && weightOz <= 320) return "large";
  return "bulky";
}

function fulfillmentFee(tier: SizeTier, shipOz: number, price: number): number | null {
  const band = price < 10 ? 0 : price <= 50 ? 1 : 2;
  if (tier === "small") {
    const row = SMALL_STANDARD.find((r) => shipOz <= r[0]);
    return row ? row[band + 1] : null;
  }
  if (tier === "large") {
    const row = LARGE_STANDARD.find((r) => shipOz <= r[0]);
    if (row) return row[band + 1];
    if (shipOz <= 320) return LARGE_HEAVY_BASE[band] + Math.ceil((shipOz - 48) / 4) * 0.08;
  }
  return null;
}

function num(s: string): number {
  return s.trim() === "" ? 0 : Number(s);
}

function usd(n: number): string {
  if (!Number.isFinite(n)) return "-";
  const sign = n < 0 ? "−" : "";
  return `${sign}$${Math.abs(n).toLocaleString("en-US", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
}

function pct(n: number): string {
  return Number.isFinite(n) ? `${formatNumber(n, 1)}%` : "-";
}

function MoneyField({
  id,
  label,
  value,
  onChange,
  hint,
}: {
  id: string;
  label: string;
  value: string;
  onChange: (v: string) => void;
  hint?: React.ReactNode;
}) {
  return (
    <Field label={label} htmlFor={id} hint={hint}>
      <NumberInput id={id} min={0} step="0.01" value={value} onChange={(e) => onChange(e.target.value)} />
    </Field>
  );
}

const TIER_LABEL: Record<SizeTier, string> = {
  small: "Small standard",
  large: "Large standard",
  bulky: "Bulky or oversize",
};

export default function AmazonFbaCalculator() {
  const [channel, setChannel] = useState<Channel>("fba");
  const [price, setPrice] = useState("29.99");
  const [cost, setCost] = useState("12");
  const [category, setCategory] = useState("home-kitchen");
  const [customRef, setCustomRef] = useState("15");

  const [feeMode, setFeeMode] = useState<"estimate" | "manual">("estimate");
  const [len, setLen] = useState("10");
  const [wid, setWid] = useState("6");
  const [hei, setHei] = useState("3");
  const [weight, setWeight] = useState("1.2");
  const [weightUnit, setWeightUnit] = useState<"lb" | "oz">("lb");
  const [peak, setPeak] = useState(false);
  const [months, setMonths] = useState("2");
  const [season, setSeason] = useState<"offPeak" | "peak">("offPeak");
  const [fulfillManual, setFulfillManual] = useState("5.00");
  const [storageManual, setStorageManual] = useState("0.15");

  const [inbound, setInbound] = useState("0.50");
  const [prep, setPrep] = useState("0.30");
  const [shipping, setShipping] = useState("6.00");
  const [packaging, setPackaging] = useState("0.50");
  const [other, setOther] = useState("0");
  const [returns, setReturns] = useState("3");
  const [minProfit, setMinProfit] = useState("3");
  const [minRoi, setMinRoi] = useState("30");

  const fba = channel === "fba";
  const estimate = fba && feeMode === "estimate";
  const p = num(price);
  const c = num(cost);
  const cat = CATEGORIES.find((x) => x.value === category) ?? CATEGORIES[0];
  const retRate = num(returns) / 100;

  // Size tier and shipping weight
  const dims = [num(len), num(wid), num(hei)];
  const unitOz = weightUnit === "lb" ? num(weight) * 16 : num(weight);
  const tier = sizeTier(dims, unitOz);
  // Dimensional weight (lb) = L x W x H / 139, width and height at least 2 in.
  const [dl, dw, dh] = [...dims].sort((a, b) => b - a);
  const dimOz = ((dl * Math.max(dw, 2) * Math.max(dh, 2)) / 139) * 16;
  const shipOz = tier === "small" ? unitOz : Math.max(unitOz, dimOz);
  const baseFee = fulfillmentFee(tier, shipOz, p);
  const estFulfill = baseFee === null ? NaN : baseFee * (1 + SURCHARGE) + (peak ? PEAK_AVG : 0);
  const cubicFeet = (dims[0] * dims[1] * dims[2]) / 1728;
  const estStorage = cubicFeet * STORAGE_RATE[season] * num(months);

  const fulfillFee = estimate ? estFulfill : num(fulfillManual);
  const storageFee = estimate ? estStorage : num(storageManual);

  const values = [price, cost, customRef, inbound, prep, shipping, packaging, other, returns, minProfit, minRoi, fulfillManual, storageManual, len, wid, hei, weight, months];
  let error = "";
  if (values.some((v) => !Number.isFinite(num(v)) || num(v) < 0)) error = "Use numbers of zero or more in every field.";
  else if (p <= 0) error = "Enter a sale price above zero.";
  else if (category === "custom" && num(customRef) >= 100) error = "The referral fee must be under 100%.";
  else if (estimate && (dims.some((d) => d <= 0) || unitOz <= 0)) error = "Enter the package size and weight to estimate the FBA fee.";
  else if (estimate && tier === "bulky")
    error = "This package is bulky or oversize. The estimate covers standard-size items only, so switch to \"Enter my own\" and use the fee from Amazon's Revenue Calculator.";

  const ref = referralFor(cat, p, num(customRef));
  const referralFee = ref.fee;
  const refPctEffective = (referralFee / p) * 100;
  const returnsCost = p * retRate;
  const lines: { label: string; amount: number; amazon?: boolean }[] = [
    { label: "Product cost", amount: c },
    { label: `Referral fee (${formatNumber(refPctEffective, 2)}%)`, amount: referralFee, amazon: true },
    ...(fba
      ? [
          { label: "FBA fulfillment fee", amount: fulfillFee, amazon: true },
          { label: "Storage", amount: storageFee, amazon: true },
          { label: "Inbound shipping and placement", amount: num(inbound) },
          { label: "Prep and labeling", amount: num(prep) },
        ]
      : [
          { label: "Your shipping to the buyer", amount: num(shipping) },
          { label: "Packaging", amount: num(packaging) },
        ]),
    { label: "Other costs", amount: num(other) },
    { label: `Returns and damage (${formatNumber(retRate * 100, 2)}%)`, amount: returnsCost },
  ];

  const totalCost = lines.reduce((s, l) => s + l.amount, 0);
  const amazonFees = lines.filter((l) => l.amazon).reduce((s, l) => s + l.amount, 0);
  const profit = p - totalCost;
  const margin = (profit / p) * 100;
  const roi = c > 0 ? (profit / c) * 100 : NaN;

  // Break-even: lowest price where profit reaches zero. Referral tiers and the
  // FBA price bands both depend on price, so search instead of solving.
  const profitAt = (price2: number) => {
    const r = referralFor(cat, price2, num(customRef)).fee;
    let f = fulfillFee;
    if (estimate) {
      const b = fulfillmentFee(tier, shipOz, price2);
      f = b === null ? NaN : b * (1 + SURCHARGE) + (peak ? PEAK_AVG : 0);
    }
    const fixedOther = totalCost - referralFee - returnsCost - (fba ? fulfillFee : 0);
    return price2 - r - price2 * retRate - (fba ? f : 0) - fixedOther;
  };
  let breakEven = NaN;
  if (!error) {
    let lo = 0;
    let hi = Math.max(p, 1);
    while (profitAt(hi) < 0 && hi < 1e6) hi *= 2;
    if (profitAt(hi) >= 0) {
      for (let i = 0; i < 60; i++) {
        const mid = (lo + hi) / 2;
        if (profitAt(mid) >= 0) hi = mid;
        else lo = mid;
      }
      breakEven = hi;
    }
  }

  const needProfit = num(minProfit);
  const needRoi = num(minRoi);
  const verdict =
    profit >= needProfit && (roi >= needRoi || (c === 0 && profit > 0))
      ? "FLIP"
      : profit > 0
        ? "RISKY"
        : "SKIP";

  return (
    <div className="tool-stack">
      <Segmented
        value={channel}
        onChange={setChannel}
        ariaLabel="Fulfillment method"
        options={[
          { value: "fba", label: "FBA (Amazon ships)" },
          { value: "fbm", label: "FBM (you ship)" },
        ]}
      />

      <div className="tool-grid cols-2">
        <MoneyField id="fba-price" label="Sale price ($)" value={price} onChange={setPrice} />
        <MoneyField id="fba-cost" label="Product cost ($)" value={cost} onChange={setCost} hint="What you pay per unit, including any sales tax." />
        <Field
          label="Category"
          htmlFor="fba-cat"
          hint={
            category === "custom"
              ? "Enter any rate below."
              : `Referral fee on this price: ${usd(referralFee)}${ref.minApplied ? ` (the $${cat.min.toFixed(2)} minimum applies)` : ""}.`
          }
        >
          <Select
            id="fba-cat"
            value={category}
            onChange={(e) => setCategory(e.target.value)}
            options={CATEGORIES.map(({ value, label }) => ({ value, label }))}
          />
        </Field>
        {category === "custom" ? (
          <Field label="Referral fee (%)" htmlFor="fba-ref">
            <NumberInput id="fba-ref" min={0} step="0.1" value={customRef} onChange={(e) => setCustomRef(e.target.value)} />
          </Field>
        ) : (
          <MoneyField id="fba-other" label="Other costs per unit ($)" value={other} onChange={setOther} hint="Ads, software, coupons spread per unit." />
        )}
      </div>

      {fba && (
        <div className="tool-stack" style={{ borderTop: "1px solid var(--line)", paddingTop: 18 }}>
          <div className="tool-actions" style={{ justifyContent: "space-between" }}>
            <h2 style={{ fontSize: 16, fontWeight: 600, color: "var(--ink)" }}>FBA fees</h2>
            <Segmented
              value={feeMode}
              onChange={setFeeMode}
              ariaLabel="FBA fee input"
              options={[
                { value: "estimate", label: "Estimate from size" },
                { value: "manual", label: "Enter my own" },
              ]}
            />
          </div>

          {estimate ? (
            <>
              <div className="tool-grid cols-3">
                <Field label="Length (in)" htmlFor="fba-l">
                  <NumberInput id="fba-l" min={0} step="0.1" value={len} onChange={(e) => setLen(e.target.value)} />
                </Field>
                <Field label="Width (in)" htmlFor="fba-w">
                  <NumberInput id="fba-w" min={0} step="0.1" value={wid} onChange={(e) => setWid(e.target.value)} />
                </Field>
                <Field label="Height (in)" htmlFor="fba-h">
                  <NumberInput id="fba-h" min={0} step="0.1" value={hei} onChange={(e) => setHei(e.target.value)} />
                </Field>
              </div>
              <div className="tool-grid cols-2">
                <Field label="Unit weight, packed" htmlFor="fba-wt">
                  <div style={{ display: "flex", gap: 8 }}>
                    <NumberInput id="fba-wt" min={0} step="0.01" value={weight} onChange={(e) => setWeight(e.target.value)} />
                    <Segmented
                      value={weightUnit}
                      onChange={setWeightUnit}
                      ariaLabel="Weight unit"
                      options={[
                        { value: "lb", label: "lb" },
                        { value: "oz", label: "oz" },
                      ]}
                    />
                  </div>
                </Field>
                <Field label="Storage" htmlFor="fba-months" hint="Months a unit sits in the warehouse before it sells.">
                  <div style={{ display: "flex", gap: 8 }}>
                    <NumberInput id="fba-months" min={0} step="0.5" value={months} onChange={(e) => setMonths(e.target.value)} />
                    <Segmented
                      value={season}
                      onChange={setSeason}
                      ariaLabel="Storage season"
                      options={[
                        { value: "offPeak", label: "Jan to Sep" },
                        { value: "peak", label: "Oct to Dec" },
                      ]}
                    />
                  </div>
                </Field>
              </div>
              <label className="tool-checkbox">
                <input type="checkbox" checked={peak} onChange={(e) => setPeak(e.target.checked)} />
                Holiday peak fees (Oct 15 to Jan 14, adds about ${PEAK_AVG.toFixed(2)} per unit on average)
              </label>
              {!error && (
                <div className="tool-hint">
                  {TIER_LABEL[tier]} · shipping weight {formatNumber(shipOz / 16, 2)} lb
                  {tier !== "small" && dimOz > unitOz ? " (dimensional weight is higher than the real weight)" : ""} · fulfillment{" "}
                  {usd(estFulfill)} incl. 3.5% surcharge · {formatNumber(cubicFeet, 3)} cu ft storage at ${STORAGE_RATE[season].toFixed(2)}/cu ft per month
                </div>
              )}
            </>
          ) : (
            <div className="tool-grid cols-2">
              <MoneyField
                id="fba-fulfill"
                label="FBA fulfillment fee per unit ($)"
                value={fulfillManual}
                onChange={setFulfillManual}
                hint="Copy it from Seller Central's Revenue Calculator or Fee Preview report."
              />
              <MoneyField id="fba-storage" label="Storage per unit ($)" value={storageManual} onChange={setStorageManual} />
            </div>
          )}

          <div className="tool-grid cols-2">
            <MoneyField id="fba-inbound" label="Inbound shipping and placement per unit ($)" value={inbound} onChange={setInbound} />
            <MoneyField id="fba-prep" label="Prep and labeling per unit ($)" value={prep} onChange={setPrep} />
          </div>
        </div>
      )}

      <div className="tool-grid cols-2">
        {!fba && (
          <>
            <MoneyField id="fbm-ship" label="Your shipping cost per unit ($)" value={shipping} onChange={setShipping} hint="Postage to the buyer, minus any shipping the buyer pays you." />
            <MoneyField id="fbm-pack" label="Packaging per unit ($)" value={packaging} onChange={setPackaging} />
          </>
        )}
        {category === "custom" && (
          <MoneyField id="fba-other2" label="Other costs per unit ($)" value={other} onChange={setOther} hint="Ads, software, coupons spread per unit." />
        )}
        <Field label="Returns and damage allowance (%)" htmlFor="fba-returns" hint="Share of the sale price you expect to lose to returns.">
          <NumberInput id="fba-returns" min={0} step="0.5" value={returns} onChange={(e) => setReturns(e.target.value)} />
        </Field>
      </div>

      {error ? (
        <Notice tone="error">{error}</Notice>
      ) : (
        <>
          <div className="tool-grid cols-3">
            <Stat label="Net profit per unit" value={usd(profit)} accent />
            <Stat label="Margin" value={pct(margin)} sub="Profit ÷ sale price" />
            <Stat label="ROI" value={pct(roi)} sub="Profit ÷ product cost" />
            <Stat label="Total Amazon fees" value={usd(amazonFees)} sub={`${pct((amazonFees / p) * 100)} of the price`} />
            <Stat label="Break-even price" value={usd(breakEven)} sub="Sale price where profit is zero" />
            <Stat label="Total cost per unit" value={usd(totalCost)} />
          </div>

          <Notice tone={verdict === "FLIP" ? "success" : verdict === "RISKY" ? "info" : "error"}>
            <b>{verdict}.</b>{" "}
            {verdict === "FLIP"
              ? `Clears your minimum profit of ${usd(needProfit)} and minimum ROI of ${formatNumber(needRoi, 1)}%.`
              : verdict === "RISKY"
                ? `Makes money, but misses your minimum profit of ${usd(needProfit)} or ROI of ${formatNumber(needRoi, 1)}%. One price drop or return could wipe it out.`
                : "This loses money at the current price and costs."}
          </Notice>

          <div className="tool-grid cols-2">
            <MoneyField id="fba-min-profit" label="Minimum profit per unit ($)" value={minProfit} onChange={setMinProfit} />
            <Field label="Minimum ROI (%)" htmlFor="fba-min-roi">
              <NumberInput id="fba-min-roi" min={0} value={minRoi} onChange={(e) => setMinRoi(e.target.value)} />
            </Field>
          </div>

          <div>
            <h2 style={{ fontSize: 16, fontWeight: 600, color: "var(--ink)", marginBottom: 12 }}>Cost breakdown per unit</h2>
            <div className="tool-scroll-x">
              <table className="tool-table">
                <thead>
                  <tr>
                    <th>Item</th>
                    <th>Amount</th>
                    <th>% of price</th>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <td>Sale price</td>
                    <td>{usd(p)}</td>
                    <td>100%</td>
                  </tr>
                  {lines.map((l) => (
                    <tr key={l.label}>
                      <td>{l.label}</td>
                      <td>{usd(-l.amount)}</td>
                      <td>{pct((l.amount / p) * 100)}</td>
                    </tr>
                  ))}
                  <tr>
                    <td>
                      <b>Net profit</b>
                    </td>
                    <td>
                      <b>{usd(profit)}</b>
                    </td>
                    <td>
                      <b>{pct(margin)}</b>
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>

          <div className="tool-hint">
            US marketplace rates, checked October 2026: referral fees from Amazon&apos;s published
            fee table, FBA fees from the 2026 rate card (standard size, non-apparel) plus the 3.5%
            fuel and logistics surcharge. Apparel, hazmat and bulky items cost more. Confirm with
            the Revenue Calculator in Seller Central before you buy stock.
          </div>
        </>
      )}
    </div>
  );
}
