import { requireAuth } from "@/app/actions";
import { db } from "@/lib/db";
import SettingsClient from "./SettingsClient";

export const dynamic = "force-dynamic";

export default async function SettingsPage() {
  const session = await requireAuth();
  const user = await db.user.findUnique({ where: { id: session.userId } });
  if (!user) return null;

  return <SettingsClient user={user} />;
}
