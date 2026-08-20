import { DepartmentContactForm } from "../DepartmentContactForm";
import { createDepartmentContact } from "../actions";

export default function NewDepartmentContactPage() {
  return (
    <div>
      <h1 className="type-display-sm mb-6 text-ink">New department contact</h1>
      <DepartmentContactForm
        action={createDepartmentContact}
        values={{ department: "", contact: "", email: "", phone: "", order: 0 }}
      />
    </div>
  );
}
