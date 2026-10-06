"use client";

import { useEffect, useRef } from "react";

export default function QuantumWatermark({ className = "", opacity = 0.06 }: { className?: string; opacity?: number }) {
  const ref = useRef<SVGSVGElement>(null);

  useEffect(() => {
    const prefersReduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (prefersReduced) return;

    let ticking = false;
    const onScroll = () => {
      if (ticking) return;
      ticking = true;
      requestAnimationFrame(() => {
        if (ref.current) {
          const offset = window.scrollY * 0.04;
          ref.current.style.transform = `translate3d(0, ${offset}px, 0)`;
        }
        ticking = false;
      });
    };
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <svg
      ref={ref}
      viewBox="0 0 800 400"
      aria-hidden="true"
      style={{ opacity }}
      className={`pointer-events-none absolute ${className}`}
    >
      <g transform="translate(400 200)">
        <ellipse cx="0" cy="0" rx="340" ry="120" transform="rotate(18)" stroke="#FF4B3E" strokeWidth="6" fill="none" />
        <ellipse cx="0" cy="0" rx="340" ry="120" transform="rotate(-18)" stroke="#FF4B3E" strokeWidth="6" fill="none" />
        <ellipse cx="0" cy="0" rx="340" ry="120" transform="rotate(90)" stroke="#FF4B3E" strokeWidth="6" fill="none" opacity="0.6" />
        <circle cx="0" cy="0" r="16" fill="#FF4B3E" />
      </g>
    </svg>
  );
}
