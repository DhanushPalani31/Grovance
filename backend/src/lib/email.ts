import { Resend } from "resend";

let client: Resend | null = null;

function getClient(): Resend | null {
  const apiKey = process.env.RESEND_API_KEY;
  if (!apiKey) return null;
  if (!client) client = new Resend(apiKey);
  return client;
}

export function isEmailConfigured(): boolean {
  return Boolean(process.env.RESEND_API_KEY && process.env.NOTIFY_EMAIL);
}

/**
 * Whether sending TO visitors (not just to your own account email) is
 * possible — requires FROM_EMAIL set to an address on a domain you've
 * verified with Resend. Without this, Resend will reject sends to anyone
 * other than your own account email.
 */
export function canReplyToVisitors(): boolean {
  return Boolean(process.env.RESEND_API_KEY && process.env.FROM_EMAIL);
}

interface LeadNotification {
  source: "Contact form" | "Automation Audit";
  name: string;
  email: string;
  message: string;
}

/**
 * Notify the site owner (NOTIFY_EMAIL) that a new lead came in. Uses Resend's
 * default onboarding@resend.dev sender, which works without owning a custom
 * domain as long as you're only sending to your own verified account email —
 * exactly this use case (notifying yourself), not cold outreach to strangers.
 *
 * Never throws — a notification failure should never break the actual lead
 * submission for the visitor. Errors are logged and swallowed.
 */
export async function notifyNewLead(lead: LeadNotification): Promise<void> {
  const resend = getClient();
  const notifyEmail = process.env.NOTIFY_EMAIL;
  if (!resend || !notifyEmail) {
    console.warn("Email notifications not configured (RESEND_API_KEY / NOTIFY_EMAIL missing) — skipping");
    return;
  }

  try {
    await resend.emails.send({
      from: "Grovance <onboarding@resend.dev>",
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

function escapeHtml(s: string): string {
  return s.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");
}

/**
 * Send a reply TO the visitor (not to you). Requires FROM_EMAIL to be set
 * to an address on a domain verified with Resend — Resend rejects sends to
 * third parties from the shared onboarding@resend.dev sender. If not
 * configured, this is skipped silently (logged, not thrown) so the rest of
 * the submission flow (DB save, owner notification) still succeeds.
 */
export async function sendReplyToVisitor(to: string, subject: string, bodyText: string): Promise<void> {
  const resend = getClient();
  const fromEmail = process.env.FROM_EMAIL;
  if (!resend || !fromEmail) {
    console.warn("Visitor auto-reply skipped — FROM_EMAIL not set (needs a Resend-verified domain)");
    return;
  }

  try {
    await resend.emails.send({
      from: `Grovance <${fromEmail}>`,
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
