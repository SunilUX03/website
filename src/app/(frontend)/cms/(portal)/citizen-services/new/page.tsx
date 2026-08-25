import { CitizenServiceForm } from "../CitizenServiceForm";
import { createCitizenService } from "../actions";

export default async function NewCitizenServicePage({
  searchParams,
}: {
  searchParams: Promise<{ error?: string }>;
}) {
  const { error } = await searchParams;
  return (
    <div>
      <h1 className="type-display-sm mb-6 text-ink">New citizen service card</h1>
      <CitizenServiceForm
        action={createCitizenService}
        values={{ name: "", description: "", buttonLabel: "", buttonHref: "", externalLink: true, error }}
      />
    </div>
  );
}
