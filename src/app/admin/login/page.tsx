import { redirect } from "next/navigation";
import { getSession } from "@/app/actions";

export default async function AdminLoginPage() {
  const session = await getSession();
  if (session?.role === "ADMIN") redirect("/admin/dashboard");
  redirect("/auth");
}
