/**
 * Seed data for site-wide FAQs, extracted verbatim from the original
 * hard-coded arrays in components/HomeFAQs.tsx and app/faq/page.tsx so no
 * wording is lost during the move to the database.
 *
 * Only used by scripts/seed-content.ts. Once seeded, edit FAQs in /admin/faqs.
 */
export const GENERAL_FAQ_SEED: {
  question: string;
  answer: string;
  category: string;
  showOnHome: boolean;
}[] = [
  {
    "question": "What does a digital growth agency like Quntam Gen actually do?",
    "answer": "We combine web development, SEO, digital marketing, Meta ads, social media management, app development, AI automation, UI/UX design, and custom software development into one coordinated strategy — so every channel drives the same business goal instead of working in isolation.",
    "category": "General",
    "showOnHome": true
  },
  {
    "question": "How much does it cost to hire a web development and SEO agency?",
    "answer": "Most website projects start between $1,500–$3,500, and ongoing SEO or digital marketing retainers start around $600–$1,200/month. Every service page has detailed package pricing, or you can request a free custom quote.",
    "category": "General",
    "showOnHome": true
  },
  {
    "question": "How long does it take to see results from SEO and digital marketing?",
    "answer": "Paid channels like Meta ads can show results within days. SEO and organic content marketing typically take 3–4 months to show meaningful movement, with results compounding significantly after 6–12 months.",
    "category": "General",
    "showOnHome": true
  },
  {
    "question": "Do you build custom websites or use templates?",
    "answer": "We build fully custom, responsive websites on modern frameworks like Next.js — no drag-and-drop templates. Every site is designed around your brand and optimized for speed, SEO, and conversions from day one.",
    "category": "General",
    "showOnHome": true
  },
  {
    "question": "Can I hire you for just one service, like SEO or Meta ads?",
    "answer": "Yes. Every service — web development, SEO, digital marketing, Meta ads, social media handling, app development, AI automation, UI/UX design, and custom software development — stands on its own. Many clients start with one service and add others once they see results.",
    "category": "General",
    "showOnHome": true
  },
  {
    "question": "Do you offer AI automation and chatbot development for small businesses?",
    "answer": "Yes — we build custom AI chatbots, workflow automation, and AI customer support agents for businesses of any size, typically starting at $900 for a single automation or chatbot.",
    "category": "General",
    "showOnHome": true
  },
  {
    "question": "Do you offer UI/UX design services separately from web development?",
    "answer": "Yes — you can hire us for UI/UX design only (Figma files, prototypes, and a design system your own developers can build from), or pair it with our web or app development service for a fully built product.",
    "category": "General",
    "showOnHome": true
  },
  {
    "question": "Can you build custom software like a CRM, ERP, or POS system?",
    "answer": "Yes — we build custom business software including CRM systems, ERP systems, inventory and HR management systems, and POS systems, all tailored to your exact workflow instead of forcing you into a generic off-the-shelf tool.",
    "category": "General",
    "showOnHome": true
  },
  {
    "question": "How do I get started?",
    "answer": "Fill out the contact form or book a free consultation call. We'll ask a few questions about your goals and current setup, then come back with a clear recommendation and quote — usually within one business day.",
    "category": "General",
    "showOnHome": false
  },
  {
    "question": "How much does a project typically cost?",
    "answer": "It depends entirely on scope. Most engagements start between $1,500–$3,500 for a single service, with ongoing monthly retainers from $500–$2,500 depending on the discipline. Every service page has detailed package pricing, or you can request a custom quote.",
    "category": "General",
    "showOnHome": false
  },
  {
    "question": "How long does a typical project take?",
    "answer": "A brochure website usually takes 2–4 weeks. Larger builds, full-funnel marketing setups, or app development typically run 6–10 weeks. Ongoing services like SEO, ads, and social media are monthly retainers with no fixed end date.",
    "category": "General",
    "showOnHome": false
  },
  {
    "question": "Do you require a long-term contract?",
    "answer": "One-time projects (like a website build) don't require a retainer. Ongoing services (SEO, ads, social, automation) are typically billed monthly with a 3-month minimum commitment, since most channels need that runway to show results — you can cancel anytime after that with 30 days' notice.",
    "category": "General",
    "showOnHome": false
  },
  {
    "question": "Can you work with businesses outside the US?",
    "answer": "Yes — we're a remote-first team and work with clients worldwide across time zones. We use async updates and scheduled calls to keep communication smooth regardless of where you're based.",
    "category": "General",
    "showOnHome": false
  },
  {
    "question": "What if I only need one service, not the full stack?",
    "answer": "That's completely fine — every service stands on its own. Many clients start with one service (often web development or SEO) and add others later once they see results.",
    "category": "General",
    "showOnHome": false
  },
  {
    "question": "How do payments work?",
    "answer": "One-time projects are typically split into a deposit and a final payment on delivery. Monthly retainers are billed at the start of each billing cycle. We accept bank transfer and major credit cards.",
    "category": "General",
    "showOnHome": false
  },
  {
    "question": "Will I own the website, code, and content you create?",
    "answer": "Yes. Once a project is paid in full, you own all deliverables outright — the website, code, designs, and content we create for you.",
    "category": "General",
    "showOnHome": false
  },
  {
    "question": "What happens after a project launches?",
    "answer": "We offer ongoing maintenance and support plans for websites and apps, and monthly optimization for SEO, ads, social, and automation services. You're never left without support after launch.",
    "category": "General",
    "showOnHome": false
  },
  {
    "question": "How do I report a bug or request a change after launch?",
    "answer": "Every client gets a direct email line to our team. Support-plan clients get priority response times (24 hours or less); one-off requests outside a support plan are quoted individually.",
    "category": "General",
    "showOnHome": false
  }
];
