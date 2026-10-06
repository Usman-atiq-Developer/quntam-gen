"use client";

import { useEffect, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { Star, ChevronLeft, ChevronRight, Pause, Play } from "lucide-react";

const testimonials = [
  {
    name: "Sarah Whitfield",
    role: "Founder, Lumen Skincare",
    quote:
      "Our new site loads instantly and our Meta ad conversion rate nearly doubled within the first two months. The team treated our brand like it was their own.",
    rating: 5,
  },
  {
    name: "Marcus Delgado",
    role: "COO, Northbridge Logistics",
    quote:
      "The AI automation they built now handles a third of our customer inquiries automatically. We got hours back every single week without hiring anyone.",
    rating: 5,
  },
  {
    name: "Priya Anand",
    role: "Marketing Director, Verdant Foods",
    quote:
      "Organic traffic grew steadily every month after the SEO work started. It's the first agency that actually reported results we could tie to revenue.",
    rating: 5,
  },
];

export default function Testimonials() {
  const [index, setIndex] = useState(0);
  const [playing, setPlaying] = useState(true);

  useEffect(() => {
    if (!playing) return;
    const timer = setInterval(() => setIndex((i) => (i + 1) % testimonials.length), 6000);
    return () => clearInterval(timer);
  }, [playing]);

  const current = testimonials[index];

  return (
    <div className="relative max-w-3xl mx-auto text-center">
      <AnimatePresence mode="wait">
        <motion.div
          key={index}
          initial={{ opacity: 0, x: 24 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: -24 }}
          transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
        >
          <div className="flex justify-center gap-1 mb-5" aria-hidden="true">
            {Array.from({ length: current.rating }).map((_, i) => (
              <Star key={i} className="w-4 h-4 fill-brand-end text-brand-end" />
            ))}
          </div>
          <p className="text-xl sm:text-2xl text-ink-heading font-medium leading-relaxed">
            &ldquo;{current.quote}&rdquo;
          </p>
          <p className="mt-6 text-sm font-semibold text-ink-heading">{current.name}</p>
          <p className="text-sm text-ink-muted">{current.role}</p>
        </motion.div>
      </AnimatePresence>

      <div className="flex items-center justify-center gap-4 mt-10">
        <button
          aria-label="Previous testimonial"
          onClick={() => setIndex((i) => (i - 1 + testimonials.length) % testimonials.length)}
          className="rounded-full border border-border bg-white p-2 text-ink-muted hover:text-white hover:border-transparent hover:bg-brand-gradient transition-all duration-micro"
        >
          <ChevronLeft className="w-4 h-4" />
        </button>
        <div className="flex items-center gap-2" role="tablist" aria-label="Testimonial pagination">
          {testimonials.map((_, i) => (
            <button
              key={i}
              role="tab"
              aria-selected={i === index}
              aria-label={`Show testimonial ${i + 1}`}
              onClick={() => setIndex(i)}
              className={`h-1.5 rounded-full transition-all duration-micro ${
                i === index ? "w-6 bg-brand-gradient" : "w-1.5 bg-border"
              }`}
            />
          ))}
        </div>
        <button
          aria-label={playing ? "Pause testimonials" : "Play testimonials"}
          onClick={() => setPlaying((p) => !p)}
          className="rounded-full border border-border bg-white p-2 text-ink-muted hover:text-white hover:border-transparent hover:bg-brand-gradient transition-all duration-micro"
        >
          {playing ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4" />}
        </button>
        <button
          aria-label="Next testimonial"
          onClick={() => setIndex((i) => (i + 1) % testimonials.length)}
          className="rounded-full border border-border bg-white p-2 text-ink-muted hover:text-white hover:border-transparent hover:bg-brand-gradient transition-all duration-micro"
        >
          <ChevronRight className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
}
