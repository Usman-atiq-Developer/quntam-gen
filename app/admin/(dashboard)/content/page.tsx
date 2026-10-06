import ContentEditor from "@/components/admin/ContentEditor";

export const metadata = { title: "Site Content" };

export default function AdminContentPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-semibold text-white">Site Content</h1>
        <p className="text-sm text-slate-400 mt-1">
          Edit any headline, paragraph, button label, or contact detail across the website.
        </p>
      </div>
      <ContentEditor />
    </div>
  );
}
