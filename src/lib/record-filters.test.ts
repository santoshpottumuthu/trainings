import { describe, expect, it } from "vitest";
import {
  buildPageHref,
  buildRecordWhere,
  parseRecordFilters,
} from "./record-filters";

describe("parseRecordFilters", () => {
  it("accepts an unfiltered request with optional dates omitted", () => {
    const result = parseRecordFilters({});

    expect(result.success).toBe(true);
    if (result.success) {
      expect(result.data.page).toBe(1);
      expect(result.data.from).toBeUndefined();
      expect(result.data.to).toBeUndefined();
    }
  });

  it("rejects invalid and reversed date ranges", () => {
    expect(parseRecordFilters({ from: "2025-02-30" }).success).toBe(false);
    expect(
      parseRecordFilters({ from: "2025-06-02", to: "2025-06-01" }).success,
    ).toBe(false);
  });

  it("uses the first value for repeated query parameters", () => {
    const result = parseRecordFilters({ q: ["first", "second"] });

    expect(result.success).toBe(true);
    if (result.success) {
      expect(result.data.q).toBe("first");
    }
  });
});

describe("buildRecordWhere", () => {
  it("combines text, exact filters, and inclusive date bounds", () => {
    const where = buildRecordWhere({
      q: "Prisma",
      trainer: "Ada",
      subject: "Databases",
      from: "2025-01-01",
      to: "2025-01-31",
      page: 1,
    });

    expect(where.OR).toHaveLength(3);
    expect(where.trainer).toBe("Ada");
    expect(where.subject).toBe("Databases");
    expect(where.date).toEqual({
      gte: new Date("2025-01-01T00:00:00.000Z"),
      lte: new Date("2025-01-31T00:00:00.000Z"),
    });
  });
});

describe("buildPageHref", () => {
  it("preserves active filters and encodes values while changing pages", () => {
    const href = buildPageHref(
      {
        q: "data & models",
        trainer: "Ada",
        subject: "",
        from: undefined,
        to: undefined,
        page: 1,
      },
      2,
    );

    expect(href).toBe("/?q=data+%26+models&trainer=Ada&page=2");
  });
});
