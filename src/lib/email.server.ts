import process from "node:process";

export interface EmailPayload {
  to: string;
  subject: string;
  html: string;
  replyTo?: string;
}

export interface EmailResult {
  id: string | null;
  skipped: boolean;
}

export async function sendEmail(payload: EmailPayload): Promise<EmailResult> {
  const apiKey = process.env.RESEND_API_KEY;
  const from = process.env.EMAIL_FROM ?? "PRIME ENERGIE <info@primeenergie.de>";

  if (!apiKey) {
    console.log(`[EMAIL DEV] An: ${payload.to} | Betreff: ${payload.subject}`);
    return { id: null, skipped: true };
  }

  // Dynamischer Import damit Resend nicht ins Client-Bundle gelangt
  const { Resend } = await import("resend");
  const resend = new Resend(apiKey);

  const { data, error } = await resend.emails.send({
    from,
    to: payload.to,
    subject: payload.subject,
    html: payload.html,
    ...(payload.replyTo ? { reply_to: payload.replyTo } : {}),
  });

  if (error) {
    throw new Error(`[EMAIL] Fehler beim Senden: ${error.message}`);
  }

  return { id: data?.id ?? null, skipped: false };
}
