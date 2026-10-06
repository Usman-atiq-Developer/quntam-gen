"use client";

import { useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { List, ChevronDown } from "lucide-react";

export default function MobileTOC({
  headings,
}: {
  headings: { depth: number; text: string; slug: string }[];
}) {
  const [open, setOpen] = useState(false);
  if (headings.length === 0) return null;

  return (
    <div className="lg:hidden mb-10 rounded-xl2 border border-border bg-surface2 overflow-hidden">
      <button
        onClick={() => setOpen((v) => !v)}
        className="w-full flex items-center justify-between gap-3 px-5 py-4 text-sm font-semibold text-ink-heading"
        aria-expanded={open}
      >
        <span className="flex items-center gap-2">
          <List className="w-4 h-4 text-brand-start" /> Jump to a section
        </span>
        <ChevronDown className={`w-4 h-4 transition-transform duration-300 ease-out-expo ${open ? "rotate-180" : ""}`} />
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
            <ul className="border-t border-border px-5 py-3">
              {headings.map((h) => (
                <li key={h.slug} style={{ paddingLeft: h.depth === 3 ? "1rem" : "0" }}>
                  <a
                    href={`#${h.slug}`}
                    onClick={() => setOpen(false)}
                    className="block py-2 text-sm text-ink-body hover:text-brand-start transition-colors"
                  >
                    {h.text}
                  </a>
                </li>
              ))}
            </ul>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
