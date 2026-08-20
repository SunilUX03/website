import { getPayloadClient } from "@/lib/payload-client";
import type { DepartmentContact } from "@/payload-types";

export type CmsDepartmentContact = {
  id: number;
  department: string;
  contact: string;
  email: string;
  phone: string;
};

function toCmsContact(doc: DepartmentContact): CmsDepartmentContact {
  return { id: doc.id, department: doc.department, contact: doc.contact, email: doc.email, phone: doc.phone };
}

export async function getDepartmentContacts(): Promise<CmsDepartmentContact[]> {
  const payload = await getPayloadClient();
  const result = await payload.find({
    collection: "department-contacts",
    sort: "order",
    limit: 200,
    overrideAccess: false,
  });
  return result.docs.map(toCmsContact);
}
