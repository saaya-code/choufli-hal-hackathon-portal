import nodemailer from 'nodemailer';

export interface EmailOptions {
    to: string;
    subject: string;
    message: string;
    isHtml?: boolean;
}

export async function sendEmail({ to, subject, message, isHtml = false }: EmailOptions) {
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
       };
   
       await transporter.sendMail(mailOptions);
   
       return { success: true };
     } catch (error) {
       console.error("Error sending email:", error);
       return { success: false, error: "Failed to send email" };
     }  
}
