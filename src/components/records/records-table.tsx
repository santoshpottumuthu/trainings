import type { TrainingRecord } from "@prisma/client";
import { ExternalLink } from "lucide-react";
import Link from "next/link";
import { asSafeHttpsUrl } from "@/lib/urls";
import { DeleteRecordButton } from "./delete-record-button";

type RecordsTableProps = {
  records: PublicTrainingRecord[];
  isAdmin: boolean;
};

type PublicTrainingRecord = Pick<
  TrainingRecord,
  | "id"
  | "date"
  | "trainer"
  | "subject"
  | "topic"
  | "colabUrl"
  | "datasetUrl"
  | "notes"
>;

function formatRecordDate(date: Date) {
  return new Intl.DateTimeFormat("en-IN", {
    dateStyle: "medium",
    timeZone: "UTC",
  }).format(date);
}

function ResourceLink({ href, label }: { href: string | null; label: string }) {
  if (!href) {
    return <span className="text-muted-foreground">Not provided</span>;
  }

  return (
    <a
      className="inline-flex items-center gap-1 font-medium text-primary underline-offset-4 hover:underline"
      href={href}
      target="_blank"
      rel="noopener noreferrer"
    >
      {label}
      <ExternalLink aria-hidden="true" className="size-3.5" />
      <span className="sr-only">(opens in a new tab)</span>
    </a>
  );
}

export function RecordsTable({ records, isAdmin }: RecordsTableProps) {
  return (
    <>
      <div className="hidden overflow-hidden rounded-xl border bg-card shadow-sm md:block">
        <div className="overflow-x-auto">
          <table className="w-full min-w-[980px] text-left text-sm">
            <caption className="sr-only">Training records</caption>
            <thead className="bg-muted/70 text-xs uppercase tracking-wide text-muted-foreground">
              <tr>
                <th scope="col" className="px-4 py-3 font-semibold">Date</th>
                <th scope="col" className="px-4 py-3 font-semibold">Trainer</th>
                <th scope="col" className="px-4 py-3 font-semibold">Subject</th>
                <th scope="col" className="px-4 py-3 font-semibold">Topic</th>
                <th scope="col" className="px-4 py-3 font-semibold">Colab</th>
                <th scope="col" className="px-4 py-3 font-semibold">Dataset</th>
                <th scope="col" className="px-4 py-3 font-semibold">Notes</th>
                {isAdmin ? (
                  <th scope="col" className="px-4 py-3 font-semibold">Actions</th>
                ) : null}
              </tr>
            </thead>
            <tbody className="divide-y">
              {records.map((record) => (
                <tr key={record.id} className="align-top transition hover:bg-muted/30">
                  <td className="whitespace-nowrap px-4 py-4">{formatRecordDate(record.date)}</td>
                  <td className="px-4 py-4 font-medium">{record.trainer}</td>
                  <td className="px-4 py-4">{record.subject}</td>
                  <td className="max-w-xs px-4 py-4">{record.topic}</td>
                  <td className="px-4 py-4">
                    <ResourceLink href={asSafeHttpsUrl(record.colabUrl)} label="Open Colab" />
                  </td>
                  <td className="px-4 py-4">
                    <ResourceLink href={asSafeHttpsUrl(record.datasetUrl)} label="Dataset" />
                  </td>
                  <td className="max-w-xs whitespace-pre-wrap px-4 py-4 text-muted-foreground">
                    {record.notes || "—"}
                  </td>
                  {isAdmin ? (
                    <td className="px-4 py-4">
                      <div className="flex items-center gap-2">
                        <Link
                          href={`/admin/records/${record.id}/edit`}
                          className="inline-flex h-8 items-center rounded-md border px-3 text-sm font-medium transition hover:bg-muted"
                        >
                          Edit
                        </Link>
                        <DeleteRecordButton
                          recordId={record.id}
                          recordLabel={record.topic}
                        />
                      </div>
                    </td>
                  ) : null}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
      <div className="grid gap-3 md:hidden">
        {records.map((record) => (
          <article key={record.id} className="rounded-xl border bg-card p-4 shadow-sm">
            <div className="flex flex-wrap items-start justify-between gap-2">
              <h2 className="font-semibold">{record.topic}</h2>
              <time className="text-sm text-muted-foreground" dateTime={record.date.toISOString()}>
                {formatRecordDate(record.date)}
              </time>
            </div>
            <p className="mt-1 text-sm text-muted-foreground">
              {record.subject} · {record.trainer}
            </p>
            {record.notes ? (
              <p className="mt-3 whitespace-pre-wrap text-sm">{record.notes}</p>
            ) : null}
            <div className="mt-4 flex flex-wrap gap-x-5 gap-y-2 text-sm">
              <ResourceLink href={asSafeHttpsUrl(record.colabUrl)} label="Open Colab" />
              <ResourceLink href={asSafeHttpsUrl(record.datasetUrl)} label="Dataset" />
            </div>
            {isAdmin ? (
              <div className="mt-4 flex items-center gap-2 border-t pt-3">
                <Link
                  href={`/admin/records/${record.id}/edit`}
                  className="inline-flex h-8 items-center rounded-md border px-3 text-sm font-medium transition hover:bg-muted"
                >
                  Edit
                </Link>
                <DeleteRecordButton
                  recordId={record.id}
                  recordLabel={record.topic}
                />
              </div>
            ) : null}
          </article>
        ))}
      </div>
    </>
  );
}
