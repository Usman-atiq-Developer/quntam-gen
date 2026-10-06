import MessagesTable from "@/components/admin/MessagesTable";

export const metadata = { title: "Messages" };

export default function AdminMessagesPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-semibold text-white">Contact Messages</h1>
        <p className="text-sm text-slate-400 mt-1">Everything submitted through the site's contact form.</p>
      </div>
      <MessagesTable />
    </div>
  );
}
