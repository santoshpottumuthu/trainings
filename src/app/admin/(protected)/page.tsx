import Link from "next/link";
import { signOut } from "@/auth";
import { Button } from "@/components/ui/button";

export default function AdminHomePage() {
  return (
    <main className="mx-auto flex w-full max-w-5xl flex-1 flex-col gap-6 px-4 py-10 sm:px-6 lg:px-8">
      <header className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <p className="text-sm font-semibold uppercase tracking-[0.18em] text-primary">
            Administration
          </p>
          <h1 className="mt-2 text-3xl font-semibold tracking-tight">
            Training records
          </h1>
        </div>
        <form
          action={async () => {
            "use server";
            await signOut({ redirectTo: "/" });
          }}
        >
          <Button type="submit" variant="outline">
            Sign out
          </Button>
        </form>
      </header>
      <section className="rounded-xl border bg-card p-6 shadow-sm">
        <h2 className="text-lg font-semibold">Manage the training library</h2>
        <p className="mt-2 text-sm text-muted-foreground">
          Add a training record to make its details and learning links available to everyone.
        </p>
        <Link
          href="/admin/records/new"
          className="mt-5 inline-flex h-9 items-center rounded-md bg-primary px-4 text-sm font-medium text-primary-foreground shadow-xs transition hover:bg-primary/85"
        >
          Add training record
        </Link>
      </section>
    </main>
  );
}
