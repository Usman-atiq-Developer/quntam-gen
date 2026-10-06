import type { Metadata } from "next";
import JsonLd from "@/components/JsonLd";
import Image from "next/image";
import Link from "next/link";
import { Target, Heart, Zap, ShieldCheck, Users, Lightbulb, Linkedin, Rocket, Flag, Sparkles } from "lucide-react";
import { SectionLabel } from "@/components/QuantumOrbit";
import AnimatedSection from "@/components/AnimatedSection";
import FinalCTA from "@/components/FinalCTA";
import QuantumWatermark from "@/components/QuantumWatermark";
import ProcessTimeline from "@/components/ProcessTimeline";
import PullQuote from "@/components/PullQuote";
import CTAButton from "@/components/CTAButton";
import { pageMetadata, webPageJsonLd, breadcrumbJsonLd } from "@/lib/seo";

export const metadata: Metadata = pageMetadata({
  title: "About Us — One Team for Your Digital Growth",
  description:
    "Quntam Gen is a digital growth agency built around one idea: every channel should work together, not in isolation. Meet the team behind the work.",
  path: "/about",
});

const stats = [
  { value: "6+", label: "Years combined experience" },
  { value: "50+", label: "Projects delivered" },
  { value: "12+", label: "Countries served" },
  { value: "98%", label: "Client satisfaction" },
];

const milestones = [
  { year: "2022", title: "The frustration", description: "Our founder spent years watching businesses juggle five disconnected vendors for web, SEO, and ads — with no one accountable for the whole picture." },
  { year: "2022", title: "First client, one team", description: "Quntam Gen launched with a single promise: one coordinated team instead of scattered specialists who don't talk to each other." },
  { year: "2024", title: "Adding AI to the stack", description: "As automation matured, we built out a dedicated AI automation practice — helping clients reclaim hours a week, not just traffic." },
  { year: "2026", title: "Nine disciplines, one system", description: "Today we run web development, SEO, marketing, ads, social, apps, AI automation, UI/UX, and custom software — all under one roof." },
];

const values = [
  { icon: Target, title: "Outcomes over output", description: "We measure success in revenue and growth, not hours billed or pages shipped." },
  { icon: Heart, title: "Genuine partnership", description: "We work like an extension of your team, not a vendor checking boxes." },
  { icon: Zap, title: "Move with urgency", description: "Momentum compounds. We ship fast and iterate in the open." },
  { icon: ShieldCheck, title: "Say the hard thing", description: "If a plan won't work, we'll tell you before we start, not after we bill you." },
  { icon: Lightbulb, title: "Curious by default", description: "We test new tools and channels before our competitors do, so your strategy never goes stale." },
  { icon: Users, title: "No black boxes", description: "You always know what we're doing, why, and what it's producing — full visibility, every month." },
];

const howWeWork = [
  { title: "Listen first", description: "Every engagement starts with understanding your business, not pitching a package." },
  { title: "One point of contact", description: "A single strategy lead coordinates every discipline on your account, so nothing falls through the cracks." },
  { title: "Show the math", description: "Every report ties back to revenue or hours saved — not vanity metrics." },
  { title: "Stay in the room", description: "We stay on after launch. Growth doesn't stop at delivery, and neither do we." },
];

const team = [
  { name: "Usman Atiq", role: "Founder & Strategy Lead", bio: "4+ years scaling growth teams before founding Quntam Gen.", photo: "/images/team/team-1.webp", email: "usman@quntamgen.com" },
  { name: "Diego Ferreira", role: "Head of Web Development", bio: "Ships fast, ships clean — obsessive about performance and code quality.", photo: "/images/team/team-2.webp" },
  { name: "Marco Torres", role: "Head of Marketing & SEO", bio: "Turns search data into content strategies that actually convert.", photo: "/images/team/team-3.webp" },
  { name: "Idris Osei", role: "Head of AI & Automation", bio: "Builds the automations that give clients their time back.", photo: "/images/team/team-4.webp" },
];

