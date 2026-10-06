import type { Metadata } from "next";
import JsonLd from "@/components/JsonLd";
import { pageMetadata, breadcrumbJsonLd, webPageJsonLd } from "@/lib/seo";
import { getAllPosts } from "@/lib/posts";
import BlogListing from "@/components/BlogListing";
import QuantumWatermark from "@/components/QuantumWatermark";
import NewsletterForm from "@/components/NewsletterForm";

// Re-check the database periodically so posts published/edited from the
// admin dashboard appear without needing a full redeploy.
export const revalidate = 60;

export const metadata: Metadata = pageMetadata({
  title: "Blog: SEO, Web Development & AI Automation Tips",
  description:
    "Practical guides on web development, SEO, digital marketing, Meta ads, social media, app development, and AI automation from the Quntam Gen team.",
  path: "/blog",
});

export default async function BlogPage() {
  const posts = await getAllPosts();
  const categoryCount = new Set(posts.map((p) => p.category)).size;

  return (
    <>
      <JsonLd
        data={[
          webPageJsonLd({
            type: "CollectionPage",
            name: "Quntam Gen Blog",
            description:
              "Practical guides on web development, SEO, digital marketing, Meta ads, social media, app development, and AI automation.",
            path: "/blog",
          }),
          breadcrumbJsonLd([{ name: "Home", path: "" }, { name: "Blog" }]),
        ]}
      />
      <section className="relative overflow-hidden bg-hero-light pt-40 pb-24">
        <QuantumWatermark className="w-[700px] h-[350px] -top-16 left-1/2 -translate-x-1/2" opacity={0.12} />
        <div className="relative mx-auto max-w-3xl px-6 text-center">
          <span className="section-label justify-center">The Blog</span>
          <h1 className="text-h1 text-ink-heading mt-4">Ideas worth stealing</h1>
          <p className="mt-5 text-lg text-ink-body">
            Practical, no-fluff writing on growing a business online — from the team building it
            for clients every day. No filler, no recycled listicles — just what actually works.
          </p>

          <div className="mt-10 flex items-center justify-center gap-10 sm:gap-16">
            <div className="text-center">
              <p className="font-display text-2xl sm:text-3xl font-bold text-gradient">{posts.length}+</p>
              <p className="mt-1 text-xs sm:text-sm text-ink-muted">Articles published</p>
            </div>
            <div className="text-center">
              <p className="font-display text-2xl sm:text-3xl font-bold text-gradient">{categoryCount}</p>
              <p className="mt-1 text-xs sm:text-sm text-ink-muted">Topics covered</p>
            </div>
            <div className="text-center">
              <p className="font-display text-2xl sm:text-3xl font-bold text-gradient">Weekly</p>
              <p className="mt-1 text-xs sm:text-sm text-ink-muted">New articles</p>
            </div>
          </div>

          <div className="mt-10 max-w-sm mx-auto">
            <NewsletterForm />
            <p className="mt-3 text-xs text-ink-muted">Get one email a month. No spam, unsubscribe anytime.</p>
          </div>
        </div>
      </section>

      <section className="py-20">
        <div className="mx-auto max-w-7xl px-6 lg:px-10">
          <BlogListing posts={posts} />
        </div>
      </section>
    </>
  );
}
