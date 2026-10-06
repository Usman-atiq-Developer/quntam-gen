import type { Metadata } from "next";
import JsonLd from "@/components/JsonLd";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ChevronRight, Clock, Calendar } from "lucide-react";
import { getAllSlugs, getPostBySlug, getRelatedPosts, extractHeadings } from "@/lib/posts";
import MDXContent from "@/components/MDXContent";
import TableOfContents from "@/components/TableOfContents";
import ShareButtons from "@/components/ShareButtons";
import BlogCard from "@/components/BlogCard";
import NewsletterForm from "@/components/NewsletterForm";
import AnimatedSection from "@/components/AnimatedSection";
import KeyTakeaways from "@/components/KeyTakeaways";
import FAQAccordion from "@/components/FAQAccordion";
import ReadingProgressBar from "@/components/ReadingProgressBar";
import QuantumWatermark from "@/components/QuantumWatermark";
import CTAButton from "@/components/CTAButton";
import ArticleCoverImage from "@/components/ArticleCoverImage";
import MobileTOC from "@/components/MobileTOC";
import { getCategoryStyle } from "@/lib/categoryStyle";
import { SITE_URL } from "@/lib/siteUrl";
import { INDEXING_ENABLED } from "@/lib/indexing";
import { absoluteUrl, breadcrumbJsonLd, ORG_ID } from "@/lib/seo";

const siteUrl = SITE_URL;

// Re-check the database periodically so edits/new posts from the admin
// dashboard appear without needing a full redeploy.
export const revalidate = 60;

export async function generateStaticParams() {
  const slugs = await getAllSlugs();
  return slugs.map((slug) => ({ slug }));
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  const post = await getPostBySlug(slug);
  if (!post) return {};

  // Indexing is completely independent of publish status: `getPostBySlug`
  // already only returns `status: "published"` posts (drafts 404 above via
  // `notFound()`, so they never reach this point and are never indexable).
  // Within published posts, two things both have to allow indexing: the
  // site-wide NEXT_PUBLIC_INDEXING_ENABLED switch (lib/indexing.ts) and
  // this specific post's own `robotsIndex` field. This page sets its own
  // `robots` value explicitly (rather than inheriting app/layout.tsx's
  // default), so it must fold the global switch in itself.
  const canIndex = INDEXING_ENABLED && post.robotsIndex !== false;

  return {
    title: post.seoTitle || post.title,
    description: post.metaDescription || post.excerpt,
    alternates: { canonical: `/blog/${post.slug}` },
    // Single source of truth for the robots meta tag — Next.js renders
    // exactly one `<meta name="robots">` (and one `<meta name="googlebot">`)
    // from this object, so there's no risk of a duplicate/conflicting tag
    // elsewhere in the tree (the root layout and admin layout don't set
    // page-level `robots` themselves).
    robots: {
      index: canIndex,
      follow: true,
      googleBot: {
        index: canIndex,
        follow: true,
      },
    },
    openGraph: {
      type: "article",
      siteName: "Quntam Gen",
      locale: "en_US",
      title: post.seoTitle || post.title,
      description: post.metaDescription || post.excerpt,
      images: [{ url: absoluteUrl(post.coverImage), width: 1200, height: 630, alt: post.title }],
      publishedTime: post.date,
      modifiedTime: post.updatedAt ?? post.date,
      authors: [post.author],
      section: post.category,
      tags: post.tags,
      url: `/blog/${post.slug}`,
    },
    twitter: {
      card: "summary_large_image",
      title: post.seoTitle || post.title,
      description: post.metaDescription || post.excerpt,
      images: [absoluteUrl(post.coverImage)],
    },
  };
}

