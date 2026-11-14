import { describe, expect, it } from "vitest";
import { trainingRecordSchema } from "./validation";

const validInput = {
  submissionKey: "0b4a1f98-86d4-4db4-b0f2-4c54b14b752a",
  date: "2026-03-08",
  trainer: "Ada Lovelace",
  subject: "Data engineering",
  topic: "Building a reliable pipeline",
  colabUrl: "https://colab.research.google.com/drive/example",
  datasetUrl: "",
  notes: "",
};

describe("trainingRecordSchema", () => {
  it("accepts required fields and normalizes blank optional fields", () => {
    const result = trainingRecordSchema.safeParse(validInput);

    expect(result.success).toBe(true);
    if (result.success) {
      expect(result.data.datasetUrl).toBeUndefined();
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
});
