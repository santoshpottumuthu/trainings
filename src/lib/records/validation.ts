import { z } from "zod";
import { asSafeHttpsUrl } from "@/lib/urls";

const httpsUrl = z
  .string()
  .trim()
  .min(1)
  .max(2048)
  .url()
  .refine((value) => asSafeHttpsUrl(value) !== null, {
    message: "Enter a valid HTTPS URL.",
  });

const trainingRecordFields = {
  date: z.iso.date(),
  trainer: z.string().trim().min(1).max(100),
  subject: z.string().trim().min(1).max(100),
  topic: z.string().trim().min(1).max(200),
  colabUrl: httpsUrl,
  videoUrl: z.preprocess(
    (value) => (value === "" || value === null ? undefined : value),
    httpsUrl.optional(),
  ),
  datasetUrl: z.preprocess(
    (value) => (value === "" || value === null ? undefined : value),
    httpsUrl.optional(),
  ),
  notes: z.preprocess(
    (value) => (value === "" || value === null ? undefined : value),
    z.string().trim().max(5000).optional(),
  ),
};

export const trainingRecordFieldsSchema = z.object(trainingRecordFields);
export const trainingRecordSchema = trainingRecordFieldsSchema.extend({
  submissionKey: z.string().uuid(),
});

export type TrainingRecordInput = z.infer<typeof trainingRecordSchema>;
export type TrainingRecordFieldsInput = z.infer<
  typeof trainingRecordFieldsSchema
>;

export type RecordFieldErrors = Partial<
  Record<
    | "date"
    | "trainer"
    | "subject"
    | "topic"
    | "colabUrl"
    | "videoUrl"
    | "datasetUrl"
    | "notes",
    string
  >
>;

export type RecordActionState =
  | {
      status: "error" | "success";
      message: string;
      fieldErrors?: RecordFieldErrors;
    }
  | null;

export type CreateRecordState = RecordActionState;
