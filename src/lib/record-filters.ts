import { Prisma } from "@prisma/client";
import { z } from "zod";

const dateFilter = z.preprocess(
  (value) => (value === "" ? undefined : value),
  z.iso.date().optional(),
);

const recordFiltersSchema = z
  .object({
    q: z.string().trim().max(120).optional(),
    trainer: z.string().trim().max(100).optional(),
    subject: z.string().trim().max(100).optional(),
    from: dateFilter,
    to: dateFilter,
    page: z.coerce.number().int().min(1).catch(1),
  })
  .superRefine(({ from, to }, context) => {
    if (from && to && from > to) {
      context.addIssue({
        code: "custom",
        path: ["to"],
        message: "The end date must be on or after the start date.",
      });
    }
  });

export type RecordFilters = z.infer<typeof recordFiltersSchema>;

export const DEFAULT_RECORD_FILTERS: RecordFilters = {
  q: "",
  trainer: "",
  subject: "",
  from: undefined,
  to: undefined,
  page: 1,
};

function firstValue(value: string | string[] | undefined) {
  return Array.isArray(value) ? value[0] : value;
}

export function parseRecordFilters(
  searchParams: Record<string, string | string[] | undefined>,
) {
  return recordFiltersSchema.safeParse({
    q: firstValue(searchParams.q),
    trainer: firstValue(searchParams.trainer),
    subject: firstValue(searchParams.subject),
    from: firstValue(searchParams.from),
    to: firstValue(searchParams.to),
    page: firstValue(searchParams.page),
  });
}

export function buildRecordWhere(
  filters: RecordFilters,
): Prisma.TrainingRecordWhereInput {
  const where: Prisma.TrainingRecordWhereInput = {};

  if (filters.q) {
    where.OR = [
      { trainer: { contains: filters.q, mode: "insensitive" } },
      { subject: { contains: filters.q, mode: "insensitive" } },
      { topic: { contains: filters.q, mode: "insensitive" } },
    ];
  }

  if (filters.trainer) {
    where.trainer = filters.trainer;
  }

  if (filters.subject) {
    where.subject = filters.subject;
  }

  if (filters.from || filters.to) {
    where.date = {
      ...(filters.from
        ? { gte: new Date(`${filters.from}T00:00:00.000Z`) }
        : {}),
      ...(filters.to
        ? { lte: new Date(`${filters.to}T00:00:00.000Z`) }
        : {}),
    };
  }

  return where;
}

export function buildPageHref(filters: RecordFilters, page: number) {
  const params = new URLSearchParams();

  if (filters.q) params.set("q", filters.q);
  if (filters.trainer) params.set("trainer", filters.trainer);
  if (filters.subject) params.set("subject", filters.subject);
  if (filters.from) params.set("from", filters.from);
  if (filters.to) params.set("to", filters.to);
  params.set("page", String(page));

  return `/?${params.toString()}`;
}
