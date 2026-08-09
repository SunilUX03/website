import { MediaItemForm } from "../MediaItemForm";
import { createMediaItem } from "../actions";

export default async function NewMediaItemPage({
  searchParams,
}: {
  searchParams: Promise<{ error?: string }>;
}) {
  const { error } = await searchParams;
  return (
    <div>
      <h1 className="type-display-sm mb-6 text-ink">New photo/video</h1>
      <MediaItemForm
        action={createMediaItem}
        error={error}
        values={{ type: "photo", caption: "", altText: "", date: new Date().toISOString().slice(0, 10) }}
      />
    </div>
  );
}
