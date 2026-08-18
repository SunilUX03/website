import { JobOpeningForm } from "../JobOpeningForm";
import { createJobOpening } from "../actions";

export default function NewJobOpeningPage() {
  return (
    <div>
      <h1 className="type-display-sm mb-6 text-ink">New job opening</h1>
      <JobOpeningForm
        action={createJobOpening}
        values={{ role: "", type: "Contract", department: "", deadline: "" }}
      />
    </div>
  );
}
