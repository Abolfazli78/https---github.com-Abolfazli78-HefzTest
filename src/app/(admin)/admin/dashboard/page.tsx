import { redirect } from "next/navigation";
import { getServerSession } from "@/lib/session";

export default async function AdminDashboardRedirect() {
  const session = await getServerSession();
  if (!session || session.user.role !== "ADMIN") {
    redirect("/login");
  }
  redirect("/admin");
}
