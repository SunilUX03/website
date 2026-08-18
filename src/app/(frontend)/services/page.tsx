import { redirect } from "next/navigation";

// /services is now split into three standalone pages (Citizen Services,
// Services to Government, Initiatives & Projects) — nothing links here
// directly anymore, but the old URL still redirects rather than 404ing
// for anyone with it bookmarked or indexed.
export default function Services() {
  redirect("/citizen-services");
}
