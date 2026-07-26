import { requireAdmin } from "@/app/actions";
import { db } from "@/lib/db";
import AdminCategoriesClient from "./AdminCategoriesClient";

export const dynamic = "force-dynamic";

export default async function AdminCategoriesPage() {
  await requireAdmin();
  const categories = await db.serviceCategory.findMany({ orderBy: { createdAt: "asc" } });
  return <AdminCategoriesClient categories={categories} />;
}
