"use client";

import { Button } from "@/components/ui/button";
import { Users } from "lucide-react";

export function ContactButton() {
  return (
    <Button
      variant="secondary"
      size="lg"
      className="text-primary w-full sm:w-auto"
      onClick={() => {
        document
          .getElementById("contact")
          ?.scrollIntoView({ behavior: "smooth" });
      }}
    >
      <Users className="h-6 w-6 mr-2" />
      Contact Us
    </Button>
  );
}
