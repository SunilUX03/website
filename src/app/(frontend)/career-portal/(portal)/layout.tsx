import { requireAdminSession } from "@/lib/admin-session";
import { CareerPortalSidebar } from "@/components/admin/CareerPortalSidebar";
import { SignOutButton } from "@/components/admin/SignOutButton";

export default async function CareerPortalLayout({ children }: { children: React.ReactNode }) {
  const session = await requireAdminSession();

  return (
    <div className="flex min-h-screen bg-canvas">
      <CareerPortalSidebar />
      <div className="flex min-w-0 flex-1 flex-col">
        <header className="flex h-16 shrink-0 items-center justify-between border-b border-hairline bg-surface-card px-6">
          <p className="type-title-sm text-ink">TNeGA Career Portal</p>
          <div className="flex items-center gap-3">
            <span className="type-caption text-[var(--color-muted)]">
              {session.user?.name || session.user?.email}
            </span>
            <SignOutButton />
          </div>
        </header>
        <main className="flex-1 overflow-y-auto px-6 py-8">{children}</main>
      </div>
    </div>
  );
}
