import nodemailer, { type Transporter } from "nodemailer";

let transporter: Transporter | null = null;

function getTransporter(): Transporter | null {
  const user = process.env.GMAIL_USER;
  const pass = process.env.GMAIL_APP_PASSWORD;
  if (!user || !pass) return null;

  if (!transporter) {
    transporter = nodemailer.createTransport({
      service: "gmail",
      auth: { user, pass },
    });
  }
  return transporter;
}

/**
 * Gmail SMTP can send to ANY recipient from your own Gmail address — unlike
 * Resend's free tier, no domain verification is needed at all. This makes
 * every step (owner notification AND replying to visitors) free with zero
 * domain cost, as long as a Gmail account + App Password is configured.
 */
export function isEmailConfigured(): boolean {
  return Boolean(process.env.GMAIL_USER && process.env.GMAIL_APP_PASSWORD);
}

// Kept for compatibility with existing call sites — with Gmail SMTP there's
// no separate domain-verification requirement, so this is just an alias for
// isEmailConfigured().
export function canReplyToVisitors(): boolean {
  return isEmailConfigured();
}

interface LeadNotification {
  source: "Contact form" | "Automation Audit";
  name: string;
  email: string;
  message: string;
}

/**
 * Notify the site owner (NOTIFY_EMAIL) that a new lead came in.
 * Never throws — a notification failure should never break the actual lead
 * submission for the visitor. Errors are logged and swallowed.
 */
export async function notifyNewLead(lead: LeadNotification): Promise<void> {
  const transport = getTransporter();
  const notifyEmail = process.env.NOTIFY_EMAIL;
  if (!transport || !notifyEmail) {
    console.warn("Email notifications not configured (GMAIL_USER / GMAIL_APP_PASSWORD / NOTIFY_EMAIL missing) — skipping");
    return;
  }

  try {
    await transport.sendMail({
      from: `Grovance <${process.env.GMAIL_USER}>`,
      to: notifyEmail,
      subject: `New lead: ${lead.name} (${lead.source})`,
      html: `
        <div style="font-family: Helvetica, Arial, sans-serif; max-width: 480px;">
          <p style="font-weight:700; font-size:16px; color:#1B2A6B;">New lead from ${lead.source}</p>
          <p style="margin:0 0 4px;"><strong>Name:</strong> ${escapeHtml(lead.name)}</p>
          <p style="margin:0 0 4px;"><strong>Email:</strong> ${escapeHtml(lead.email)}</p>
          <p style="margin:12px 0 4px;"><strong>Message:</strong></p>
          <p style="margin:0; white-space:pre-wrap;">${escapeHtml(lead.message)}</p>
        </div>
      `,
    });
  } catch (err) {
    console.error("Failed to send lead notification email:", err);
  }
}

/**
 * Send a reply TO the visitor. With Gmail SMTP this works for any recipient,
 * no domain needed. Never throws — logged and swallowed so a failure here
 * never breaks the rest of the submission flow (DB save, owner notification).
 */
export async function sendReplyToVisitor(to: string, subject: string, bodyText: string): Promise<void> {
  const transport = getTransporter();
  if (!transport) {
    console.warn("Visitor auto-reply skipped — GMAIL_USER / GMAIL_APP_PASSWORD not configured");
    return;
  }

  try {
    await transport.sendMail({
      from: `Grovance <${process.env.GMAIL_USER}>`,
      to,
      subject,
      html: `
        <div style="font-family: Helvetica, Arial, sans-serif; max-width: 480px; white-space: pre-wrap; color:#0F172A;">
          ${escapeHtml(bodyText)}
        </div>
      `,
    });
  } catch (err) {
    console.error("Failed to send visitor auto-reply:", err);
  }
}

function escapeHtml(s: string): string {
  return s.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");
}
