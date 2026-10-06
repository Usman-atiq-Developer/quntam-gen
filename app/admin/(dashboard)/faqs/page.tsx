import FAQsManager from "@/components/admin/FAQsManager";

export const metadata = { title: "FAQs" };

export default function AdminFAQsPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-semibold text-white">FAQs</h1>
        <p className="text-sm text-slate-400 mt-1">
          Manage the questions shown on your home page and the FAQ page. Use the arrows to reorder.
        </p>
      </div>
      <FAQsManager />
    </div>
  );
}
