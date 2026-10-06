import type { Metadata } from "next";
import JsonLd from "@/components/JsonLd";
import ServiceCard from "@/components/ServiceCard";
import AnimatedSection from "@/components/AnimatedSection";
import FinalCTA from "@/components/FinalCTA";
import { SectionLabel } from "@/components/QuantumOrbit";
import { loadContent, text } from "@/lib/content";
import QuantumWatermark from "@/components/QuantumWatermark";
import { getServices } from "@/lib/siteData";
import { pageMetadata } from "@/lib/seo";
import { SITE_URL } from "@/lib/siteUrl";

export const metadata: Metadata = pageMetadata({
  title: "Web Development, SEO & AI Automation Services",
  description:
    "Web development, SEO, digital marketing, Meta ads, social media handling, app development, and AI automation — explore all Quntam Gen services.",
  path: "/services",
});

export const revalidate = 60;

export default async function ServicesPage() {
  const [content, services] = await Promise.all([loadContent(), getServices()]);

  const servicesJsonLd = {
    "@context": "https://schema.org",
    "@type": "ItemList",
    itemListElement: services.map((s, i) => ({
      "@type": "ListItem",
      position: i + 1,
      url: `${SITE_URL}/services/${s.slug}`,
      name: s.name,
    })),
  };

  return (
    <>
      <JsonLd data={servicesJsonLd} />
      <section className="relative overflow-hidden bg-hero-light pt-40 pb-24">
        <QuantumWatermark className="w-[600px] h-[300px] -top-10 right-[-120px]" opacity={0.12} />
        <div className="relative mx-auto max-w-4xl px-6 text-center">
          <span className="section-label justify-center">{text(content, "services.hero.eyebrow", "Services")}</span>
          <h1 className="text-h1 text-ink-heading mt-4">{text(content, "services.hero.heading", "One team for the whole growth stack")}</h1>
          <p className="mt-6 text-lg text-ink-body">
            {text(content, "services.hero.subheading", "Every service below is designed to work together — but each one stands on its own if that's all you need right now.")}
          </p>
        </div>
      </section>

      <section className="bg-hero-light border-t border-border">
        <div className="mx-auto max-w-4xl px-6 py-8 grid grid-cols-3 gap-6 text-center">
          <div>
            <p className="font-display text-2xl sm:text-3xl font-bold text-gradient">50+</p>
            <p className="mt-1 text-xs sm:text-sm text-ink-muted">Projects delivered</p>
          </div>
          <div>
            <p className="font-display text-2xl sm:text-3xl font-bold text-gradient">98%</p>
            <p className="mt-1 text-xs sm:text-sm text-ink-muted">Client satisfaction</p>
          </div>
          <div>
            <p className="font-display text-2xl sm:text-3xl font-bold text-gradient">9</p>
            <p className="mt-1 text-xs sm:text-sm text-ink-muted">Disciplines, one team</p>
          </div>
        </div>
      </section>

      <section className="pt-20 pb-16">
        <div className="mx-auto max-w-7xl px-6 lg:px-10">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {services.map((service, i) => (
              <ServiceCard key={service.slug} service={service} index={i} />
            ))}
          </div>
        </div>
      </section>

      <section className="pb-28">
        <div className="mx-auto max-w-4xl px-6">
          <AnimatedSection className="card-surface rounded-xl2 p-8 sm:p-10 text-center">
            <h2 className="text-h3 text-ink-heading">Not sure which service you need?</h2>
            <p className="mt-3 text-ink-body max-w-xl mx-auto">
              Tell us where you're stuck and what you're trying to achieve — we'll tell you
              honestly which service (or combination) actually moves the needle, free of charge.
            </p>
            <a
              href="/contact"
              className="btn-gradient mt-6 inline-flex items-center gap-2 rounded-full px-7 py-3.5 text-sm font-semibold text-white"
            >
              Get a Free Recommendation
            </a>
          </AnimatedSection>
        </div>
      </section>

      <FinalCTA />
    </>
  );
}
