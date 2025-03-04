"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import {
  AlertCircle,
  Code,
  Eye,
  FileText,
  Loader2,
  Mail,
  Tag,
} from "lucide-react";
import { sendBulkEmail } from "@/app/actions/emailActions";
import { emailSchema } from "@/lib/schemas/emailSchema";
import { z } from "zod";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { Badge } from "@/components/ui/badge";

type EmailComposerProps = {
  selectedTeams: string[];
  onEmailSent: (success: boolean, message: string) => void;
};

// List of available template variables
const templateVariables = [
  {
    name: "{{teamName}}",
    description: "The name of the team",
    example: "Team Awesome",
  },
  {
    name: "{{teamId}}",
    description: "The unique ID of the team",
    example: "team_12345",
  },
  {
    name: "{{memberName}}",
    description: "The name of the member receiving this email",
    example: "John Doe",
  },
  {
    name: "{{memberEmail}}",
    description: "The email address of the recipient",
    example: "john@example.com",
  },
  {
    name: "{{allMembers}}",
    description: "List of all team members",
    example: "John, Alice, Bob",
  },
];

export function EmailComposer({
  selectedTeams,
  onEmailSent,
}: EmailComposerProps) {
  const [isHtmlMode, setIsHtmlMode] = useState(false);
  const [previewHtml, setPreviewHtml] = useState("");
  const [isSending, setIsSending] = useState(false);

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const [textareaCursorPos, setTextareaCursorPos] = useState<number | null>(
    null
  );
  const textareaRef = useState<HTMLTextAreaElement | null>(null);

  const form = useForm<z.infer<typeof emailSchema>>({
    resolver: zodResolver(emailSchema),
    defaultValues: {
      subject: "",
      message: "",
    },
  });

  const handleSubmit = async (values: z.infer<typeof emailSchema>) => {
    if (selectedTeams.length === 0) {
      onEmailSent(false, "Please select at least one recipient team");
      return;
    }

    try {
      setIsSending(true);
      const result = await sendBulkEmail({
        teamIds: selectedTeams,
        subject: values.subject,
        message: values.message,
        isHtml: isHtmlMode,
        useTemplateVars: true,
      });

      if (result.success) {
        form.reset();
        onEmailSent(
          true,
          `Email sent successfully to ${selectedTeams.length} teams!`
        );
      } else {
        onEmailSent(false, result.error || "Failed to send email");
      }
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
    } catch (error) {
      onEmailSent(false, "An unexpected error occurred while sending emails");
    } finally {
      setIsSending(false);
    }
  };

  const handleTabChange = (value: string) => {
    setIsHtmlMode(value === "html");
    if (value === "preview" && isHtmlMode) {
      setPreviewHtml(form.getValues("message"));
    }
  };

  // Insert a template variable at current cursor position
  const insertTemplateVar = (variable: string) => {
    const message = form.getValues("message");
    const textarea = textareaRef[0];

    if (textarea) {
      const cursorPos = textarea.selectionStart;
      const textBefore = message.substring(0, cursorPos);
      const textAfter = message.substring(cursorPos, message.length);

      const newValue = textBefore + variable + textAfter;
      form.setValue("message", newValue);

      // Move cursor after inserted variable
      setTimeout(() => {
        textarea.focus();
        const newCursorPos = cursorPos + variable.length;
        textarea.setSelectionRange(newCursorPos, newCursorPos);
      }, 0);
    } else {
      // Fallback for when we don't have direct textarea access
      form.setValue("message", message + " " + variable);
    }
  };

  const createExampleEmail = (useHtml: boolean) => {
    const template = useHtml
      ? `<html><div style="font-family: Arial, sans-serif; padding: 20px; color: #333;">
  <h2>Hello {{teamName}}!</h2>
  <p>Thank you for participating in Choufli Hal Hackathon!</p>
  <p>Your team ID is: <strong>{{teamId}}</strong></p>
  <p>Please keep this ID handy for future reference.</p>
  <hr>
  <p>Team members: {{allMembers}}</p>
  <p>Best regards,<br>The Organizing Team</p>
</div></html>`
      : `Hello {{teamName}}!

Thank you for participating in Choufli Hal Hackathon!

Your team ID is: {{teamId}}

Please keep this ID handy for future reference.

Team members: {{allMembers}}

Best regards,
The Organizing Team`;

    form.setValue("subject", "Important Information: Your Team ID");
    form.setValue("message", template);
    setIsHtmlMode(useHtml);
    form.clearErrors();
  };

  return (
    <div className="space-y-6">
      <Form {...form}>
        <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-6">
          <FormField
            control={form.control}
            name="subject"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Email Subject</FormLabel>
                <FormControl>
                  <Input
                    placeholder="Enter email subject..."
                    {...field}
                    disabled={isSending}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <FormLabel>Email Body</FormLabel>

              <div className="text-sm text-muted-foreground flex items-center">
                <AlertCircle className="h-3 w-3 mr-1" />
                <span>Supports dynamic team variables</span>
              </div>
            </div>

            <Tabs
              defaultValue="text"
              onValueChange={handleTabChange}
              className="w-full"
            >
              <TabsList className="grid grid-cols-3">
                <TabsTrigger value="text" disabled={isSending}>
                  <FileText className="h-4 w-4 mr-2" />
                  Plain Text
                </TabsTrigger>
                <TabsTrigger value="html" disabled={isSending}>
                  <Code className="h-4 w-4 mr-2" />
                  HTML
                </TabsTrigger>
                <TabsTrigger
                  value="preview"
                  disabled={
                    isSending || !isHtmlMode || !form.getValues("message")
                  }
                >
                  <Eye className="h-4 w-4 mr-2" />
                  Preview
                </TabsTrigger>
              </TabsList>

              <TabsContent value="text" className="mt-4">
                <FormField
                  control={form.control}
                  name="message"
                  render={({ field }) => (
                    <FormItem>
                      <FormControl>
                        <Textarea
                          placeholder="Write your email message here..."
                          className="min-h-[300px]"
                          {...field}
                          disabled={isSending}
                          ref={(el) => {
                            textareaRef[0] = el;
                            if (typeof field.ref === "function") field.ref(el);
                          }}
                          onSelect={(e) => {
                            const target = e.target as HTMLTextAreaElement;
                            setTextareaCursorPos(target.selectionStart);
                          }}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </TabsContent>

              <TabsContent value="html" className="mt-4">
                <FormField
                  control={form.control}
                  name="message"
                  render={({ field }) => (
                    <FormItem>
                      <FormControl>
                        <Textarea
                          placeholder="<html><body><h1>Hello {{teamName}}!</h1><p>Your team ID is {{teamId}}</p></body></html>"
                          className="min-h-[300px] font-mono text-sm"
                          {...field}
                          disabled={isSending}
                          ref={(el) => {
                            textareaRef[0] = el;
                            if (typeof field.ref === "function") field.ref(el);
                          }}
                          onSelect={(e) => {
                            const target = e.target as HTMLTextAreaElement;
                            setTextareaCursorPos(target.selectionStart);
                          }}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <div className="text-xs text-muted-foreground mt-2">
                  <p>
                    You can use HTML to format your email. Template variables
                    like
                    {"{{"}teamName{"}}"} will be replaced with actual values.
                  </p>
                </div>
              </TabsContent>

              <TabsContent value="preview" className="mt-4">
                <div className="border rounded-md p-4 min-h-[300px] bg-white">
                  <div
                    className="prose max-w-none"
                    dangerouslySetInnerHTML={{ __html: previewHtml }}
                  />
                </div>
              </TabsContent>
            </Tabs>
          </div>

          {/* Template Variables Section */}
          <div className="space-y-2 border rounded-md p-4 bg-muted/20">
            <div className="flex items-center">
              <Tag className="h-4 w-4 mr-2" />
              <h4 className="text-sm font-medium">Template Variables</h4>
            </div>
            <p className="text-xs text-muted-foreground">
              Click on a variable to insert it at the cursor position in your
              email.
            </p>
            <div className="flex flex-wrap gap-2 mt-2">
              <TooltipProvider delayDuration={300}>
                {templateVariables.map((variable) => (
                  <Tooltip key={variable.name}>
                    <TooltipTrigger asChild>
                      <Badge
                        variant="outline"
                        className="cursor-pointer hover:bg-primary/10"
                        onClick={() => insertTemplateVar(variable.name)}
                      >
                        {variable.name}
                      </Badge>
                    </TooltipTrigger>
                    <TooltipContent>
                      <p className="font-medium">{variable.description}</p>
                      <p className="text-xs text-muted-foreground">
                        Example: {variable.example}
                      </p>
                    </TooltipContent>
                  </Tooltip>
                ))}
              </TooltipProvider>
            </div>
          </div>

          <div className="flex items-center justify-between pt-4">
            <div className="text-sm">
              Sending to{" "}
              <strong className="text-primary">{selectedTeams.length}</strong>{" "}
              {selectedTeams.length === 1 ? "team" : "teams"}
            </div>
            <Button
              type="submit"
              disabled={isSending || selectedTeams.length === 0}
            >
              {isSending ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Sending...
                </>
              ) : (
                <>
                  <Mail className="mr-2 h-4 w-4" />
                  Send Email
                </>
              )}
            </Button>
          </div>
        </form>
      </Form>

      {/* Email Template Suggestions */}
      <div className="mt-8 border-t pt-4">
        <h3 className="font-medium mb-2">Email Templates</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => {
              form.setValue(
                "subject",
                "Important Update: Choufli Hal Hackathon"
              );
              form.setValue(
                "message",
                "Dear {{teamName}} team,\n\nWe have an important update regarding the Choufli Hal Hackathon schedule.\n\nBest regards,\nThe Organizing Team"
              );
              setIsHtmlMode(false);
              form.clearErrors();
            }}
          >
            Event Update
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={() => {
              form.setValue(
                "subject",
                "Submission Reminder: Choufli Hal Hackathon"
              );
              form.setValue(
                "message",
                "Dear {{teamName}} team,\n\nThis is a friendly reminder that project submissions are due soon. Please ensure you submit your project on time using your team ID: {{teamId}}.\n\nBest regards,\nThe Organizing Team"
              );
              setIsHtmlMode(false);
              form.clearErrors();
            }}
          >
            Submission Reminder
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={() => createExampleEmail(true)}
          >
            Team ID Template (HTML)
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={() => createExampleEmail(false)}
          >
            Team ID Template (Text)
          </Button>
        </div>
      </div>
    </div>
  );
}
