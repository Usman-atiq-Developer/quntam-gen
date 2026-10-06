import Link from "next/link";
import Hero from "@/components/Hero";
import TrustBar from "@/components/TrustBar";
import { loadContent, text } from "@/lib/content";
import ServiceCard from "@/components/ServiceCard";
import Counter from "@/components/Counter";
import ProcessTimeline from "@/components/ProcessTimeline";
import Testimonials from "@/components/Testimonials";
import BlogCard from "@/components/BlogCard";
import HomeFAQs from "@/components/HomeFAQs";
import FinalCTA from "@/components/FinalCTA";
import AnimatedSection from "@/components/AnimatedSection";
import QuantumWatermark from "@/components/QuantumWatermark";
import ParallaxBlobs from "@/components/ParallaxBlobs";
import { SectionLabel } from "@/components/QuantumOrbit";
import { getServices } from "@/lib/siteData";
import { getAllPosts } from "@/lib/posts";
import type { Metadata } from "next";
import JsonLd from "@/components/JsonLd";
import { webPageJsonLd } from "@/lib/seo";

// The homepage previously exported no metadata of its own — it silently
// inherited the root layout's defaults, which happens to work for
// title/OpenGraph/Twitter (the layout's copy already *is* the homepage's
// copy) but never emits an explicit canonical tag. Every indexable page
// should declare its own canonical, so that's the only thing added here.
//
// Deliberately NOT setting `title` here: the root layout defines
// `title.template: "%s | Quntam Gen"`, so a plain string title on this
// page would get templated into "... | Quntam Gen" and stack on top of
// the layout's own already-branded default, producing a duplicated
// "Quntam Gen | ... | Quntam Gen" title. Leaving `title` unset lets the
// layout's `title.default` (the correct, final homepage title) apply as-is.
export const metadata: Metadata = {
  alternates: { canonical: "/" },
};

const processSteps = [
  { title: "Discover", description: "We learn your business, goals, and audience before recommending anything." },
  { title: "Strategize", description: "We map the exact plan — channels, timeline, and what success looks like." },
  { title: "Build", description: "We design and build in your brand system, with weekly visibility into progress." },
  { title: "Launch", description: "We ship, test, and go live with zero surprises." },
  { title: "Grow", description: "We monitor, report, and keep optimizing after launch." },
];

export default async function HomePage() {
  const [allPosts, content, services] = await Promise.all([getAllPosts(), loadContent(), getServices()]);

  const heroCopy = {
    eyebrow: text(content, "home.hero.eyebrow", "Innovate • Build • Transform"),
    headline: text(content, "home.hero.headline", "We Build Digital"),
    headlineAccent: text(content, "home.hero.headlineAccent", "Growth Engines"),
    subheadline: text(
      content,
      "home.hero.subheadline",
      "Web development, SEO, marketing, and AI automation — engineered as one system, not nine disconnected vendors. Built to compound, not just launch."
    ),
    primaryCta: text(content, "home.hero.primaryCta", "Get a Free Quote"),
    secondaryCta: text(content, "home.hero.secondaryCta", "Explore Services"),
  };

  const featuredPosts = allPosts.slice(0, 3);

  return (
    <>
      <JsonLd
        data={webPageJsonLd({
          name: "Quntam Gen | Web, SEO, Marketing & AI Automation",
          description:
            "Quntam Gen builds digital growth engines — web development, SEO, digital marketing, Meta ads, social media, app development, and AI automation.",
          path: "/",
        })}
      />
      <Hero copy={heroCopy} />
      <TrustBar />

      <section className="relative py-24 sm:py-32 overflow-hidden">
        <ParallaxBlobs />
        <div className="absolute inset-0 bg-mesh-glow-light pointer-events-none" aria-hidden="true" />
        <div className="relative mx-auto max-w-7xl px-6 lg:px-10">
          <AnimatedSection className="max-w-2xl mx-auto text-center mb-16">
            <SectionLabel>Our Services</SectionLabel>
            <h2 className="text-h2 text-ink-heading mt-4">Everything your growth engine needs</h2>
            <p className="mt-4 text-ink-body">
              Nine disciplines, one coordinated strategy — so nothing gets lost between vendors.
              Hover a card to see what we mean.
            </p>
          </AnimatedSection>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {services.map((service, i) => (
              <ServiceCard key={service.slug} service={service} index={i} />
            ))}
          </div>
        </div>
      </section>

      <section className="py-24 bg-surface2 border-y border-border">
        <div className="mx-auto max-w-6xl px-6 lg:px-10">
          <AnimatedSection className="max-w-2xl mx-auto text-center mb-16">
            <SectionLabel>Why Choose Us</SectionLabel>
            <h2 className="text-h2 text-ink-heading mt-4">Results, not just deliverables</h2>
          </AnimatedSection>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-8">
            <Counter value={50} suffix="+" label="Projects Delivered" />
            <Counter value={98} suffix="%" label="Client Satisfaction" />
            <Counter value={24} suffix="/7" label="Support Available" />
            <Counter value={6} suffix=" yrs" label="Combined Team Experience" />
          </div>
        </div>
      </section>

      <section className="py-24 sm:py-32">
        <div className="mx-auto max-w-7xl px-6 lg:px-10">
          <AnimatedSection className="max-w-2xl mx-auto text-center mb-16">
            <SectionLabel>Our Process</SectionLabel>
            <h2 className="text-h2 text-ink-heading mt-4">How we work, start to finish</h2>
          </AnimatedSection>
          <ProcessTimeline steps={processSteps} />
        </div>
      </section>

      <section className="py-24 bg-hero-light border-y border-border relative overflow-hidden">
        <QuantumWatermark className="w-[600px] h-[300px] top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2" opacity={0.15} />
        <div className="relative mx-auto max-w-7xl px-6 lg:px-10">
          <AnimatedSection className="text-center mb-16">
            <span className="section-label justify-center">Testimonials</span>
            <h2 className="text-h2 text-ink-heading mt-4">Trusted by teams who need results</h2>
          </AnimatedSection>
          <Testimonials />
        </div>
      </section>

      {featuredPosts.length > 0 && (
        <section className="relative py-24 sm:py-32 overflow-hidden">
          <div className="absolute inset-0 bg-mesh-glow-light pointer-events-none" aria-hidden="true" />
          <div className="relative mx-auto max-w-7xl px-6 lg:px-10">
            <AnimatedSection className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-4 mb-16">
              <div>
                <SectionLabel>From the Blog</SectionLabel>
                <h2 className="text-h2 text-ink-heading mt-4">Ideas worth stealing</h2>
              </div>
              <Link href="/blog" className="text-sm font-semibold text-brand-end hover:text-ink-heading transition-colors">
                View all posts →
              </Link>
            </AnimatedSection>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {featuredPosts.map((post, i) => (
                <BlogCard key={post.slug} post={post} index={i} priority={i === 0} />
              ))}
            </div>
          </div>
        </section>
      )}

      <HomeFAQs />

      <FinalCTA />
    </>
  );
}
