import { randomUUID } from "node:crypto";
import Link from "next/link";
import { RecordForm } from "./record-form";

export const dynamic = "force-dynamic";

export default function NewTrainingRecordPage() {
  return (
    <main className="mx-auto w-full max-w-3xl flex-1 px-4 py-10 sm:px-6 lg:px-8">
      <Link
        href="/admin"
        className="text-sm font-medium text-muted-foreground underline-offset-4 hover:text-foreground hover:underline"
      >
        Back to administration
      </Link>
      <section className="mt-5 rounded-xl border bg-card p-6 shadow-sm sm:p-8">
        <p className="text-sm font-semibold uppercase tracking-[0.18em] text-primary">
          New record
        </p>
        <h1 className="mt-2 text-2xl font-semibold tracking-tight">
          Add a training session
        </h1>
        <p className="mb-6 mt-2 text-sm text-muted-foreground">
          Required fields are marked with an asterisk. Links must use HTTPS.
        </p>
        <RecordForm submissionKey={randomUUID()} />
      </section>
    </main>
  );
}
