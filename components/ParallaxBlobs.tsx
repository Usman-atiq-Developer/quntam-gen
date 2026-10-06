"use client";

import { useEffect, useRef } from "react";

const blobs = [
  { color: "bg-blue-400/25", size: "w-72 h-72", pos: "top-10 left-[8%]", factor: 0.06 },
  { color: "bg-violet-400/20", size: "w-80 h-80", pos: "top-40 right-[6%]", factor: -0.08 },
  { color: "bg-teal-400/20", size: "w-64 h-64", pos: "bottom-0 left-[35%]", factor: 0.1 },
];

export default function ParallaxBlobs() {
  const refs = useRef<(HTMLDivElement | null)[]>([]);

  useEffect(() => {
    const prefersReduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (prefersReduced) return;

    let ticking = false;
    const onScroll = () => {
      if (ticking) return;
      ticking = true;
      requestAnimationFrame(() => {
        const y = window.scrollY;
        refs.current.forEach((el, i) => {
          if (!el) return;
          el.style.transform = `translate3d(0, ${y * blobs[i].factor}px, 0)`;
        });
        ticking = false;
      });
    };
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none" aria-hidden="true">
      {blobs.map((b, i) => (
        <div
          key={i}
          ref={(el) => { refs.current[i] = el; }}
          className={`absolute ${b.pos} ${b.size} ${b.color} rounded-full blur-3xl`}
        />
      ))}
    </div>
  );
}
