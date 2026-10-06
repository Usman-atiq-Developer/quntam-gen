import { Check, Sparkles } from "lucide-react";
import CTAButton from "@/components/CTAButton";
import type { Package, Theme } from "@/data/services";

export default function PackageCard({ pkg, theme }: { pkg: Package; theme?: Theme }) {
  const gradient = theme ? `${theme.from},${theme.to}` : "#C81E2C,#FF4B3E";
  const glow = theme ? theme.glow : "200, 30, 44";

  return (
    <div
      className={`group relative flex flex-col rounded-xl2 p-8 transition-all duration-300 ease-out-expo hover:-translate-y-1.5 ${
        pkg.highlighted
          ? "border-2 border-transparent bg-clip-padding [background-origin:border-box] [background-clip:padding-box,border-box]"
          : "border border-border bg-white hover:border-transparent hover:shadow-[0_24px_48px_rgba(10,15,44,0.08)]"
      }`}
      style={
        pkg.highlighted
          ? {
              backgroundImage: `linear-gradient(white,white), linear-gradient(135deg, ${gradient})`,
              boxShadow: `0 20px 50px rgba(${glow}, 0.18)`,
            }
          : undefined
      }
    >
      {pkg.highlighted && (
        <span
          className="absolute -top-3.5 left-1/2 -translate-x-1/2 inline-flex items-center gap-1 rounded-full px-4 py-1.5 text-xs font-bold text-white"
          style={{
            backgroundImage: `linear-gradient(90deg, ${gradient})`,
            boxShadow: `0 8px 16px rgba(${glow}, 0.35)`,
          }}
        >
          <Sparkles className="w-3 h-3" /> Most Popular
        </span>
      )}
      <h3 className="text-lg font-semibold text-ink-heading">{pkg.name}</h3>
      <p className="text-sm text-ink-muted mt-1 mb-5">{pkg.description}</p>
      <div className="flex items-baseline gap-1 mb-6">
        <span className="font-display text-3xl font-bold text-ink-heading">{pkg.price}</span>
        <span className="text-sm text-ink-muted">{pkg.cadence}</span>
      </div>
      <ul className="space-y-3 mb-8 flex-1">
        {pkg.features.map((f) => (
          <li key={f} className="flex items-start gap-2.5 text-sm text-ink-body">
            <span
              className="flex h-4.5 w-4.5 shrink-0 items-center justify-center rounded-full mt-0.5"
              style={{ backgroundColor: theme ? theme.tint : "#FEF2F2" }}
            >
              <Check className="w-3 h-3" style={{ color: theme ? theme.from : "#C81E2C" }} />
            </span>
            {f}
          </li>
        ))}
      </ul>
      <CTAButton href="/contact" variant={pkg.highlighted ? "primary" : "secondary"} className="w-full justify-center">
        Get a Quote for {pkg.name}
      </CTAButton>
    </div>
  );
}
