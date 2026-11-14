import Link from "next/link";
import { Search } from "lucide-react";
import { Button } from "@/components/ui/button";
import type { RecordFilters } from "@/lib/record-filters";

type RecordFiltersFormProps = {
  filters: RecordFilters;
  trainers: string[];
  subjects: string[];
};

const fieldClassName =
  "h-10 w-full rounded-md border border-input bg-background px-3 text-sm shadow-xs outline-none transition focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/40";

export function RecordFiltersForm({
  filters,
  trainers,
  subjects,
}: RecordFiltersFormProps) {
  return (
    <form
      action="/"
      method="get"
      aria-label="Filter training records"
      className="grid gap-4 rounded-xl border bg-card p-4 shadow-sm md:grid-cols-2 xl:grid-cols-6"
    >
      <label className="grid gap-1.5 text-sm font-medium xl:col-span-2">
        Search
        <input
          className={fieldClassName}
          type="search"
          name="q"
          maxLength={120}
          placeholder="Trainer, subject, or topic"
          defaultValue={filters.q}
        />
      </label>
      <label className="grid gap-1.5 text-sm font-medium">
        Trainer
        <select
          className={fieldClassName}
          name="trainer"
          defaultValue={filters.trainer}
        >
          <option value="">All trainers</option>
          {trainers.map((trainer) => (
            <option key={trainer} value={trainer}>
              {trainer}
            </option>
          ))}
        </select>
      </label>
      <label className="grid gap-1.5 text-sm font-medium">
        Subject
        <select
          className={fieldClassName}
          name="subject"
          defaultValue={filters.subject}
        >
          <option value="">All subjects</option>
          {subjects.map((subject) => (
            <option key={subject} value={subject}>
              {subject}
            </option>
          ))}
        </select>
      </label>
      <label className="grid gap-1.5 text-sm font-medium">
        From
        <input
          className={fieldClassName}
          type="date"
          name="from"
          defaultValue={filters.from}
        />
      </label>
      <label className="grid gap-1.5 text-sm font-medium">
        To
        <input
          className={fieldClassName}
          type="date"
          name="to"
          defaultValue={filters.to}
        />
      </label>
      <div className="flex items-center gap-2 md:col-span-2 xl:col-span-6">
        <Button type="submit">
          <Search aria-hidden="true" />
          Search records
        </Button>
        <Link
          href="/"
          className="inline-flex h-9 items-center rounded-md px-3 text-sm font-medium text-muted-foreground transition hover:bg-muted hover:text-foreground"
        >
          Clear filters
        </Link>
      </div>
    </form>
  );
}
