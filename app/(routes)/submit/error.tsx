"use client";

import { Button } from "@/components/ui/button";
import { AlertCircle } from "lucide-react";
import Link from "next/link";

export default function ErrorComponent({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="bg-white rounded-lg shadow-lg p-8 max-w-md w-full text-center">
        <AlertCircle className="h-16 w-16 mx-auto text-red-500 mb-4" />
        <h2 className="text-2xl font-bold text-primary mb-2">
          Something went wrong
        </h2>
        <p className="text-muted-foreground mb-6">
          {error.message ||
            "An unexpected error occurred. Please try again later."}
        </p>
        <div className="flex flex-col space-y-2 sm:flex-row sm:space-y-0 sm:space-x-2 justify-center">
          <Button onClick={reset} variant="outline">
            Try Again
          </Button>
          <Link href="/">
            <Button className="w-full sm:w-auto">Return to Home</Button>
          </Link>
        </div>
      </div>
    </div>
  );
}
