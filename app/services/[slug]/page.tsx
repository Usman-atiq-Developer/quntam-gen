import type { Metadata } from "next";
import JsonLd from "@/components/JsonLd";
import type { CSSProperties } from "react";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ChevronRight, TrendingUp, Zap, ShieldCheck, Target, Sparkles, Rocket } from "lucide-react";
import { getServices, getServiceBySlugFromDb, getCaseStudies } from "@/lib/siteData";

import { getRelatedPosts } from "@/lib/posts";
import { ServiceIcon } from "@/components/IconMap";
import { SectionLabel } from "@/components/QuantumOrbit";
import AnimatedSection from "@/components/AnimatedSection";
import ProcessTimeline from "@/components/ProcessTimeline";
import ChecklistGrid from "@/components/ChecklistGrid";
import PackageCard from "@/components/PackageCard";
import FAQAccordion from "@/components/FAQAccordion";
import BlogCard from "@/components/BlogCard";
import CTAButton from "@/components/CTAButton";
import FinalCTA from "@/components/FinalCTA";
import QuantumWatermark from "@/components/QuantumWatermark";
import PullQuote from "@/components/PullQuote";
import FloatingAccentIcons from "@/components/FloatingAccentIcons";
import { themeGradient, themeGradientText } from "@/lib/themeStyle";
import { pageMetadata } from "@/lib/seo";
import { SITE_URL } from "@/lib/siteUrl";
import { ORG_ID } from "@/lib/seo";

const benefitIcons = [TrendingUp, Zap, ShieldCheck, Target, Sparkles, Rocket];

export async function generateStaticParams() {
  const services = await getServices();
  return services.map((s) => ({ slug: s.slug }));
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  const service = await getServiceBySlugFromDb(slug);
  if (!service) return {};
  return pageMetadata({
    title: service.name,
    description: service.positioning,
    path: `/services/${service.slug}`,
  });
}

