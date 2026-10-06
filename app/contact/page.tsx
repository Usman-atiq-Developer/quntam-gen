import type { Metadata } from "next";
import JsonLd from "@/components/JsonLd";
import { Mail, MapPin, Linkedin, Instagram, Facebook } from "lucide-react";
import ContactForm from "@/components/ContactForm";
import QuantumWatermark from "@/components/QuantumWatermark";
import { loadContent, text } from "@/lib/content";
import { getServices } from "@/lib/siteData";
import { pageMetadata, webPageJsonLd, breadcrumbJsonLd } from "@/lib/seo";

export const metadata: Metadata = pageMetadata({
  title: "Contact Us — Get a Free Quote",
  description: "Get a free quote from Quntam Gen. Tell us about your project and we'll get back to you within one business day.",
  path: "/contact",
});

export const revalidate = 60;

export default async function ContactPage() {
  const [content, services] = await Promise.all([loadContent(), getServices()]);

  return (
    <>
      <JsonLd
        data={[
          webPageJsonLd({ type: "ContactPage", name: "Contact Quntam Gen", description: "Get a free quote from Quntam Gen. Tell us about your project and we will reply within one business day.", path: "/contact" }),
          breadcrumbJsonLd([{ name: "Home", path: "" }, { name: "Contact" }]),
        ]}
      />
      <section className="relative overflow-hidden bg-hero-light pt-40 pb-20">
        <QuantumWatermark className="w-[600px] h-[300px] -top-16 right-[-120px]" opacity={0.12} />
        <div className="relative mx-auto max-w-7xl px-6 lg:px-10">
          <div className="max-w-2xl">
            <span className="section-label">{text(content, "contact.hero.eyebrow", "Contact")}</span>
            <h1 className="text-h1 text-ink-heading mt-4">{text(content, "contact.hero.heading", "Let's talk about your project")}</h1>
            <p className="mt-6 text-lg text-ink-body">
              {text(content, "contact.hero.subheading", "Tell us what you're trying to achieve, and we'll come back with a clear, honest plan — no pressure, no jargon.")}
            </p>
          </div>
        </div>
      </section>

      <section className="py-20">
        <div className="mx-auto max-w-7xl px-6 lg:px-10">
        <div className="grid lg:grid-cols-[1fr_1.2fr] gap-12">
          <div className="space-y-8">
            <div className="card-surface rounded-xl2 p-6 space-y-5">
              <a href={`mailto:${text(content, "global.email", "support@quntamgen.com")}`} className="flex items-center gap-3 text-ink-body hover:text-brand-end transition-colors">
                <span className="rounded-lg bg-surface2 p-2.5 text-brand-end"><Mail className="w-5 h-5" /></span>
                {text(content, "global.email", "support@quntamgen.com")}
              </a>
              <span className="flex items-center gap-3 text-ink-body">
                <span className="rounded-lg bg-surface2 p-2.5 text-brand-end"><MapPin className="w-5 h-5" /></span>
                {text(content, "global.location", "Remote-first, worldwide")}
              </span>
            </div>

            <div className="flex items-center gap-3">
              {[
                { icon: Facebook, href: text(content, "global.social.facebook", "https://www.facebook.com/profile.php?id=61594184384426"), label: "Facebook" },
                { icon: Linkedin, href: text(content, "global.social.linkedin", "https://www.linkedin.com/company/quntam-gen/"), label: "LinkedIn" },
                { icon: Instagram, href: text(content, "global.social.instagram", "https://www.instagram.com/quntamgen/"), label: "Instagram" },
              ].map(({ icon: Icon, href, label }) => (
                <a
                  key={label}
                  href={href}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={label}
                  className="rounded-full border border-border p-2.5 text-ink-muted hover:text-white hover:border-transparent hover:bg-brand-gradient transition-all duration-micro"
                >
                  <Icon className="w-4 h-4" />
                </a>
              ))}
            </div>

            <div className="rounded-xl2 overflow-hidden border border-border h-64">
              <iframe
                title="Quntam Gen location"
                width="100%"
                height="100%"
                loading="lazy"
                style={{ border: 0 }}
                src="https://www.google.com/maps?q=New+York,NY&output=embed"
              />
            </div>
          </div>

          <ContactForm services={services} />
        </div>
      </div>
      </section>
    </>
  );
}
