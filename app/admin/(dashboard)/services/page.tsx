import ServicesTable from "@/components/admin/ServicesTable";

export const metadata = { title: "Services" };

export default function AdminServicesPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-semibold text-white">Services</h1>
        <p className="text-sm text-slate-400 mt-1">
          Add, edit, reorder, publish or hide the services shown across your site.
        </p>
      </div>
      <ServicesTable />
    </div>
  );
}
