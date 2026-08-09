import { AnnouncementForm } from "../AnnouncementForm";
import { createAnnouncement } from "../actions";

export default function NewAnnouncementPage() {
  return (
    <div>
      <h1 className="type-display-sm mb-6 text-ink">New announcement</h1>
      <AnnouncementForm
        action={createAnnouncement}
        values={{
          heading: "",
          date: new Date().toISOString().slice(0, 10),
          description: "",
          category: "",
          body: "",
          facts: [],
          links: [],
          tickerFeatured: false,
          tickerOrder: 0,
        }}
      />
    </div>
  );
}
