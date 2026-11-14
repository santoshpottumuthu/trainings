import { auth } from "@/auth";
import { redirect } from "next/navigation";

export async function requireAdmin() {
  const session = await auth();
  if (session?.user.isAdmin !== true || !session.user.id) {
    redirect("/admin/login");
  }

  return session.user.id;
}
