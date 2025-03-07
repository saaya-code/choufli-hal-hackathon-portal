import nodemailer from 'nodemailer';

export interface EmailOptions {
    to: string;
    subject: string;
    message: string;
    isHtml?: boolean;
    attachments?: Array<{
      filename: string;
      content?: Buffer;
      path?: string;
      contentType?: string;
    }>;
}

export async function sendEmail({ to, subject, message, isHtml = false, attachments = [] }: EmailOptions) {
   try {
       const transporter = nodemailer.createTransport({
         service: "gmail",
         host: "smtp.gmail.com",
         port: 465,
         auth: {
           user: process.env.GMAIL_USER,
           pass: process.env.GMAIL_PASS,
         },
       });
   
       const mailOptions = {
         from: `"Choufli Hal Hackathon" <${process.env.GMAIL_USER}>`,
         to,
         subject,
         [isHtml ? "html" : "text"]: message,
         attachments,
       };
   
       await transporter.sendMail(mailOptions);
   
       return { success: true };
     } catch (error) {
       console.error("Error sending email:", error);
       return { success: false, error: "Failed to send email" };
     }  
}
