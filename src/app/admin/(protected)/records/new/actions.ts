"use server";

import { Prisma } from "@prisma/client";
import { revalidatePath } from "next/cache";
import { prisma } from "@/lib/prisma";
import { requireAdmin } from "@/lib/auth/require-admin";
import {
  trainingRecordSchema,
  type CreateRecordState,
} from "@/lib/records/validation";

export async function createTrainingRecord(
  _previousState: CreateRecordState,
  formData: FormData,
): Promise<CreateRecordState> {
  const adminId = await requireAdmin();
  const parsed = trainingRecordSchema.safeParse({
    submissionKey: formData.get("submissionKey"),
    date: formData.get("date"),
    trainer: formData.get("trainer"),
    subject: formData.get("subject"),
    topic: formData.get("topic"),
    colabUrl: formData.get("colabUrl"),
    videoUrl: formData.get("videoUrl"),
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
        videoUrl: errors.videoUrl?.[0],
        datasetUrl: errors.datasetUrl?.[0],
        notes: errors.notes?.[0],
      },
    };
  }

  const record = parsed.data;
  try {
    await prisma.trainingRecord.create({
      data: {
        submissionKey: record.submissionKey,
        date: new Date(`${record.date}T00:00:00.000Z`),
        trainer: record.trainer,
        subject: record.subject,
        topic: record.topic,
        colabUrl: record.colabUrl,
        videoUrl: record.videoUrl,
        datasetUrl: record.datasetUrl,
        notes: record.notes,
        createdById: adminId,
      },
    });
  } catch (error) {
    if (
      error instanceof Prisma.PrismaClientKnownRequestError &&
      error.code === "P2002"
    ) {
      const existingRecord = await prisma.trainingRecord.findUnique({
        where: { submissionKey: record.submissionKey },
        select: { id: true },
      });

      if (existingRecord) {
        return {
          status: "success",
          message: "This training record was already saved.",
        };
      }
    }

    if (
      error instanceof Prisma.PrismaClientInitializationError ||
      error instanceof Prisma.PrismaClientKnownRequestError
    ) {
      console.error("Training record persistence failed.", error);
      return {
        status: "error",
        message:
          "The record could not be saved. Please try again later; no changes were made.",
      };
    }

    throw error;
  }

  revalidatePath("/");
  revalidatePath("/admin");

  return {
    status: "success",
    message: "Training record saved and published.",
  };
}
