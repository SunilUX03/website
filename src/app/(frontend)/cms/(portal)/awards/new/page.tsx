import { AwardForm } from "../AwardForm";
import { createAward } from "../actions";

export default async function NewAwardPage({
  searchParams,
}: {
  searchParams: Promise<{ error?: string }>;
}) {
  const { error } = await searchParams;
  return (
    <div>
      <h1 className="type-display-sm mb-6 text-ink">New award</h1>
      <AwardForm action={createAward} values={{ title: "", year: "", description: "", error }} />
    </div>
  );
}
