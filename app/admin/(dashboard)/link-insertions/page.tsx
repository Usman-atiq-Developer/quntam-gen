import LinkInsertionsTable from "@/components/admin/LinkInsertionsTable";

export const metadata = { title: "Link Insertions" };

export default function AdminLinkInsertionsPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-semibold text-white">Link Insertions</h1>
        <p className="text-sm text-slate-400 mt-1">
          Review public requests and manage every link insertion end-to-end.
        </p>
      </div>
      <LinkInsertionsTable />
    </div>
  );
}
