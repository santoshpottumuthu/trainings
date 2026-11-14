"use client";

import Link from "next/link";
import { useActionState } from "react";
import { useFormStatus } from "react-dom";
import { Button } from "@/components/ui/button";
import type {
  CreateRecordState,
  RecordFieldErrors,
} from "@/lib/records/validation";
import { createTrainingRecord } from "./actions";

const initialState: CreateRecordState = null;
const fieldClassName =
  "h-10 w-full rounded-md border border-input bg-background px-3 text-sm shadow-xs outline-none transition focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/40";

function FieldError({ message, id }: { message?: string; id: string }) {
  return message ? (
    <p id={id} className="text-sm text-destructive">
      {message}
    </p>
  ) : null;
}

function SubmitButton() {
  const { pending } = useFormStatus();

  return (
    <Button type="submit" disabled={pending}>
      {pending ? "Saving..." : "Save training record"}
    </Button>
  );
}

function fieldProps(errors: RecordFieldErrors | undefined, field: keyof RecordFieldErrors) {
  const message = errors?.[field];
  return {
    "aria-invalid": Boolean(message),
    "aria-describedby": message ? `${field}-error` : undefined,
  };
}

export function RecordForm({ submissionKey }: { submissionKey: string }) {
  const [state, formAction] = useActionState(createTrainingRecord, initialState);
  const errors = state?.fieldErrors;

  return (
    <form action={formAction} className="grid gap-5">
      <input type="hidden" name="submissionKey" value={submissionKey} />

      {state?.message ? (
        <p
          role={state.status === "error" ? "alert" : "status"}
          className={
            state.status === "error"
              ? "rounded-md border border-destructive/30 bg-destructive/5 px-3 py-2 text-sm text-destructive"
              : "rounded-md border border-primary/30 bg-primary/5 px-3 py-2 text-sm text-foreground"
          }
        >
          {state.message}
        </p>
      ) : null}

      <label className="grid gap-1.5 text-sm font-medium">
        Training date <span className="text-destructive">*</span>
        <input
          className={fieldClassName}
          type="date"
          name="date"
          required
          {...fieldProps(errors, "date")}
        />
        <FieldError id="date-error" message={errors?.date} />
      </label>

      <div className="grid gap-5 sm:grid-cols-2">
        <label className="grid gap-1.5 text-sm font-medium">
          Trainer <span className="text-destructive">*</span>
          <input
            className={fieldClassName}
            name="trainer"
            type="text"
            maxLength={100}
            required
            {...fieldProps(errors, "trainer")}
          />
          <FieldError id="trainer-error" message={errors?.trainer} />
        </label>
        <label className="grid gap-1.5 text-sm font-medium">
          Subject <span className="text-destructive">*</span>
          <input
            className={fieldClassName}
            name="subject"
            type="text"
            maxLength={100}
            required
            {...fieldProps(errors, "subject")}
          />
          <FieldError id="subject-error" message={errors?.subject} />
        </label>
      </div>

      <label className="grid gap-1.5 text-sm font-medium">
        Topic <span className="text-destructive">*</span>
        <input
          className={fieldClassName}
          name="topic"
          type="text"
          maxLength={200}
          required
          {...fieldProps(errors, "topic")}
        />
        <FieldError id="topic-error" message={errors?.topic} />
      </label>

      <label className="grid gap-1.5 text-sm font-medium">
        Google Colab link <span className="text-destructive">*</span>
        <input
          className={fieldClassName}
          name="colabUrl"
          type="url"
          inputMode="url"
          maxLength={2048}
          placeholder="https://colab.research.google.com/..."
          required
          {...fieldProps(errors, "colabUrl")}
        />
        <FieldError id="colabUrl-error" message={errors?.colabUrl} />
      </label>

      <label className="grid gap-1.5 text-sm font-medium">
        Dataset link <span className="font-normal text-muted-foreground">(optional)</span>
        <input
          className={fieldClassName}
          name="datasetUrl"
          type="url"
          inputMode="url"
          maxLength={2048}
          placeholder="https://..."
          {...fieldProps(errors, "datasetUrl")}
        />
        <FieldError id="datasetUrl-error" message={errors?.datasetUrl} />
      </label>

      <label className="grid gap-1.5 text-sm font-medium">
        Additional notes <span className="font-normal text-muted-foreground">(optional)</span>
        <textarea
          className="min-h-28 w-full rounded-md border border-input bg-background px-3 py-2 text-sm shadow-xs outline-none transition focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/40"
          name="notes"
          maxLength={5000}
          {...fieldProps(errors, "notes")}
        />
        <FieldError id="notes-error" message={errors?.notes} />
      </label>

      <div className="flex flex-wrap items-center gap-3">
        <SubmitButton />
        <Link
          href="/admin"
          className="inline-flex h-9 items-center rounded-md px-3 text-sm font-medium text-muted-foreground transition hover:bg-muted hover:text-foreground"
        >
          Cancel
        </Link>
        {state?.status === "success" ? (
          <Link
            href="/admin/records/new"
            className="text-sm font-medium text-primary underline-offset-4 hover:underline"
          >
            Add another record
          </Link>
        ) : null}
      </div>
    </form>
  );
}
