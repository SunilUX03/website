import { PolicyForm } from "../PolicyForm";
import { createPolicy } from "../actions";

export default async function NewPolicyPage({
  searchParams,
}: {
  searchParams: Promise<{ error?: string }>;
}) {
  const { error } = await searchParams;
  return (
    <div>
      <h1 className="type-display-sm mb-6 text-ink">New policy</h1>
      <PolicyForm action={createPolicy} error={error} values={{ title: "", year: "", category: "" }} />
    </div>
  );
}
