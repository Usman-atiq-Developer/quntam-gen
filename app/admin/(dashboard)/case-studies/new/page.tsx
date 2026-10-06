import Link from "next/link";
import { ChevronLeft } from "lucide-react";
import CaseStudyEditor from "@/components/admin/CaseStudyEditor";

export const metadata = { title: "New Case Study" };

export default function NewCaseStudyPage() {
  return (
    <div className="space-y-6">
      <div>
        <Link href="/admin/case-studies" className="inline-flex items-center gap-1 text-sm text-slate-400 hover:text-white transition-colors mb-3">
          <ChevronLeft className="w-4 h-4" /> Back to Case Studies
        </Link>
        <h1 className="text-2xl font-semibold text-white">New Case Study</h1>
      </div>
      <CaseStudyEditor />
    </div>
  );
}
