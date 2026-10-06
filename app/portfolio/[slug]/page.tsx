import type { Metadata } from "next";
import JsonLd from "@/components/JsonLd";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ChevronRight, Check, Building2, Clock, Wrench, ArrowRight } from "lucide-react";
import { getCaseStudies, getCaseStudyBySlugFromDb, getServiceBySlugFromDb } from "@/lib/siteData";

import AnimatedSection from "@/components/AnimatedSection";
import FinalCTA from "@/components/FinalCTA";
import PullQuote from "@/components/PullQuote";
import CTAButton from "@/components/CTAButton";
import { SectionLabel, QuantumOrbit } from "@/components/QuantumOrbit";
import QuantumWatermark from "@/components/QuantumWatermark";
import { getCategoryStyle } from "@/lib/categoryStyle";
import { pageMetadata } from "@/lib/seo";
import { SITE_URL } from "@/lib/siteUrl";
import { absoluteUrl, ORG_ID } from "@/lib/seo";

export async function generateStaticParams() {
  const caseStudies = await getCaseStudies();
  return caseStudies.map((c) => ({ slug: c.slug }));
}

export const revalidate = 60;

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  const cs = await getCaseStudyBySlugFromDb(slug);
  if (!cs) return {};

  // Built from the case study's own result and problem/solution copy so
  // every case study gets a unique, keyword-relevant description instead
  // of a generic one-liner — same description used for the page, OG, and
  // Twitter card via the pageMetadata() helper.
  const description = `${cs.title} — ${cs.resultStat} ${cs.resultLabel} for ${cs.client}. ${cs.solution}`.slice(0, 300);

  return pageMetadata({
    title: `${cs.client} Case Study`,
    description,
    path: `/portfolio/${cs.slug}`,
    image: cs.image,
    type: "article",
  });
}

