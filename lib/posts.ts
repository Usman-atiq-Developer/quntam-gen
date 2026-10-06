import readingTime from "reading-time";
import { connectToDatabase } from "@/lib/db/connect";
import PostModel, { type PostDoc } from "@/models/Post";

export type PostFAQ = { q: string; a: string };

export type PostFrontmatter = {
  title: string;
  excerpt: string;
  category: string;
  tags: string[];
  coverImage: string;
  author: string;
  authorRole: string;
  authorPhoto?: string;
  date: string; // ISO string — mirrors PostDoc.publishedAt
  /** ISO string — mirrors PostDoc.updatedAt (used for dateModified / sitemap lastmod). */
  updatedAt?: string;
  seoTitle?: string;
  metaDescription?: string;
  takeaways?: string[];
  faqs?: PostFAQ[];
  /** `true` = indexable (default/legacy behavior), `false` = noindex, follow. */
  robotsIndex: boolean;
};

export type PostSummary = PostFrontmatter & {
  slug: string;
  readingTime: string;
};

export type Post = PostSummary & {
  content: string;
};

/** Converts a lean Mongo Post document into the plain, serializable shape the UI expects. */
function toPost(doc: PostDoc & { _id: unknown }): Post {
  const stats = readingTime(doc.content);
  return {
    slug: doc.slug,
    content: doc.content,
    readingTime: stats.text,
    title: doc.title,
    excerpt: doc.excerpt,
    category: doc.category,
    tags: doc.tags ?? [],
    coverImage: doc.coverImage,
    author: doc.author,
    authorRole: doc.authorRole,
    authorPhoto: doc.authorPhoto,
    date: new Date(doc.publishedAt).toISOString(),
    updatedAt: doc.updatedAt ? new Date(doc.updatedAt).toISOString() : undefined,
    seoTitle: doc.seoTitle,
    metaDescription: doc.metaDescription,
    takeaways: doc.takeaways ?? [],
    faqs: doc.faqs ?? [],
    // Lean reads don't apply Mongoose schema defaults, so documents saved
    // before `robotsIndex` existed come back with the field simply absent.
    // Treat anything other than an explicit `false` as indexable, so every
    // pre-existing post keeps its current (indexed) behavior unchanged.
    robotsIndex: doc.robotsIndex !== false,
  };
}

/**
 * Wraps a DB-backed call so that if the database is unreachable (most
 * commonly: MONGODB_URI isn't set yet, e.g. during a local `next build`
 * before the project is configured) the site degrades to an empty blog
 * instead of crashing the entire build/request. Once MONGODB_URI is set
 * correctly, these calls behave normally.
 */
async function safely<T>(fallback: T, fn: () => Promise<T>): Promise<T> {
  try {
    return await fn();
  } catch (err) {
    console.warn("[lib/posts] Falling back to empty result — database unavailable:", err instanceof Error ? err.message : err);
    return fallback;
  }
}

/**
 * Slugs of every published post, regardless of `robotsIndex`. Used for
 * `generateStaticParams` — a noindex post must still be built, rendered,
 * and be crawlable (with a `noindex` tag) for search engines to discover
 * and respect that directive. Unpublished (draft) posts are never included.
 */
export async function getAllSlugs(): Promise<string[]> {
  return safely([], async () => {
    await connectToDatabase();
    const posts = await PostModel.find({ status: "published" }).select("slug").lean();
    return posts.map((p) => p.slug);
  });
}

/**
 * Slugs of posts that should appear in the XML sitemap: published AND not
 * explicitly set to noindex. Missing/undefined `robotsIndex` (legacy posts)
 * counts as indexable, matching the default in `toPost()` above.
 */
export async function getIndexableSlugs(): Promise<string[]> {
  return safely([], async () => {
    await connectToDatabase();
    const posts = await PostModel.find({
      status: "published",
      robotsIndex: { $ne: false },
    })
      .select("slug")
      .lean();
    return posts.map((p) => p.slug);
  });
}

/** Same filter as getIndexableSlugs(), but with real last-modified dates for the sitemap. */
export async function getIndexablePostsForSitemap(): Promise<{ slug: string; lastModified: Date }[]> {
  return safely([], async () => {
    await connectToDatabase();
    const posts = await PostModel.find({ status: "published", robotsIndex: { $ne: false } })
      .select("slug publishedAt updatedAt")
      .lean();
    return posts.map((p) => ({
      slug: p.slug,
      lastModified: new Date(p.updatedAt ?? p.publishedAt),
    }));
  });
}

export async function getPostBySlug(slug: string): Promise<Post | null> {
  return safely(null, async () => {
    await connectToDatabase();
    const doc = await PostModel.findOne({ slug, status: "published" }).lean();
    if (!doc) return null;
    return toPost(doc as PostDoc & { _id: unknown });
  });
}

export async function getAllPosts(): Promise<PostSummary[]> {
  return safely([], async () => {
    await connectToDatabase();
    const docs = await PostModel.find({ status: "published" })
      .sort({ publishedAt: -1 })
      .lean();
    return docs.map((doc) => {
      const { content, ...summary } = toPost(doc as PostDoc & { _id: unknown });
      return summary;
    });
  });
}

export async function getRelatedPosts(
  category: string,
  excludeSlug: string,
  limit = 3
): Promise<PostSummary[]> {
  return safely([], async () => {
    await connectToDatabase();
    const docs = await PostModel.find({
      status: "published",
      category,
      slug: { $ne: excludeSlug },
    })
      .sort({ publishedAt: -1 })
      .limit(limit)
      .lean();
    return docs.map((doc) => {
      const { content, ...summary } = toPost(doc as PostDoc & { _id: unknown });
      return summary;
    });
  });
}

export function slugifyHeading(text: string) {
  return text
    .toLowerCase()
    .replace(/[^a-z0-9\s-]/g, "")
    .replace(/\s+/g, "-");
}

export function extractHeadings(content: string) {
  const headingRegex = /^(##|###)\s+(.*)$/gm;
  const headings: { depth: number; text: string; slug: string }[] = [];
  let match;
  while ((match = headingRegex.exec(content)) !== null) {
    const depth = match[1].length;
    const text = match[2].trim();
    headings.push({ depth, text, slug: slugifyHeading(text) });
  }
  return headings;
}
