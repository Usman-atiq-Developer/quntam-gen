import Link from "next/link";
import { notFound } from "next/navigation";
import { ChevronLeft } from "lucide-react";
import { connectToDatabase } from "@/lib/db/connect";
import CaseStudyModel from "@/models/CaseStudy";
import CaseStudyEditor, { type CaseStudyEditorData } from "@/components/admin/CaseStudyEditor";

export const metadata = { title: "Edit Case Study" };

async function getItem(id: string): Promise<CaseStudyEditorData | null> {
  await connectToDatabase();
  const doc = await CaseStudyModel.findById(id).lean().catch(() => null);
  if (!doc) return null;
  return JSON.parse(
    JSON.stringify({
      _id: doc._id.toString(),
      slug: doc.slug,
      client: doc.client,
      category: doc.category,
      industry: doc.industry ?? "",
      timeline: doc.timeline ?? "",
      serviceSlug: doc.serviceSlug ?? "",
      tools: doc.tools ?? [],
      title: doc.title,
      image: doc.image,
      resultStat: doc.resultStat ?? "",
      resultLabel: doc.resultLabel ?? "",
      problem: doc.problem ?? "",
      solution: doc.solution ?? "",
      results: doc.results ?? [],
      quote: doc.quote ?? { text: "", author: "", role: "" },
      published: doc.published ?? true,
    })
  );
}

export default async function EditCaseStudyPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const item = await getItem(id);
  if (!item) notFound();

  return (
    <div className="space-y-6">
      <div>
        <Link href="/admin/case-studies" className="inline-flex items-center gap-1 text-sm text-slate-400 hover:text-white transition-colors mb-3">
          <ChevronLeft className="w-4 h-4" /> Back to Case Studies
        </Link>
        <h1 className="text-2xl font-semibold text-white">{item.client}</h1>
      </div>
      <CaseStudyEditor initialData={item} />
    </div>
  );
}
