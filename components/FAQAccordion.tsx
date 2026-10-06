"use client";

import { useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { Plus } from "lucide-react";
import type { FAQ } from "@/data/services";

export default function FAQAccordion({ faqs }: { faqs: FAQ[] }) {
  const [openIndex, setOpenIndex] = useState<number | null>(0);

  return (
    <div className="space-y-4">
      {faqs.map((faq, i) => {
        const open = openIndex === i;
        return (
          <motion.div
            key={faq.q}
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-60px" }}
            transition={{ duration: 0.5, delay: i * 0.05, ease: [0.16, 1, 0.3, 1] }}
            className={`group relative overflow-hidden rounded-xl2 border bg-white transition-all duration-300 ease-out-expo ${
              open
                ? "border-transparent shadow-[0_0_0_1.5px_#ff4b3e,0_24px_48px_rgba(200,30,44,0.14)]"
                : "border-border hover:border-transparent hover:shadow-[0_0_0_1.5px_#ff4b3e,0_16px_32px_rgba(200,30,44,0.1)]"
            }`}
          >
            {/* Accent bar down the left edge, brand-gradient, only lit up while open */}
            <span
              className={`absolute inset-y-0 left-0 w-1 bg-brand-gradient transition-opacity duration-300 ${
                open ? "opacity-100" : "opacity-0 group-hover:opacity-60"
              }`}
              aria-hidden="true"
            />

            <button
              onClick={() => setOpenIndex(open ? null : i)}
              aria-expanded={open}
              className="relative w-full flex items-center justify-between gap-4 py-5 pl-6 pr-5 text-left"
            >
              <span
                className={`font-display font-semibold transition-colors duration-300 ${
                  open ? "text-brand-end" : "text-ink-heading group-hover:text-brand-end"
                }`}
              >
                {faq.q}
              </span>
              <motion.span
                animate={{ rotate: open ? 135 : 0 }}
                transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
                className={`shrink-0 flex items-center justify-center w-8 h-8 rounded-full transition-all duration-300 ${
                  open ? "bg-brand-gradient text-white shadow-glow" : "bg-surface2 text-brand-end group-hover:bg-brand-gradient group-hover:text-white"
                }`}
              >
                <Plus className="w-4 h-4" />
              </motion.span>
            </button>

            <AnimatePresence initial={false}>
              {open && (
                <motion.div
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: "auto", opacity: 1 }}
                  exit={{ height: 0, opacity: 0 }}
                  transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
                  className="overflow-hidden"
                >
                  <p className="pb-6 pl-6 pr-5 text-sm text-ink-body leading-relaxed">{faq.a}</p>
                </motion.div>
              )}
            </AnimatePresence>
          </motion.div>
        );
      })}
    </div>
  );
}
