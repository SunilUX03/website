import { GovernmentOrderForm } from "../GovernmentOrderForm";
import { createGovernmentOrder } from "../actions";

export default async function NewGovernmentOrderPage({
  searchParams,
}: {
  searchParams: Promise<{ error?: string }>;
}) {
  const { error } = await searchParams;
  return (
    <div>
      <h1 className="type-display-sm mb-6 text-ink">New Government Order</h1>
      <GovernmentOrderForm action={createGovernmentOrder} error={error} values={{ title: "", year: "", department: "" }} />
    </div>
  );
}
