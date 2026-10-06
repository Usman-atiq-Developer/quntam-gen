import Link from "next/link";
import { notFound } from "next/navigation";
import { ChevronLeft } from "lucide-react";
import { connectToDatabase } from "@/lib/db/connect";
import ServiceModel from "@/models/Service";
import ServiceEditor, { type ServiceEditorData } from "@/components/admin/ServiceEditor";

export const metadata = { title: "Edit Service" };

async function getService(id: string): Promise<ServiceEditorData | null> {
  await connectToDatabase();
  const doc = await ServiceModel.findById(id).lean().catch(() => null);
  if (!doc) return null;
  // Strip Mongo internals and serialise for the client component
  return JSON.parse(
    JSON.stringify({
      _id: doc._id.toString(),
      slug: doc.slug,
      name: doc.name,
      shortName: doc.shortName,
      icon: doc.icon,
      oneLiner: doc.oneLiner,
      positioning: doc.positioning,
      whatIs: doc.whatIs,
      theme: doc.theme,
      accentIcons: doc.accentIcons ?? [],
      stats: doc.stats ?? [],
      whoFor: doc.whoFor ?? [],
      quote: doc.quote ?? { text: "", author: "", role: "" },
      process: doc.process ?? [],
      included: doc.included ?? [],
      benefits: doc.benefits ?? [],
      tools: doc.tools ?? [],
      packages: doc.packages ?? [],
      customQuoteOnly: doc.customQuoteOnly ?? false,
      faqs: doc.faqs ?? [],
      category: doc.category,
      published: doc.published ?? true,
    })
  );
}

export default async function EditServicePage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const service = await getService(id);
  if (!service) notFound();

  return (
    <div className="space-y-6">
      <div>
        <Link href="/admin/services" className="inline-flex items-center gap-1 text-sm text-slate-400 hover:text-white transition-colors mb-3">
          <ChevronLeft className="w-4 h-4" /> Back to Services
        </Link>
        <h1 className="text-2xl font-semibold text-white">{service.name}</h1>
      </div>
      <ServiceEditor initialData={service} />
    </div>
  );
}
