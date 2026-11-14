"use client";

import { useActionState } from "react";
import { Button } from "@/components/ui/button";
import { authenticate } from "./actions";

const initialState: string | null = null;
const fieldClassName =
  "h-10 w-full rounded-md border border-input bg-background px-3 text-sm shadow-xs outline-none transition focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/40";

export function LoginForm() {
  const [message, formAction, isPending] = useActionState(
    authenticate,
    initialState,
  );

  return (
    <form action={formAction} className="grid gap-5">
      <label className="grid gap-1.5 text-sm font-medium">
        Email or username
        <input
          className={fieldClassName}
          name="username"
          type="text"
          autoComplete="username"
          maxLength={254}
          required
        />
      </label>
      <label className="grid gap-1.5 text-sm font-medium">
        Password
        <input
          className={fieldClassName}
          name="password"
          type="password"
          autoComplete="current-password"
          maxLength={72}
          required
        />
      </label>
      {message ? (
        <p role="alert" className="text-sm text-destructive">
          {message}
        </p>
      ) : null}
      <Button type="submit" disabled={isPending}>
        {isPending ? "Signing in..." : "Sign in"}
      </Button>
    </form>
  );
}
