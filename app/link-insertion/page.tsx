import type { Metadata } from "next";
import { Mail, Link2, CheckCircle2 } from "lucide-react";
import LinkInsertionForm from "@/components/LinkInsertionForm";
import QuantumWatermark from "@/components/QuantumWatermark";
import { pageMetadata } from "@/lib/seo";

export const metadata: Metadata = pageMetadata({
  title: "Link Insertion Requests",
  description:
    "Request a link insertion or guest post placement on the Quntam Gen blog. Tell us your target URL and anchor text and we'll review it.",
  path: "/link-insertion",
});

const guidelines = [
  "Links must point to content that's genuinely useful to our readers — no thin affiliate pages.",
  "We review every request manually; not all submissions are accepted.",
  "Turnaround is typically 3–5 business days once approved.",
  "Pricing depends on the article, relevance, and placement — we'll follow up by email.",
];

export default function LinkInsertionPage() {
  return (
    <>
      <section className="relative overflow-hidden bg-hero-light pt-40 pb-20">
        <QuantumWatermark className="w-[600px] h-[300px] -top-16 right-[-120px]" opacity={0.12} />
        <div className="relative mx-auto max-w-7xl px-6 lg:px-10">
          <div className="max-w-2xl">
            <span className="section-label">Link Insertion</span>
            <h1 className="text-h1 text-ink-heading mt-4">Request a link placement</h1>
            <p className="mt-6 text-lg text-ink-body">
              Looking to place a link in one of our published articles? Tell us the URL, your
              preferred anchor text, and where you&apos;d like it placed — we&apos;ll review it and
              follow up by email.
            </p>
          </div>
        </div>
      </section>

      <section className="py-20">
        <div className="mx-auto max-w-7xl px-6 lg:px-10">
          <div className="grid lg:grid-cols-[1fr_1.2fr] gap-12">
            <div className="space-y-8">
              <div className="card-surface rounded-xl2 p-6 space-y-4">
                <h2 className="text-lg font-semibold text-ink-heading flex items-center gap-2">
                  <Link2 className="w-5 h-5 text-brand-end" /> How it works
                </h2>
                <ul className="space-y-3">
                  {guidelines.map((g) => (
                    <li key={g} className="flex items-start gap-3 text-sm text-ink-body">
                      <CheckCircle2 className="w-4 h-4 text-brand-end mt-0.5 shrink-0" />
                      {g}
                    </li>
                  ))}
                </ul>
              </div>

              <a
                href="mailto:support@quntamgen.com"
                className="flex items-center gap-3 text-ink-body hover:text-brand-end transition-colors"
              >
                <span className="rounded-lg bg-surface2 p-2.5 text-brand-end">
                  <Mail className="w-5 h-5" />
                </span>
                support@quntamgen.com
              </a>
            </div>

            <LinkInsertionForm />
          </div>
        </div>
      </section>
    </>
  );
}
