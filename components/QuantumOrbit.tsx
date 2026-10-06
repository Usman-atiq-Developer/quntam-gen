"use client";

import { motion } from "framer-motion";

export function QuantumOrbit({
  className = "",
  animated = false,
  strokeWidth = 6,
}: {
  className?: string;
  animated?: boolean;
  strokeWidth?: number;
}) {
  return (
    <svg viewBox="0 0 200 100" fill="none" className={className} xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
      <defs>
        <linearGradient id="quantumGradient" x1="0%" y1="0%" x2="100%" y2="0%">
          <stop offset="0%" stopColor="#C81E2C" />
          <stop offset="100%" stopColor="#FF4B3E" />
        </linearGradient>
      </defs>
      {animated ? (
        <>
          <motion.ellipse
            cx="100"
            cy="50"
            rx="88"
            ry="30"
            transform="rotate(18 100 50)"
            stroke="url(#quantumGradient)"
            strokeWidth={strokeWidth}
            strokeLinecap="round"
            initial={{ pathLength: 0, opacity: 0 }}
            animate={{ pathLength: 1, opacity: 1 }}
            transition={{ duration: 1.1, ease: [0.16, 1, 0.3, 1] }}
          />
          <motion.ellipse
            cx="100"
            cy="50"
            rx="88"
            ry="30"
            transform="rotate(-18 100 50)"
            stroke="url(#quantumGradient)"
            strokeWidth={strokeWidth}
            strokeLinecap="round"
            initial={{ pathLength: 0, opacity: 0 }}
            animate={{ pathLength: 1, opacity: 1 }}
            transition={{ duration: 1.1, delay: 0.15, ease: [0.16, 1, 0.3, 1] }}
          />
          <motion.circle
            cx="100"
            cy="50"
            r="8"
            fill="url(#quantumGradient)"
            initial={{ scale: 0, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ delay: 0.85, duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
          />
        </>
      ) : (
        <>
          <ellipse cx="100" cy="50" rx="88" ry="30" transform="rotate(18 100 50)" stroke="url(#quantumGradient)" strokeWidth={strokeWidth} strokeLinecap="round" />
          <ellipse cx="100" cy="50" rx="88" ry="30" transform="rotate(-18 100 50)" stroke="url(#quantumGradient)" strokeWidth={strokeWidth} strokeLinecap="round" />
          <circle cx="100" cy="50" r="8" fill="url(#quantumGradient)" />
        </>
      )}
    </svg>
  );
}

export function SectionLabel({ children, color }: { children: React.ReactNode; color?: string }) {
  return (
    <span className="section-label" style={color ? { color } : undefined}>
      <QuantumOrbit className="w-5 h-3" />
      {children}
    </span>
  );
}
