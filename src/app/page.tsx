import Link from "next/link";
import { prisma } from "@/lib/prisma";
import {
  buildPageHref,
  buildRecordWhere,
  DEFAULT_RECORD_FILTERS,
  parseRecordFilters,
} from "@/lib/record-filters";
import { RecordFiltersForm } from "@/components/records/record-filters";
import { RecordsTable } from "@/components/records/records-table";

const PAGE_SIZE = 10;

type HomePageProps = {
  searchParams: Promise<Record<string, string | string[] | undefined>>;
};

export const dynamic = "force-dynamic";

export default async function Home({ searchParams }: HomePageProps) {
  const parsedFilters = parseRecordFilters(await searchParams);
  const filters = parsedFilters.success
    ? parsedFilters.data
    : DEFAULT_RECORD_FILTERS;

  const where = buildRecordWhere(filters);
  const [totalRecords, trainers, subjects] = await Promise.all([
    prisma.trainingRecord.count({ where }),
    prisma.trainingRecord.findMany({
      select: { trainer: true },
      distinct: ["trainer"],
      orderBy: { trainer: "asc" },
    }),
    prisma.trainingRecord.findMany({
      select: { subject: true },
      distinct: ["subject"],
      orderBy: { subject: "asc" },
    }),
  ]);
  const totalPages = Math.max(1, Math.ceil(totalRecords / PAGE_SIZE));
  const currentPage = Math.min(filters.page, totalPages);
  const records = await prisma.trainingRecord.findMany({
    where,
    orderBy: [{ date: "desc" }, { createdAt: "desc" }],
    skip: (currentPage - 1) * PAGE_SIZE,
    take: PAGE_SIZE,
    select: {
      id: true,
      date: true,
      trainer: true,
      subject: true,
      topic: true,
      colabUrl: true,
      datasetUrl: true,
      notes: true,
    },
  });

  const firstRecord = totalRecords === 0 ? 0 : (currentPage - 1) * PAGE_SIZE + 1;
  const lastRecord = Math.min(currentPage * PAGE_SIZE, totalRecords);

  return (
    <main className="mx-auto flex w-full max-w-7xl flex-1 flex-col gap-8 px-4 py-10 sm:px-6 lg:px-8">
      <header className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <p className="text-sm font-semibold uppercase tracking-[0.18em] text-primary">
            Training library
          </p>
          <h1 className="mt-2 text-3xl font-semibold tracking-tight sm:text-4xl">
            Training records
          </h1>
          <p className="mt-2 max-w-2xl text-muted-foreground">
            Find sessions by trainer, subject, topic, or date and open their learning resources.
          </p>
        </div>
        <Link
          href="/admin/login"
          className="inline-flex h-9 items-center rounded-md border bg-background px-4 text-sm font-medium shadow-xs transition hover:bg-muted"
        >
          Administrator sign in
        </Link>
      </header>

      <RecordFiltersForm
        filters={filters}
        trainers={trainers.map(({ trainer }) => trainer)}
        subjects={subjects.map(({ subject }) => subject)}
      />

      {!parsedFilters.success ? (
        <p
          role="alert"
          className="rounded-lg border border-destructive/30 bg-destructive/5 px-4 py-3 text-sm text-destructive"
        >
          {parsedFilters.error.issues[0]?.message ?? "Please check your search filters."}
        </p>
      ) : null}

      <section aria-labelledby="results-heading" className="grid gap-4">
        <div className="flex flex-wrap items-center justify-between gap-2">
          <h2 id="results-heading" className="text-lg font-semibold">
            {totalRecords === 1 ? "1 record" : `${totalRecords} records`}
          </h2>
          {totalRecords > 0 ? (
            <p className="text-sm text-muted-foreground" aria-live="polite">
              Showing {firstRecord}–{lastRecord} of {totalRecords}
            </p>
          ) : null}
        </div>

        {records.length > 0 ? (
          <RecordsTable records={records} />
        ) : (
          <div className="rounded-xl border border-dashed bg-card px-6 py-14 text-center">
            <h3 className="font-semibold">No training records found</h3>
            <p className="mt-2 text-sm text-muted-foreground">
              Try changing your search or clearing one or more filters.
            </p>
          </div>
        )}

        {totalRecords > PAGE_SIZE ? (
          <nav
            aria-label="Record pages"
            className="flex items-center justify-between gap-3"
          >
            <p className="text-sm text-muted-foreground">
              Page {currentPage} of {totalPages}
            </p>
            <div className="flex gap-2">
              {currentPage > 1 ? (
                <Link
                  href={buildPageHref(filters, currentPage - 1)}
                  rel="prev"
                  className="inline-flex h-9 items-center rounded-md border px-3 text-sm font-medium transition hover:bg-muted"
                >
                  Previous
                </Link>
              ) : null}
              {currentPage < totalPages ? (
                <Link
                  href={buildPageHref(filters, currentPage + 1)}
                  rel="next"
                  className="inline-flex h-9 items-center rounded-md border px-3 text-sm font-medium transition hover:bg-muted"
                >
                  Next
                </Link>
              ) : null}
            </div>
          </nav>
        ) : null}
      </section>
    </main>
  );
}
