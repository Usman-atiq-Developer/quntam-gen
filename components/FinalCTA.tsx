import Link from "next/link";
import { ArrowRight, Sparkles } from "lucide-react";
import QuantumWatermark from "@/components/QuantumWatermark";
import AnimatedSection from "@/components/AnimatedSection";

export default function FinalCTA() {
  return (
    <section className="relative overflow-hidden bg-brand-gradient-diag py-24">
      <QuantumWatermark className="w-[600px] h-[300px] top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2" opacity={0.16} />
      <span className="pointer-events-none absolute top-10 left-1/2 -translate-x-1/2 w-72 h-72 rounded-full bg-white/10 blur-3xl" aria-hidden="true" />
      <AnimatedSection className="relative mx-auto max-w-3xl px-6 text-center">
        <span className="inline-flex items-center gap-1.5 rounded-full bg-white/15 px-3.5 py-1.5 text-xs font-bold uppercase tracking-widest text-white backdrop-blur-sm">
          <Sparkles className="w-3.5 h-3.5" /> Let's Build Something Great
        </span>
        <h2 className="text-h2 text-white mt-5">Ready to Elevate Your Business?</h2>
        <p className="mt-4 text-white/85 text-lg">
          Tell us where you're stuck, and we'll show you exactly how we'd fix it — no obligation.
        </p>
        <Link
          href="/contact"
          className="group relative mt-8 inline-flex items-center gap-2 overflow-hidden rounded-full bg-white px-8 py-3.5 text-sm font-bold text-basedark shadow-xl transition-all duration-300 ease-out-expo hover:-translate-y-1 hover:shadow-2xl"
        >
          <span className="pointer-events-none absolute inset-0 -translate-x-full bg-gradient-to-r from-transparent via-brand-start/10 to-transparent transition-transform duration-700 ease-out-expo group-hover:translate-x-full" />
          <span className="relative">Get a Free Quote</span>
          <ArrowRight className="relative w-4 h-4 transition-transform duration-300 ease-out-expo group-hover:translate-x-1.5" />
        </Link>
      </AnimatedSection>
    </section>
  );
}
