/**
 * Seed list of editable site copy. Each entry becomes a SiteContent document
 * that can be edited from /admin/content, and the corresponding public page
 * falls back to the same string if it hasn't been overridden.
 *
 * To make a new piece of copy editable: add an entry here, then use
 * `text(content, "<key>", "<same default>")` at the matching spot in the page.
 *
 * Only used by scripts/seed-content.ts.
 */
export const SITE_CONTENT_SEED: {
  key: string;
  value: string;
  items: string[];
  type: "text" | "textarea" | "image" | "url" | "list";
  group: string;
  label: string;
  hint?: string;
  order: number;
}[] = [
  // ── Home — Hero ───────────────────────────────────────────────────
  {
    key: "home.hero.eyebrow",
    value: "Innovate • Build • Transform",
    items: [],
    type: "text",
    group: "Home — Hero",
    label: "Eyebrow text",
    hint: "The small red text above the main headline.",
    order: 1,
  },
  {
    key: "home.hero.headline",
    value: "We Build Digital",
    items: [],
    type: "text",
    group: "Home — Hero",
    label: "Headline (first part)",
    hint: "Shown in dark text.",
    order: 2,
  },
  {
    key: "home.hero.headlineAccent",
    value: "Growth Engines",
    items: [],
    type: "text",
    group: "Home — Hero",
    label: "Headline (highlighted part)",
    hint: "Shown in the red/gradient colour.",
    order: 3,
  },
  {
    key: "home.hero.subheadline",
    value:
      "Web development, SEO, marketing, and AI automation — engineered as one system, not nine disconnected vendors. Built to compound, not just launch.",
    items: [],
    type: "textarea",
    group: "Home — Hero",
    label: "Sub-headline",
    order: 4,
  },
  {
    key: "home.hero.primaryCta",
    value: "Get a Free Quote",
    items: [],
    type: "text",
    group: "Home — Hero",
    label: "Primary button text",
    order: 5,
  },
  {
    key: "home.hero.secondaryCta",
    value: "Explore Services",
    items: [],
    type: "text",
    group: "Home — Hero",
    label: "Secondary button text",
    order: 6,
  },

  // ── Home — Trust bar ──────────────────────────────────────────────
  {
    key: "home.trustbar.heading",
    value: "Trusted by 50+ growing businesses",
    items: [],
    type: "text",
    group: "Home — Trust Bar",
    label: "Trust bar heading",
    order: 1,
  },

  // ── Home — FAQ section ────────────────────────────────────────────
  {
    key: "home.faq.eyebrow",
    value: "Frequently Asked Questions",
    items: [],
    type: "text",
    group: "Home — FAQ Section",
    label: "Eyebrow text",
    order: 1,
  },
  {
    key: "home.faq.heading",
    value: "Common questions, answered",
    items: [],
    type: "text",
    group: "Home — FAQ Section",
    label: "Section heading",
    order: 2,
  },
  {
    key: "home.faq.ctaText",
    value: "Ask Us Anything",
    items: [],
    type: "text",
    group: "Home — FAQ Section",
    label: "Button text",
    order: 3,
  },

  // ── Services page ─────────────────────────────────────────────────
  {
    key: "services.hero.eyebrow",
    value: "Services",
    items: [],
    type: "text",
    group: "Services Page",
    label: "Eyebrow text",
    order: 1,
  },
  {
    key: "services.hero.heading",
    value: "One team for the whole growth stack",
    items: [],
    type: "text",
    group: "Services Page",
    label: "Page heading",
    order: 2,
  },
  {
    key: "services.hero.subheading",
    value:
      "Every service below is designed to work together — but each one stands on its own if that's all you need right now.",
    items: [],
    type: "textarea",
    group: "Services Page",
    label: "Page sub-heading",
    order: 3,
  },

  // ── Contact page ──────────────────────────────────────────────────
  {
    key: "contact.hero.eyebrow",
    value: "Contact",
    items: [],
    type: "text",
    group: "Contact Page",
    label: "Eyebrow text",
    order: 1,
  },
  {
    key: "contact.hero.heading",
    value: "Let's talk about your project",
    items: [],
    type: "text",
    group: "Contact Page",
    label: "Page heading",
    order: 2,
  },
  {
    key: "contact.hero.subheading",
    value:
      "Tell us what you're trying to achieve, and we'll come back with a clear, honest plan — no pressure, no jargon.",
    items: [],
    type: "textarea",
    group: "Contact Page",
    label: "Page sub-heading",
    order: 3,
  },

  // ── About page ────────────────────────────────────────────────────
  {
    key: "about.hero.eyebrow",
    value: "About Us",
    items: [],
    type: "text",
    group: "About Page",
    label: "Eyebrow text",
    order: 1,
  },
  {
    key: "about.hero.heading",
    value: "Built to be the last agency you hire",
    items: [],
    type: "text",
    group: "About Page",
    label: "Page heading",
    order: 2,
  },
  {
    key: "about.story.heading",
    value: "From one frustration to nine disciplines",
    items: [],
    type: "text",
    group: "About Page",
    label: "Our Story heading",
    order: 3,
  },
  {
    key: "about.values.heading",
    value: "What guides how we work",
    items: [],
    type: "text",
    group: "About Page",
    label: "Core Values heading",
    order: 4,
  },
  {
    key: "about.team.heading",
    value: "The people behind the work",
    items: [],
    type: "text",
    group: "About Page",
    label: "Our Team heading",
    order: 5,
  },

  // ── FAQ page ──────────────────────────────────────────────────────
  {
    key: "faq.hero.eyebrow",
    value: "FAQs",
    items: [],
    type: "text",
    group: "FAQ Page",
    label: "Eyebrow text",
    order: 1,
  },
  {
    key: "faq.hero.heading",
    value: "Questions, answered",
    items: [],
    type: "text",
    group: "FAQ Page",
    label: "Page heading",
    order: 2,
  },

  // ── Global / contact details ──────────────────────────────────────
  {
    key: "global.email",
    value: "support@quntamgen.com",
    items: [],
    type: "text",
    group: "Global — Contact Details",
    label: "Support email address",
    hint: "Used in the footer, contact page, and the floating email button.",
    order: 1,
  },
  {
    key: "global.location",
    value: "Remote-first, worldwide",
    items: [],
    type: "text",
    group: "Global — Contact Details",
    label: "Location text",
    order: 2,
  },
  {
    key: "global.social.facebook",
    value: "https://www.facebook.com/profile.php?id=61594184384426",
    items: [],
    type: "url",
    group: "Global — Contact Details",
    label: "Facebook URL",
    order: 3,
  },
  {
    key: "global.social.instagram",
    value: "https://www.instagram.com/quntamgen/",
    items: [],
    type: "url",
    group: "Global — Contact Details",
    label: "Instagram URL",
    order: 4,
  },
  {
    key: "global.social.linkedin",
    value: "https://www.linkedin.com/company/quntam-gen/",
    items: [],
    type: "url",
    group: "Global — Contact Details",
    label: "LinkedIn URL",
    order: 5,
  },
  {
    key: "global.footer.tagline",
    value:
      "A digital growth agency building web, SEO, marketing, and AI automation systems that compound over time.",
    items: [],
    type: "textarea",
    group: "Global — Contact Details",
    label: "Footer tagline",
    order: 5,
  },
];
