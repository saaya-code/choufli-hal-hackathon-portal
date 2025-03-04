import nodemailer from "nodemailer";

type EmailParams = {
  to: string;
  subject: string;
  message: string;
  isHtml?: boolean;
};

export async function sendEmail({ to, subject, message, isHtml = false }: EmailParams) {
  try {
    const transporter = nodemailer.createTransport({
      service: "gmail",
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
