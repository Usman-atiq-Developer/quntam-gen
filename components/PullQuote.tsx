import { Quote } from "lucide-react";
import QuantumWatermark from "@/components/QuantumWatermark";
import AnimatedSection from "@/components/AnimatedSection";
import type { Theme } from "@/data/services";
import { themeGradient } from "@/lib/themeStyle";

export default function PullQuote({
  text,
  author,
  role,
  theme,
}: {
  text: string;
  author: string;
  role: string;
  theme?: Theme;
}) {
  return (
    <section
      className={`relative overflow-hidden py-20 ${theme ? "" : "bg-hero-light"}`}
      style={theme ? { backgroundColor: theme.tint } : undefined}
    >
      <QuantumWatermark className="w-[500px] h-[250px] top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2" opacity={0.12} />
      <AnimatedSection className="relative mx-auto max-w-3xl px-6 text-center">
        <Quote className="w-9 h-9 mx-auto mb-6" style={{ color: theme ? theme.from : undefined }} strokeWidth={1.5} />
        <p className="text-2xl sm:text-3xl font-display font-semibold text-ink-heading leading-snug">
          "{text}"
        </p>
        <div className="mt-6 flex items-center justify-center gap-3">
          <span
            className={`flex h-10 w-10 items-center justify-center rounded-full text-white text-sm font-semibold ${theme ? "" : "bg-brand-gradient"}`}
            style={theme ? themeGradient(theme, 135) : undefined}
          >
            {author.split(" ").map((n) => n[0]).join("").slice(0, 2)}
          </span>
          <span className="text-left">
            <span className="block text-sm font-semibold text-ink-heading">{author}</span>
            <span className="block text-xs text-ink-body">{role}</span>
          </span>
        </div>
      </AnimatedSection>
    </section>
  );
}