export default async function BlogPostPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const post = await getPostBySlug(slug);
  if (!post) notFound();

  const headings = extractHeadings(post.content);
  const relatedPosts = await getRelatedPosts(post.category, post.slug, 3);
  const postUrl = `${siteUrl}/blog/${post.slug}`;
  const date = new Date(post.date).toLocaleDateString("en-US", { month: "long", day: "numeric", year: "numeric" });
  const categoryStyle = getCategoryStyle(post.category);

  const wordCount = post.content.split(/\s+/).filter(Boolean).length;

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "BlogPosting",
    "@id": `${postUrl}#article`,
    headline: (post.seoTitle || post.title).slice(0, 110),
    description: post.metaDescription || post.excerpt,
    datePublished: post.date,
    dateModified: post.updatedAt ?? post.date,
    inLanguage: "en",
    articleSection: post.category,
    keywords: post.tags.join(", "),
    wordCount,
    author: { "@type": "Person", name: post.author, jobTitle: post.authorRole, url: `${siteUrl}/about` },
    publisher: {
      "@type": "Organization",
      "@id": ORG_ID,
      name: "Quntam Gen",
      logo: { "@type": "ImageObject", url: `${siteUrl}/images/logo.webp` },
    },
    image: [absoluteUrl(post.coverImage)],
    mainEntityOfPage: { "@type": "WebPage", "@id": postUrl },
    isPartOf: { "@type": "Blog", name: "Quntam Gen Blog", url: `${siteUrl}/blog` },
  };

  const breadcrumbLd = breadcrumbJsonLd([
    { name: "Home", path: "" },
    { name: "Blog", path: "/blog" },
    { name: post.title },
  ]);

  const faqJsonLd =
    post.faqs && post.faqs.length > 0
      ? {
          "@context": "https://schema.org",
          "@type": "FAQPage",
          mainEntity: post.faqs.map((faq) => ({
            "@type": "Question",
            name: faq.q,
            acceptedAnswer: { "@type": "Answer", text: faq.a },
          })),
        }
      : null;

  return (
    <article>
      <ReadingProgressBar />
      <JsonLd data={[jsonLd, breadcrumbLd]} />
      {faqJsonLd && (
        <JsonLd data={faqJsonLd} />
      )}

      {/* Hero */}
      <section className="relative overflow-hidden bg-hero-light pt-32 pb-8">
        <QuantumWatermark className="w-[600px] h-[300px] -top-16 right-[-120px]" opacity={0.12} />
        <div className="relative mx-auto max-w-3xl px-6">
          <nav aria-label="Breadcrumb" className="flex items-center gap-1.5 text-sm text-ink-muted mb-6">
            <Link href="/" className="hover:text-ink-heading transition-colors">Home</Link>
            <ChevronRight className="w-3.5 h-3.5" />
            <Link href="/blog" className="hover:text-ink-heading transition-colors">Blog</Link>
            <ChevronRight className="w-3.5 h-3.5" />
            <span className="text-ink-heading line-clamp-1">{post.title}</span>
          </nav>
          <span className={`inline-flex items-center gap-1.5 rounded-full ${categoryStyle.bg} ${categoryStyle.text} px-3 py-1 text-xs font-bold shadow-sm`}>
            <span className={`h-1.5 w-1.5 rounded-full ${categoryStyle.dot}`} />
            {post.category}
          </span>
          <h1 className="text-h1 text-ink-heading mt-4">{post.title}</h1>
          <p className="mt-4 text-lg text-ink-body max-w-2xl">{post.excerpt}</p>

          <div className="mt-7 flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-brand-gradient flex items-center justify-center text-white text-sm font-semibold">
              {post.author.split(" ").map((n) => n[0]).join("").slice(0, 2)}
            </div>
            <div>
              <p className="text-sm font-semibold text-ink-heading">{post.author}</p>
              <div className="flex items-center gap-3 text-xs text-ink-muted">
                <span className="flex items-center gap-1"><Calendar className="w-3.5 h-3.5" /> {date}</span>
                <span className="flex items-center gap-1"><Clock className="w-3.5 h-3.5" /> {post.readingTime}</span>
              </div>
            </div>
          </div>

          <div className="mt-5 lg:hidden">
            <ShareButtons url={postUrl} title={post.title} />
          </div>
        </div>
      </section>

      {/* Cover image — contained card, overlapping the hero/content boundary */}
      <ArticleCoverImage src={post.coverImage} alt={post.title} />

      <div className="mx-auto max-w-6xl px-6 mt-14 grid grid-cols-1 lg:grid-cols-[1fr_240px] gap-16 pb-28">
        <div className="max-w-3xl">
          <MobileTOC headings={headings} />

          {post.takeaways && <KeyTakeaways items={post.takeaways} />}

          <MDXContent source={post.content} />

          {post.faqs && post.faqs.length > 0 && (
            <div className="mt-16 pt-12 border-t border-border">
              <span className="section-label mb-3">FAQs</span>
              <h2 className="text-h3 text-ink-heading mb-6 mt-2">Frequently Asked Questions</h2>
              <FAQAccordion faqs={post.faqs} />
            </div>
          )}

          {/* Author + newsletter, combined */}
          <AnimatedSection className="mt-16 card-surface rounded-xl2 overflow-hidden">
            <div className="flex items-center gap-5 p-7">
              <div className="w-16 h-16 shrink-0 rounded-full bg-brand-gradient flex items-center justify-center text-white text-lg font-semibold">
                {post.author.split(" ").map((n) => n[0]).join("").slice(0, 2)}
              </div>
              <div className="flex-1">
                <p className="text-ink-heading font-semibold">{post.author}</p>
                <p className="text-sm text-ink-muted">{post.authorRole} at Quntam Gen</p>
              </div>
              <CTAButton href="/contact" icon={false} className="hidden sm:inline-flex">
                Work With Us
              </CTAButton>
            </div>
            <div className="border-t border-border p-7 bg-surface2 text-center">
              <h3 className="text-ink-heading font-semibold mb-1.5">Enjoyed this? Get more like it.</h3>
              <p className="text-sm text-ink-muted mb-5">One email a month, growth tips only.</p>
              <div className="max-w-sm mx-auto">
                <NewsletterForm />
              </div>
            </div>
          </AnimatedSection>
        </div>

        <aside className="hidden lg:block">
          <div className="sticky top-28 space-y-8">
            <div>
              <h6 className="text-xs font-semibold uppercase tracking-widest text-ink-muted mb-4">Share</h6>
              <ShareButtons url={postUrl} title={post.title} />
            </div>
            <TableOfContents headings={headings} />
          </div>
        </aside>
      </div>

      {relatedPosts.length > 0 && (
        <section className="bg-surface2 border-t border-border py-20">
          <div className="mx-auto max-w-7xl px-6 lg:px-10">
            <h2 className="text-h3 text-ink-heading mb-10">Related posts</h2>
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {relatedPosts.map((p, i) => (
                <BlogCard key={p.slug} post={p} index={i} />
              ))}
            </div>
          </div>
        </section>
      )}
    </article>
  );
}
