import "server-only";

/** Reconstructs the array of rows a <RepeatableRows name="facts" .../>
 * submitted, from `facts.0.label`, `facts.0.value`, `facts.1.label`, ...
 * Rows where every field is blank are dropped (an admin who clicked "Add
 * row" and then removed the text shouldn't end up with an empty row) —
 * except a row still carrying its original `id` is kept even if every
 * visible field was cleared, since dropping it would delete that row
 * (and the other locale's translation tied to its id) rather than just
 * blanking its text.
 *
 * Each row's own `id` (from the hidden `facts.0.id` input RepeatableRows
 * renders for pre-existing rows) comes back as `row.id` when present —
 * callers must pass it through into the Payload array data (`{ id,
 * ...fields }`), or Payload treats every row as brand new and silently
 * deletes the sibling locale's translations for the whole field on save.
 * See the comment on RepeatableRows itself for the full explanation. */
export function parseRepeatable(formData: FormData, name: string, keys: string[]): (Record<string, string> & { id?: string })[] {
  const rows: (Record<string, string> & { id?: string })[] = [];
  for (let i = 0; ; i++) {
    const prefix = `${name}.${i}.`;
    if (!formData.has(`${prefix}${keys[0]}`)) break;
    const row: Record<string, string> & { id?: string } = {};
    for (const key of keys) {
      row[key] = String(formData.get(`${prefix}${key}`) ?? "").trim();
    }
    const id = formData.get(`${prefix}id`);
    if (id) row.id = String(id);
    if (row.id || Object.values(row).some(Boolean)) rows.push(row);
  }
  return rows;
}

export function str(formData: FormData, key: string): string {
  return String(formData.get(key) ?? "").trim();
}

export function optionalStr(formData: FormData, key: string): string | undefined {
  const value = str(formData, key);
  return value.length > 0 ? value : undefined;
}
