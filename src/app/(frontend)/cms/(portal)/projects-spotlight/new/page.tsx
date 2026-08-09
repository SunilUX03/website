import { ProjectSpotlightForm } from "../ProjectSpotlightForm";
import { createProjectSpotlight } from "../actions";

export default async function NewProjectSpotlightPage({
  searchParams,
}: {
  searchParams: Promise<{ error?: string }>;
}) {
  const { error } = await searchParams;
  return (
    <div>
      <h1 className="type-display-sm mb-6 text-ink">New spotlight project</h1>
      <ProjectSpotlightForm
        action={createProjectSpotlight}
        values={{ name: "", description: "", badge: "", order: 0, stats: [], ctas: [], error }}
      />
    </div>
  );
}
