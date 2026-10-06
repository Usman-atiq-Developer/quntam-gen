import type { Metadata } from "next";
import JsonLd from "@/components/JsonLd";
import { getCaseStudies } from "@/lib/siteData";
import PortfolioGrid from "@/components/PortfolioGrid";
import FeaturedCaseStudy from "@/components/FeaturedCaseStudy";
import FinalCTA from "@/components/FinalCTA";
import QuantumWatermark from "@/components/QuantumWatermark";
import AnimatedSection from "@/components/AnimatedSection";
import { SectionLabel } from "@/components/QuantumOrbit";
import { pageMetadata } from "@/lib/seo";
import { SITE_URL } from "@/lib/siteUrl";

export const metadata: Metadata = pageMetadata({
  title: "Case Studies & Client Results",
  description: "Real results from real clients — browse case studies across web development, SEO, ads, app development, AI automation, UI/UX design, and custom software.",
  path: "/portfolio",
});

export const revalidate = 60;

export default async function PortfolioPage() {
  const caseStudies = await getCaseStudies();

  const portfolioJsonLd = {
    "@context": "https://schema.org",
    "@type": "ItemList",
    itemListElement: caseStudies.map((c, i) => ({
      "@type": "ListItem",
      position: i + 1,
      url: `${SITE_URL}/portfolio/${c.slug}`,
      name: c.title,
    })),
  };

  // Computed per-request now that case studies come from the database,
  // so the counts stay accurate as you add or hide work in the dashboard.
  const stats = [
    { value: `${caseStudies.length}`, label: "Case studies published" },
    { value: `${new Set(caseStudies.map((c) => c.industry)).size}`, label: "Industries served" },
    { value: "9", label: "Disciplines represented" },
    { value: "100%", label: "Real, named clients" },
  ];

  const industries = Array.from(new Set(caseStudies.map((c) => c.industry)));
  const [featured] = caseStudies;

  return (
    <>
      <JsonLd data={portfolioJsonLd} />

      <section className="relative overflow-hidden bg-hero-light pt-40 pb-16">
        <QuantumWatermark className="w-[600px] h-[300px] -top-16 left-1/2 -translate-x-1/2" opacity={0.12} />
        <div className="relative mx-auto max-w-3xl px-6 text-center">
          <span className="section-label justify-center">Portfolio</span>
          <h1 className="text-h1 text-ink-heading mt-4">Results, not just deliverables</h1>
          <p className="mt-6 text-lg text-ink-body">
            A look at the problems we've solved, how we solved them, and the numbers that came
            out of it — no vague "we helped them grow" claims.
          </p>
        </div>
      </section>

      <section className="relative bg-hero-light border-t border-border">
        <div className="mx-auto max-w-5xl px-6 py-10 grid grid-cols-2 sm:grid-cols-4 gap-8 text-center">
          {stats.map((s) => (
            <div key={s.label}>
              <p className="font-display text-3xl sm:text-4xl font-bold text-gradient">{s.value}</p>
              <p className="mt-1 text-xs sm:text-sm text-ink-muted">{s.label}</p>
            </div>
          ))}
        </div>
      </section>

      <section className="pt-20">
        <div className="mx-auto max-w-7xl px-6 lg:px-10">
          <AnimatedSection className="mb-10">
            <span className="section-label mb-3">Featured Case Study</span>
            <h2 className="text-h3 text-ink-heading mt-2">Our latest win</h2>
          </AnimatedSection>
          <FeaturedCaseStudy caseStudy={featured} />
        </div>
      </section>

      <section className="pt-20 pb-6">
        <div className="mx-auto max-w-7xl px-6 lg:px-10">
          <AnimatedSection className="mb-10">
            <SectionLabel>All Case Studies</SectionLabel>
            <h2 className="text-h2 text-ink-heading mt-4">Browse by discipline</h2>
          </AnimatedSection>
          <PortfolioGrid caseStudies={caseStudies} />
        </div>
      </section>

      <section className="py-20">
        <div className="mx-auto max-w-4xl px-6 text-center">
          <AnimatedSection>
            <p className="text-xs font-bold uppercase tracking-widest text-ink-muted mb-5">
              Industries we've worked with
            </p>
            <div className="flex flex-wrap justify-center gap-3">
              {industries.map((ind) => (
                <span
                  key={ind}
                  className="rounded-full border border-border bg-white px-4 py-2 text-sm text-ink-body transition-all duration-300 ease-out-expo hover:-translate-y-0.5 hover:border-transparent hover:bg-brand-gradient hover:text-white hover:shadow-[0_10px_20px_rgba(200,30,44,0.25)]"
                >
                  {ind}
                </span>
              ))}
            </div>
          </AnimatedSection>
        </div>
      </section>

      <FinalCTA />
    </>
  );
}
