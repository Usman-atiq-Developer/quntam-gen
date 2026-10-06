import Link from "next/link";
import { notFound } from "next/navigation";
import { ChevronLeft } from "lucide-react";
import { connectToDatabase } from "@/lib/db/connect";
import LinkInsertion from "@/models/LinkInsertion";
import LinkInsertionEditor, { type LinkInsertionEditorInitialData } from "@/components/admin/LinkInsertionEditor";

export const metadata = { title: "Edit Link Insertion" };

async function getItem(id: string): Promise<LinkInsertionEditorInitialData | null> {
  await connectToDatabase();
  const doc = await LinkInsertion.findById(id).populate("relatedPost", "title slug").lean().catch(() => null);
  if (!doc) return null;

  return {
    _id: doc._id.toString(),
    clientName: doc.clientName,
    clientEmail: doc.clientEmail,
    clientCompany: doc.clientCompany ?? "",
    targetUrl: doc.targetUrl,
    anchorText: doc.anchorText,
    relatedArticle: doc.relatedArticle ?? "",
    relatedPost: doc.relatedPost
      ? {
          _id: (doc.relatedPost as any)._id.toString(),
          title: (doc.relatedPost as any).title,
          slug: (doc.relatedPost as any).slug,
        }
      : "",
    message: doc.message ?? "",
    price: doc.price ?? null,
    status: doc.status,
    notes: doc.notes ?? "",
    source: doc.source,
  };
}

export default async function EditLinkInsertionPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const item = await getItem(id);
  if (!item) notFound();

  return (
    <div className="space-y-6">
      <div>
        <Link href="/admin/link-insertions" className="inline-flex items-center gap-1 text-sm text-slate-400 hover:text-white transition-colors mb-3">
          <ChevronLeft className="w-4 h-4" /> Back to Link Insertions
        </Link>
        <h1 className="text-2xl font-semibold text-white">{item.clientName}</h1>
      </div>
      <LinkInsertionEditor initialData={item} />
    </div>
  );
}
