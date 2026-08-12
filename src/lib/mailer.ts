import "server-only";

import nodemailer, { type Transporter } from "nodemailer";
import { siteConfig } from "@/data/site";
import type { ContactFormInput } from "@/lib/validation";

/**
 * Server-only email transport.
 *
 * The `server-only` import above is a build-time guard: if this module is ever
 * pulled into a Client Component, the build fails rather than shipping the
 * credentials to the browser.
 *
 * Required environment variables (see `.env.example`):
 *   EMAIL_USER      — the Gmail account that sends the message
 *   EMAIL_PASSWORD  — a Google App Password, never the account password
 *   CONTACT_EMAIL   — where enquiries should land (defaults to EMAIL_USER)
 */

interface MailerConfig {
  user: string;
  password: string;
  recipient: string;
}

function readConfig(): MailerConfig | null {
  const user = process.env.EMAIL_USER?.trim();
  const password = process.env.EMAIL_PASSWORD?.trim();
  const recipient = process.env.CONTACT_EMAIL?.trim() || user;

  if (!user || !password || !recipient) return null;

  return { user, password, recipient };
}

let cachedTransporter: Transporter | null = null;

function getTransporter(config: MailerConfig): Transporter {
  // Reused across requests so warm invocations skip the SMTP handshake.
  cachedTransporter ??= nodemailer.createTransport({
    service: "gmail",
    auth: { user: config.user, pass: config.password },
  });

  return cachedTransporter;
}

const HTML_ESCAPES: Record<string, string> = {
  "&": "&amp;",
  "<": "&lt;",
  ">": "&gt;",
  '"': "&quot;",
  "'": "&#39;",
};

/** Submitted text is untrusted; escape before it goes into the HTML body. */
function escapeHtml(value: string): string {
  return value.replace(/[&<>"']/g, (character) => HTML_ESCAPES[character]);
}

/** Strips CR/LF so a crafted subject cannot inject extra mail headers. */
function sanitiseHeader(value: string): string {
  return value.replace(/[\r\n]+/g, " ").trim();
}

export type SendResult = { ok: true } | { ok: false; reason: "not-configured" | "send-failed" };

export async function sendContactEmail(input: ContactFormInput): Promise<SendResult> {
  const config = readConfig();

  if (!config) {
    console.error(
      "[contact] Email is not configured: set EMAIL_USER, EMAIL_PASSWORD and CONTACT_EMAIL.",
    );
    return { ok: false, reason: "not-configured" };
  }

  const subject = sanitiseHeader(`[Portfolio] ${input.subject}`);
  const receivedAt = new Date().toISOString();

  const text = [
    `Name:    ${input.name}`,
    `Email:   ${input.email}`,
    `Subject: ${input.subject}`,
    `Sent:    ${receivedAt}`,
    "",
    input.message,
  ].join("\n");

  const html = `
    <div style="font-family:ui-sans-serif,system-ui,-apple-system,sans-serif;font-size:15px;line-height:1.6;color:#17181a">
      <p style="margin:0 0 16px;font-size:13px;color:#5b5f66">
        New message from the ${escapeHtml(siteConfig.name)} portfolio contact form.
      </p>
      <table cellpadding="0" cellspacing="0" style="border-collapse:collapse;margin-bottom:16px">
        <tr><td style="padding:2px 16px 2px 0;color:#5b5f66">Name</td><td style="padding:2px 0"><strong>${escapeHtml(input.name)}</strong></td></tr>
        <tr><td style="padding:2px 16px 2px 0;color:#5b5f66">Email</td><td style="padding:2px 0"><a href="mailto:${escapeHtml(input.email)}">${escapeHtml(input.email)}</a></td></tr>
        <tr><td style="padding:2px 16px 2px 0;color:#5b5f66">Subject</td><td style="padding:2px 0">${escapeHtml(input.subject)}</td></tr>
      </table>
      <div style="white-space:pre-wrap;border-top:1px solid #e4e4e1;padding-top:16px">${escapeHtml(input.message)}</div>
    </div>
  `.trim();

  try {
    await getTransporter(config).sendMail({
      // Gmail rewrites `from` to the authenticated account; the visitor's
      // address goes in `replyTo` so a reply reaches them directly.
      from: `"${sanitiseHeader(input.name)} via portfolio" <${config.user}>`,
      to: config.recipient,
      replyTo: `"${sanitiseHeader(input.name)}" <${input.email}>`,
      subject,
      text,
      html,
    });

    return { ok: true };
  } catch (error) {
    // Logged server-side only — the response stays generic.
    console.error("[contact] Failed to send message:", error);
    return { ok: false, reason: "send-failed" };
  }
}
