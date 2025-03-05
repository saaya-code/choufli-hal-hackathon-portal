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
        isHtml: true,
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

  const insertTemplateVar = (variable: string) => {
    const message = form.getValues("message");
    const textarea = textareaRef[0];

    if (textarea) {
      const cursorPos = textarea.selectionStart;
      const textBefore = message.substring(0, cursorPos);
      const textAfter = message.substring(cursorPos, message.length);

      const newValue = textBefore + variable + textAfter;
      form.setValue("message", newValue);

      setTimeout(() => {
        textarea.focus();
        const newCursorPos = cursorPos + variable.length;
        textarea.setSelectionRange(newCursorPos, newCursorPos);
      }, 0);
    } else {
      form.setValue("message", message + " " + variable);
    }
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
        <div className="grid grid-cols-1 md:grid-cols-4 gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => {
              form.setValue(
                "subject",
                "Invitation to Pitch Day: Choufli Hal 2.0 Hackathon"
              );
              form.setValue(
                "message",
                `<div style="max-width: 600px; margin: 0 auto; font-family: Arial, sans-serif; color: #333333; background-color: #ffffff; padding: 20px; border-radius: 10px; box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);">
                  <div style="background-color: #E6EFFF; padding: 20px; text-align: center; border-radius: 10px 10px 0 0;">
                    <img src="https://gdg-on-campus-issatso.tn/logo.png" alt="Choufli Hal 2.0 Logo" style="max-width: 200px; height: auto;">
                  </div>
                  <div style="padding: 20px;">
                    <h1 style="color: #8B3E16; font-size: 24px; margin-bottom: 20px;">Hello {{teamName}}!</h1>
                    
                    <p style="font-size: 16px; line-height: 1.5; margin-bottom: 20px;">
                      Thank you for your hard work and dedication in submitting your project for the <strong>Choufli Hal 2.0 Hackathon</strong>. We're impressed with your submission and would like to invite you to pitch your solution at our in-person event!
                    </p>

                    <div style="background-color: #f9f9f9; border-left: 4px solid #8B3E16; padding: 15px; margin-bottom: 20px;">
                      <h2 style="color: #8B3E16; font-size: 18px; margin-top: 0;">Event Details:</h2>
                      <p style="margin: 0 0 5px 0;"><strong>Date:</strong> March 6th, 2024</p>
                      <p style="margin: 0 0 5px 0;"><strong>Location:</strong> ISSAT Sousse</p>
                    </div>

                    <h3 style="color: #8B3E16; font-size: 18px;">Event Schedule:</h3>
                    <table style="width: 100%; border-collapse: collapse; margin-bottom: 20px;">
                      <tr style="border-bottom: 1px solid #eee;">
                        <td style="padding: 8px; font-weight: bold;">17:00 - 17:30</td>
                        <td style="padding: 8px;">Check-in</td>
                      </tr>
                      <tr style="border-bottom: 1px solid #eee;">
                        <td style="padding: 8px; font-weight: bold;">17:30 - 18:00</td>
                        <td style="padding: 8px;">Final touches to presentations</td>
                      </tr>
                      <tr style="border-bottom: 1px solid #eee;">
                        <td style="padding: 8px; font-weight: bold;">18:00 - 19:15</td>
                        <td style="padding: 8px;">Iftar</td>
                      </tr>
                      <tr style="border-bottom: 1px solid #eee;">
                        <td style="padding: 8px; font-weight: bold;">19:15 - 20:30</td>
                        <td style="padding: 8px;">Coffee Break + Band + Fun activities</td>
                      </tr>
                      <tr style="border-bottom: 1px solid #eee;">
                        <td style="padding: 8px; font-weight: bold;">20:30 - 22:30</td>
                        <td style="padding: 8px;">Pitching</td>
                      </tr>
                      <tr>
                        <td style="padding: 8px; font-weight: bold;">22:30 - 23:30</td>
                        <td style="padding: 8px;">Winners announcement + Closure Ceremony</td>
                      </tr>
                    </table>

                    <div style="background-color: #FFF5E6; padding: 15px; border-radius: 5px; margin-bottom: 20px;">
                      <h3 style="color: #8B3E16; margin-top: 0;">Important Notes:</h3>
                      <ul style="margin-bottom: 0; padding-left: 20px;">
                        <li>You may bring any demo materials or prototypes</li>
                        <li>Don't forget to check in upon arrival</li>
                      </ul>
                    </div>

                    <p style="font-size: 16px; line-height: 1.5; margin-bottom: 20px;">
                      We look forward to seeing you and your team at the event. This is your chance to showcase your hard work, network with other participants, and potentially win exciting prizes!
                    </p>
                    
                    <p style="font-size: 16px; line-height: 1.5;">
                      Best regards,<br>
                      Google Developer Group On Campus ISSAT Sousse
                    </p>
                  </div>
                  <div style="background-color: #F5F5F5; padding: 20px; text-align: center; font-size: 14px; border-radius: 0 0 10px 10px;">
                    <p>&copy; 2025 Choufli Hal Bootcamp 2.0. All rights reserved.</p>
                  </div>
                </div>`
              );
              setIsHtmlMode(true);
              form.clearErrors();
            }}
          >
            Pitch Day Invitation
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={() => {
              form.setValue(
                "subject",
                "DEADLINE EXTENDED: Choufli Hal Hackathon Submission"
              );
              form.setValue(
                "message",
                `<div style="max-width: 600px; margin: 0 auto; font-family: Arial, sans-serif; color: #333333; background-color: #ffffff; padding: 20px; border-radius: 10px; box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);">
      <div style="background-color: #E6EFFF; padding: 20px; text-align: center; border-radius: 10px 10px 0 0;">
        <img src="https://gdg-on-campus-issatso.tn/logo.png" alt="Choufli Hal 2.0 Logo" style="max-width: 200px; height: auto;">
      </div>
      <div style="padding: 20px;">
        <h1 style="color: #8B3E16; font-size: 24px; margin-bottom: 20px;">Submission Deadline Extended!</h1>
        <p style="font-size: 16px; line-height: 1.5; margin-bottom: 20px;">
          Dear <strong>{{teamName}}</strong> team,<br><br>
          Good news! We've decided to extend the submission deadline for the <strong>Choufli Hal 2.0 Hackathon</strong>.
        </p>
        
        <div style="background-color: #FFF5E6; border-left: 4px solid #8B3E16; padding: 20px; margin-bottom: 25px;">
          <h3 style="color: #8B3E16; font-size: 18px; margin-top: 0; margin-bottom: 10px;">New Submission Deadline:</h3>
          <p style="font-size: 18px; font-weight: bold; margin: 0; text-align: center;">March 6th, 2025 at 10:00 AM</p>
        </div>
        
        <div style="margin-bottom: 20px; padding: 15px; background-color: #f9f9f9; border-radius: 5px;">
          <p style="margin: 0; font-size: 16px; margin-bottom: 10px;">For your reference, your team ID is:</p>
          <p style="margin: 0; font-weight: bold; font-size: 18px; color: #8B3E16; text-align: center; padding: 10px; border: 1px dashed #8B3E16; border-radius: 5px;">{{teamId}}</p>
          <p style="margin: 10px 0 0 0; font-size: 14px; text-align: center;">You will need this ID when submitting your project</p>
        </div>
        
        <p style="font-size: 16px; line-height: 1.5; margin-bottom: 20px;">
          We've extended the deadline to give all teams adequate time to finalize and polish their projects. This is your opportunity to make any final improvements before submission.
        </p>
        
        <p style="font-size: 16px; line-height: 1.5; margin-bottom: 20px;">
          <strong>Important:</strong> No further extensions will be provided after this date. Please ensure your submission is complete before the new deadline.
        </p>
        
        <div style="text-align: center; margin-bottom: 25px;">
          <a href="https://gdg-on-campus-issatso.tn/submit?teamId={{teamId}}" style="display: inline-block; background-color: #8B3E16; color: #ffffff; text-decoration: none; padding: 12px 24px; border-radius: 5px; font-weight: bold;">Submit Your Project</a>
        </div>
        
        <p style="font-size: 16px; line-height: 1.5; margin-top: 20px;">
          If you have any questions or need technical assistance with your submission, please don't hesitate to contact us.
        </p>
        
        <p style="font-size: 16px; line-height: 1.5;">
          Best regards,<br>
          Google Developer Group On Campus ISSAT Sousse
        </p>
      </div>
      <div style="background-color: #F5F5F5; padding: 20px; text-align: center; font-size: 14px; border-radius: 0 0 10px 10px;">
        <p>&copy; 2025 Choufli Hal Bootcamp 2.0. All rights reserved.</p>
      </div>
    </div>`
              );
              setIsHtmlMode(true);
              form.clearErrors();
            }}
          >
            Deadline Extension
          </Button>
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
                `<div style="max-width: 600px; margin: 0 auto; font-family: Arial, sans-serif; color: #333333; background-color: #ffffff; padding: 20px; border-radius: 10px; box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);">
                  <div style="background-color: #E6EFFF; padding: 20px; text-align: center; border-radius: 10px 10px 0 0;">
                    <img src="https://gdg-on-campus-issatso.tn/logo.png" alt="Choufli Hal 2.0 Logo" style="max-width: 200px; height: auto;">
                  </div>
                  <div style="padding: 20px;">
                    <h1 style="color: #8B3E16; font-size: 24px; margin-bottom: 20px;">Important Update</h1>
                    <p style="font-size: 16px; line-height: 1.5; margin-bottom: 20px;">
                      Dear <strong>{{teamName}}</strong> team,<br><br>
                      We have an important update regarding the <strong>Choufli Hal 2.0 Hackathon</strong> schedule.
                    </p>
                    <div style="background-color: #f9f9f9; border-left: 4px solid #8B3E16; padding: 15px; margin-bottom: 20px;">
                      <p style="margin: 0; font-size: 16px; line-height: 1.5;">
                        [Insert your schedule update details here]
                      </p>
                    </div>
                    <p style="font-size: 16px; line-height: 1.5; margin-bottom: 20px;">
                      Best regards,<br>
                      Google Developer Group On Campus ISSAT Sousse
                    </p>
                    <a href="#" style="display: inline-block; background-color: #8B3E16; color: #ffffff; text-decoration: none; padding: 12px 24px; border-radius: 5px; font-weight: bold;">Contact Us</a>
                  </div>
                  <div style="background-color: #F5F5F5; padding: 20px; text-align: center; font-size: 14px; border-radius: 0 0 10px 10px;">
                    <p>&copy; 2025 Choufli Hal Bootcamp 2.0. All rights reserved.</p>
                  </div>
                </div>`
              );
              setIsHtmlMode(true);
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
                `<div style="max-width: 600px; margin: 0 auto; font-family: Arial, sans-serif; color: #333333; background-color: #ffffff; padding: 20px; border-radius: 10px; box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);">
      <div style="background-color: #E6EFFF; padding: 20px; text-align: center; border-radius: 10px 10px 0 0;">
        <img src="https://gdg-on-campus-issatso.tn/logo.png" alt="Choufli Hal 2.0 Logo" style="max-width: 200px; height: auto;">
      </div>
      <div style="padding: 20px;">
        <h1 style="color: #8B3E16; font-size: 24px; margin-bottom: 20px;">Submission Reminder</h1>
        <p style="font-size: 16px; line-height: 1.5; margin-bottom: 20px;">
          Dear <strong>{{teamName}}</strong> team,<br><br>
          This is a friendly reminder that project submissions for the <strong>Choufli Hal 2.0 Hackathon</strong> are due soon. Please ensure you submit your project by the deadline.
        </p>

        <div style="background-color: #FFF5E6; border-left: 4px solid #8B3E16; padding: 15px; margin-bottom: 20px;">
          <p style="margin: 0; font-size: 16px; font-weight: bold;">Submission Deadline: March 6th, 2024 at 10:00 AM</p>
        </div>
        
        <div style="margin-bottom: 20px; padding: 15px; background-color: #f9f9f9; border-radius: 5px;">
          <p style="margin: 0; font-size: 16px; margin-bottom: 10px;">Your team ID is:</p>
          <p style="margin: 0; font-weight: bold; font-size: 18px; color: #8B3E16; text-align: center; padding: 10px; border: 1px dashed #8B3E16; border-radius: 5px;">{{teamId}}</p>
          <p style="margin: 10px 0 0 0; font-size: 14px; text-align: center;">Please keep this ID handy for future reference. You will need to enter it if prompted for a Team ID in the submit page</p>
        </div>
        <p style="font-size: 16px; line-height: 1.5; margin-bottom: 20px;">
          If you have any questions or need assistance with your submission, please reach out to our support team.
        </p>
        <div style="text-align: center;">
          <a href="https://gdg-on-campus-issatso.tn/submit?teamId={{teamId}}" style="display: inline-block; background-color: #8B3E16; color: #ffffff; text-decoration: none; padding: 12px 24px; border-radius: 5px; font-weight: bold;">Submit Your Project</a>
        </div>
        <p style="font-size: 16px; line-height: 1.5; margin-top: 20px;">
          Best regards,<br>
          Google Developer Group On Campus ISSAT Sousse
        </p>
      </div>
      <div style="background-color: #F5F5F5; padding: 20px; text-align: center; font-size: 14px; border-radius: 0 0 10px 10px;">
        <p>&copy; 2025 Choufli Hal Bootcamp 2.0. All rights reserved.</p>
      </div>
    </div>`
              );
              setIsHtmlMode(true);
              form.clearErrors();
            }}
          >
            Submission Reminder
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={() => {
              form.setValue("subject", "Important Information: Your Team ID");
              form.setValue(
                "message",
                `<div style="max-width: 600px; margin: 0 auto; font-family: Arial, sans-serif; color: #333333; background-color: #ffffff; padding: 20px; border-radius: 10px; box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);">
              <div style="background-color: #E6EFFF; padding: 20px; text-align: center; border-radius: 10px 10px 0 0;">
                <img src="https://gdg-on-campus-issatso.tn/logo.png" alt="Choufli Hal 2.0 Logo" style="max-width: 200px; height: auto;">
              </div>
              <div style="padding: 20px;">
                <h1 style="color: #8B3E16; font-size: 24px; margin-bottom: 20px;">Hello {{teamName}}!</h1>
                <p style="font-size: 16px; line-height: 1.5; margin-bottom: 20px;">
                  Thank you for participating in the <strong>Choufli Hal 2.0 Hackathon</strong>!
                </p>
                <div style="background-color: #f9f9f9; padding: 15px; border-radius: 5px; margin-bottom: 20px;">
                  <p style="margin: 0 0 10px 0; font-size: 16px;">Your team ID is:</p>
                  <p style="margin: 0; font-size: 20px; font-weight: bold; color: #8B3E16; text-align: center; padding: 10px; border: 1px dashed #8B3E16; border-radius: 5px;">{{teamId}}</p>
                  <p style="margin: 10px 0 0 0; font-size: 14px; text-align: center;">Please keep this ID handy for future reference. You will need to enter it if prompted for a Team ID in the submit page</p>
                </div>
                <div style="margin-bottom: 20px;">
                  <h2 style="color: #8B3E16; font-size: 18px; margin-bottom: 10px;">Team Members:</h2>
                  <p style="margin: 0; font-size: 16px;">{{allMembers}}</p>
                </div>
                <div style="text-align: center; margin-bottom: 20px;">
                  <a href="https://gdg-on-campus-issatso.tn/submit?teamId={{teamId}}" style="display: inline-block; background-color: #8B3E16; color: #ffffff; text-decoration: none; padding: 12px 24px; border-radius: 5px; font-weight: bold; margin-right: 10px;">Submit Your Project</a>
                  <a href="https://gdg-on-campus-issatso.tn/challenge" style="display: inline-block; background-color: #4285F4; color: #ffffff; text-decoration: none; padding: 12px 24px; border-radius: 5px; font-weight: bold;">View Challenge</a>
                </div>
                <p style="font-size: 16px; line-height: 1.5; margin-bottom: 20px;">
                  Best regards,<br>Google Developer Group On Campus ISSAT Sousse
                </p>
              </div>
              <div style="background-color: #F5F5F5; padding: 20px; text-align: center; font-size: 14px; border-radius: 0 0 10px 10px;">
                <p>&copy; 2025 Choufli Hal Bootcamp 2.0. All rights reserved.</p>
              </div>
            </div>`
              );
              setIsHtmlMode(true);
              form.clearErrors();
            }}
          >
            Team ID Template
          </Button>
        </div>
      </div>
    </div>
  );
}
