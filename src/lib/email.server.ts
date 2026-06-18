import process from "node:process";

export interface EmailPayload {
  to: string;
  subject: string;
  html: string;
  replyTo?: string;
}

export async function sendEmail(payload: EmailPayload): Promise<void> {
  const apiKey = process.env.RESEND_API_KEY;
  const from = process.env.EMAIL_FROM ?? "EnergieClever <noreply@energieclever.de>";

  if (!apiKey) {
    console.log(
      `[EMAIL DEV] An: ${payload.to} | Betreff: ${payload.subject}`,
    );
    return;
  }

  // Dynamischer Import damit Resend nicht ins Client-Bundle gelangt
  const { Resend } = await import("resend");
  const resend = new Resend(apiKey);

  const { error } = await resend.emails.send({
    from,
    to: payload.to,
    subject: payload.subject,
    html: payload.html,
    ...(payload.replyTo ? { reply_to: payload.replyTo } : {}),
  });

  if (error) {
    console.error("[EMAIL] Fehler beim Senden:", error);
  }
}
