"use client";

import Link from "next/link";
import { Button, ButtonProps } from "@/components/ui/button";
import { Trophy } from "lucide-react";
import { useSubmissionStatus } from "@/hooks/use-submission-status";
import { Skeleton } from "@/components/ui/skeleton";
import { cn } from "@/lib/utils";

interface ChallengeButtonProps extends ButtonProps {
  className?: string;
  variant?:
    | "default"
    | "destructive"
    | "outline"
    | "secondary"
    | "ghost"
    | "link";
  fullWidth?: boolean;
  showIcon?: boolean;
  size?: "default" | "sm" | "lg" | "icon";
  mobile?: boolean;
}

export function ChallengeButton({
  className,
  variant = "outline",
  fullWidth = false,
  showIcon = true,
  size = "default",
  mobile = false,
  ...props
}: ChallengeButtonProps) {
  const { isOpen, isLoading } = useSubmissionStatus();

  if (!isLoading && !isOpen) return null;

  if (isLoading) {
    return (
      <Skeleton
        className={cn("h-10 w-32", mobile && "w-full sm:w-auto", className)}
      />
    );
  }

  return (
    <Link href="/challenge" className={cn(mobile ? "w-full sm:w-auto" : "")}>
      <Button
        variant={variant}
        size={size}
        className={cn(
          "text-secondary border-secondary hover:bg-secondary/10 hover:text-secondary",
          (fullWidth || mobile) && "w-full sm:w-auto",
          className
        )}
        {...props}
      >
        {showIcon && <Trophy className="h-4 w-4 mr-2" />}
        View Challenge
      </Button>
    </Link>
  );
}
