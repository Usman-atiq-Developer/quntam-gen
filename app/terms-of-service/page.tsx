import type { Metadata } from "next";
import { SectionLabel } from "@/components/QuantumOrbit";
import { pageMetadata } from "@/lib/seo";

export const metadata: Metadata = pageMetadata({
  title: "Terms of Service",
  description: "The terms that govern your use of the Quntam Gen website and services.",
  path: "/terms-of-service",
});

export default function TermsOfServicePage() {
  return (
    <section className="pt-40 pb-28">
      <div className="mx-auto max-w-3xl px-6">
        <SectionLabel>Legal</SectionLabel>
        <h1 className="text-h1 text-ink-heading mt-4 mb-4">Terms of Service</h1>
        <p className="text-ink-muted mb-12">Last updated: August 2, 2026</p>

        <div className="prose-invert-brand prose max-w-none space-y-8 text-ink-body">
          <div>
            <h2 className="text-h4 text-ink-heading mb-3">1. Acceptance of Terms</h2>
            <p>
              By accessing this website or engaging Quntam Gen for services, you
              agree to be bound by these Terms of Service. If you don't agree, please don't use
              this site or our services.
            </p>
          </div>
          <div>
            <h2 className="text-h4 text-ink-heading mb-3">2. Services</h2>
            <p>
              Specific service engagements — including scope, timelines, deliverables, and
              pricing — are governed by a separate written agreement or proposal between you and
              Quntam Gen. These general terms apply to your use of this website.
            </p>
          </div>
          <div>
            <h2 className="text-h4 text-ink-heading mb-3">3. Intellectual Property</h2>
            <p>
              All content on this site — including text, graphics, logos, and the Quntam Gen
              Solutions brand mark — is owned by or licensed to Quntam Gen and may not
              be copied, reproduced, or used without written permission.
            </p>
          </div>
          <div>
            <h2 className="text-h4 text-ink-heading mb-3">4. Website Use</h2>
            <p>
              You agree not to misuse this website, including attempting unauthorized access to
              our systems, interfering with site functionality, or using automated tools to scrape
              content without permission.
            </p>
          </div>
          <div>
            <h2 className="text-h4 text-ink-heading mb-3">5. Limitation of Liability</h2>
            <p>
              This website and its content are provided "as is" without warranties of any kind. To
              the fullest extent permitted by law, Quntam Gen is not liable for any
              indirect, incidental, or consequential damages arising from your use of this site.
            </p>
          </div>
          <div>
            <h2 className="text-h4 text-ink-heading mb-3">6. Third-Party Links</h2>
            <p>
              This site may link to third-party websites we don't control. We aren't responsible
              for the content or practices of those sites.
            </p>
          </div>
          <div>
            <h2 className="text-h4 text-ink-heading mb-3">7. Changes to These Terms</h2>
            <p>
              We may update these Terms from time to time. Continued use of the site after changes
              are posted constitutes acceptance of the revised terms.
            </p>
          </div>
          <div>
            <h2 className="text-h4 text-ink-heading mb-3">8. Contact Us</h2>
            <p>Questions about these terms? Email us at support@quntamgen.com.</p>
          </div>
        </div>
      </div>
    </section>
  );
}
