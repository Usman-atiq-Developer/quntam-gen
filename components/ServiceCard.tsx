"use client";

import { useRef, useState } from "react";
import Link from "next/link";
import { motion, useMotionValue, useSpring, useTransform } from "framer-motion";
import { ArrowRight } from "lucide-react";
import { ServiceIcon } from "@/components/IconMap";
import type { Service } from "@/data/services";
import type { CSSProperties } from "react";

const TILT_RANGE = 9;

export default function ServiceCard({ service, index = 0 }: { service: Service; index?: number }) {
  const { theme } = service;
  const ref = useRef<HTMLDivElement>(null);
  const [reduced, setReduced] = useState(false);

  const px = useMotionValue(0);
  const py = useMotionValue(0);
  const rotateX = useSpring(useTransform(py, [-0.5, 0.5], [TILT_RANGE, -TILT_RANGE]), { stiffness: 260, damping: 22 });
  const rotateY = useSpring(useTransform(px, [-0.5, 0.5], [-TILT_RANGE, TILT_RANGE]), { stiffness: 260, damping: 22 });
  const glowX = useTransform(px, [-0.5, 0.5], ["10%", "90%"]);
  const glowY = useTransform(py, [-0.5, 0.5], ["10%", "90%"]);

  const cssVars = {
    "--t-from": theme.from,
    "--t-to": theme.to,
    "--t-tint": theme.tint,
    "--t-glow": theme.glow,
  } as CSSProperties;

  function handleMouseMove(e: React.MouseEvent<HTMLDivElement>) {
    if (reduced || !ref.current) return;
    const rect = ref.current.getBoundingClientRect();
    px.set((e.clientX - rect.left) / rect.width - 0.5);
    py.set((e.clientY - rect.top) / rect.height - 0.5);
  }
  function handleMouseLeave() {
    px.set(0);
    py.set(0);
  }
  function handleMouseEnter() {
    setReduced(window.matchMedia("(prefers-reduced-motion: reduce)").matches);
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 32 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-80px" }}
      transition={{ duration: 0.6, delay: index * 0.08, ease: [0.16, 1, 0.3, 1] }}
      style={{ perspective: 1200 }}
    >
      <motion.div
        ref={ref}
        onMouseMove={handleMouseMove}
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
        style={{ rotateX, rotateY, transformStyle: "preserve-3d", ...cssVars }}
        whileHover={{ scale: 1.05, zIndex: 20 }}
        transition={{ type: "spring", stiffness: 300, damping: 20 }}
        className="group relative h-full rounded-xl2"
      >
        {/* Rotating multi-color outline ring — only visible on hover, spins one full
            revolution around the card's perimeter, contained to a thin border ring */}
        <div className="pointer-events-none absolute -inset-[2px] rounded-xl2 overflow-hidden opacity-0 transition-opacity duration-300 ease-out-expo group-hover:opacity-100">
          <div
            className="absolute inset-[-60%] group-hover:animate-[spin_2.6s_linear_infinite]"
            style={{
              background: `conic-gradient(from 0deg, #C81E2C, #7C5CFC, #12B8A6, #F5A623, #C81E2C)`,
            }}
          />
        </div>

        <Link
          href={`/services/${service.slug}`}
          className="relative block h-full overflow-hidden rounded-xl2 border border-border bg-white p-7 shadow-[0_2px_8px_rgba(10,10,12,0.04)] transition-shadow duration-300 ease-out-expo group-hover:border-transparent group-hover:[box-shadow:0_30px_60px_-15px_rgba(var(--t-glow),0.3)]"
        >
          {/* Cursor-follow glow */}
          <motion.span
            className="pointer-events-none absolute h-40 w-40 -translate-x-1/2 -translate-y-1/2 rounded-full opacity-0 blur-3xl transition-opacity duration-300 ease-out-expo group-hover:opacity-25 [background-image:linear-gradient(90deg,var(--t-from),var(--t-to))]"
            style={{ left: glowX, top: glowY }}
          />

          <div style={{ transform: "translateZ(50px)", transformStyle: "preserve-3d" }} className="relative">
            <span
              className="inline-flex items-center justify-center w-14 h-14 rounded-xl p-3.5 shadow-sm transition-all duration-300 ease-out-expo bg-[color:var(--t-tint)] text-[color:var(--t-from)] group-hover:scale-110 group-hover:text-white group-hover:[background-image:linear-gradient(135deg,var(--t-from),var(--t-to))]"
              style={{ transform: "translateZ(30px)" }}
            >
              <ServiceIcon name={service.icon} className="w-6 h-6" />
            </span>

            <h3 className="mt-5 text-lg font-semibold text-ink-heading">{service.name}</h3>
            <p className="mt-2 text-sm text-ink-body leading-relaxed">{service.oneLiner}</p>

            <div className="mt-4 flex items-baseline gap-1.5">
              <span
                className="font-display text-lg font-bold [background-image:linear-gradient(90deg,var(--t-from),var(--t-to))] bg-clip-text text-transparent"
              >
                {service.stats[0].value}
              </span>
              <span className="text-xs text-ink-muted">{service.stats[0].label}</span>
            </div>

            <span className="mt-5 inline-flex items-center gap-1.5 text-sm font-semibold" style={{ color: theme.from }}>
              Learn More
              <ArrowRight className="w-4 h-4 transition-transform duration-300 ease-out-expo group-hover:translate-x-1.5" />
            </span>
          </div>
        </Link>
      </motion.div>
    </motion.div>
  );
}
