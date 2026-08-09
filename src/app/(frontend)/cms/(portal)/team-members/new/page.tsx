import { TeamMemberForm } from "../TeamMemberForm";
import { createTeamMember } from "../actions";

export default function NewTeamMemberPage() {
  return (
    <div>
      <h1 className="type-display-sm mb-6 text-ink">New team member</h1>
      <TeamMemberForm action={createTeamMember} values={{ name: "", designation: "", subject: "", order: 0 }} />
    </div>
  );
}
