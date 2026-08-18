import { db } from "@/lib/db";
import { ConfirmSubmitButton } from "@/components/portal/ConfirmSubmitButton";
import { createRole, renameRole, deleteRole, moveRole } from "./actions";

export const dynamic = "force-dynamic";

export default async function RolesPage() {
  const roles = await db.jobRole.findMany({ orderBy: { order: "asc" } });

  return (
    <div>
      <div className="mb-6">
        <h1 className="type-display-sm text-ink">Roles</h1>
        <p className="type-body-sm mt-1 text-[var(--color-muted)]">
          The options shown in the public application form&apos;s &quot;Role Applied For&quot; dropdown, in this order.
        </p>
      </div>

      <div className="mb-6 max-w-[560px] rounded-xl border border-hairline bg-surface-card p-5">
        <p className="type-caption-uppercase mb-2 text-[var(--color-muted)]">Add a role</p>
        <form action={createRole} className="flex gap-2">
          <input
            name="label"
            required
            placeholder="e.g. Backend Engineer"
            className="w-full rounded-lg border border-hairline-strong bg-canvas px-3 py-2 outline-none focus:border-[var(--color-primary-blue)]"
          />
          <button type="submit" className="type-button btn-primary shrink-0">
            Add
          </button>
        </form>
      </div>

      <div className="max-w-[560px] overflow-hidden rounded-xl border border-hairline bg-surface-card">
        {roles.length === 0 ? (
          <p className="type-body-sm px-5 py-8 text-center text-[var(--color-muted)]">No roles yet — add one above.</p>
        ) : (
          <ul role="list">
            {roles.map((role, i) => {
              const boundRename = renameRole.bind(null, role.id);
              const boundMoveUp = moveRole.bind(null, role.id, "up");
              const boundMoveDown = moveRole.bind(null, role.id, "down");
              const boundDelete = deleteRole.bind(null, role.id);
              return (
                <li key={role.id} className="flex items-center gap-2 border-b border-hairline p-3 last:border-0">
                  <div className="flex shrink-0 flex-col">
                    <form action={boundMoveUp}>
                      <button
                        type="submit"
                        disabled={i === 0}
                        aria-label="Move up"
                        className="flex h-5 w-5 items-center justify-center text-[var(--color-muted)] hover:text-ink disabled:opacity-30"
                      >
                        ▲
                      </button>
                    </form>
                    <form action={boundMoveDown}>
                      <button
                        type="submit"
                        disabled={i === roles.length - 1}
                        aria-label="Move down"
                        className="flex h-5 w-5 items-center justify-center text-[var(--color-muted)] hover:text-ink disabled:opacity-30"
                      >
                        ▼
                      </button>
                    </form>
                  </div>

                  <form action={boundRename} className="flex flex-1 items-center gap-2">
                    <input
                      name="label"
                      defaultValue={role.label}
                      required
                      className="w-full rounded-lg border border-hairline-strong bg-canvas px-3 py-1.5 text-sm outline-none focus:border-[var(--color-primary-blue)]"
                    />
                    <button type="submit" className="type-caption shrink-0 rounded-md border border-hairline-strong px-2.5 py-1.5 text-[var(--color-primary-blue)] hover:bg-surface-strong">
                      Save
                    </button>
                  </form>

                  <form action={boundDelete}>
                    <ConfirmSubmitButton
                      confirmMessage={`Delete the "${role.label}" role? It'll disappear from the application form's dropdown.`}
                      className="type-caption shrink-0 rounded-md border border-hairline-strong px-2.5 py-1.5 text-[var(--color-muted)] hover:text-[var(--color-error)]"
                    >
                      Delete
                    </ConfirmSubmitButton>
                  </form>
                </li>
              );
            })}
          </ul>
        )}
      </div>
    </div>
  );
}
