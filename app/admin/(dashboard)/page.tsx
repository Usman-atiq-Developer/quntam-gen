import { Mail, MailWarning, Newspaper, FileEdit, Link2, Clock } from "lucide-react";
import Link from "next/link";
import { connectToDatabase } from "@/lib/db/connect";
import ContactMessage from "@/models/ContactMessage";
import Post from "@/models/Post";
import LinkInsertion from "@/models/LinkInsertion";
import StatCard from "@/components/admin/StatCard";
import StatusBadge from "@/components/admin/StatusBadge";

export const dynamic = "force-dynamic";

async function getStats() {
  await connectToDatabase();

  const [
    totalMessages,
    unreadMessages,
    totalPosts,
    publishedPosts,
    draftPosts,
    totalLinkInsertions,
    pendingLinkInsertions,
    recentMessages,
    recentLinkInsertions,
  ] = await Promise.all([
    ContactMessage.countDocuments(),
    ContactMessage.countDocuments({ status: "new" }),
    Post.countDocuments(),
    Post.countDocuments({ status: "published" }),
    Post.countDocuments({ status: "draft" }),
    LinkInsertion.countDocuments(),
    LinkInsertion.countDocuments({ status: "pending" }),
    ContactMessage.find().sort({ createdAt: -1 }).limit(5).lean(),
    LinkInsertion.find().sort({ createdAt: -1 }).limit(5).lean(),
  ]);

  return {
    totalMessages,
    unreadMessages,
    totalPosts,
    publishedPosts,
    draftPosts,
    totalLinkInsertions,
    pendingLinkInsertions,
    recentMessages: JSON.parse(JSON.stringify(recentMessages)),
    recentLinkInsertions: JSON.parse(JSON.stringify(recentLinkInsertions)),
  };
}

export default async function AdminOverviewPage() {
  const stats = await getStats();

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-2xl font-semibold text-white">Overview</h1>
        <p className="text-sm text-slate-400 mt-1">A quick look at what's happening across your site.</p>
      </div>

      <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-5">
        <StatCard label="Total Messages" value={stats.totalMessages} icon={Mail} sublabel={`${stats.unreadMessages} unread`} />
        <StatCard label="Unread Messages" value={stats.unreadMessages} icon={MailWarning} />
        <StatCard label="Published Posts" value={stats.publishedPosts} icon={Newspaper} sublabel={`${stats.totalPosts} total`} />
        <StatCard label="Draft Posts" value={stats.draftPosts} icon={FileEdit} />
        <StatCard label="Link Insertions" value={stats.totalLinkInsertions} icon={Link2} sublabel={`${stats.pendingLinkInsertions} pending`} />
        <StatCard label="Pending Requests" value={stats.pendingLinkInsertions} icon={Clock} />
      </div>

      <div className="grid lg:grid-cols-2 gap-6">
        <div className="rounded-xl2 border border-white/10 bg-[#131a35] p-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-sm font-semibold text-white">Recent Messages</h2>
            <Link href="/admin/messages" className="text-xs text-violet-300 hover:text-violet-200">
              View all
            </Link>
          </div>
          {stats.recentMessages.length === 0 ? (
            <p className="text-sm text-slate-500">No messages yet.</p>
          ) : (
            <ul className="space-y-3">
              {stats.recentMessages.map((m: any) => (
                <li key={m._id} className="flex items-center justify-between gap-3 text-sm">
                  <div className="min-w-0">
                    <p className="text-white truncate">{m.name}</p>
                    <p className="text-slate-500 truncate text-xs">{m.email}</p>
                  </div>
                  <StatusBadge status={m.status} />
                </li>
              ))}
            </ul>
          )}
        </div>

        <div className="rounded-xl2 border border-white/10 bg-[#131a35] p-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-sm font-semibold text-white">Recent Link Requests</h2>
            <Link href="/admin/link-insertions" className="text-xs text-violet-300 hover:text-violet-200">
              View all
            </Link>
          </div>
          {stats.recentLinkInsertions.length === 0 ? (
            <p className="text-sm text-slate-500">No link insertion requests yet.</p>
          ) : (
            <ul className="space-y-3">
              {stats.recentLinkInsertions.map((l: any) => (
                <li key={l._id} className="flex items-center justify-between gap-3 text-sm">
                  <div className="min-w-0">
                    <p className="text-white truncate">{l.clientName}</p>
                    <p className="text-slate-500 truncate text-xs">{l.targetUrl}</p>
                  </div>
                  <StatusBadge status={l.status} />
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>
    </div>
  );
}
