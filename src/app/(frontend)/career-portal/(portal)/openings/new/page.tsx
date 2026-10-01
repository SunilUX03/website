import { JobOpeningForm } from "../JobOpeningForm";
import { createJobOpening } from "../actions";

export default async function NewJobOpeningPage({
  searchParams,
}: {
  searchParams: Promise<{ error?: string }>;
}) {
  const { error } = await searchParams;
  return (
    <div>
      <h1 className="type-display-sm mb-6 text-ink">New job opening</h1>
      {error ? (
        <p className="type-body-sm mb-4 max-w-[560px] rounded-lg border border-[var(--color-error)] bg-[rgba(220,38,38,0.06)] px-3 py-2 text-[var(--color-error)]">
          {error}
        </p>
      ) : null}
      <JobOpeningForm
        action={createJobOpening}
        values={{ role: "", type: "Contract", department: "", deadline: "" }}
      />
    </div>
  );
}