export default async function ServiceDetailPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const service = await getServiceBySlugFromDb(slug);
  if (!service) notFound();

  const { theme } = service;
  const relatedPosts = await getRelatedPosts(service.category, "", 3);
  const caseStudies = await getCaseStudies();
  const spotlightCaseStudy = caseStudies.find((c) => c.category === service.category);

  const serviceJsonLd = {
    "@context": "https://schema.org",
    "@type": "Service",
    "@id": `${SITE_URL}/services/${service.slug}#service`,
    name: service.name,
    serviceType: service.name,
    url: `${SITE_URL}/services/${service.slug}`,
    provider: { "@type": "Organization", "@id": ORG_ID, name: "Quntam Gen", url: SITE_URL },
    areaServed: "Worldwide",
    description: service.positioning,
  };

  const breadcrumbJsonLd = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      { "@type": "ListItem", position: 1, name: "Home", item: SITE_URL },
      { "@type": "ListItem", position: 2, name: "Services", item: `${SITE_URL}/services` },
      { "@type": "ListItem", position: 3, name: service.name, item: `${SITE_URL}/services/${service.slug}` },
    ],
  };

  // The FAQ section below already renders service.faqs visually; this
  // marks the same content up as FAQPage structured data so it's eligible
  // for a rich-result snippet in search — previously untagged.
  const faqJsonLd =
    service.faqs.length > 0
      ? {
          "@context": "https://schema.org",
          "@type": "FAQPage",
          mainEntity: service.faqs.map((faq) => ({
            "@type": "Question",
            name: faq.q,
            acceptedAnswer: { "@type": "Answer", text: faq.a },
          })),
        }
      : null;

  return (
    <>
      <JsonLd data={serviceJsonLd} />
      <JsonLd data={breadcrumbJsonLd} />
      {faqJsonLd && <JsonLd data={faqJsonLd} />}

      {/* Hero — themed per service */}
      <section className="relative overflow-hidden pt-36 pb-20" style={{ backgroundColor: theme.tint }}>
        <QuantumWatermark className="w-[600px] h-[300px] -top-10 right-[-100px]" opacity={0.14} />
        <FloatingAccentIcons icons={service.accentIcons} theme={theme} />
        <div className="relative mx-auto max-w-5xl px-6">
          <nav aria-label="Breadcrumb" className="flex items-center gap-1.5 text-sm text-ink-muted mb-8">
            <Link href="/" className="hover:text-ink-heading transition-colors">Home</Link>
            <ChevronRight className="w-3.5 h-3.5" />
            <Link href="/services" className="hover:text-ink-heading transition-colors">Services</Link>
            <ChevronRight className="w-3.5 h-3.5" />
            <span className="text-ink-heading">{service.name}</span>
          </nav>
          <span
            className="inline-flex items-center justify-center w-14 h-14 rounded-xl text-white mb-6 shadow-lg"
            style={{ ...themeGradient(theme, 135), boxShadow: `0 16px 32px rgba(${theme.glow}, 0.35)` }}
          >
            <ServiceIcon name={service.icon} className="w-7 h-7" />
          </span>
          <h1 className="text-h1 text-ink-heading max-w-3xl">{service.name}</h1>
          <p className="mt-5 text-lg text-ink-body max-w-2xl">{service.positioning}</p>
          <div className="mt-8 flex flex-wrap gap-4">
            <Link
              href="/contact"
              className="group relative inline-flex items-center gap-2 overflow-hidden rounded-full px-6 py-3 text-sm font-semibold text-white transition-transform duration-300 ease-out-expo hover:-translate-y-0.5"
              style={{ ...themeGradient(theme), boxShadow: `0 14px 32px rgba(${theme.glow}, 0.32)` }}
            >
              Get a Free Quote
            </Link>
            <CTAButton href="#packages" variant="secondary" icon={false}>See Pricing</CTAButton>
          </div>
        </div>
      </section>

      {/* Results strip — themed per service */}
      <section className="border-t border-border" style={{ backgroundColor: theme.tint }}>
        <div className="mx-auto max-w-5xl px-6 py-10 grid grid-cols-1 sm:grid-cols-3 gap-8 text-center">
          {service.stats.map((stat) => (
            <div key={stat.label}>
              <p className="font-display text-3xl font-bold" style={themeGradientText(theme)}>{stat.value}</p>
              <p className="mt-1 text-sm text-ink-muted">{stat.label}</p>
            </div>
          ))}
        </div>
      </section>

      {/* What is */}
      <AnimatedSection as="section" className="py-20 border-t border-border">
        <div className="mx-auto max-w-3xl px-6">
          <SectionLabel color={theme.from}>What is {service.name}?</SectionLabel>
          <p className="mt-5 text-lg text-ink-heading leading-relaxed">{service.whatIs}</p>
        </div>
      </AnimatedSection>

      {/* Who this is for */}
      <section className="py-20 bg-surface2 border-y border-border">
        <div className="mx-auto max-w-4xl px-6">
          <AnimatedSection className="max-w-2xl mb-10">
            <SectionLabel color={theme.from}>Is This You?</SectionLabel>
            <h2 className="text-h2 text-ink-heading mt-4">This service is built for you if...</h2>
          </AnimatedSection>
          <div className="space-y-4">
            {service.whoFor.map((point, i) => (
              <AnimatedSection
                key={point}
                delay={i * 0.08}
                className="flex items-start gap-4 rounded-xl2 bg-white border border-border p-5"
              >
                <span
                  className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full text-white text-sm font-bold"
                  style={themeGradient(theme, 135)}
                >
                  ✓
                </span>
                <p className="text-ink-heading font-medium leading-relaxed pt-0.5">{point}</p>
              </AnimatedSection>
            ))}
          </div>
        </div>
      </section>

      {/* Process */}
      <section className="py-20 border-y border-border">
        <div className="mx-auto max-w-7xl px-6 lg:px-10">
          <AnimatedSection className="max-w-2xl mb-14">
            <SectionLabel color={theme.from}>Our Process</SectionLabel>
            <h2 className="text-h2 text-ink-heading mt-4">Exactly how we deliver it</h2>
          </AnimatedSection>
          <ProcessTimeline steps={service.process} theme={theme} />
        </div>
      </section>

      {/* What's included */}
      <section className="py-20 bg-surface2">
        <div className="mx-auto max-w-5xl px-6">
          <AnimatedSection className="max-w-2xl mb-12">
            <SectionLabel color={theme.from}>What's Included</SectionLabel>
            <h2 className="text-h2 text-ink-heading mt-4">Every deliverable, laid out</h2>
          </AnimatedSection>
          <ChecklistGrid items={service.included} theme={theme} />
        </div>
      </section>

      {/* Benefits */}
      <section className="py-20 border-y border-border">
        <div className="mx-auto max-w-5xl px-6">
          <AnimatedSection className="max-w-2xl mb-12">
            <SectionLabel color={theme.from}>Benefits</SectionLabel>
            <h2 className="text-h2 text-ink-heading mt-4">What you should expect to gain</h2>
          </AnimatedSection>
          <div className="grid sm:grid-cols-2 gap-6">
            {service.benefits.map((b, i) => {
              const Icon = benefitIcons[i % benefitIcons.length];
              const cssVars = {
                "--t-from": theme.from,
                "--t-to": theme.to,
                "--t-glow": theme.glow,
              } as CSSProperties;
              return (
                <AnimatedSection
                  key={b}
                  delay={i * 0.06}
                  className="group relative overflow-hidden rounded-xl2 border border-border bg-white p-6 transition-all duration-300 ease-out-expo hover:-translate-y-1 hover:border-transparent"
                  style={cssVars}
                >
                  <span
                    className="pointer-events-none absolute -top-10 -right-10 w-28 h-28 rounded-full opacity-0 blur-2xl transition-opacity duration-300 ease-out-expo group-hover:opacity-25 [background-image:linear-gradient(135deg,var(--t-from),var(--t-to))]"
                  />
                  <span
                    className="relative inline-flex items-center justify-center w-11 h-11 rounded-lg mb-4 transition-all duration-300 ease-out-expo group-hover:rotate-6 group-hover:text-white group-hover:[background-image:linear-gradient(135deg,var(--t-from),var(--t-to))]"
                    style={{ backgroundColor: theme.tint, color: theme.from }}
                  >
                    <Icon className="w-5 h-5" />
                  </span>
                  <p className="relative text-ink-heading leading-relaxed">{b}</p>
                </AnimatedSection>
              );
            })}
          </div>
        </div>
      </section>

      <PullQuote text={service.quote.text} author={service.quote.author} role={service.quote.role} theme={theme} />

      {/* Case study spotlight */}
      {spotlightCaseStudy && (
        <section className="py-20 bg-surface2">
          <div className="mx-auto max-w-5xl px-6">
            <AnimatedSection className="grid md:grid-cols-2 gap-0 rounded-xl2 overflow-hidden border border-border bg-white">
              <div className="relative aspect-[4/3] md:aspect-[3/4]">
                <Image src={spotlightCaseStudy.image} alt={spotlightCaseStudy.title} fill sizes="50vw" className="object-cover" />
              </div>
              <div className="p-8 sm:p-10 flex flex-col justify-center">
                <SectionLabel color={theme.from}>Case Study</SectionLabel>
                <h3 className="text-h3 text-ink-heading mt-4">{spotlightCaseStudy.title}</h3>
                <div className="mt-4 flex items-baseline gap-2">
                  <span className="font-display text-3xl font-bold" style={themeGradientText(theme)}>{spotlightCaseStudy.resultStat}</span>
                  <span className="text-sm text-ink-muted">{spotlightCaseStudy.resultLabel}</span>
                </div>
                <p className="mt-4 text-ink-body leading-relaxed">{spotlightCaseStudy.solution}</p>
                <Link
                  href={`/portfolio/${spotlightCaseStudy.slug}`}
                  className="mt-6 inline-flex items-center gap-1.5 text-sm font-semibold hover:text-ink-heading transition-colors"
                  style={{ color: theme.from }}
                >
                  Read the full case study <ChevronRight className="w-4 h-4" />
                </Link>
              </div>
            </AnimatedSection>
          </div>
        </section>
      )}

      {/* Tools */}
      <section className="py-20 border-y border-border">
        <div className="mx-auto max-w-5xl px-6">
          <AnimatedSection className="max-w-2xl mb-10">
            <SectionLabel color={theme.from}>Tools & Tech We Use</SectionLabel>
            <h2 className="text-h2 text-ink-heading mt-4">Built on a proven stack</h2>
          </AnimatedSection>
          <div className="flex flex-wrap gap-3">
            {service.tools.map((tool, i) => (
              <span
                key={tool}
                className="rounded-full border border-border bg-white px-4 py-2 text-sm text-ink-body transition-all duration-300 ease-out-expo hover:-translate-y-0.5 hover:border-transparent hover:text-white hover:[background-image:linear-gradient(135deg,var(--t-from),var(--t-to))] hover:[box-shadow:0_10px_20px_rgba(var(--t-glow),0.25)]"
                style={{
                  transitionDelay: `${i * 20}ms`,
                  ["--t-from" as string]: theme.from,
                  ["--t-to" as string]: theme.to,
                  ["--t-glow" as string]: theme.glow,
                } as CSSProperties}
              >
                {tool}
              </span>
            ))}
          </div>
        </div>
      </section>

      {/* Packages */}
      <section id="packages" className="py-20 bg-surface2 scroll-mt-24">
        <div className="mx-auto max-w-6xl px-6">
          <AnimatedSection className="max-w-2xl mx-auto text-center mb-14">
            <SectionLabel color={theme.from}>Packages</SectionLabel>
            <h2 className="text-h2 text-ink-heading mt-4">Choose the fit for where you are</h2>
          </AnimatedSection>
          <div className="grid sm:grid-cols-3 gap-6 items-start">
            {service.packages.map((pkg) => (
              <PackageCard key={pkg.name} pkg={pkg} theme={theme} />
            ))}
          </div>
        </div>
      </section>

      {/* FAQs */}
      <section id="faqs" className="py-20 border-t border-border scroll-mt-24">
        <div className="mx-auto max-w-3xl px-6">
          <AnimatedSection className="mb-12">
            <SectionLabel color={theme.from}>FAQs</SectionLabel>
            <h2 className="text-h2 text-ink-heading mt-4">Questions we hear often</h2>
          </AnimatedSection>
          <FAQAccordion faqs={service.faqs} />
        </div>
      </section>

      {/* Related posts */}
      {relatedPosts.length > 0 && (
        <section className="py-20 bg-surface2 border-y border-border">
          <div className="mx-auto max-w-7xl px-6 lg:px-10">
            <AnimatedSection className="max-w-2xl mb-12">
              <SectionLabel color={theme.from}>Related Reading</SectionLabel>
              <h2 className="text-h2 text-ink-heading mt-4">Go deeper on {service.name.toLowerCase()}</h2>
            </AnimatedSection>
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {relatedPosts.map((post, i) => (
                <BlogCard key={post.slug} post={post} index={i} />
              ))}
            </div>
          </div>
        </section>
      )}

      <FinalCTA />
    </>
  );
}
