import { RollOfHonourForm } from "../RollOfHonourForm";
import { createRollOfHonourEntry } from "../actions";

export default function NewRollOfHonourEntryPage() {
  return (
    <div>
      <h1 className="type-display-sm mb-6 text-ink">New roll of honour entry</h1>
      <RollOfHonourForm action={createRollOfHonourEntry} values={{ designation: "", name: "", range: "", order: 0 }} />
    </div>
  );
}
