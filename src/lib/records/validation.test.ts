import { describe, expect, it } from "vitest";
import {
  trainingRecordFieldsSchema,
  trainingRecordSchema,
} from "./validation";

const validRecordFields = {
  date: "2026-03-08",
  trainer: "Ada Lovelace",
  subject: "Data engineering",
  topic: "Building a reliable pipeline",
  colabUrl: "https://colab.research.google.com/drive/example",
  videoUrl: "",
  datasetUrl: "",
  notes: "",
};
const validInput = {
  submissionKey: "0b4a1f98-86d4-4db4-b0f2-4c54b14b752a",
  ...validRecordFields,
};

describe("trainingRecordSchema", () => {
  it("accepts required fields and normalizes blank optional fields", () => {
    const result = trainingRecordSchema.safeParse(validInput);

    expect(result.success).toBe(true);
    if (result.success) {
      expect(result.data.datasetUrl).toBeUndefined();
      expect(result.data.videoUrl).toBeUndefined();
      expect(result.data.notes).toBeUndefined();
    }
  });

  it("rejects missing required fields and non-HTTPS URLs", () => {
    expect(
      trainingRecordSchema.safeParse({
        ...validInput,
        topic: " ",
        colabUrl: "http://example.com/notebook",
      }).success,
    ).toBe(false);
  });

  it("rejects HTTPS URLs containing embedded credentials", () => {
    expect(
      trainingRecordSchema.safeParse({
        ...validInput,
        datasetUrl: "https://user:password@example.com/data",
      }).success,
    ).toBe(false);
  });

  it("accepts a blank optional video URL and rejects non-HTTPS URLs", () => {
    expect(trainingRecordFieldsSchema.safeParse(validRecordFields).success).toBe(
      true,
    );
    expect(
      trainingRecordFieldsSchema.safeParse({
        ...validRecordFields,
        videoUrl: "http://example.com/video",
      }).success,
    ).toBe(false);
  });
});

describe("trainingRecordFieldsSchema", () => {
  it("accepts valid record fields without a create-only submission key", () => {
    expect(trainingRecordFieldsSchema.safeParse(validRecordFields).success).toBe(
      true,
    );
  });

  it("rejects invalid URLs when validating updated record fields", () => {
    expect(
      trainingRecordFieldsSchema.safeParse({
        ...validRecordFields,
        colabUrl: "http://example.com/notebook",
      }).success,
    ).toBe(false);
  });
});
