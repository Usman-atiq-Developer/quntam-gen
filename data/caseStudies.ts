export type CaseStudy = {
  slug: string;
  client: string;
  category: string; // matches a service name
  industry: string;
  timeline: string;
  serviceSlug: string;
  tools: string[];
  title: string;
  image: string;
  resultStat: string;
  resultLabel: string;
  problem: string;
  solution: string;
  results: string[];
  quote: { text: string; author: string; role: string };
};

export const caseStudies: CaseStudy[] = [
  {
    slug: "lumen-skincare-web-redesign",
    client: "Lumen Skincare",
    category: "Web Development",
    industry: "Skincare & Beauty E-commerce",
    timeline: "6 weeks",
    serviceSlug: "web-development",
    tools: ["Next.js", "Shopify", "Tailwind CSS", "Vercel"],
    title: "A 3-second homepage becomes a 0.9-second one",
    image: "/images/portfolio/case-lumen.webp",
    resultStat: "+62%",
    resultLabel: "conversion rate",
    problem:
      "Lumen's e-commerce site was built on a slow, plugin-heavy platform. Mobile load times averaged over three seconds, and cart abandonment was climbing every quarter.",
    solution:
      "We rebuilt the storefront on a modern headless stack, optimized every image and script, and redesigned the checkout flow around fewer steps and clearer trust signals.",
    results: [
      "Largest Contentful Paint dropped from 3.1s to 0.9s",
      "Checkout conversion rate increased 62%",
      "Mobile bounce rate fell by a third within six weeks",
    ],
    quote: {
      text: "The new site paid for itself in the first month — conversion went up before we even finished the SEO work.",
      author: "Sarah Whitfield",
      role: "Founder, Lumen Skincare",
    },
  },
  {
    slug: "northbridge-logistics-automation",
    client: "Northbridge Logistics",
    category: "AI Automation",
    industry: "Logistics & Freight",
    timeline: "4 weeks",
    serviceSlug: "ai-automation",
    tools: ["OpenAI / Claude API", "Zapier", "Twilio", "HubSpot"],
    title: "Cutting support response time from hours to minutes",
    image: "/images/portfolio/case-northbridge.webp",
    resultStat: "35%",
    resultLabel: "of tickets automated",
    problem:
      "Northbridge's small support team was buried in repetitive shipment-status questions, leaving little time for the complex cases that actually needed a human.",
    solution:
      "We built an AI support agent connected directly to their shipment tracking system, able to resolve status questions instantly and escalate anything else with full context.",
    results: [
      "35% of inbound tickets now resolved without a human",
      "Average response time dropped from 4 hours to under 2 minutes",
      "Support team capacity freed up for high-value accounts",
    ],
    quote: {
      text: "A third of our support tickets now resolve without a human touching them. That's hours back every week.",
      author: "Marcus Delgado",
      role: "COO, Northbridge Logistics",
    },
  },
  {
    slug: "verdant-foods-seo-growth",
    client: "Verdant Foods",
    category: "SEO",
    industry: "Food & Beverage",
    timeline: "9 months (ongoing)",
    serviceSlug: "seo",
    tools: ["Google Search Console", "Ahrefs", "Screaming Frog"],
    title: "Organic traffic that kept compounding",
    image: "/images/portfolio/case-verdant.webp",
    resultStat: "3.4x",
    resultLabel: "organic traffic in 9 months",
    problem:
      "Verdant relied almost entirely on paid ads, with organic traffic flat for over a year despite strong products and content.",
    solution:
      "We ran a full technical audit, restructured their content around real search intent, and built a consistent link-earning content calendar.",
    results: [
      "Organic sessions grew 3.4x within nine months",
      "Blog now drives 40% of new customer acquisition",
      "Cost per acquisition from organic search down 58%",
    ],
    quote: {
      text: "Organic traffic grew every single month. It's the first time SEO felt like a system instead of a gamble.",
      author: "Priya Anand",
      role: "Marketing Director, Verdant Foods",
    },
  },
  {
    slug: "cascade-fitness-meta-ads",
    client: "Cascade Fitness",
    category: "Meta Ads",
    industry: "Fitness & Wellness",
    timeline: "3 months (ongoing)",
    serviceSlug: "meta-ads",
    tools: ["Meta Ads Manager", "Meta Pixel", "Triple Whale"],
    title: "Scaling ad spend without losing ROAS",
    image: "/images/portfolio/case-cascade.webp",
    resultStat: "4.1x",
    resultLabel: "return on ad spend",
    problem:
      "Cascade's Meta ads performed well at a small budget but broke down every time they tried to scale spend, with ROAS dropping sharply past $5k/month.",
    solution:
      "We rebuilt the campaign structure around a tighter testing framework, refreshed creative on a two-week cycle, and layered in a dedicated retargeting funnel.",
    results: [
      "Scaled monthly spend 3x while holding 4.1x ROAS",
      "Cost per purchase down 44%",
      "Retargeting funnel now drives 28% of total revenue",
    ],
    quote: {
      text: "We finally scaled spend without ROAS falling apart. The creative testing process is the difference.",
      author: "Sarah Whitfield",
      role: "Founder, Lumen Skincare",
    },
  },
  {
    slug: "harbor-co-social-growth",
    client: "Harbor & Co.",
    category: "Social Media",
    industry: "Hospitality & Retail",
    timeline: "6 months (ongoing)",
    serviceSlug: "social-media-handling",
    tools: ["Canva", "CapCut", "Meta Business Suite", "Later"],
    title: "From inconsistent posting to a real community",
    image: "/images/portfolio/case-harbor.webp",
    resultStat: "12k",
    resultLabel: "followers gained in 6 months",
    problem:
      "Harbor & Co. posted sporadically with no content strategy, and engagement had been declining for months.",
    solution:
      "We built a content calendar around three core pillars, redesigned their visual system, and took over daily community management.",
    results: [
      "Gained 12,000 followers across Instagram and TikTok in six months",
      "Engagement rate more than tripled",
      "Social now drives measurable traffic to the online store",
    ],
    quote: {
      text: "Our engagement more than tripled in six months, and I stopped thinking about posting altogether.",
      author: "Priya Anand",
      role: "Marketing Director, Verdant Foods",
    },
  },
  {
    slug: "kinetic-robotics-app",
    client: "Kinetic Robotics",
    category: "App Development",
    industry: "Industrial Robotics",
    timeline: "10 weeks",
    serviceSlug: "app-development",
    tools: ["Flutter", "Firebase", "Figma"],
    title: "A field-service app built for spotty connectivity",
    image: "/images/portfolio/case-kinetic.webp",
    resultStat: "-70%",
    resultLabel: "reporting time per job",
    problem:
      "Kinetic's field technicians relied on paper checklists, causing delays and errors in reporting back to the office.",
    solution:
      "We built a cross-platform app with full offline support, syncing automatically once technicians regained signal, plus a technician-friendly UI built for gloves and glare.",
    results: [
      "Reporting time per job cut by 70%",
      "Data entry errors dropped to near zero",
      "Office team gets real-time job status instead of end-of-day paperwork",
    ],
    quote: {
      text: "Our field techs actually use the app now — offline support was the feature that made it stick.",
      author: "Marcus Delgado",
      role: "COO, Northbridge Logistics",
    },
  },
  {
    slug: "verdant-foods-dashboard-redesign",
    client: "Verdant Foods",
    category: "UI/UX Design",
    industry: "Food & Beverage",
    timeline: "5 weeks",
    serviceSlug: "ui-ux-design",
    tools: ["Figma", "FigJam", "Maze"],
    title: "Turning a confusing internal dashboard into one the team enjoys using",
    image: "/images/portfolio/case-uiux.webp",
    resultStat: "-64%",
    resultLabel: "'how do I do X' support tickets",
    problem:
      "Verdant's internal operations dashboard had grown organically for years, with buried features and a layout that confused new hires for weeks.",
    solution:
      "We ran usability sessions with the actual team, redesigned the information architecture from scratch, and delivered a full Figma design system the developers could build from directly.",
    results: [
      "Internal 'how do I do X' support tickets dropped 64%",
      "New hire onboarding time on the tool cut roughly in half",
      "Design system now reused across three other internal tools",
    ],
    quote: {
      text: "They turned a confusing internal tool into something our team actually enjoys using. Support tickets about 'how do I do X' basically disappeared.",
      author: "Priya Anand",
      role: "Marketing Director, Verdant Foods",
    },
  },
  {
    slug: "northbridge-logistics-custom-crm",
    client: "Northbridge Logistics",
    category: "Custom Software Development",
    industry: "Logistics & Freight",
    timeline: "12 weeks",
    serviceSlug: "custom-software-development",
    tools: ["Node.js", "PostgreSQL", "React", "AWS"],
    title: "Replacing four spreadsheets with one custom CRM",
    image: "/images/portfolio/case-software.webp",
    resultStat: "12hrs",
    resultLabel: "saved per week on manual reconciliation",
    problem:
      "Northbridge's sales and operations teams tracked shipments, quotes, and client history across four disconnected spreadsheets that constantly fell out of sync.",
    solution:
      "We built a custom CRM tailored to their exact sales and fulfillment process, with role-based access and a direct integration into their shipment tracking system.",
    results: [
      "12 hours a week reclaimed from manual spreadsheet reconciliation",
      "Zero data-entry conflicts since rollout",
      "Full client history now visible to every team in one place",
    ],
    quote: {
      text: "The custom dashboard replaced four different spreadsheets our team was manually reconciling every week. It just works the way we actually operate.",
      author: "Marcus Delgado",
      role: "COO, Northbridge Logistics",
    },
  },
];

export const getCaseStudyBySlug = (slug: string) => caseStudies.find((c) => c.slug === slug);
