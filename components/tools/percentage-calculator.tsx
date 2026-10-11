"use client";

import { useState } from "react";
import { Field, NumberInput, Stat, formatNumber } from "./ui";

function num(s: string): number {
  return s.trim() === "" ? NaN : Number(s);
}

export default function PercentageCalculator() {
  return (
    <div className="tool-stack">
      <PercentOf />
      <hr style={{ border: 0, borderTop: "1px solid var(--line)" }} />
      <WhatPercent />
      <hr style={{ border: 0, borderTop: "1px solid var(--line)" }} />
      <PercentChange />
      <hr style={{ border: 0, borderTop: "1px solid var(--line)" }} />
      <AddSubtract />
    </div>
  );
}

function Row({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div>
      <h2 style={{ fontSize: 16, fontWeight: 600, color: "var(--ink)", marginBottom: 12 }}>
        {title}
      </h2>
      {children}
    </div>
  );
}

function PercentOf() {
  const [p, setP] = useState("15");
  const [x, setX] = useState("2400");
  const r = (num(p) / 100) * num(x);
  return (
    <Row title="What is X% of a number?">
      <div className="tool-grid cols-3">
        <Field label="Percent (%)">
          <NumberInput value={p} onChange={(e) => setP(e.target.value)} />
        </Field>
        <Field label="Of">
          <NumberInput value={x} onChange={(e) => setX(e.target.value)} />
        </Field>
        <Stat
          label="Answer"
          value={formatNumber(r, 4)}
          sub={Number.isFinite(r) ? `${p} ÷ 100 × ${x}` : undefined}
          accent
        />
      </div>
    </Row>
  );
}

function WhatPercent() {
  const [a, setA] = useState("360");
  const [b, setB] = useState("2400");
  const r = (num(a) / num(b)) * 100;
  return (
    <Row title="X is what percent of Y?">
      <div className="tool-grid cols-3">
        <Field label="X">
          <NumberInput value={a} onChange={(e) => setA(e.target.value)} />
        </Field>
        <Field label="Y">
          <NumberInput value={b} onChange={(e) => setB(e.target.value)} />
        </Field>
        <Stat
          label="Answer"
          value={Number.isFinite(r) ? `${formatNumber(r, 4)}%` : "-"}
          sub={Number.isFinite(r) ? `${a} ÷ ${b} × 100` : undefined}
          accent
        />
      </div>
    </Row>
  );
}

function PercentChange() {
  const [from, setFrom] = useState("1200");
  const [to, setTo] = useState("1500");
  const r = ((num(to) - num(from)) / Math.abs(num(from))) * 100;
  const label = !Number.isFinite(r) ? "Change" : r >= 0 ? "Increase" : "Decrease";
  return (
    <Row title="Percentage increase or decrease">
      <div className="tool-grid cols-3">
        <Field label="From">
          <NumberInput value={from} onChange={(e) => setFrom(e.target.value)} />
        </Field>
        <Field label="To">
          <NumberInput value={to} onChange={(e) => setTo(e.target.value)} />
        </Field>
        <Stat
          label={label}
          value={Number.isFinite(r) ? `${formatNumber(Math.abs(r), 4)}%` : "-"}
          sub={Number.isFinite(r) ? `(${to} − ${from}) ÷ ${from} × 100` : undefined}
          accent
        />
      </div>
    </Row>
  );
}

function AddSubtract() {
  const [x, setX] = useState("5000");
  const [p, setP] = useState("18");
  const add = num(x) * (1 + num(p) / 100);
  const sub = num(x) * (1 - num(p) / 100);
  return (
    <Row title="Add or subtract a percentage">
      <div className="tool-grid cols-4">
        <Field label="Amount">
          <NumberInput value={x} onChange={(e) => setX(e.target.value)} />
        </Field>
        <Field label="Percent (%)">
          <NumberInput value={p} onChange={(e) => setP(e.target.value)} />
        </Field>
        <Stat label={`+ ${p || 0}%`} value={formatNumber(add, 2)} />
        <Stat label={`− ${p || 0}%`} value={formatNumber(sub, 2)} />
      </div>
    </Row>
  );
}
