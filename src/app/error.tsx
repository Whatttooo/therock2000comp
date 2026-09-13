"use client";

import { Button } from "@/components/ui/button";

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <div className="flex min-h-[60vh] w-full flex-col items-center justify-center gap-4 p-8 text-center">
      <h1 className="text-2xl md:text-3xl">Something went wrong</h1>
      <p className="text-muted-foreground">
        Please try again, or come back later.
      </p>
      <Button onClick={reset}>Try again</Button>
    </div>
  );
}
