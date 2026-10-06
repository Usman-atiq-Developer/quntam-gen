import { NextResponse } from "next/server";
import { z } from "zod";
import { connectToDatabase } from "@/lib/db/connect";
import Post from "@/models/Post";
import { toApiErrorResponse } from "@/lib/apiError";
import { slugify } from "@/lib/slugify";

const postUpdateSchema = z.object({
  title: z.string().min(3).max(200).optional(),
  slug: z
    .string()
    .min(3)
    .regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/, "Slug must be lowercase, alphanumeric, and hyphen-separated")
    .optional(),
  excerpt: z.string().min(10).max(400).optional(),
  content: z.string().min(20).optional(),
  category: z.string().min(1).optional(),
  tags: z.array(z.string()).optional(),
  coverImage: z.string().min(1).optional(),
  author: z.string().min(1).optional(),
  authorRole: z.string().min(1).optional(),
  authorPhoto: z.string().optional(),
  status: z.enum(["draft", "published"]).optional(),
  publishedAt: z.string().optional(),
  seoTitle: z.string().max(70).optional(),
  metaDescription: z.string().max(160).optional(),
  primaryKeyword: z.string().max(100).optional(),
  secondaryKeywords: z.array(z.string()).optional(),
  searchIntent: z.enum(["informational", "commercial", "transactional", "navigational"]).optional(),
  takeaways: z.array(z.string()).optional(),
  faqs: z.array(z.object({ q: z.string().min(1), a: z.string().min(1) })).optional(),
  // Optional so the quick indexing toggle can PATCH just this one field
  // without resubmitting the whole post.
  robotsIndex: z.boolean().optional(),
});

export async function GET(_request: Request, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  try {
    await connectToDatabase();
    const post = await Post.findById(id).lean();
    if (!post) {
      return NextResponse.json({ error: "Post not found" }, { status: 404 });
    }
    return NextResponse.json({ post });
  } catch (err) {
    return toApiErrorResponse(err, "Failed to load post");
  }
}

export async function PATCH(request: Request, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  try {
    let body: unknown;
    try {
      body = await request.json();
    } catch {
      return NextResponse.json({ error: "Invalid request body" }, { status: 400 });
    }

    const parsed = postUpdateSchema.safeParse(body);
    if (!parsed.success) {
      return NextResponse.json(
        { error: parsed.error.issues[0]?.message ?? "Invalid update" },
        { status: 400 }
      );
    }

    await connectToDatabase();

    const update: Record<string, unknown> = { ...parsed.data };
    if (parsed.data.slug) {
      update.slug = slugify(parsed.data.slug);
    }
    if (parsed.data.publishedAt) {
      update.publishedAt = new Date(parsed.data.publishedAt);
    }

    const post = await Post.findByIdAndUpdate(id, update, {
      new: true,
      runValidators: true,
    }).lean();

    if (!post) {
      return NextResponse.json({ error: "Post not found" }, { status: 404 });
    }
    return NextResponse.json({ post });
  } catch (err) {
    return toApiErrorResponse(err, "Failed to update post");
  }
}

export async function DELETE(_request: Request, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  try {
    await connectToDatabase();
    const deleted = await Post.findByIdAndDelete(id).lean();
    if (!deleted) {
      return NextResponse.json({ error: "Post not found" }, { status: 404 });
    }
    return NextResponse.json({ success: true });
  } catch (err) {
    return toApiErrorResponse(err, "Failed to delete post");
  }
}
