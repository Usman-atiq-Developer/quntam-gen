"use client";

import { motion } from "framer-motion";
import type { Theme } from "@/data/services";
import { themeGradientText } from "@/lib/themeStyle";

export default function ProcessTimeline({
  steps,
  theme,
}: {
  steps: { title: string; description: string }[];
  theme?: Theme;
}) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-6">
      {steps.map((step, i) => (
        <motion.div
          key={step.title}
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-60px" }}
          transition={{ duration: 0.6, delay: i * 0.1, ease: [0.16, 1, 0.3, 1] }}
          className="relative"
        >
          <div className="flex items-center gap-3 mb-3">
            <span
              className={`font-display text-2xl font-bold ${theme ? "" : "text-gradient"}`}
              style={theme ? themeGradientText(theme) : undefined}
            >
              {`0${i + 1}`}
            </span>
            {i < steps.length - 1 && <span className="hidden lg:block h-px flex-1 bg-border" />}
          </div>
          <h4 className="text-ink-heading font-semibold mb-1.5">{step.title}</h4>
          <p className="text-sm text-ink-body leading-relaxed">{step.description}</p>
        </motion.div>
      ))}
    </div>
  );
}
