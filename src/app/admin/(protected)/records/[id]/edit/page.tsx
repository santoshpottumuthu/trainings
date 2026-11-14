import { notFound } from "next/navigation";
import { DeleteRecordButton } from "@/components/records/delete-record-button";
import { prisma } from "@/lib/prisma";
import { EditRecordForm } from "./edit-record-form";

type EditTrainingRecordPageProps = {
  params: Promise<{ id: string }>;
};

export const dynamic = "force-dynamic";

export default async function EditTrainingRecordPage({
  params,
}: EditTrainingRecordPageProps) {
  const { id } = await params;
  const record = await prisma.trainingRecord.findUnique({
    where: { id },
    select: {
      id: true,
      date: true,
      trainer: true,
      subject: true,
      topic: true,
      colabUrl: true,
      videoUrl: true,
      datasetUrl: true,
      notes: true,
    },
  });

  if (!record) {
    notFound();
  }

  return (
    <main className="mx-auto w-full max-w-3xl flex-1 px-4 py-10 sm:px-6 lg:px-8">
      <section className="rounded-xl border bg-card p-6 shadow-sm sm:p-8">
        <p className="text-sm font-semibold uppercase tracking-[0.18em] text-primary">
          Edit record
        </p>
        <h1 className="mt-2 text-2xl font-semibold tracking-tight">
          Update training session
        </h1>
        <p className="mb-6 mt-2 text-sm text-muted-foreground">
          Required fields are marked with an asterisk. Links must use HTTPS.
        </p>
        <EditRecordForm
          record={{
            id: record.id,
            date: record.date.toISOString().slice(0, 10),
            trainer: record.trainer,
            subject: record.subject,
            topic: record.topic,
            colabUrl: record.colabUrl,
            videoUrl: record.videoUrl ?? "",
            datasetUrl: record.datasetUrl ?? "",
            notes: record.notes ?? "",
          }}
        />
        <div className="mt-8 grid gap-3 border-t pt-6">
          <h2 className="font-semibold">Delete this record</h2>
          <p className="text-sm text-muted-foreground">
            Deleting a record cannot be undone.
          </p>
          <DeleteRecordButton recordId={record.id} recordLabel={record.topic} />
        </div>
      </section>
    </main>
  );
}
