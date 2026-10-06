import type { Metadata } from "next";
import JsonLd from "@/components/JsonLd";
import Link from "next/link";
import FAQAccordion from "@/components/FAQAccordion";
import CTAButton from "@/components/CTAButton";
import QuantumWatermark from "@/components/QuantumWatermark";
import { getServices, getAllFAQs } from "@/lib/siteData";
import { loadContent, text } from "@/lib/content";
import { pageMetadata } from "@/lib/seo";

export const metadata: Metadata = pageMetadata({
  title: "FAQs: Pricing, Process & Timelines",
  description: "Answers to common questions about working with Quntam Gen — pricing, process, timelines, contracts, and support.",
  path: "/faq",
});

const fallbackGeneralFaqs = [
  {
    q: "How do I get started?",
    a: "Fill out the contact form or book a free consultation call. We'll ask a few questions about your goals and current setup, then come back with a clear recommendation and quote — usually within one business day.",
  },
  {
    q: "How much does a project typically cost?",
    a: "It depends entirely on scope. Most engagements start between $1,500–$3,500 for a single service, with ongoing monthly retainers from $500–$2,500 depending on the discipline. Every service page has detailed package pricing, or you can request a custom quote.",
  },
  {
    q: "How long does a typical project take?",
    a: "A brochure website usually takes 2–4 weeks. Larger builds, full-funnel marketing setups, or app development typically run 6–10 weeks. Ongoing services like SEO, ads, and social media are monthly retainers with no fixed end date.",
  },
  {
    q: "Do you require a long-term contract?",
    a: "One-time projects (like a website build) don't require a retainer. Ongoing services (SEO, ads, social, automation) are typically billed monthly with a 3-month minimum commitment, since most channels need that runway to show results — you can cancel anytime after that with 30 days' notice.",
  },
  {
    q: "Can you work with businesses outside the US?",
    a: "Yes — we're a remote-first team and work with clients worldwide across time zones. We use async updates and scheduled calls to keep communication smooth regardless of where you're based.",
  },
  {
    q: "What if I only need one service, not the full stack?",
    a: "That's completely fine — every service stands on its own. Many clients start with one service (often web development or SEO) and add others later once they see results.",
  },
  {
    q: "How do payments work?",
    a: "One-time projects are typically split into a deposit and a final payment on delivery. Monthly retainers are billed at the start of each billing cycle. We accept bank transfer and major credit cards.",
  },
  {
    q: "Will I own the website, code, and content you create?",
    a: "Yes. Once a project is paid in full, you own all deliverables outright — the website, code, designs, and content we create for you.",
  },
  {
    q: "What happens after a project launches?",
    a: "We offer ongoing maintenance and support plans for websites and apps, and monthly optimization for SEO, ads, social, and automation services. You're never left without support after launch.",
  },
  {
    q: "How do I report a bug or request a change after launch?",
    a: "Every client gets a direct email line to our team. Support-plan clients get priority response times (24 hours or less); one-off requests outside a support plan are quoted individually.",
  },
];

export const revalidate = 60;

export default async function FAQPage() {
  const [generalFaqs, content, services] = await Promise.all([
    getAllFAQs(fallbackGeneralFaqs),
    loadContent(),
    getServices(),
  ]);

  const faqJsonLd = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: generalFaqs.map((faq) => ({
      "@type": "Question",
      name: faq.q,
      acceptedAnswer: { "@type": "Answer", text: faq.a },
    })),
  };

  return (
    <>
      <JsonLd data={faqJsonLd} />

      <section className="relative overflow-hidden bg-hero-light pt-40 pb-20">
        <QuantumWatermark className="w-[600px] h-[300px] -top-16 left-1/2 -translate-x-1/2" opacity={0.12} />
        <div className="relative mx-auto max-w-3xl px-6 text-center">
          <span className="section-label justify-center">{text(content, "faq.hero.eyebrow", "FAQs")}</span>
          <h1 className="text-h1 text-ink-heading mt-4">{text(content, "faq.hero.heading", "Questions, answered")}</h1>
          <p className="mt-6 text-lg text-ink-body">
            Everything you need to know about working with us. Can't find your answer?{" "}
            <Link href="/contact" className="text-brand-start font-semibold underline underline-offset-2">Ask us directly</Link>.
          </p>
        </div>
      </section>

      <section className="py-20">
        <div className="mx-auto max-w-3xl px-6">
          <FAQAccordion faqs={generalFaqs} />
        </div>
      </section>

      <section className="py-20 bg-surface2 border-t border-border">
        <div className="mx-auto max-w-5xl px-6">
          <h2 className="text-h3 text-ink-heading text-center mb-3">Have a service-specific question?</h2>
          <p className="text-ink-body text-center mb-10">Each service page has its own detailed FAQ section.</p>
          <div className="flex flex-wrap justify-center gap-3">
            {services.map((s) => (
              <Link
                key={s.slug}
                href={`/services/${s.slug}#faqs`}
                className="rounded-full border border-border bg-white px-5 py-2.5 text-sm font-medium text-ink-heading hover:border-transparent hover:bg-brand-gradient hover:text-white transition-all duration-micro ease-out-expo"
              >
                {s.name}
              </Link>
            ))}
          </div>
          <div className="mt-12 text-center">
            <CTAButton href="/contact">Still Have Questions? Contact Us</CTAButton>
          </div>
        </div>
      </section>
    </>
  );
}
