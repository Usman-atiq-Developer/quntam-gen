"use client";

import { motion } from "framer-motion";
import type { CSSProperties } from "react";

export default function AnimatedSection({
  children,
  className = "",
  delay = 0,
  as: Component = "div",
  style,
}: {
  children: React.ReactNode;
  className?: string;
  delay?: number;
  as?: "div" | "section";
  style?: CSSProperties;
}) {
  const MotionComponent = Component === "section" ? motion.section : motion.div;
  return (
    <MotionComponent
      initial={{ opacity: 0, y: 28 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-100px" }}
      transition={{ duration: 0.7, delay, ease: [0.16, 1, 0.3, 1] }}
      className={className}
      style={style}
    >
      {children}
    </MotionComponent>
  );
}
