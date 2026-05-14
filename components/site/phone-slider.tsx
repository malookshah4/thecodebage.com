"use client";
import Image from "next/image";
import { useEffect, useState } from "react";

interface PhoneSliderProps {
  screenshots: string[];
  alt: string;
  intervalMs?: number;
  sizes?: string;
}

export function PhoneSlider({
  screenshots,
  alt,
  intervalMs = 3500,
  sizes = "(min-width: 1024px) 320px, 80vw",
}: PhoneSliderProps) {
  const [i, setI] = useState(0);
  const [paused, setPaused] = useState(false);
  const count = screenshots.length;

  useEffect(() => {
    if (count <= 1 || paused) return;
    const t = setInterval(() => setI((p) => (p + 1) % count), intervalMs);
    return () => clearInterval(t);
  }, [count, intervalMs, paused]);

  if (count === 0) return null;

  return (
    <div
      style={{ position: "absolute", inset: 0 }}
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
    >
      {screenshots.map((src, idx) => (
        <Image
          key={src}
          src={src}
          alt={`${alt} screenshot ${idx + 1}`}
          fill
          sizes={sizes}
          priority={idx === 0}
          style={{
            objectFit: "contain",
            transition: "opacity 700ms ease",
            opacity: idx === i ? 1 : 0,
          }}
        />
      ))}
      {count > 1 && (
        <div
          aria-hidden
          style={{
            position: "absolute",
            bottom: 12,
            left: 0,
            right: 0,
            display: "flex",
            justifyContent: "center",
            gap: 6,
            zIndex: 2,
          }}
        >
          {screenshots.map((_, idx) => (
            <button
              key={idx}
              type="button"
              onClick={() => setI(idx)}
              aria-label={`Show screenshot ${idx + 1}`}
              style={{
                width: idx === i ? 18 : 6,
                height: 6,
                padding: 0,
                border: "none",
                borderRadius: 3,
                background:
                  idx === i ? "rgba(255,255,255,0.9)" : "rgba(255,255,255,0.35)",
                cursor: "pointer",
                transition: "width 220ms ease, background 220ms ease",
              }}
            />
          ))}
        </div>
      )}
    </div>
  );
}
