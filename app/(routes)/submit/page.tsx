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
  AlertTriangle,
  BookOpen,
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
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";

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

// New schema for presentation URL only
const presentationSchema = z.object({
  teamId: z.string(),
  presentationUrl: z
    .string()
    .url("Please enter a valid URL")
    .min(1, "Presentation URL is required"),
});

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

const validateTeamId = async (teamId: string) => {
  try {
    const response = await fetch(`/api/team/${teamId}`);
    const data = await response.json();

    if (!response.ok) {
      return {
        isValid: false,
        error: data.error || "Invalid team ID",
        team: null,
      };
    }

    return {
      isValid: true,
      error: null,
      team: data.team,
    };
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
  } catch (error) {
    return {
      isValid: false,
      error: "Failed to validate team ID",
      team: null,
    };
  }
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
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const [isLoadingTeam, setIsLoadingTeam] = useState(false);
  const [teamIdError, setTeamIdError] = useState<string | null>(null);

  const [isTeamIdValid, setIsTeamIdValid] = useState<boolean | null>(null);
  const [isValidatingTeam, setIsValidatingTeam] = useState<boolean>(false);
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const [teamInfo, setTeamInfo] = useState<any>(null);

  const [state, formAction, pending] = useActionState(
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    (prevState: any, formData: any) => submitProject(formData as FormData),
    initialState
  );

  const { data: submissionCountData } = useQuery({
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

  // New form for presentation URL only submissions
  const presentationForm = useForm<z.infer<typeof presentationSchema>>({
    resolver: zodResolver(presentationSchema),
    defaultValues: {
      teamId: teamId || "",
      presentationUrl: "",
    },
  });

  const watchedValues = form.watch();

  useEffect(() => {
    const validateTeamIdOnLoad = async () => {
      if (!teamId) {
        setIsTeamIdValid(false);
        setIsTeamIdDialogOpen(true);
        return;
      }

      setIsValidatingTeam(true);

      try {
        const { isValid, error, team } = await validateTeamId(teamId);

        setIsTeamIdValid(isValid);

        if (!isValid) {
          setTeamIdError(error);
          setIsTeamIdDialogOpen(true);

          toast({
            variant: "destructive",
            title: "Invalid Team ID",
            description: error || "The provided team ID is invalid",
          });
        } else {
          setTeamInfo(team);
          form.setValue("teamId", teamId);
          setIsTeamIdDialogOpen(false);
        }
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
      } catch (error) {
        setIsTeamIdValid(false);
        setTeamIdError("Failed to validate team ID");
        setIsTeamIdDialogOpen(true);
      } finally {
        setIsValidatingTeam(false);
      }
    };

    validateTeamIdOnLoad();
  }, [teamId, toast, form]);

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

  // New function to handle presentation URL submission when submissions are closed
  async function onPresentationSubmit(
    values: z.infer<typeof presentationSchema>
  ) {
    if (!teamId) {
      toast({
        variant: "destructive",
        title: "Team ID Required",
        description: "Please provide a valid team ID",
      });
      return;
    }

    const submitFormData = new FormData();
    submitFormData.append("teamId", values.teamId);
    submitFormData.append("presentationUrl", values.presentationUrl);
    submitFormData.append("presentationOnly", "true"); // Flag to indicate this is a presentation-only submission

    try {
      const result = await submitProject(submitFormData);
      if (result.message && !result.error) {
        toast({
          title: "Success!",
          description: "Your presentation URL has been submitted successfully.",
        });
        presentationForm.reset({
          teamId: values.teamId,
          presentationUrl: "",
        });
      } else if (result.error) {
        toast({
          variant: "destructive",
          title: "Error",
          description: result.error || "Failed to submit presentation URL",
        });
      }
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Error",
        description: "An unexpected error occurred",
      });
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-primary/10 to-background py-20">
      <div className="container max-w-2xl relative">
        <div className="absolute -top-10 left-0 flex gap-2">
          <Link href="/">
            <Button
              variant="ghost"
              className="text-primary hover:text-primary hover:bg-primary/10"
            >
              <ChevronLeft className="mr-2 h-4 w-4" />
              Back to Home
            </Button>
          </Link>
          <Link href="/challenge">
            <Button
              variant="outline"
              className="text-primary hover:text-primary hover:bg-primary/10"
            >
              <BookOpen className="mr-2 h-4 w-4" />
              View Challenge
            </Button>
          </Link>
        </div>

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
          {isValidatingTeam ? (
            <div className="flex flex-col items-center justify-center py-12">
              <Loader2 className="w-12 h-12 text-primary animate-spin mb-4" />
              <p className="text-lg font-medium">Validating team...</p>
            </div>
          ) : !isTeamIdValid && teamId ? (
            <Alert variant="destructive" className="mb-6">
              <AlertTriangle className="h-4 w-4" />
              <AlertTitle>Invalid Team ID</AlertTitle>
              <AlertDescription>
                {teamIdError ||
                  "The provided team ID is invalid. Please check your URL or contact support."}
              </AlertDescription>
            </Alert>
          ) : !isSubmissionActive ? (
            <div className="text-center p-6">
              <AlertCircle className="h-16 w-16 mx-auto text-amber-500 mb-4" />
              <h2 className="text-2xl font-bold text-primary mb-4">
                Main Submission Period Closed
              </h2>
              <p className="text-muted-foreground mb-6">
                {submissionStatus.message}
              </p>

              <div className="bg-blue-50 border-l-4 border-blue-500 p-4 rounded-md mb-6 text-left">
                <p className="text-blue-800">
                  <strong>Good news:</strong> You can still submit or update
                  your presentation URL below.
                </p>
              </div>

              {teamInfo && (
                <Alert className="mb-6 bg-primary/10 border-primary/20">
                  <CheckCircle2 className="h-4 w-4 text-primary" />
                  <AlertTitle>Team Validated</AlertTitle>
                  <AlertDescription>
                    Submitting for team: <strong>{teamInfo.name}</strong>
                  </AlertDescription>
                </Alert>
              )}

              <div className="border rounded-md p-6 mb-6">
                <h3 className="text-lg font-medium mb-4">
                  Presentation URL Submission
                </h3>

                <Form {...presentationForm}>
                  <form
                    onSubmit={presentationForm.handleSubmit(
                      onPresentationSubmit
                    )}
                    className="space-y-6"
                  >
                    <input type="hidden" name="teamId" value={teamId || ""} />

                    <FormField
                      control={presentationForm.control}
                      name="presentationUrl"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Presentation URL</FormLabel>
                          <FormControl>
                            <Input
                              placeholder="https://figma.com/file/... or https://slides.google.com/..."
                              {...field}
                            />
                          </FormControl>
                          <FormDescription>
                            Link to your Figma design, Google Slides, or any
                            other presentation
                          </FormDescription>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <Button
                      type="submit"
                      className="w-full"
                      disabled={!presentationForm.formState.isValid}
                    >
                      {presentationForm.formState.isSubmitting ? (
                        <>
                          <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                          Submitting...
                        </>
                      ) : (
                        "Submit Presentation URL"
                      )}
                    </Button>
                  </form>
                </Form>
              </div>

              <Link href="/">
                <Button variant="outline">Return to Home</Button>
              </Link>
            </div>
          ) : (
            <>
              {teamInfo && (
                <Alert className="mb-6 bg-primary/10 border-primary/20">
                  <CheckCircle2 className="h-4 w-4 text-primary" />
                  <AlertTitle>Team Validated</AlertTitle>
                  <AlertDescription>
                    Submitting for team: <strong>{teamInfo.name}</strong>
                  </AlertDescription>
                </Alert>
              )}

              <Form {...form}>
                <form
                  action={(formData) => onSubmit(form.getValues(), formData)}
                  className="space-y-8"
                  encType="multipart/form-data"
                >
                  <div className="bg-amber-50 border-l-4 border-amber-500 p-4 rounded-md">
                    <p className="text-amber-800">
                      <strong>Note:</strong> Submission period is open from
                      March 5, 2025 00:00 to March 6, 2025 00:00. You can update
                      your submission any time during this period.
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
                                ZIP, PDF, PPTX, or other project files (MAX
                                30MB)
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
            </>
          )}
        </div>
      </div>

      <Dialog
        open={isTeamIdDialogOpen}
        onOpenChange={(open) => {
          // Only allow closing the dialog if a valid teamId exists
          if (isTeamIdValid) {
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
