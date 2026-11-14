"use client";

import { useEffect } from "react";
import { Button } from "@/components/ui/button";

export default function ErrorPage({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error("Training records page failed to load.", error);
  }, [error]);

  return (
    <main className="mx-auto flex min-h-[60vh] w-full max-w-3xl flex-col items-center justify-center px-6 text-center">
      <p className="text-sm font-semibold uppercase tracking-[0.18em] text-muted-foreground">
        Something went wrong
      </p>
      <h1 className="mt-3 text-3xl font-semibold tracking-tight">
        Training records are unavailable
      </h1>
      <p className="mt-3 max-w-lg text-muted-foreground">
        We couldn&apos;t load the records just now. Please try again in a moment.
      </p>
      <Button className="mt-6" onClick={() => reset()}>
        Try again
      </Button>
    </main>
  );
}
