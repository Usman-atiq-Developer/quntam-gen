import Link from "next/link";
import { ChevronLeft } from "lucide-react";
import ServiceEditor from "@/components/admin/ServiceEditor";

export const metadata = { title: "New Service" };

export default function NewServicePage() {
  return (
    <div className="space-y-6">
      <div>
        <Link href="/admin/services" className="inline-flex items-center gap-1 text-sm text-slate-400 hover:text-white transition-colors mb-3">
          <ChevronLeft className="w-4 h-4" /> Back to Services
        </Link>
        <h1 className="text-2xl font-semibold text-white">New Service</h1>
      </div>
      <ServiceEditor />
    </div>
  );
}
