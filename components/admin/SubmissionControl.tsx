"use client";

import { useState, useEffect } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import { Loader2, AlertTriangle, CheckCircle } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Switch } from "@/components/ui/switch";

export function SubmissionControl() {
  const [submissionOpen, setSubmissionOpen] = useState(false);
  const [lastUpdated, setLastUpdated] = useState<Date | null>(null);
  const [openedAt, setOpenedAt] = useState<Date | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isUpdating, setIsUpdating] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { toast } = useToast();

  useEffect(() => {
    fetchSubmissionStatus();
  }, []);

  const fetchSubmissionStatus = async () => {
    try {
      setIsLoading(true);
      const response = await fetch("/api/admin/submission-status");
      if (!response.ok) throw new Error("Failed to fetch submission status");

      const data = await response.json();
      setSubmissionOpen(data.submissionOpen);
      setLastUpdated(data.lastUpdatedAt ? new Date(data.lastUpdatedAt) : null);
      setOpenedAt(data.openedAt ? new Date(data.openedAt) : null);
      setError(null);
    } catch (err) {
      setError("Failed to load submission status");
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  const toggleSubmissionStatus = async () => {
    try {
      setIsUpdating(true);
      const newStatus = !submissionOpen;

      const response = await fetch("/api/admin/submission-status", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ open: newStatus }),
      });

      if (!response.ok) throw new Error("Failed to update submission status");

      const data = await response.json();
      setSubmissionOpen(data.submissionOpen);
      setLastUpdated(data.lastUpdatedAt ? new Date(data.lastUpdatedAt) : null);

      if (data.submissionOpen) {
        setOpenedAt(data.openedAt ? new Date(data.openedAt) : null);
      }

      toast({
        title: "Success",
        description: `Submissions are now ${newStatus ? "open" : "closed"}.`,
      });
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
    } catch (err) {
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to update submission status.",
      });
    } finally {
      setIsUpdating(false);
    }
  };

  const formatDateTime = (date: Date | null) => {
    if (!date) return "N/A";
    return new Intl.DateTimeFormat("en-US", {
      dateStyle: "medium",
      timeStyle: "short",
    }).format(date);
  };

  if (isLoading) {
    return (
      <Card className="w-full mb-6">
        <CardHeader>
          <CardTitle className="flex items-center">
            <Loader2 className="h-4 w-4 mr-2 animate-spin" />
            Loading Submission Control
          </CardTitle>
        </CardHeader>
        <CardContent className="h-28 flex items-center justify-center">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
        </CardContent>
      </Card>
    );
  }

  if (error) {
    return (
      <Alert variant="destructive" className="mb-6">
        <AlertTriangle className="h-4 w-4" />
        <AlertTitle>Error</AlertTitle>
        <AlertDescription>
          {error}. Please refresh the page or contact support.
        </AlertDescription>
      </Alert>
    );
  }

  return (
    <Card className="w-full mb-6">
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle>Submission Control</CardTitle>
            <CardDescription>
              Toggle submission availability for teams
            </CardDescription>
          </div>
          <Badge
            className={submissionOpen ? "bg-green-600" : "bg-red-600"}
            variant="default"
          >
            {submissionOpen ? "OPEN" : "CLOSED"}
          </Badge>
        </div>
      </CardHeader>
      <CardContent>
        <div className="flex flex-col space-y-4">
          <div className="flex items-center space-x-2">
            <Switch
              checked={submissionOpen}
              onCheckedChange={toggleSubmissionStatus}
              disabled={isUpdating}
              id="submission-toggle"
            />
            <Label htmlFor="submission-toggle">
              {isUpdating ? (
                <div className="flex items-center">
                  <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                  Updating...
                </div>
              ) : submissionOpen ? (
                <div className="flex items-center">
                  <CheckCircle className="h-4 w-4 mr-2 text-green-600" />
                  Submissions are currently open
                </div>
              ) : (
                <div className="flex items-center">
                  <AlertTriangle className="h-4 w-4 mr-2 text-amber-500" />
                  Submissions are currently closed
                </div>
              )}
            </Label>
          </div>

          <div className="pt-2 text-sm text-muted-foreground">
            {submissionOpen && openedAt && (
              <div className="text-green-600">
                <p>
                  <strong>Opened At:</strong> {formatDateTime(openedAt)}
                </p>
              </div>
            )}
            {lastUpdated && (
              <p>
                <strong>Last Updated:</strong> {formatDateTime(lastUpdated)}
              </p>
            )}
          </div>

          <div className="pt-2">
            <Button
              variant="outline"
              size="sm"
              onClick={fetchSubmissionStatus}
              disabled={isLoading || isUpdating}
            >
              Refresh Status
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
