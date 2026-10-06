import PostsTable from "@/components/admin/PostsTable";

export const metadata = { title: "Blog" };

export default function AdminBlogPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-semibold text-white">Blog</h1>
        <p className="text-sm text-slate-400 mt-1">Create, edit, and publish articles.</p>
      </div>
      <PostsTable />
    </div>
  );
}
