"use client";

import { Sparkles, Truck, Leaf, Dumbbell, Building2, Bot, Rocket } from "lucide-react";

const clients = [
  { name: "Lumen Skincare", icon: Sparkles, from: "#FF7A8A", to: "#C81E2C" },
  { name: "Northbridge Logistics", icon: Truck, from: "#38BDF8", to: "#2563EB" },
  { name: "Verdant Foods", icon: Leaf, from: "#4ADE80", to: "#0F766E" },
  { name: "Cascade Fitness", icon: Dumbbell, from: "#FBBF24", to: "#EA580C" },
  { name: "Harbor & Co.", icon: Building2, from: "#C4B5FD", to: "#6D28D9" },
  { name: "Kinetic Robotics", icon: Bot, from: "#67E8F9", to: "#0891B2" },
  { name: "Ignite Ventures", icon: Rocket, from: "#FDA4AF", to: "#E11D48" },
];

function LogoBadge({ name, icon: Icon, from, to }: { name: string; icon: typeof Sparkles; from: string; to: string }) {
  return (
    <div className="group flex items-center gap-3 shrink-0 rounded-full border border-border bg-white pl-2.5 pr-5 py-2 mx-2.5 shadow-sm transition-all duration-300 ease-out-expo hover:-translate-y-1 hover:shadow-card hover:border-transparent hover:scale-[1.04]">
      <span
        className="flex items-center justify-center w-9 h-9 rounded-full text-white transition-transform duration-300 ease-out-expo group-hover:rotate-[360deg] group-hover:scale-110"
        style={{ backgroundImage: `linear-gradient(135deg, ${from}, ${to})` }}
      >
        <Icon className="w-[18px] h-[18px]" strokeWidth={2.25} />
      </span>
      <span className="font-display text-sm font-semibold text-ink-heading whitespace-nowrap">{name}</span>
    </div>
  );
}

export default function TrustBar() {
  // The shared `marquee` keyframe moves the track by exactly -50% of its own
  // width, so duplicating the list exactly once (2x total) is what makes the
  // loop wrap seamlessly — 3x+ would leave a visible jump.
  const loop = [...clients, ...clients];

  return (
    <div className="relative border-y border-border bg-surface2 py-8 overflow-hidden">
      <div className="mx-auto max-w-7xl px-6 mb-6">
        <p className="flex items-center justify-center gap-2 text-center text-xs font-bold uppercase tracking-widest text-ink-muted">
          <Sparkles className="w-3.5 h-3.5 text-brand-end" />
          Trusted by 50+ growing businesses
        </p>
      </div>

      <div className="relative">
        <div className="pointer-events-none absolute inset-y-0 left-0 w-24 bg-gradient-to-r from-surface2 to-transparent z-10" />
        <div className="pointer-events-none absolute inset-y-0 right-0 w-24 bg-gradient-to-l from-surface2 to-transparent z-10" />
        <div className="group/track flex w-max animate-[marquee_24s_linear_infinite] hover:[animation-play-state:paused] motion-reduce:animate-none">
          {loop.map((client, i) => (
            <LogoBadge key={`${client.name}-${i}`} {...client} />
          ))}
        </div>
      </div>
    </div>
  );
}
