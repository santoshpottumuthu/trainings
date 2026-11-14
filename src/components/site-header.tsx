import Link from "next/link";
import { auth, signOut } from "@/auth";

export async function SiteHeader() {
  const session = await auth();
  const isAdmin = session?.user.isAdmin === true;

  return (
    <header className="border-b bg-background">
      <div className="mx-auto flex min-h-16 w-full max-w-7xl items-center gap-6 px-4 py-3 sm:px-6 lg:px-8">
        <Link href="/" className="shrink-0 font-semibold tracking-tight">
          Data Science and Artificial Intelligence Course
        </Link>

        {isAdmin ? (
          <nav
            aria-label="Primary navigation"
            className="ml-auto flex flex-wrap items-center justify-end gap-3 sm:gap-5"
          >
            <Link
              href="/admin/records/new"
              className="text-sm font-medium hover:underline"
            >
              Create a new record
            </Link>
            <Link href="/" className="text-sm font-medium hover:underline">
              View records
            </Link>
            <form
              action={async () => {
                "use server";
                await signOut({ redirectTo: "/" });
              }}
            >
              <button
                type="submit"
                className="inline-flex h-9 items-center rounded-md border bg-background px-4 text-sm font-medium shadow-xs transition hover:bg-muted"
              >
                Sign out
              </button>
            </form>
          </nav>
        ) : null}
      </div>
    </header>
  );
}
