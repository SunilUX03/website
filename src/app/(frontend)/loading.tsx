import { LoadingScreen } from "@/components/ui/LoadingScreen";
import { getLocale } from "@/lib/locale";

export default async function Loading() {
  const locale = await getLocale();
  return <LoadingScreen label={locale === "ta" ? "ஏற்றுகிறது…" : "Loading…"} />;
}
