"use server";

import { Prisma } from "@prisma/client";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { z } from "zod";
import { requireAdmin } from "@/lib/auth/require-admin";
import { prisma } from "@/lib/prisma";
import {
  trainingRecordFieldsSchema,
  type RecordActionState,
} from "@/lib/records/validation";

const recordIdSchema = z.string().trim().min(1).max(64);

export async function updateTrainingRecord(
  _previousState: RecordActionState,
  formData: FormData,
): Promise<RecordActionState> {
  await requireAdmin();

  const recordId = recordIdSchema.safeParse(formData.get("recordId"));
  if (!recordId.success) {
    return {
      status: "error",
      message: "This record identifier is invalid.",
    };
  }

  const parsed = trainingRecordFieldsSchema.safeParse({
    date: formData.get("date"),
    trainer: formData.get("trainer"),
    subject: formData.get("subject"),
    topic: formData.get("topic"),
    colabUrl: formData.get("colabUrl"),
    datasetUrl: formData.get("datasetUrl"),
    notes: formData.get("notes"),
  });

  if (!parsed.success) {
    const errors = parsed.error.flatten().fieldErrors;
    return {
      status: "error",
      message: "Please correct the highlighted fields.",
      fieldErrors: {
        date: errors.date?.[0],
        trainer: errors.trainer?.[0],
        subject: errors.subject?.[0],
        topic: errors.topic?.[0],
        colabUrl: errors.colabUrl?.[0],
        datasetUrl: errors.datasetUrl?.[0],
        notes: errors.notes?.[0],
      },
    };
  }

  const record = parsed.data;
  try {
    await prisma.trainingRecord.update({
      where: { id: recordId.data },
      data: {
        date: new Date(`${record.date}T00:00:00.000Z`),
        trainer: record.trainer,
        subject: record.subject,
        topic: record.topic,
        colabUrl: record.colabUrl,
        datasetUrl: record.datasetUrl ?? null,
        notes: record.notes ?? null,
      },
    });
  } catch (error) {
    if (
      error instanceof Prisma.PrismaClientKnownRequestError &&
      error.code === "P2025"
    ) {
      return {
        status: "error",
        message: "This record no longer exists. Refresh the records list.",
      };
    }

    if (
      error instanceof Prisma.PrismaClientInitializationError ||
      error instanceof Prisma.PrismaClientKnownRequestError
    ) {
      console.error("Training record update failed.", error);
      return {
        status: "error",
        message:
          "The record could not be updated. Please try again later; no changes were made.",
      };
    }

    throw error;
  }

  revalidatePath("/");
  revalidatePath(`/admin/records/${recordId.data}/edit`);
  redirect("/");
}

export type DeleteRecordState = { message: string } | null;

export async function deleteTrainingRecord(
  _previousState: DeleteRecordState,
  formData: FormData,
): Promise<DeleteRecordState> {
  await requireAdmin();

  const recordId = recordIdSchema.safeParse(formData.get("recordId"));
  if (!recordId.success) {
    return { message: "This record identifier is invalid." };
  }

  try {
    await prisma.trainingRecord.delete({ where: { id: recordId.data } });
  } catch (error) {
    if (
      error instanceof Prisma.PrismaClientKnownRequestError &&
      error.code === "P2025"
    ) {
      return {
        message: "This record no longer exists. Refresh the records list.",
      };
    }

    if (
      error instanceof Prisma.PrismaClientInitializationError ||
      error instanceof Prisma.PrismaClientKnownRequestError
    ) {
      console.error("Training record deletion failed.", error);
      return {
        message: "The record could not be deleted. Please try again later.",
      };
    }

    throw error;
  }

  revalidatePath("/");
  redirect("/");
}
