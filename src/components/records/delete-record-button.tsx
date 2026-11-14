"use client";

import { useActionState, type FormEvent } from "react";
import { useFormStatus } from "react-dom";
import { Button } from "@/components/ui/button";
import {
  deleteTrainingRecord,
  type DeleteRecordState,
} from "@/app/admin/(protected)/records/[id]/edit/actions";

function DeleteButton() {
  const { pending } = useFormStatus();

  return (
    <Button type="submit" variant="destructive" disabled={pending}>
      {pending ? "Deleting..." : "Delete"}
    </Button>
  );
}

export function DeleteRecordButton({
  recordId,
  recordLabel,
}: {
  recordId: string;
  recordLabel: string;
}) {
  const [state, formAction] = useActionState<DeleteRecordState, FormData>(
    deleteTrainingRecord,
    null,
  );

  function confirmDelete(event: FormEvent<HTMLFormElement>) {
    if (!window.confirm(`Delete "${recordLabel}"? This cannot be undone.`)) {
      event.preventDefault();
    }
  }

  return (
    <form action={formAction} onSubmit={confirmDelete} className="grid gap-1">
      <input type="hidden" name="recordId" value={recordId} />
      <DeleteButton />
      {state?.message ? (
        <p role="alert" className="text-xs text-destructive">
          {state.message}
        </p>
      ) : null}
    </form>
  );
}
