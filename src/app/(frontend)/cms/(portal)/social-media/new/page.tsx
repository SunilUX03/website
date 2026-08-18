import { SocialPostForm } from "../SocialPostForm";
import { createSocialPost } from "../actions";

export default function NewSocialPostPage() {
  return (
    <div>
      <h1 className="type-display-sm mb-6 text-ink">New social post</h1>
      <SocialPostForm
        action={createSocialPost}
        values={{ platform: "facebook", text: "", date: "" }}
      />
    </div>
  );
}
