"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";
import { ArrowUpRight } from "lucide-react";
import type { CaseStudy } from "@/data/caseStudies";
import { getCategoryStyle } from "@/lib/categoryStyle";

export default function PortfolioGrid({ caseStudies }: { caseStudies: CaseStudy[] }) {
  const categories = useMemo(
    () => ["All", ...Array.from(new Set(caseStudies.map((c) => c.category)))],
    [caseStudies]
  );
  const [active, setActive] = useState("All");
  const filtered = active === "All" ? caseStudies : caseStudies.filter((c) => c.category === active);

  return (
    <div>
      <div className="flex flex-wrap justify-center gap-2.5 mb-14">
        {categories.map((cat) => (
          <button
            key={cat}
            onClick={() => setActive(cat)}
            className={`rounded-full border px-5 py-2.5 text-sm font-semibold transition-all duration-300 ease-out-expo ${
              active === cat
                ? "border-transparent bg-brand-gradient text-white shadow-[0_8px_20px_rgba(200,30,44,0.32)] scale-[1.04]"
                : "border-border bg-white text-ink-muted hover:-translate-y-0.5 hover:border-brand-end/50 hover:text-ink-heading hover:shadow-sm"
            }`}
          >
            {cat}
          </button>
        ))}
      </div>

      <AnimatePresence mode="wait">
        <motion.div
          key={active}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.3 }}
          className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6"
        >
          {filtered.map((cs, i) => {
            const style = getCategoryStyle(cs.category);
            return (
            <motion.div
              key={cs.slug}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: i * 0.06, ease: [0.16, 1, 0.3, 1] }}
            >
              <Link href={`/portfolio/${cs.slug}`} className="card-surface group block overflow-hidden rounded-xl2">
                <div className="relative aspect-[4/3] overflow-hidden">
                  <Image
                    src={cs.image}
                    alt={cs.title}
                    fill
                    sizes="(max-width: 768px) 100vw, 33vw"
                    className="object-cover transition-transform duration-[600ms] ease-out-expo group-hover:scale-105"
                  />
                  <div className="pointer-events-none absolute inset-x-0 top-0 h-24 bg-gradient-to-b from-black/55 via-black/15 to-transparent" />
                  <span className={`absolute top-4 left-4 inline-flex items-center gap-1.5 rounded-full ${style.bg} ${style.text} px-3 py-1 text-xs font-bold shadow-sm`}>
                    <span className={`h-1.5 w-1.5 rounded-full ${style.dot}`} />
                    {cs.category}
                  </span>
                  <div className="absolute top-4 right-4 rounded-full bg-basedark/70 backdrop-blur p-2 opacity-0 group-hover:opacity-100 transition-opacity duration-micro">
                    <ArrowUpRight className="w-4 h-4 text-white" />
                  </div>
                </div>
                <div className="p-6">
                  <h3 className="text-lg font-semibold text-ink-heading leading-snug">{cs.title}</h3>
                  <p className="mt-1.5 text-xs text-ink-muted">{cs.client} · {cs.industry}</p>
                  <div className="mt-3 flex items-baseline gap-2">
                    <span className="font-display text-2xl font-bold text-gradient">{cs.resultStat}</span>
                    <span className="text-sm text-ink-muted">{cs.resultLabel}</span>
                  </div>
                </div>
              </Link>
            </motion.div>
            );
          })}
        </motion.div>
      </AnimatePresence>
    </div>
  );
}
