"use client";

import Link from "next/link";
import Image from "next/image";
import { motion } from "framer-motion";
import { ArrowRight, Clock, Building2 } from "lucide-react";
import { getCategoryStyle } from "@/lib/categoryStyle";
import type { CaseStudy } from "@/data/caseStudies";

export default function FeaturedCaseStudy({ caseStudy }: { caseStudy: CaseStudy }) {
  const style = getCategoryStyle(caseStudy.category);

  return (
    <motion.div
      initial={{ opacity: 0, y: 24 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-60px" }}
      transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
    >
      <Link
        href={`/portfolio/${caseStudy.slug}`}
        className="group relative grid grid-cols-1 lg:grid-cols-[0.9fr_1fr] items-stretch overflow-hidden rounded-xl2 border border-border bg-white shadow-[0_2px_8px_rgba(10,15,44,0.04)] transition-shadow duration-300 ease-out-expo hover:shadow-[0_20px_40px_-15px_rgba(200,30,44,0.16)]"
      >
        <div className="relative aspect-[16/9] lg:aspect-[4/3] overflow-hidden">
          <Image
            src={caseStudy.image}
            alt={caseStudy.title}
            fill
            sizes="(max-width: 1024px) 100vw, 45vw"
            className="object-cover transition-transform duration-[800ms] ease-out-expo group-hover:scale-110"
            priority
          />
        </div>

        <div className="relative flex flex-col justify-center p-6 sm:p-8">
          <span className={`inline-flex w-fit items-center gap-1.5 rounded-full ${style.bg} ${style.text} px-3 py-1 text-xs font-bold shadow-sm`}>
            <span className={`h-1.5 w-1.5 rounded-full ${style.dot}`} />
            {caseStudy.category}
          </span>
          <h3 className="mt-3 text-xl sm:text-2xl font-display font-bold text-ink-heading leading-snug">
            {caseStudy.title}
          </h3>
          <p className="mt-2.5 text-sm text-ink-body leading-relaxed line-clamp-2">{caseStudy.solution}</p>

          <div className="mt-4 flex items-center gap-3 text-xs text-ink-muted">
            <span className="flex items-center gap-1"><Building2 className="w-3.5 h-3.5" /> {caseStudy.industry}</span>
            <span aria-hidden="true">•</span>
            <span className="flex items-center gap-1"><Clock className="w-3.5 h-3.5" /> {caseStudy.timeline}</span>
          </div>

          <div className="mt-4 flex items-baseline gap-2">
            <span className="font-display text-2xl font-bold text-gradient">{caseStudy.resultStat}</span>
            <span className="text-sm text-ink-muted">{caseStudy.resultLabel}</span>
          </div>

          <span className="btn-gradient relative mt-5 inline-flex w-fit items-center gap-2 rounded-full px-5 py-2.5 text-sm font-semibold text-white transition-transform duration-300 ease-out-expo group-hover:-translate-y-0.5">
            Read the Case Study
            <ArrowRight className="w-4 h-4 transition-transform duration-300 ease-out-expo group-hover:translate-x-1" />
          </span>
        </div>
      </Link>
    </motion.div>
  );
}
