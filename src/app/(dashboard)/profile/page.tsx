import { cookies } from "next/headers";
import ProfileClient from "./ProfileClient";

export default async function ProfilePage() {
  const cookieStore = await cookies();
  const plan = cookieStore.get("neon10_plan")?.value || "Free";
  const email = cookieStore.get("neon10_user")?.value || "";
  return <ProfileClient initialPlan={plan} initialEmail={email} />;
}
