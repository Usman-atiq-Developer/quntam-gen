import { NextResponse } from "next/server";
import { z } from "zod";
import { connectToDatabase } from "@/lib/db/connect";
import Post from "@/models/Post";
import { toApiErrorResponse } from "@/lib/apiError";
import { slugify } from "@/lib/slugify";
import { escapeRegex } from "@/lib/searchRegex";

const postSchema = z.object({
  title: z.string().min(3, "Title must be at least 3 characters").max(200),
  slug: z
    .string()
    .min(3, "Slug must be at least 3 characters")
    .regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/, "Slug must be lowercase, alphanumeric, and hyphen-separated"),
  excerpt: z.string().min(10, "Excerpt must be at least 10 characters").max(400),
  content: z.string().min(20, "Content must be at least 20 characters"),
  category: z.string().min(1, "Category is required"),
  tags: z.array(z.string()).default([]),
  coverImage: z.string().min(1, "Cover image is required"),
  author: z.string().min(1, "Author is required"),
  authorRole: z.string().min(1, "Author role is required"),
  authorPhoto: z.string().optional(),
  status: z.enum(["draft", "published"]).default("draft"),
  publishedAt: z.string().optional(),
  seoTitle: z.string().max(70).optional(),
  metaDescription: z.string().max(160).optional(),
  primaryKeyword: z.string().max(100).optional(),
  secondaryKeywords: z.array(z.string()).default([]),
  searchIntent: z.enum(["informational", "commercial", "transactional", "navigational"]).optional(),
  takeaways: z.array(z.string()).default([]),
  faqs: z.array(z.object({ q: z.string().min(1), a: z.string().min(1) })).default([]),
  // Search-engine indexing, independent of `status`. Defaults to `true`
  // (indexable) so behavior matches every post created before this field
  // existed.
  robotsIndex: z.boolean().default(true),
});

export async function GET(request: Request) {
  try {
    await connectToDatabase();

    const { searchParams } = new URL(request.url);
    const status = searchParams.get("status");
    const search = searchParams.get("search")?.trim();
    const category = searchParams.get("category")?.trim();

    const query: Record<string, unknown> = {};
    if (status && ["draft", "published"].includes(status)) {
      query.status = status;
    }
    if (category) {
      query.category = category;
    }
    if (search) {
      // Escaped so a crafted regex pattern in the search box can't cause a
      // catastrophic-backtracking (ReDoS) query — see lib/searchRegex.ts.
      const safeSearch = escapeRegex(search);
      query.$or = [
        { title: { $regex: safeSearch, $options: "i" } },
        { excerpt: { $regex: safeSearch, $options: "i" } },
        { slug: { $regex: safeSearch, $options: "i" } },
      ];
    }

    const posts = await Post.find(query)
      .select("title slug excerpt category tags status robotsIndex publishedAt coverImage createdAt updatedAt")
      .sort({ updatedAt: -1 })
      .lean();

    return NextResponse.json({ posts });
  } catch (err) {
    return toApiErrorResponse(err, "Failed to load posts");
  }
}

export async function POST(request: Request) {
  try {
    let body: unknown;
    try {
      body = await request.json();
    } catch {
      return NextResponse.json({ error: "Invalid request body" }, { status: 400 });
    }

    const parsed = postSchema.safeParse(body);
    if (!parsed.success) {
      return NextResponse.json(
        { error: parsed.error.issues[0]?.message ?? "Invalid submission" },
        { status: 400 }
      );
    }

    await connectToDatabase();

    const data = parsed.data;
    const slug = slugify(data.slug || data.title);

    const post = await Post.create({
      ...data,
      slug,
      publishedAt: data.publishedAt ? new Date(data.publishedAt) : new Date(),
    });

    return NextResponse.json({ post }, { status: 201 });
  } catch (err) {
    return toApiErrorResponse(err, "Failed to create post");
  }
}
