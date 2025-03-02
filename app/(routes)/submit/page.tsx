"use client";

import { useState, useEffect, useActionState, useRef } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import * as z from "zod";
import { useToast } from "@/hooks/use-toast";
import { Toaster } from "@/components/ui/toaster";
import {
  ChevronLeft,
  Loader2,
  Upload,
  FileText,
  CheckCircle2,
  AlertCircle,
  Search,
  FileCheck,
} from "lucide-react";
import Link from "next/link";
import Image from "next/image";
import { submitProject } from "@/app/actions/submissionActions";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { useQuery } from "@tanstack/react-query";

const formSchema = z
  .object({
    teamId: z.string(),
    githubUrl: z
      .string()
      .url("Please enter a valid URL")
      .optional()
      .or(z.literal("")),
    deployedUrl: z
      .string()
      .url("Please enter a valid URL")
      .optional()
      .or(z.literal("")),
    presentationUrl: z
      .string()
      .url("Please enter a valid URL")
      .optional()
      .or(z.literal("")),
  })
  .refine(
    (data) => {
      return data.githubUrl || data.deployedUrl || data.presentationUrl;
    },
    {
      message: "You must provide at least one URL or upload a file",
    }
  );

const teamIdSchema = z.object({
  teamId: z.string().min(1, "Team ID is required"),
});

const initialState = {
  message: "",
  error: "",
};

const fetchSubmissionCount = async () => {
  const response = await fetch("/api/submission-count");
  if (!response.ok) {
    throw new Error("Failed to fetch submission count");
  }
  return response.json();
};

