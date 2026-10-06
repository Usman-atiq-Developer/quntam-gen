import type { Metadata } from "next";
import JsonLd from "@/components/JsonLd";
import Link from "next/link";
import { Check } from "lucide-react";
import { SectionLabel } from "@/components/QuantumOrbit";
import AnimatedSection from "@/components/AnimatedSection";
import CTAButton from "@/components/CTAButton";
import FinalCTA from "@/components/FinalCTA";
import QuantumWatermark from "@/components/QuantumWatermark";
import { pageMetadata, webPageJsonLd, breadcrumbJsonLd } from "@/lib/seo";

export const metadata: Metadata = pageMetadata({
  title: "Pricing for Web, SEO & Marketing Services",
  description: "Custom pricing tiers across web development, SEO, digital marketing, Meta ads, social media, app development, AI automation, UI/UX design, and custom software.",
  path: "/pricing",
});

const rows = [
  { feature: "Dedicated project lead", starter: true, growth: true, scale: true },
  { feature: "Monthly strategy call", starter: false, growth: true, scale: true },
  { feature: "Custom design & build", starter: true, growth: true, scale: true },
  { feature: "SEO foundation included", starter: false, growth: true, scale: true },
  { feature: "Paid ads management", starter: false, growth: false, scale: true },
  { feature: "AI automation included", starter: false, growth: false, scale: true },
  { feature: "Priority support (24hr)", starter: false, growth: true, scale: true },
  { feature: "Quarterly growth report", starter: false, growth: true, scale: true },
];

const tiers = [
  { key: "starter", name: "Starter", price: "Custom", cadence: "pricing", description: "For businesses validating one channel at a time." },
  { key: "growth", name: "Growth", price: "Custom", cadence: "pricing", description: "For businesses ready to run 2–3 channels together.", highlighted: true },
  { key: "scale", name: "Scale", price: "Custom", cadence: "pricing", description: "For businesses running full-funnel, multi-channel programs." },
];

export default function PricingPage() {
  return (
    <>
      <JsonLd
        data={[
          webPageJsonLd({ type: "WebPage", name: "Quntam Gen Pricing", description: "Custom pricing tiers across web development, SEO, digital marketing, Meta ads, social media, app development, AI automation, UI/UX design, and custom software.", path: "/pricing" }),
          breadcrumbJsonLd([{ name: "Home", path: "" }, { name: "Pricing" }]),
        ]}
      />
      <section className="relative overflow-hidden bg-hero-light pt-40 pb-20">
        <QuantumWatermark className="w-[600px] h-[300px] -top-16 left-1/2 -translate-x-1/2" opacity={0.12} />
        <div className="relative mx-auto max-w-3xl px-6 text-center">
          <span className="section-label justify-center">Pricing</span>
          <h1 className="text-h1 text-ink-heading mt-4">Straightforward tiers, custom pricing</h1>
          <p className="mt-6 text-lg text-ink-body">
            Every engagement is scoped to your business, so every quote is custom — but here's how
            our tiers compare. Visit any service page for the full feature breakdown.
          </p>
        </div>
      </section>

      <section className="pb-28">
        <div className="mx-auto max-w-6xl px-6">
          <AnimatedSection className="overflow-x-auto">
            <table className="w-full border-collapse min-w-[640px]">
              <thead>
                <tr>
                  <th className="text-left p-4 text-sm text-ink-muted font-normal"> </th>
                  {tiers.map((t) => (
                    <th key={t.key} className="p-4 text-center">
                      <div className={`rounded-xl2 p-6 ${t.highlighted ? "bg-white shadow-glow border-2 border-transparent [background-image:linear-gradient(#fff,#fff),linear-gradient(90deg,#C81E2C,#FF4B3E)] [background-origin:border-box] [background-clip:padding-box,border-box]" : "card-surface"}`}>
                        <p className="text-ink-heading font-semibold text-lg">{t.name}</p>
                        <p className="text-xs text-ink-muted mt-1 mb-4">{t.description}</p>
                        <p className="font-display text-2xl font-bold text-ink-heading">{t.price}</p>
                        <p className="text-xs text-ink-muted mb-4">{t.cadence}</p>
                        <CTAButton href="/contact" className="w-full justify-center" variant={t.highlighted ? "primary" : "secondary"}>
                          Get Started
                        </CTAButton>
                      </div>
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {rows.map((row) => (
                  <tr key={row.feature} className="border-t border-border">
                    <td className="p-4 text-sm text-ink-body">{row.feature}</td>
                    {(["starter", "growth", "scale"] as const).map((key) => (
                      <td key={key} className="p-4 text-center">
                        {row[key] ? (
                          <Check className="w-5 h-5 text-brand-end mx-auto" />
                        ) : (
                          <span className="text-ink-muted">—</span>
                        )}
                      </td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </AnimatedSection>

          <AnimatedSection className="text-center mt-14">
            <p className="text-ink-body">
              Need something more specific? <Link href="/contact" className="text-brand-end font-semibold hover:text-ink-heading transition-colors">Request a custom quote →</Link>
            </p>
          </AnimatedSection>
        </div>
      </section>

      <FinalCTA />
    </>
  );
}
