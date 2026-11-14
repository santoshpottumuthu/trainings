import type { ReactNode } from "react";
import { auth } from "@/auth";
import { redirect } from "next/navigation";

export default async function ProtectedAdminLayout({
  children,
}: {
  children: ReactNode;
}) {
  const session = await auth();
  if (session?.user.isAdmin !== true) {
    redirect("/admin/login");
  }

  return children;
}
