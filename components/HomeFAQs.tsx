import FAQAccordion from "@/components/FAQAccordion";
import AnimatedSection from "@/components/AnimatedSection";
import CTAButton from "@/components/CTAButton";
import QuantumWatermark from "@/components/QuantumWatermark";
import { SectionLabel } from "@/components/QuantumOrbit";
import { getHomeFAQs } from "@/lib/siteData";
import { loadContent, text } from "@/lib/content";

const fallbackHomeFaqs = [
  {
    q: "What does a digital growth agency like Quntam Gen actually do?",
    a: "We combine web development, SEO, digital marketing, Meta ads, social media management, app development, AI automation, UI/UX design, and custom software development into one coordinated strategy — so every channel drives the same business goal instead of working in isolation.",
  },
  {
    q: "How much does it cost to hire a web development and SEO agency?",
    a: "Most website projects start between $1,500–$3,500, and ongoing SEO or digital marketing retainers start around $600–$1,200/month. Every service page has detailed package pricing, or you can request a free custom quote.",
  },
  {
    q: "How long does it take to see results from SEO and digital marketing?",
    a: "Paid channels like Meta ads can show results within days. SEO and organic content marketing typically take 3–4 months to show meaningful movement, with results compounding significantly after 6–12 months.",
  },
  {
    q: "Do you build custom websites or use templates?",
    a: "We build fully custom, responsive websites on modern frameworks like Next.js — no drag-and-drop templates. Every site is designed around your brand and optimized for speed, SEO, and conversions from day one.",
  },
  {
    q: "Can I hire you for just one service, like SEO or Meta ads?",
    a: "Yes. Every service — web development, SEO, digital marketing, Meta ads, social media handling, app development, AI automation, UI/UX design, and custom software development — stands on its own. Many clients start with one service and add others once they see results.",
  },
  {
    q: "Do you offer AI automation and chatbot development for small businesses?",
    a: "Yes — we build custom AI chatbots, workflow automation, and AI customer support agents for businesses of any size, typically starting at $900 for a single automation or chatbot.",
  },
  {
    q: "Do you offer UI/UX design services separately from web development?",
    a: "Yes — you can hire us for UI/UX design only (Figma files, prototypes, and a design system your own developers can build from), or pair it with our web or app development service for a fully built product.",
  },
  {
    q: "Can you build custom software like a CRM, ERP, or POS system?",
    a: "Yes — we build custom business software including CRM systems, ERP systems, inventory and HR management systems, and POS systems, all tailored to your exact workflow instead of forcing you into a generic off-the-shelf tool.",
  },
];

export default async function HomeFAQs() {
  const [homeFaqs, content] = await Promise.all([
    getHomeFAQs(fallbackHomeFaqs),
    loadContent(),
  ]);

  const faqJsonLd = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: homeFaqs.map((faq) => ({
      "@type": "Question",
      name: faq.q,
      acceptedAnswer: { "@type": "Answer", text: faq.a },
    })),
  };

  return (
    <section className="relative py-24 sm:py-32 border-t border-border overflow-hidden">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(faqJsonLd) }} />

      <div className="mx-auto max-w-5xl px-6">
        <div className="relative overflow-hidden rounded-xl2 bg-hero-light border border-border px-6 py-14 sm:px-14 sm:py-16">
          <QuantumWatermark className="w-[420px] h-[210px] -top-10 -right-16" opacity={0.1} />
          <QuantumWatermark className="w-[300px] h-[150px] -bottom-16 -left-16 rotate-45" opacity={0.07} />

          {/* Decorative floating dots, echoing the brand palette */}
          <span className="hidden sm:block absolute top-10 left-10 w-3 h-3 rounded-full bg-brand-end/40 animate-floatSlow" aria-hidden="true" />
          <span className="hidden sm:block absolute top-24 right-16 w-2 h-2 rounded-full bg-accent-violet/50 animate-floatSlow [animation-delay:1.2s]" aria-hidden="true" />
          <span className="hidden sm:block absolute bottom-16 left-1/4 w-2.5 h-2.5 rounded-full bg-accent-gold/50 animate-floatSlow [animation-delay:0.6s]" aria-hidden="true" />

          <div className="relative max-w-3xl mx-auto">
            <AnimatedSection className="text-center mb-14">
              <SectionLabel>{text(content, "home.faq.eyebrow", "Frequently Asked Questions")}</SectionLabel>
              <h2 className="text-h2 text-ink-heading mt-4">{text(content, "home.faq.heading", "Common questions, answered")}</h2>
              <p className="mt-4 text-ink-body">
                Can't find what you're looking for?{" "}
                <a href="/faq" className="text-brand-end font-semibold hover:text-ink-heading transition-colors">
                  Browse the full FAQ →
                </a>
              </p>
            </AnimatedSection>
            <FAQAccordion faqs={homeFaqs} />
            <AnimatedSection className="text-center mt-12">
              <CTAButton href="/contact">{text(content, "home.faq.ctaText", "Ask Us Anything")}</CTAButton>
            </AnimatedSection>
          </div>
        </div>
      </div>
    </section>
  );
}
