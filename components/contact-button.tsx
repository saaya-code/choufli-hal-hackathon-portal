"use client";

import { Button } from "@/components/ui/button";

export function ContactButton() {
  return (
    <Button
      size="lg"
      variant="outline"
      className="text-primary hover:bg-primary/10 hover:text-primary"
      onClick={() => {
        document
          .getElementById("contact")
          ?.scrollIntoView({ behavior: "smooth" });
      }}
    >
      Contact Us
    </Button>
  );
}
