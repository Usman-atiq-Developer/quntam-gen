"use client";

import { useEffect, useRef } from "react";
import { motion } from "framer-motion";
import Link from "next/link";
import { ArrowRight, PlayCircle } from "lucide-react";
import { QuantumOrbit } from "@/components/QuantumOrbit";
import QuantumWatermark from "@/components/QuantumWatermark";

export type HeroCopy = {
  eyebrow: string;
  headline: string;
  headlineAccent: string;
  subheadline: string;
  primaryCta: string;
  secondaryCta: string;
};

export default function Hero({ copy }: { copy: HeroCopy }) {
  const meshRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const prefersReduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (prefersReduced) return;

    function onMove(e: MouseEvent) {
      if (!meshRef.current) return;
      const x = (e.clientX / window.innerWidth - 0.5) * 20;
      const y = (e.clientY / window.innerHeight - 0.5) * 20;
      meshRef.current.style.transform = `translate3d(${x}px, ${y}px, 0)`;
    }
    window.addEventListener("mousemove", onMove);
    return () => window.removeEventListener("mousemove", onMove);
  }, []);

  return (
    <section className="relative overflow-hidden bg-hero-light min-h-[88vh] flex items-center pt-40 pb-16 sm:pt-44 sm:pb-20">
      <div ref={meshRef} className="absolute inset-0 bg-mesh-glow-light transition-transform duration-300 ease-out" />
      <QuantumWatermark className="w-[700px] h-[350px] -top-10 left-1/2 -translate-x-1/2" opacity={0.18} />

      <div className="relative w-full mx-auto max-w-5xl px-6 text-center">
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
          className="section-label justify-center mb-6"
        >
          {copy.eyebrow}
        </motion.div>

        <motion.h1
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.1, ease: [0.16, 1, 0.3, 1] }}
          className="text-h1 text-ink-heading"
        >
          {copy.headline} <span className="text-gradient">{copy.headlineAccent}</span>
        </motion.h1>

        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.2, ease: [0.16, 1, 0.3, 1] }}
          className="mt-6 text-lg text-ink-body max-w-2xl mx-auto"
        >
          {copy.subheadline}
        </motion.p>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.3, ease: [0.16, 1, 0.3, 1] }}
          className="mt-10 flex flex-col sm:flex-row items-center justify-center gap-4"
        >
          <Link href="/contact" className="btn-gradient inline-flex items-center gap-2 rounded-full px-7 py-3.5 text-sm font-semibold text-white">
            {copy.primaryCta} <ArrowRight className="w-4 h-4" />
          </Link>
          <Link
            href="/services"
            className="inline-flex items-center gap-2 rounded-full border border-border bg-white px-7 py-3.5 text-sm font-semibold text-ink-heading hover:border-transparent hover:bg-brand-gradient hover:text-white hover:shadow-glow transition-all duration-300 ease-out-expo"
          >
            <PlayCircle className="w-4 h-4" /> {copy.secondaryCta}
          </Link>
        </motion.div>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.8, delay: 0.5 }}
          className="mt-16 flex justify-center"
        >
          <QuantumOrbit animated className="w-24 h-12 animate-floatSlow" />
        </motion.div>
      </div>
    </section>
  );
}
