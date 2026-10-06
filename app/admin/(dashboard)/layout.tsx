import { redirect } from "next/navigation";
import { getAdminSession } from "@/lib/auth/session";
import AdminSidebar from "@/components/admin/AdminSidebar";
import LogoutButton from "@/components/admin/LogoutButton";

export default async function DashboardLayout({ children }: { children: React.ReactNode }) {
  // Defense in depth: middleware.ts already redirects unauthenticated
  // requests to /admin/login before this layout ever renders, but checking
  // again here means the dashboard never briefly renders for a session
  // that expired mid-navigation (e.g. client-side route transitions).
  const session = await getAdminSession();
  if (!session) {
    redirect("/admin/login");
  }

  return (
    <div className="flex">
      <AdminSidebar />
      <div className="flex-1 min-w-0">
        <header className="flex items-center justify-between border-b border-white/10 bg-[#0b0f1f]/80 backdrop-blur px-8 py-4 sticky top-0 z-10">
          <div />
          <div className="flex items-center gap-4">
            <span className="text-sm text-slate-400">{session.name}</span>
            <LogoutButton />
          </div>
        </header>
        <main className="px-8 py-8">{children}</main>
      </div>
    </div>
  );
}
