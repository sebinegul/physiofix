import nodemailer from "nodemailer";
import { MailtrapTransport } from "mailtrap";

const TOKEN = process.env.MAILTRAP_TOKEN || "";

const transport = TOKEN
  ? nodemailer.createTransport(MailtrapTransport({ token: TOKEN }))
  : nodemailer.createTransport({
      host: "smtp.mailtrap.io",
      port: 2525,
      secure: false,
      auth: {
        user: process.env.SMTP_USER || "",
        pass: process.env.SMTP_PASS || "",
      },
    });

const sender = {
  address: process.env.SMTP_FROM || "hello@demomailtrap.com",
  name: "PhysioFix",
};

interface SendEmailOptions {
  to: string[];
  subject: string;
  html: string;
  category?: string;
}

export async function sendEmail({
  to,
  subject,
  html,
  category,
}: SendEmailOptions): Promise<{ success: boolean; error?: string }> {
  try {
    await transport.sendMail({
      from: sender,
      to,
      subject,
      html,
      category: category || "PhysioFix",
    });
    return { success: true };
  } catch (error) {
    console.error("Email send error:", error);
    return {
      success: false,
      error: error instanceof Error ? error.message : "Failed to send email",
    };
  }
}
