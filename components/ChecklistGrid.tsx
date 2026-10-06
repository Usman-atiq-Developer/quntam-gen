"use client";

import { motion } from "framer-motion";
import { Check } from "lucide-react";
import type { Theme } from "@/data/services";
import { themeGradient } from "@/lib/themeStyle";

export default function ChecklistGrid({ items, theme }: { items: string[]; theme?: Theme }) {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
      {items.map((item, i) => (
        <motion.div
          key={item}
          initial={{ opacity: 0, x: -12 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true, margin: "-40px" }}
          transition={{ duration: 0.4, delay: i * 0.05, ease: [0.16, 1, 0.3, 1] }}
          className="flex items-start gap-3 rounded-lg card-surface p-4"
        >
          <span
            className={`mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full ${theme ? "" : "bg-brand-gradient"}`}
            style={theme ? themeGradient(theme, 135) : undefined}
          >
            <Check className="w-3 h-3 text-white" />
          </span>
          <span className="text-sm text-ink-body">{item}</span>
        </motion.div>
      ))}
    </div>
  );
}