export default function AboutPage() {
  return (
    <>
      <JsonLd
        data={[
          webPageJsonLd({ type: "AboutPage", name: "About Quntam Gen", description: "Quntam Gen is one coordinated team for web development, SEO, marketing, ads, app development, and AI automation.", path: "/about" }),
          breadcrumbJsonLd([{ name: "Home", path: "" }, { name: "About" }]),
        ]}
      />
      <section className="relative overflow-hidden bg-hero-light pt-40 pb-20">
        <QuantumWatermark className="w-[600px] h-[300px] -top-16 left-1/2 -translate-x-1/2" opacity={0.12} />
        <div className="relative mx-auto max-w-3xl px-6 text-center">
          <span className="section-label justify-center">About Us</span>
          <h1 className="text-h1 text-ink-heading mt-4">Built to be the last agency you hire</h1>
          <p className="mt-6 text-lg text-ink-body">
            Quntam Gen started with a simple frustration: businesses were hiring five
            different vendors for web, SEO, ads, and automation — and none of them talked to each
            other. We built the agency we wished existed: one team, one strategy, every channel
            working toward the same number.
          </p>
        </div>
      </section>

      {/* Stats bar */}
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

      {/* Mission & Vision */}
      <AnimatedSection as="section" className="py-20 border-t border-border">
        <div className="mx-auto max-w-5xl px-6 grid sm:grid-cols-2 gap-6">
          <div className="card-surface rounded-xl2 p-8">
            <span className="inline-flex items-center justify-center w-11 h-11 rounded-lg bg-red-50 text-brand-start mb-4">
              <Flag className="w-5 h-5" />
            </span>
            <h2 className="text-h4 text-ink-heading mb-3">Our Mission</h2>
            <p className="text-ink-body leading-relaxed">
              Give growing businesses access to senior-level digital expertise across every
              channel, coordinated as one system instead of scattered specialists.
            </p>
          </div>
          <div className="card-surface rounded-xl2 p-8">
            <span className="inline-flex items-center justify-center w-11 h-11 rounded-lg bg-violet-50 text-accent-violet mb-4">
              <Sparkles className="w-5 h-5" />
            </span>
            <h2 className="text-h4 text-ink-heading mb-3">Our Vision</h2>
            <p className="text-ink-body leading-relaxed">
              A world where "digital growth" isn't a black box — where every client understands
              exactly what's working, why, and what's next.
            </p>
          </div>
        </div>
      </AnimatedSection>

      {/* Our story timeline */}
      <section className="py-20 bg-surface2 border-y border-border">
        <div className="mx-auto max-w-4xl px-6">
          <AnimatedSection className="max-w-2xl mx-auto text-center mb-16">
            <SectionLabel>Our Story</SectionLabel>
            <h2 className="text-h2 text-ink-heading mt-4">From one frustration to nine disciplines</h2>
          </AnimatedSection>
          <div className="relative border-l-2 border-border ml-3 sm:ml-0 sm:pl-0">
            {milestones.map((m, i) => (
              <AnimatedSection
                key={`${m.year}-${i}`}
                delay={i * 0.1}
                className="relative pl-8 sm:pl-10 pb-12 last:pb-0"
              >
                <span className="absolute -left-[9px] top-1 h-4 w-4 rounded-full bg-brand-gradient ring-4 ring-surface2" />
                <span className="text-sm font-bold text-brand-start">{m.year}</span>
                <h3 className="mt-1 text-lg font-semibold text-ink-heading">{m.title}</h3>
                <p className="mt-2 text-ink-body leading-relaxed">{m.description}</p>
              </AnimatedSection>
            ))}
          </div>
        </div>
      </section>

      {/* Core values */}
      <section className="py-24">
        <div className="mx-auto max-w-7xl px-6 lg:px-10">
          <AnimatedSection className="max-w-2xl mx-auto text-center mb-16">
            <SectionLabel>Core Values</SectionLabel>
            <h2 className="text-h2 text-ink-heading mt-4">What guides how we work</h2>
          </AnimatedSection>
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {values.map((v, i) => (
              <AnimatedSection
                key={v.title}
                delay={i * 0.06}
                className="group relative overflow-hidden rounded-xl2 border border-border bg-white p-6 transition-all duration-300 ease-out-expo hover:-translate-y-1 hover:border-transparent hover:shadow-[0_20px_40px_rgba(200,30,44,0.12)]"
              >
                <span className="pointer-events-none absolute -top-10 -right-10 w-28 h-28 rounded-full bg-brand-gradient opacity-0 blur-2xl transition-opacity duration-300 ease-out-expo group-hover:opacity-20" />
                <span className="relative inline-flex items-center justify-center w-11 h-11 rounded-lg bg-surface2 text-brand-end mb-4 transition-all duration-300 ease-out-expo group-hover:bg-brand-gradient group-hover:text-white group-hover:rotate-6">
                  <v.icon className="w-5 h-5" strokeWidth={1.75} />
                </span>
                <h3 className="relative text-ink-heading font-semibold mb-2">{v.title}</h3>
                <p className="relative text-sm text-ink-body leading-relaxed">{v.description}</p>
              </AnimatedSection>
            ))}
          </div>
        </div>
      </section>

      {/* How we work */}
      <section className="py-20 bg-surface2 border-y border-border">
        <div className="mx-auto max-w-7xl px-6 lg:px-10">
          <AnimatedSection className="max-w-2xl mx-auto text-center mb-16">
            <SectionLabel>How We Work</SectionLabel>
            <h2 className="text-h2 text-ink-heading mt-4">What it's actually like to work with us</h2>
          </AnimatedSection>
          <ProcessTimeline steps={howWeWork} />
        </div>
      </section>

      <PullQuote
        text="Quntam Gen doesn't feel like a vendor. They feel like the team we wish we'd hired full-time — and they show up like it too."
        author="Sarah Whitfield"
        role="Founder, Lumen Skincare"
      />

      {/* Team */}
      <section className="py-24">
        <div className="mx-auto max-w-7xl px-6 lg:px-10">
          <AnimatedSection className="max-w-2xl mx-auto text-center mb-16">
            <SectionLabel>Our Team</SectionLabel>
            <h2 className="text-h2 text-ink-heading mt-4">The people behind the work</h2>
          </AnimatedSection>
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {team.map((member, i) => (
              <AnimatedSection
                key={member.name}
                delay={i * 0.08}
                className="group overflow-hidden rounded-xl2 border border-border bg-white transition-all duration-300 ease-out-expo hover:-translate-y-1 hover:shadow-[0_20px_40px_rgba(200,30,44,0.12)]"
              >
                <div className="relative aspect-[4/4.2] overflow-hidden">
                  <Image
                    src={member.photo}
                    alt={member.name}
                    fill
                    sizes="25vw"
                    className="object-cover transition-transform duration-[600ms] ease-out-expo group-hover:scale-105"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-basedark/70 via-basedark/10 to-transparent" />
                  <a
                    href="#"
                    aria-label={`${member.name} on LinkedIn`}
                    className="absolute top-3 right-3 flex h-8 w-8 items-center justify-center rounded-full bg-white/15 text-white backdrop-blur-sm opacity-0 transition-all duration-300 ease-out-expo group-hover:opacity-100 hover:bg-white hover:text-brand-start"
                  >
                    <Linkedin className="w-4 h-4" />
                  </a>
                  <div className="absolute bottom-0 left-0 right-0 p-4">
                    <p className="text-white font-semibold">{member.name}</p>
                    <p className="text-xs text-white/75">{member.role}</p>
                  </div>
                </div>
                <div className="p-4">
                  <p className="text-sm text-ink-body leading-relaxed">{member.bio}</p>
                  {member.email && (
                    <a
                      href={`mailto:${member.email}`}
                      className="mt-2 inline-flex items-center gap-1.5 text-xs font-semibold text-brand-start hover:text-ink-heading transition-colors"
                    >
                      {member.email}
                    </a>
                  )}
                </div>
              </AnimatedSection>
            ))}
          </div>
        </div>
      </section>

      {/* Careers CTA */}
      <section className="py-20 bg-surface2 border-y border-border">
        <div className="mx-auto max-w-4xl px-6">
          <AnimatedSection className="card-surface rounded-xl2 p-8 sm:p-10 flex flex-col sm:flex-row items-center gap-8">
            <span className="inline-flex items-center justify-center w-16 h-16 shrink-0 rounded-2xl bg-brand-gradient text-white">
              <Rocket className="w-7 h-7" />
            </span>
            <div className="flex-1 text-center sm:text-left">
              <h2 className="text-h3 text-ink-heading">We're growing — want in?</h2>
              <p className="mt-2 text-ink-body">
                We're always open to hearing from strong designers, developers, and strategists
                who want to work on real client outcomes, not busywork.
              </p>
            </div>
            <CTAButton href="/contact" icon={false} className="shrink-0">
              Get in Touch
            </CTAButton>
          </AnimatedSection>
        </div>
      </section>

      <FinalCTA />
    </>
  );
}
