import * as z from "zod";

export const emailSchema = z.object({
  subject: z.string().min(1, "Subject is required"),
  message: z.string().min(1, "Email body is required"),
});
