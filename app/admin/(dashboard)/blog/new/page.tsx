import Link from "next/link";
import { ChevronLeft } from "lucide-react";
import PostEditor from "@/components/admin/PostEditor";

export const metadata = { title: "New Post" };

export default function NewPostPage() {
  return (
    <div className="space-y-6">
      <div>
        <Link href="/admin/blog" className="inline-flex items-center gap-1 text-sm text-slate-400 hover:text-white transition-colors mb-3">
          <ChevronLeft className="w-4 h-4" /> Back to Blog
        </Link>
        <h1 className="text-2xl font-semibold text-white">New Post</h1>
      </div>
      <PostEditor />
    </div>
  );
}
