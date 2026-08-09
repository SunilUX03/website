import "server-only";

/** Reconstructs the array of rows a <RepeatableRows name="facts" .../>
 * submitted, from `facts.0.label`, `facts.0.value`, `facts.1.label`, ...
 * Rows where every field is blank are dropped (an admin who clicked "Add
 * row" and then removed the text shouldn't end up with an empty row). */
export function parseRepeatable(formData: FormData, name: string, keys: string[]): Record<string, string>[] {
  const rows: Record<string, string>[] = [];
  for (let i = 0; ; i++) {
    const prefix = `${name}.${i}.`;
    if (!formData.has(`${prefix}${keys[0]}`)) break;
    const row: Record<string, string> = {};
    for (const key of keys) {
      row[key] = String(formData.get(`${prefix}${key}`) ?? "").trim();
    }
    if (Object.values(row).some(Boolean)) rows.push(row);
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
