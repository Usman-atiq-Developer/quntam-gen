import type { Metadata } from "next";
import { SectionLabel } from "@/components/QuantumOrbit";
import { pageMetadata } from "@/lib/seo";

export const metadata: Metadata = pageMetadata({
  title: "Privacy Policy",
  description: "How Quntam Gen collects, uses, and protects your information.",
  path: "/privacy-policy",
});

export default function PrivacyPolicyPage() {
  return (
    <section className="pt-40 pb-28">
      <div className="mx-auto max-w-3xl px-6">
        <SectionLabel>Legal</SectionLabel>
        <h1 className="text-h1 text-ink-heading mt-4 mb-4">Privacy Policy</h1>
        <p className="text-ink-muted mb-12">Last updated: August 2, 2026</p>

        <div className="prose-invert-brand prose max-w-none space-y-8 text-ink-body">
          <div>
            <h2 className="text-h4 text-ink-heading mb-3">1. Information We Collect</h2>
            <p>
              We collect information you provide directly to us, such as when you fill out our
              contact form, subscribe to our newsletter, or communicate with us — including your
              name, email address, phone number, and any project details you share. We also
              collect certain technical information automatically, such as your IP address,
              browser type, device information, and pages visited, through cookies and similar
              technologies, including Meta Pixel and Google Analytics.
            </p>
          </div>
          <div>
            <h2 className="text-h4 text-ink-heading mb-3">2. How We Use Your Information</h2>
            <p>
              We use the information we collect to respond to your inquiries, deliver the services
              you request, send marketing communications you've opted into, measure and improve
              the performance of our website and advertising (including Meta Ads campaigns), and
              comply with legal obligations.
            </p>
          </div>
          <div>
            <h2 className="text-h4 text-ink-heading mb-3">3. Cookies & Tracking</h2>
            <p>
              We use cookies and similar technologies to understand how visitors use our site and
              to measure advertising performance. You can control cookie preferences through our
              cookie consent banner or your browser settings. Declining cookies may affect certain
              site functionality.
            </p>
          </div>
          <div>
            <h2 className="text-h4 text-ink-heading mb-3">4. Sharing Your Information</h2>
            <p>
              We do not sell your personal information. We may share information with trusted
              service providers who help us operate our business (such as hosting, email, and
              analytics providers), or when required by law.
            </p>
          </div>
          <div>
            <h2 className="text-h4 text-ink-heading mb-3">5. Your Rights</h2>
            <p>
              Depending on your location, you may have the right to access, correct, delete, or
              export your personal information, and to opt out of marketing communications at any
              time. To exercise these rights, contact us at support@quntamgen.com.
            </p>
          </div>
          <div>
            <h2 className="text-h4 text-ink-heading mb-3">6. Data Retention & Security</h2>
            <p>
              We retain personal information only as long as necessary for the purposes described
              in this policy, and take reasonable technical and organizational measures to protect
              it against unauthorized access or disclosure.
            </p>
          </div>
          <div>
            <h2 className="text-h4 text-ink-heading mb-3">7. Changes to This Policy</h2>
            <p>
              We may update this Privacy Policy from time to time. We'll post any changes on this
              page with an updated revision date.
            </p>
          </div>
          <div>
            <h2 className="text-h4 text-ink-heading mb-3">8. Contact Us</h2>
            <p>
              Questions about this policy? Email us at support@quntamgen.com.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
