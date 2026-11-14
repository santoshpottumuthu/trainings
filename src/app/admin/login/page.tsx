import type { Metadata } from "next";
import { redirect } from "next/navigation";
import { auth } from "@/auth";
import { LoginForm } from "./login-form";

export const metadata: Metadata = {
  title: "Administrator sign in | Training Records",
};

export default async function AdminLoginPage() {
  const session = await auth();
  if (session?.user.isAdmin) {
    redirect("/admin");
  }

  return (
    <main className="mx-auto flex min-h-[70vh] w-full max-w-md flex-1 items-center px-4 py-10">
      <section className="w-full rounded-xl border bg-card p-6 shadow-sm sm:p-8">
        <p className="text-sm font-semibold uppercase tracking-[0.18em] text-primary">
          Administrator
        </p>
        <h1 className="mt-2 text-2xl font-semibold tracking-tight">
          Sign in to manage records
        </h1>
        <p className="mb-6 mt-2 text-sm text-muted-foreground">
          Use the credentials provisioned for your administrator account.
        </p>
        <LoginForm />
      </section>
    </main>
  );
}