export default async function CaseStudyPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const cs = await getCaseStudyBySlugFromDb(slug);
  if (!cs) notFound();

  const [relatedService, caseStudies] = await Promise.all([
    cs.serviceSlug ? getServiceBySlugFromDb(cs.serviceSlug) : Promise.resolve(null),
    getCaseStudies(),
  ]);
  const moreCaseStudies = caseStudies.filter((c) => c.slug !== cs.slug && c.category === cs.category).slice(0, 3);
  const fallbackCaseStudies = caseStudies.filter((c) => c.slug !== cs.slug).slice(0, 3);
  const related = moreCaseStudies.length > 0 ? moreCaseStudies : fallbackCaseStudies;
  const style = getCategoryStyle(cs.category);

  const caseStudyJsonLd = {
    "@context": "https://schema.org",
    "@type": "Article",
    headline: cs.title,
    about: cs.client,
    articleSection: cs.category,
    image: [absoluteUrl(cs.image)],
    inLanguage: "en",
    author: { "@type": "Organization", name: "Quntam Gen" },
    publisher: {
      "@type": "Organization",
      "@id": ORG_ID,
      name: "Quntam Gen",
      logo: { "@type": "ImageObject", url: `${SITE_URL}/images/logo.webp` },
    },
    mainEntityOfPage: { "@type": "WebPage", "@id": `${SITE_URL}/portfolio/${cs.slug}` },
  };

  const breadcrumbJsonLd = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      { "@type": "ListItem", position: 1, name: "Home", item: SITE_URL },
      { "@type": "ListItem", position: 2, name: "Portfolio", item: `${SITE_URL}/portfolio` },
      { "@type": "ListItem", position: 3, name: cs.client, item: `${SITE_URL}/portfolio/${cs.slug}` },
    ],
  };

  return (
    <>
      <JsonLd data={caseStudyJsonLd} />
      <JsonLd data={breadcrumbJsonLd} />

      <section className="relative overflow-hidden bg-hero-light pt-36 pb-16">
        <QuantumWatermark className="w-[600px] h-[300px] -top-16 right-[-120px]" opacity={0.12} />
        <div className="relative mx-auto max-w-4xl px-6">
          <nav aria-label="Breadcrumb" className="flex items-center gap-1.5 text-sm text-ink-muted mb-8">
            <Link href="/" className="hover:text-ink-heading transition-colors">Home</Link>
            <ChevronRight className="w-3.5 h-3.5" />
            <Link href="/portfolio" className="hover:text-ink-heading transition-colors">Portfolio</Link>
            <ChevronRight className="w-3.5 h-3.5" />
            <span className="text-ink-heading">{cs.client}</span>
          </nav>
          <span className={`inline-flex items-center gap-1.5 rounded-full ${style.bg} ${style.text} px-3 py-1 text-xs font-bold shadow-sm`}>
            <span className={`h-1.5 w-1.5 rounded-full ${style.dot}`} />
            {cs.category}
          </span>
          <h1 className="text-h1 text-ink-heading mt-4">{cs.title}</h1>
          <div className="mt-6 flex items-baseline gap-2">
            <span className="font-display text-4xl font-bold text-gradient">{cs.resultStat}</span>
            <span className="text-ink-muted">{cs.resultLabel}</span>
          </div>
        </div>
      </section>

      {/* Quick facts bar */}
      <div className="mx-auto max-w-4xl px-6">
        <div className="grid grid-cols-3 divide-x divide-border rounded-xl2 border border-border bg-white -mt-8 sm:-mt-10 relative shadow-[0_10px_30px_rgba(10,15,44,0.06)]">
          <div className="flex flex-col items-center gap-1.5 py-5 px-2 text-center">
            <Building2 className="w-4 h-4 text-brand-start" />
            <span className="text-xs sm:text-sm font-semibold text-ink-heading">{cs.industry}</span>
            <span className="text-[11px] text-ink-muted">Industry</span>
          </div>
          <div className="flex flex-col items-center gap-1.5 py-5 px-2 text-center">
            <Clock className="w-4 h-4 text-brand-start" />
            <span className="text-xs sm:text-sm font-semibold text-ink-heading">{cs.timeline}</span>
            <span className="text-[11px] text-ink-muted">Timeline</span>
          </div>
          <div className="flex flex-col items-center gap-1.5 py-5 px-2 text-center">
            <Wrench className="w-4 h-4 text-brand-start" />
            <span className="text-xs sm:text-sm font-semibold text-ink-heading line-clamp-1">{cs.tools[0]} +{cs.tools.length - 1}</span>
            <span className="text-[11px] text-ink-muted">Stack</span>
          </div>
        </div>
      </div>

      <div className="relative aspect-[16/8] max-w-5xl mx-6 lg:mx-auto rounded-xl2 overflow-hidden mt-10 mb-20 shadow-[0_20px_50px_rgba(10,15,44,0.1)]">
        <Image src={cs.image} alt={cs.title} fill sizes="100vw" className="object-cover" priority />
      </div>

      <div className="mx-auto max-w-3xl px-6 space-y-16">
        <AnimatedSection>
          <SectionLabel>The Problem</SectionLabel>
          <p className="mt-4 text-lg text-ink-heading leading-relaxed">{cs.problem}</p>
        </AnimatedSection>

        <AnimatedSection>
          <SectionLabel>The Solution</SectionLabel>
          <p className="mt-4 text-lg text-ink-heading leading-relaxed">{cs.solution}</p>
        </AnimatedSection>

        <AnimatedSection>
          <SectionLabel>The Results</SectionLabel>
          <div className="mt-5 grid sm:grid-cols-1 gap-3">
            {cs.results.map((r) => (
              <div
                key={r}
                className="flex items-start gap-3 rounded-xl2 border border-border bg-white p-4 transition-all duration-300 ease-out-expo hover:-translate-y-0.5 hover:border-transparent hover:shadow-[0_16px_32px_rgba(200,30,44,0.1)]"
              >
                <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-brand-gradient">
                  <Check className="w-3.5 h-3.5 text-white" />
                </span>
                <p className="text-ink-heading leading-relaxed">{r}</p>
              </div>
            ))}
          </div>
        </AnimatedSection>

        <AnimatedSection>
          <SectionLabel>Tools & Tech Used</SectionLabel>
          <div className="mt-4 flex flex-wrap gap-3">
            {cs.tools.map((tool) => (
              <span key={tool} className="rounded-full border border-border bg-white px-4 py-2 text-sm text-ink-body">
                {tool}
              </span>
            ))}
          </div>
        </AnimatedSection>
      </div>

      <div className="mt-20">
        <PullQuote text={cs.quote.text} author={cs.quote.author} role={cs.quote.role} />
      </div>

      {relatedService && (
        <section className="py-20">
          <div className="mx-auto max-w-3xl px-6">
            <AnimatedSection className="card-surface rounded-xl2 p-8 sm:p-10 flex flex-col sm:flex-row items-center gap-8 text-center sm:text-left">
              <QuantumOrbit className="w-16 h-8 shrink-0" animated />
              <div className="flex-1">
                <h2 className="text-h4 text-ink-heading">
                  Want results like this from {relatedService.name}?
                </h2>
                <p className="mt-2 text-ink-body">{relatedService.oneLiner}</p>
              </div>
              <CTAButton href={`/services/${relatedService.slug}`} icon={false} variant="secondary" className="shrink-0">
                Explore {relatedService.shortName} <ArrowRight className="w-4 h-4 ml-1" />
              </CTAButton>
            </AnimatedSection>
          </div>
        </section>
      )}

      {related.length > 0 && (
        <section className="py-20 bg-surface2 border-y border-border">
          <div className="mx-auto max-w-7xl px-6 lg:px-10">
            <AnimatedSection className="mb-12">
              <SectionLabel>More Case Studies</SectionLabel>
              <h2 className="text-h2 text-ink-heading mt-4">See what else we've shipped</h2>
            </AnimatedSection>
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {related.map((r, i) => {
                const rStyle = getCategoryStyle(r.category);
                return (
                  <AnimatedSection key={r.slug} delay={i * 0.08}>
                    <Link href={`/portfolio/${r.slug}`} className="card-surface group block overflow-hidden rounded-xl2">
                      <div className="relative aspect-[4/3] overflow-hidden">
                        <Image
                          src={r.image}
                          alt={r.title}
                          fill
                          sizes="(max-width: 768px) 100vw, 33vw"
                          className="object-cover transition-transform duration-[600ms] ease-out-expo group-hover:scale-105"
                        />
                        <span className={`absolute top-4 left-4 inline-flex items-center gap-1.5 rounded-full ${rStyle.bg} ${rStyle.text} px-3 py-1 text-xs font-bold shadow-sm`}>
                          <span className={`h-1.5 w-1.5 rounded-full ${rStyle.dot}`} />
                          {r.category}
                        </span>
                      </div>
                      <div className="p-6">
                        <h3 className="text-lg font-semibold text-ink-heading leading-snug">{r.title}</h3>
                        <div className="mt-3 flex items-baseline gap-2">
                          <span className="font-display text-2xl font-bold text-gradient">{r.resultStat}</span>
                          <span className="text-sm text-ink-muted">{r.resultLabel}</span>
                        </div>
                      </div>
                    </Link>
                  </AnimatedSection>
                );
              })}
            </div>
          </div>
        </section>
      )}

      <FinalCTA />
    </>
  );
}
