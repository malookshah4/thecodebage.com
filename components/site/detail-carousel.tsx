"use client";
import { useRef, type ReactNode } from "react";

interface DetailCarouselProps {
  step: number;
  children: ReactNode;
}

export function DetailCarousel({ step, children }: DetailCarouselProps) {
  const ref = useRef<HTMLDivElement>(null);
  const scroll = (dir: number) => {
    ref.current?.scrollBy({ left: dir * step, behavior: "smooth" });
  };
  return (
    <>
      <div className="flex justify-end gap-2 mb-4">
        <button
          type="button"
          className="hub-carousel-btn"
          aria-label="Previous screenshot"
          onClick={() => scroll(-1)}
        >
          ←
        </button>
        <button
          type="button"
          className="hub-carousel-btn"
          aria-label="Next screenshot"
          onClick={() => scroll(1)}
        >
          →
        </button>
      </div>
      <div className="hub-carousel" ref={ref}>
        {children}
      </div>
    </>
  );
}
