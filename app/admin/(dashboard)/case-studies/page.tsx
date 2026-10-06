import CaseStudiesTable from "@/components/admin/CaseStudiesTable";

export const metadata = { title: "Case Studies" };

export default function AdminCaseStudiesPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-semibold text-white">Case Studies</h1>
        <p className="text-sm text-slate-400 mt-1">Manage the work shown on your portfolio page.</p>
      </div>
      <CaseStudiesTable />
    </div>
  );
}