export default function SubmitPage() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const { toast } = useToast();
  const teamId = searchParams?.get("teamId");
  const [file, setFile] = useState<File | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [isSubmissionActive, setIsSubmissionActive] = useState<boolean>(true);
  const [submissionStatus, setSubmissionStatus] = useState<{
    status: string;
    message: string;
  }>({ status: "loading", message: "Checking submission period..." });
  const [isTeamIdDialogOpen, setIsTeamIdDialogOpen] = useState(false);
  const [isLoadingTeam, setIsLoadingTeam] = useState(false);
  const [teamIdError, setTeamIdError] = useState<string | null>(null);

  const [state, formAction, pending] = useActionState(
    submitProject,
    initialState
  );

  // Add submission count query
  const {
    data: submissionCountData,
  } = useQuery({
    queryKey: ["submissionsCount"],
    queryFn: fetchSubmissionCount,
    refetchInterval: 60000,
  });

  const submissionCount = submissionCountData?.count || 0;

  const teamIdForm = useForm<z.infer<typeof teamIdSchema>>({
    resolver: zodResolver(teamIdSchema),
    defaultValues: {
      teamId: "",
    },
  });

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      teamId: teamId || "",
      githubUrl: "",
      deployedUrl: "",
      presentationUrl: "",
    },
    context: { hasFile: Boolean(file) },
  });

  const watchedValues = form.watch();

  useEffect(() => {
    if (!teamId) {
      setIsTeamIdDialogOpen(true);
    } else {
      form.setValue("teamId", teamId);
    }
  }, [teamId, form]);

  useEffect(() => {
    if (file) {
      form.clearErrors();
    } else {
      const { githubUrl, deployedUrl, presentationUrl } = form.getValues();
      if (!githubUrl && !deployedUrl && !presentationUrl) {
        form.trigger();
      }
    }
  }, [file, form]);

  useEffect(() => {
    async function checkSubmissionStatus() {
      try {
        const response = await fetch("/api/submission-status");
        if (!response.ok) {
          throw new Error("Failed to fetch submission status");
        }

        const data = await response.json();
        setIsSubmissionActive(data.submissionOpen);
        setSubmissionStatus({
          status: data.submissionOpen ? "active" : "closed",
          message: data.submissionOpen
            ? "Submission period is currently open. Submit your project now!"
            : "Submission period is currently closed. Please check back later.",
        });
      } catch (error) {
        console.error("Error checking submission status:", error);
        setIsSubmissionActive(false);
        setSubmissionStatus({
          status: "error",
          message:
            "Unable to determine submission status. Please try again later.",
        });
      }
    }

    checkSubmissionStatus();
  }, []);

  useEffect(() => {
    if (state?.message && !state.error) {
      toast({
        title: "Success!",
        description: state.message,
      });
      setFile(null);
    }

    if (state?.error) {
      toast({
        variant: "destructive",
        title: "Error",
        description: state.error,
      });
    }
  }, [state, toast]);

  const validateTeamId = async (teamId: string) => {
    setIsLoadingTeam(true);
    setTeamIdError(null);

    try {
      const response = await fetch(`/api/team/${teamId}`);

      if (!response.ok) {
        const data = await response.json();
        setTeamIdError(data.error || "Team not found");
        return false;
      }

      return true;
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
    } catch (error) {
      setTeamIdError("Failed to validate team ID");
      return false;
    } finally {
      setIsLoadingTeam(false);
    }
  };

  const handleTeamIdSubmit = async (data: z.infer<typeof teamIdSchema>) => {
    const isValid = await validateTeamId(data.teamId);

    if (isValid) {
      const currentUrl = new URL(window.location.href);
      currentUrl.searchParams.set("teamId", data.teamId);
      router.push(currentUrl.pathname + currentUrl.search);
      setIsTeamIdDialogOpen(false);
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      if (e.target.files[0].size > 30 * 1024 * 1024) {
        toast({
          variant: "destructive",
          title: "File too large",
          description: "File size exceeds 30MB limit",
        });
        return;
      }
      setFile(e.target.files[0]);
    }
  };

  const handleFileRemove = () => {
    setFile(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  async function onSubmit(
    values: z.infer<typeof formSchema>,
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    formData: FormData
  ) {
    const { githubUrl, deployedUrl, presentationUrl } = values;
    if (!githubUrl && !deployedUrl && !presentationUrl && !file) {
      toast({
        variant: "destructive",
        title: "Submission Error",
        description: "Please provide at least one URL or upload a project file",
      });
      return;
    }

    const submitFormData = new FormData();

    Object.entries(values).forEach(([key, value]) => {
      if (value) submitFormData.append(key, value);
    });

    if (file) {
      submitFormData.append("file", file);
    }

    return formAction(submitFormData);
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-primary/10 to-background py-20">
      <div className="container max-w-2xl relative">
        <Link href="/" className="absolute -top-10 left-0">
          <Button variant="ghost" className="text-primary hover:bg-primary/10">
            <ChevronLeft className="mr-2 h-4 w-4" />
            Back to Home
          </Button>
        </Link>

        <div className="text-center mb-12 relative">
          <div className="relative w-48 h-48 mx-auto mb-8">
            <Image
              src="/logo.png"
              alt="Choufli Hal Bootcamp 2.0"
              fill
              className="object-contain"
            />
          </div>
          <h1 className="text-4xl font-bold text-primary mb-2">
            Submit Your Project
          </h1>
          <p className="text-muted-foreground">
            Share your creation with the world
          </p>

          {/* Submission count badge */}
          <div className="mt-4 inline-flex items-center bg-primary/10 px-4 py-2 rounded-full">
            <FileCheck className="h-4 w-4 text-primary mr-2" />
            <span className="text-sm">
              <strong className="text-primary">{submissionCount}</strong> teams
              have submitted their projects
            </span>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-lg p-8">
          {!isSubmissionActive ? (
            <div className="text-center p-8">
              <AlertCircle className="h-16 w-16 mx-auto text-amber-500 mb-4" />
              <h2 className="text-2xl font-bold text-primary mb-4">
                Submission{" "}
                {submissionStatus.status === "not_started"
                  ? "Not Started Yet"
                  : "Closed"}
              </h2>
              <p className="text-muted-foreground mb-6">
                {submissionStatus.message}
              </p>
              <Link href="/">
                <Button>Return to Home</Button>
              </Link>
            </div>
          ) : (
            <Form {...form}>
              <form
                action={(formData) => onSubmit(form.getValues(), formData)}
                className="space-y-8"
                encType="multipart/form-data"
              >
                <div className="bg-amber-50 border-l-4 border-amber-500 p-4 rounded-md">
                  <p className="text-amber-800">
                    <strong>Note:</strong> Submission period is open from March
                    5, 2025 00:00 to March 6, 2025 00:00. You can update your
                    submission any time during this period.
                  </p>
                </div>

                <input type="hidden" name="teamId" value={teamId || ""} />

                <div className="bg-blue-50 border-l-4 border-blue-500 p-4 rounded-md mb-6">
                  <p className="text-blue-800">
                    <strong>Important:</strong> You must provide at least one
                    URL or upload a project file.
                  </p>
                </div>

                <FormField
                  control={form.control}
                  name="githubUrl"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>GitHub Repository URL (Optional)</FormLabel>
                      <FormControl>
                        <Input
                          placeholder="https://github.com/username/repo"
                          {...field}
                        />
                      </FormControl>
                      <FormDescription>
                        Link to your project&apos;s GitHub repository
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="deployedUrl"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Deployed Project URL (Optional)</FormLabel>
                      <FormControl>
                        <Input
                          placeholder="https://your-project.vercel.app"
                          {...field}
                        />
                      </FormControl>
                      <FormDescription>
                        Link to your deployed project if available
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="presentationUrl"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>
                        Figma or Presentation URL (Optional)
                      </FormLabel>
                      <FormControl>
                        <Input
                          placeholder="https://figma.com/file/..."
                          {...field}
                        />
                      </FormControl>
                      <FormDescription>
                        Link to your design or presentation
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <div className="border-t border-gray-200 pt-6">
                  <FormLabel>Project Files (Optional, max 30MB)</FormLabel>
                  <div className="mt-2">
                    <div className="flex items-center justify-center w-full">
                      <label
                        htmlFor="file-upload"
                        className={`flex flex-col items-center justify-center w-full h-36 border-2 border-dashed rounded-lg cursor-pointer 
                          ${
                            file
                              ? "border-primary/50 bg-primary/5"
                              : "border-gray-300 bg-gray-50 hover:bg-gray-100"
                          }`}
                      >
                        {file ? (
                          <div className="flex flex-col items-center justify-center pt-5 pb-6 text-primary">
                            <CheckCircle2 className="w-8 h-8 mb-2" />
                            <p className="font-semibold">{file.name}</p>
                            <p className="text-xs text-muted-foreground">
                              {(file.size / 1024 / 1024).toFixed(2)} MB
                            </p>
                          </div>
                        ) : (
                          <div className="flex flex-col items-center justify-center pt-5 pb-6">
                            <Upload className="w-8 h-8 mb-2 text-gray-500" />
                            <p className="text-sm text-gray-500">
                              <span className="font-semibold">
                                Click to upload
                              </span>{" "}
                              or drag and drop
                            </p>
                            <p className="text-xs text-gray-500">
                              ZIP, PDF, PPTX, or other project files (MAX 30MB)
                            </p>
                          </div>
                        )}
                        <input
                          id="file-upload"
                          name="file"
                          type="file"
                          className="hidden"
                          ref={fileInputRef}
                          onChange={handleFileChange}
                        />
                      </label>
                    </div>
                  </div>
                  {file && (
                    <div className="mt-2 flex items-center">
                      <FileText className="w-4 h-4 mr-2 text-primary" />
                      <span className="text-sm font-medium">{file.name}</span>
                      <Button
                        type="button"
                        variant="ghost"
                        size="sm"
                        className="ml-auto text-red-500 hover:text-red-700"
                        onClick={handleFileRemove}
                      >
                        Remove
                      </Button>
                    </div>
                  )}
                </div>

                <Button
                  type="submit"
                  className="w-full"
                  disabled={
                    pending ||
                    (!file &&
                      !watchedValues.githubUrl &&
                      !watchedValues.deployedUrl &&
                      !watchedValues.presentationUrl)
                  }
                >
                  {pending ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Submitting...
                    </>
                  ) : (
                    "Submit Project"
                  )}
                </Button>
              </form>
            </Form>
          )}
        </div>
      </div>

      <Dialog
        open={isTeamIdDialogOpen}
        onOpenChange={(open) => {
          if (teamId) {
            setIsTeamIdDialogOpen(open);
          }
        }}
      >
        <DialogContent
          className="sm:max-w-[425px]"
          hideClose={true}
          preventOutsideClose={true}
        >
          <DialogHeader>
            <DialogTitle>Enter Your Team ID</DialogTitle>
            <DialogDescription>
              Please enter your team ID to access the submission form
            </DialogDescription>
          </DialogHeader>

          <Form {...teamIdForm}>
            <form
              onSubmit={teamIdForm.handleSubmit(handleTeamIdSubmit)}
              className="space-y-6"
            >
              <FormField
                control={teamIdForm.control}
                name="teamId"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Team ID</FormLabel>
                    <FormControl>
                      <Input placeholder="Enter your team ID" {...field} />
                    </FormControl>
                    {teamIdError && (
                      <p className="text-sm font-medium text-red-500">
                        {teamIdError}
                      </p>
                    )}
                    <FormMessage />
                  </FormItem>
                )}
              />

              <DialogFooter>
                <Button
                  type="submit"
                  disabled={isLoadingTeam}
                  className="w-full"
                >
                  {isLoadingTeam ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Validating...
                    </>
                  ) : (
                    <>
                      <Search className="mr-2 h-4 w-4" />
                      Find My Team
                    </>
                  )}
                </Button>
              </DialogFooter>
            </form>
          </Form>

          <div className="text-center text-sm text-muted-foreground pt-2">
            <p>
              Don&apos;t know your team ID?{" "}
              <Link href="/contact" className="text-primary hover:underline">
                Contact support
              </Link>
            </p>
          </div>
        </DialogContent>
      </Dialog>

      <Toaster />
    </div>
  );
}
