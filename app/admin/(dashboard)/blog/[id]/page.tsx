import Link from "next/link";
import { notFound } from "next/navigation";
import { ChevronLeft } from "lucide-react";
import { connectToDatabase } from "@/lib/db/connect";
import Post from "@/models/Post";
import PostEditor, { type PostEditorInitialData } from "@/components/admin/PostEditor";

export const metadata = { title: "Edit Post" };

async function getPost(id: string): Promise<PostEditorInitialData | null> {
  await connectToDatabase();
  const doc = await Post.findById(id).lean().catch(() => null);
  if (!doc) return null;

  return {
    _id: doc._id.toString(),
    title: doc.title,
    slug: doc.slug,
    excerpt: doc.excerpt,
    content: doc.content,
    category: doc.category,
    tags: doc.tags ?? [],
    coverImage: doc.coverImage,
    author: doc.author,
    authorRole: doc.authorRole,
    authorPhoto: doc.authorPhoto ?? "",
    status: doc.status,
    seoTitle: doc.seoTitle ?? "",
    metaDescription: doc.metaDescription ?? "",
    primaryKeyword: doc.primaryKeyword ?? "",
    secondaryKeywords: doc.secondaryKeywords ?? [],
    searchIntent: doc.searchIntent ?? "",
    takeaways: doc.takeaways ?? [],
    faqs: doc.faqs ?? [],
    // Legacy documents saved before this field existed come back without
    // it — treat anything other than an explicit `false` as indexable.
    robotsIndex: doc.robotsIndex !== false,
  };
}

export default async function EditPostPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const post = await getPost(id);
  if (!post) notFound();

  return (
    <div className="space-y-6">
      <div>
        <Link href="/admin/blog" className="inline-flex items-center gap-1 text-sm text-slate-400 hover:text-white transition-colors mb-3">
          <ChevronLeft className="w-4 h-4" /> Back to Blog
        </Link>
        <h1 className="text-2xl font-semibold text-white">{post.title || "Edit Post"}</h1>
      </div>
      <PostEditor initialData={post} />
    </div>
  );
}
