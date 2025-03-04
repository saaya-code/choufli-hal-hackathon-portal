"use client";

import { useEffect, useState } from "react";

export function useSubmissionStatus() {
  const [isOpen, setIsOpen] = useState<boolean | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [message, setMessage] = useState<string>("");

  useEffect(() => {
    async function checkSubmissionStatus() {
      try {
        setIsLoading(true);
        const response = await fetch("/api/submission-status");
        if (!response.ok) {
          throw new Error("Failed to fetch submission status");
        }

        const data = await response.json();
        setIsOpen(data.submissionOpen);
        setMessage(data.message || "");
      } catch (err) {
        console.error("Error checking submission status:", err);
        setError("Unable to determine submission status");
        setIsOpen(false);
      } finally {
        setIsLoading(false);
      }
    }

    checkSubmissionStatus();
  }, []);

  return { isOpen, isLoading, error, message };
}