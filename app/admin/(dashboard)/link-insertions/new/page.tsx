import Link from "next/link";
import { ChevronLeft } from "lucide-react";
import LinkInsertionEditor from "@/components/admin/LinkInsertionEditor";

export const metadata = { title: "New Link Insertion" };

export default function NewLinkInsertionPage() {
  return (
    <div className="space-y-6">
      <div>
        <Link href="/admin/link-insertions" className="inline-flex items-center gap-1 text-sm text-slate-400 hover:text-white transition-colors mb-3">
          <ChevronLeft className="w-4 h-4" /> Back to Link Insertions
        </Link>
        <h1 className="text-2xl font-semibold text-white">New Link Insertion</h1>
      </div>
      <LinkInsertionEditor />
    </div>
  );
}
