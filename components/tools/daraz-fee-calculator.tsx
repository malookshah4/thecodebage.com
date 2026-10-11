"use client";

import { useState } from "react";
import { Field, Notice, NumberInput, Select, Stat, formatNumber } from "./ui";

// Commission examples from published 2026 Daraz fee breakdowns. Daraz shows the
// official per-category sheet only inside Seller Center (Finance > Fee
// Structure), so the rate stays editable. Last checked October 2026.
const CATEGORIES: { value: string; label: string; pct?: number }[] = [
  { value: "mobile-acc", label: "Mobile accessories (about 12.9%)", pct: 12.9 },
  { value: "fashion", label: "Fashion (about 18.5%)", pct: 18.5 },
  { value: "beauty", label: "Health and beauty, skin care (about 14.54%)", pct: 14.54 },
  { value: "kitchen", label: "Kitchen and dining, cookware (about 14.8%)", pct: 14.8 },
  { value: "appliances", label: "Home appliances (about 8.9%)", pct: 8.9 },
  { value: "groceries", label: "Groceries (about 7.04%)", pct: 7.04 },
  { value: "cartons", label: "Packaging and cartons (about 6.7%)", pct: 6.7 },
  { value: "packaging", label: "Packaging material (about 2.95%)", pct: 2.95 },
  { value: "custom", label: "Custom rate" },
];

// Income tax under section 6A of the Income Tax Ordinance (Finance Act 2025,
// unchanged by Finance Act 2026): 1% when the buyer pays digitally, 2% on cash
// on delivery.
const TAX_MODES: { value: string; label: string; pct?: number }[] = [
  { value: "cod", label: "Cash on delivery (2%)", pct: 2 },
  { value: "online", label: "Card, wallet or bank payment (1%)", pct: 1 },
  { value: "custom", label: "Custom rate" },
];

function num(s: string): number {
  return s.trim() === "" ? 0 : Number(s);
}

function rs(n: number): string {
  if (!Number.isFinite(n)) return "-";
  const sign = n < 0 ? "−" : "";
  return `${sign}Rs ${formatNumber(Math.abs(n), 0)}`;
}

function pct(n: number): string {
  return Number.isFinite(n) ? `${formatNumber(n, 1)}%` : "-";
}

function NumField({
  id,
  label,
  value,
  onChange,
  hint,
  step = "1",
}: {
  id: string;
  label: string;
  value: string;
  onChange: (v: string) => void;
  hint?: React.ReactNode;
  step?: string;
}) {
  return (
    <Field label={label} htmlFor={id} hint={hint}>
      <NumberInput id={id} min={0} step={step} value={value} onChange={(e) => onChange(e.target.value)} />
    </Field>
  );
}

