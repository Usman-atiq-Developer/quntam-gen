"use client";

import { useEffect, useRef } from "react";
import { motion, useInView, useMotionValue, useSpring } from "framer-motion";

export default function Counter({
  value,
  suffix = "",
  label,
}: {
  value: number;
  suffix?: string;
  label: string;
}) {
  const ref = useRef<HTMLSpanElement>(null);
  const isInView = useInView(ref, { once: true, margin: "-40px" });
  const motionValue = useMotionValue(0);
  const springValue = useSpring(motionValue, { damping: 30, stiffness: 90 });

  useEffect(() => {
    if (isInView) motionValue.set(value);
  }, [isInView, value, motionValue]);

  useEffect(() => {
    return springValue.on("change", (latest) => {
      if (ref.current) ref.current.textContent = Math.floor(latest).toString();
    });
  }, [springValue]);

  return (
    <div className="text-center">
      <div className="font-display text-4xl sm:text-5xl font-bold text-gradient">
        <span ref={ref}>0</span>
        {suffix}
      </div>
      <p className="mt-2 text-sm text-ink-muted">{label}</p>
    </div>
  );
}
