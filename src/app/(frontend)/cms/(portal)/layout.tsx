import { redirect } from "next/navigation";
import { requireSession, logout } from "@/lib/portal/auth";
import { PortalSidebar } from "@/components/portal/PortalSidebar";

export default async function PortalLayout({ children }: { children: React.ReactNode }) {
  const user = await requireSession();

  async function logoutAction() {
    "use server";
    await logout();
    redirect("/cms/login");
  }

  return (
    <div className="flex min-h-screen bg-canvas">
      <PortalSidebar />
      <div className="flex min-w-0 flex-1 flex-col">
        <header className="flex h-16 shrink-0 items-center justify-between border-b border-hairline bg-surface-card px-6">
          <p className="type-title-sm text-ink">TNeGA Content Portal</p>
          <div className="flex items-center gap-3">
            <span className="type-caption text-[var(--color-muted)]">
              {user.name || user.email} · {user.role}
            </span>
            <form action={logoutAction}>
              <button type="submit" className="type-button btn-outline !h-9 !px-4">
                Sign out
              </button>
            </form>
          </div>
        </header>
        <main className="flex-1 overflow-y-auto px-6 py-8">{children}</main>
      </div>
    </div>
  );
}