export default function DarazFeeCalculator() {
  const [price, setPrice] = useState("2500");
  const [cost, setCost] = useState("1200");
  const [qty, setQty] = useState("1");
  const [category, setCategory] = useState("mobile-acc");
  const [commission, setCommission] = useState("12.9");
  const [payment, setPayment] = useState("2.25");
  const [shipping, setShipping] = useState("150");
  const [packaging, setPackaging] = useState("40");
  const [taxMode, setTaxMode] = useState("cod");
  const [incomeTax, setIncomeTax] = useState("2");
  const [salesTax, setSalesTax] = useState("16");
  const [voucher, setVoucher] = useState("0");
  const [other, setOther] = useState("0");

  const all = [price, cost, qty, commission, payment, shipping, packaging, incomeTax, salesTax, voucher, other];
  const q = Math.round(num(qty));
  const orderValue = num(price) * q;
  const v = num(voucher);
  const base = orderValue - v;

  let error = "";
  if (all.some((s) => !Number.isFinite(num(s)) || num(s) < 0)) error = "Use numbers of zero or more in every field.";
  else if (num(price) <= 0) error = "Enter a selling price above zero.";
  else if (q < 1) error = "Quantity per order must be at least 1.";
  else if (base <= 0) error = "The voucher is as large as the order, so there is nothing left to earn.";

  const cRate = num(commission) / 100;
  const pRate = num(payment) / 100;
  const itRate = num(incomeTax) / 100;
  const stRate = num(salesTax) / 100;

  const commissionFee = base * cRate;
  const paymentFee = base * pRate;
  const ship = num(shipping);
  const feeTax = (commissionFee + paymentFee + ship) * stRate;
  const tax = base * itRate;
  const deductions = commissionFee + paymentFee + ship + feeTax + tax;
  const payout = base - deductions;
  const goods = num(cost) * q;
  const ownCosts = goods + num(packaging) + num(other);
  const profit = payout - ownCosts;
  const margin = (profit / orderValue) * 100;
  const roi = goods > 0 ? (profit / goods) * 100 : NaN;

  // Profit = B × (1 − k) − fixed, with B = order value − voucher. Solve for profit = 0.
  const k = cRate + pRate + itRate + stRate * (cRate + pRate);
  const fixed = ship * (1 + stRate) + ownCosts;
  const breakEven = k < 1 ? (fixed / (1 - k) + v) / q : NaN;

  const rows: { label: string; amount: number; bold?: boolean }[] = [
    { label: `Order value (${q} × ${rs(num(price))})`, amount: orderValue },
    ...(v > 0 ? [{ label: "Voucher you fund", amount: -v }] : []),
    { label: `Commission (${formatNumber(cRate * 100, 2)}%)`, amount: -commissionFee },
    { label: `Payment handling (${formatNumber(pRate * 100, 2)}%)`, amount: -paymentFee },
    { label: "Shipping fee charged to you", amount: -ship },
    ...(feeTax > 0 ? [{ label: `Sales tax on fees (${formatNumber(stRate * 100, 2)}%)`, amount: -feeTax }] : []),
    ...(tax > 0 ? [{ label: `Income tax withheld (${formatNumber(itRate * 100, 2)}%)`, amount: -tax }] : []),
    { label: "Payout from Daraz", amount: payout, bold: true },
    { label: "Product cost", amount: -goods },
    { label: "Packaging", amount: -num(packaging) },
    ...(num(other) > 0 ? [{ label: "Other costs", amount: -num(other) }] : []),
    { label: "Net profit", amount: profit, bold: true },
  ];

  return (
    <div className="tool-stack">
      <div className="tool-grid cols-3">
        <NumField id="dz-price" label="Selling price per item (Rs)" value={price} onChange={setPrice} />
        <NumField id="dz-cost" label="Product cost per item (Rs)" value={cost} onChange={setCost} />
        <NumField id="dz-qty" label="Quantity per order" value={qty} onChange={setQty} />
        <Field label="Category" htmlFor="dz-category" hint="Your exact rate is in Seller Center under Finance, Fee Structure.">
          <Select
            id="dz-category"
            value={category}
            onChange={(e) => {
              setCategory(e.target.value);
              const preset = CATEGORIES.find((c) => c.value === e.target.value)?.pct;
              if (preset !== undefined) setCommission(String(preset));
            }}
            options={CATEGORIES.map(({ value, label }) => ({ value, label }))}
          />
        </Field>
        <NumField
          id="dz-commission"
          label="Commission (%)"
          value={commission}
          onChange={(v) => {
            setCommission(v);
            setCategory("custom");
          }}
          step="0.01"
        />
        <NumField
          id="dz-payment"
          label="Payment handling fee (%)"
          value={payment}
          onChange={setPayment}
          step="0.01"
          hint="2.25% in most 2026 statements. Some sellers report a lower rate, so check yours."
        />
        <NumField id="dz-shipping" label="Shipping fee charged to you per order (Rs)" value={shipping} onChange={setShipping} hint="Usually about Rs 109 to 160 for a small parcel, depending on weight and zone. Free Shipping Max campaigns charge a percentage instead." />
        <NumField id="dz-packaging" label="Packaging per order (Rs)" value={packaging} onChange={setPackaging} hint="Flyer, tape, bubble wrap, label." />
        <Field label="How the buyer paid" htmlFor="dz-tax-mode" hint="Sets the section 6A income tax: 2% on cash on delivery, 1% on digital payments.">
          <Select
            id="dz-tax-mode"
            value={taxMode}
            onChange={(e) => {
              setTaxMode(e.target.value);
              const preset = TAX_MODES.find((m) => m.value === e.target.value)?.pct;
              if (preset !== undefined) setIncomeTax(String(preset));
            }}
            options={TAX_MODES.map(({ value, label }) => ({ value, label }))}
          />
        </Field>
        <NumField
          id="dz-income-tax"
          label="Income tax withheld (%)"
          value={incomeTax}
          onChange={(v) => {
            setIncomeTax(v);
            setTaxMode("custom");
          }}
          step="0.1"
        />
        <NumField id="dz-sales-tax" label="Sales tax on fees (%)" value={salesTax} onChange={setSalesTax} step="0.1" hint="Provincial tax on Daraz's fees: 16% in Punjab, 15% in Sindh, KP and Balochistan." />
        <NumField id="dz-voucher" label="Voucher or discount you fund per order (Rs)" value={voucher} onChange={setVoucher} />
        <NumField id="dz-other" label="Other costs per order (Rs)" value={other} onChange={setOther} hint="Ads, transport to the drop-off point, returns." />
      </div>

      {error ? (
        <Notice tone="error">{error}</Notice>
      ) : (
        <>
          <div className="tool-grid cols-3">
            <Stat label="Net profit per order" value={rs(profit)} accent />
            <Stat label="Payout per order" value={rs(payout)} sub="What Daraz pays you" />
            <Stat label="Total Daraz deductions" value={rs(deductions)} sub={`${pct((deductions / orderValue) * 100)} of the order`} />
            <Stat label="Margin" value={pct(margin)} sub="Profit ÷ order value" />
            <Stat label="ROI" value={pct(roi)} sub="Profit ÷ product cost" />
            <Stat label="Break-even price" value={rs(breakEven)} sub="Per item, where profit is zero" />
          </div>

          {profit < 0 && <Notice tone="error">This order loses money. Raise the price above {rs(breakEven)} or cut costs.</Notice>}

          <div>
            <h2 style={{ fontSize: 16, fontWeight: 600, color: "var(--ink)", marginBottom: 12 }}>Breakdown per order</h2>
            <div className="tool-scroll-x">
              <table className="tool-table">
                <thead>
                  <tr>
                    <th>Item</th>
                    <th>Amount</th>
                  </tr>
                </thead>
                <tbody>
                  {rows.map((r) => (
                    <tr key={r.label}>
                      <td>{r.bold ? <b>{r.label}</b> : r.label}</td>
                      <td>{r.bold ? <b>{rs(r.amount)}</b> : rs(r.amount)}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          <div className="tool-hint">
            Rates checked October 2026. Commission examples come from published 2026 Daraz fee
            breakdowns, since Daraz shows the full category sheet only inside Seller Center. Income
            tax follows section 6A (1% digital, 2% cash on delivery). Daraz also changes fees by
            campaign and seller type, so compare with your own statement. Fees here are worked out
            on the order value after your voucher.
          </div>
        </>
      )}
    </div>
  );
}
