import Link from "next/link";
import { Container } from "@/components/ui/Container";

export interface BreadcrumbItem {
  label: string;
  /** Omit for a non-navigable crumb (e.g. "Notifications", which has no
   * page of its own) or for the current page, which is always last. */
  href?: string;
}

/** Shared Home / … / Current trail, used above the hero on every page
 * except Home itself. */
export function Breadcrumb({ items }: { items: BreadcrumbItem[] }) {
  return (
    <div className="bg-canvas">
      <Container className="py-md">
        <nav
          className="type-body-sm flex flex-wrap items-center gap-1.5 text-[var(--color-muted)]"
          aria-label="Breadcrumb"
        >
          <Link href="/" className="hover:text-ink">
            Home
          </Link>
          {items.map((item) => (
            <span key={item.label} className="flex items-center gap-1.5">
              <span aria-hidden>/</span>
              {item.href ? (
                <Link href={item.href} className="hover:text-ink">
                  {item.label}
                </Link>
              ) : (
                <span className="text-ink" aria-current="page">
                  {item.label}
                </span>
              )}
            </span>
          ))}
        </nav>
      </Container>
    </div>
  );
}
