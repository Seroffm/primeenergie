import process from "node:process";

export interface EmailPayload {
  to: string;
  subject: string;
  html: string;
  replyTo?: string;
  /** Stabiler Schlüssel für sichere Wiederholungen ohne doppelte Zustellung. */
  idempotencyKey?: string;
}

export interface EmailResult {
  id: string | null;
  skipped: boolean;
  attempts: number;
}

const MAX_ATTEMPTS = 3;
const RETRY_DELAYS_MS = [250, 750] as const;

type ResendError = {
  message: string;
  statusCode: number | null;
  name: string;
};

function isRetryable(error: ResendError): boolean {
  return (
    error.statusCode === 408 ||
    error.statusCode === 429 ||
    (error.statusCode !== null && error.statusCode >= 500) ||
    error.name === "rate_limit_exceeded" ||
    error.name === "application_error" ||
    error.name === "internal_server_error" ||
    error.name === "concurrent_idempotent_requests"
  );
}

function delay(milliseconds: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, milliseconds));
}

export function getEmailReadiness(): { ok: boolean; reason?: string } {
  if (!process.env.RESEND_API_KEY?.trim()) return { ok: false, reason: "api_key_missing" };
  if (!process.env.EMAIL_FROM?.trim()) return { ok: false, reason: "sender_missing" };
  if (!process.env.NOTIFICATION_EMAIL?.trim()) {
    return { ok: false, reason: "notification_recipient_missing" };
  }
  return { ok: true };
}

export async function sendEmail(payload: EmailPayload): Promise<EmailResult> {
  const apiKey = process.env.RESEND_API_KEY?.trim();
  const from = process.env.EMAIL_FROM ?? "PRIME ENERGIE <info@primeenergie.de>";

  if (!apiKey) {
    if (process.env.NODE_ENV === "production") {
      throw new Error("[EMAIL] RESEND_API_KEY fehlt in der Produktionsumgebung");
    }
    console.log(`[EMAIL DEV] An: ${payload.to} | Betreff: ${payload.subject}`);
    return { id: null, skipped: true, attempts: 0 };
  }

  // Dynamischer Import damit Resend nicht ins Client-Bundle gelangt
  const { Resend } = await import("resend");
  const resend = new Resend(apiKey);
  const idempotencyKey = payload.idempotencyKey ?? `prime-${crypto.randomUUID()}`;

  for (let attempt = 1; attempt <= MAX_ATTEMPTS; attempt++) {
    try {
      const { data, error } = await resend.emails.send(
        {
          from,
          to: payload.to,
          subject: payload.subject,
          html: payload.html,
          ...(payload.replyTo ? { reply_to: payload.replyTo } : {}),
        },
        { idempotencyKey },
      );

      if (!error) return { id: data?.id ?? null, skipped: false, attempts: attempt };

      const resendError = error as ResendError;
      console.error(
        JSON.stringify({
          event: "email_send_failed",
          attempt,
          retryable: isRetryable(resendError),
          providerCode: resendError.name,
          statusCode: resendError.statusCode,
        }),
      );

      if (!isRetryable(resendError) || attempt === MAX_ATTEMPTS) {
        throw new Error(
          `[EMAIL] Versand fehlgeschlagen (${resendError.name}, Status ${resendError.statusCode ?? "unbekannt"})`,
        );
      }
    } catch (error) {
      if (error instanceof Error && error.message.startsWith("[EMAIL] Versand fehlgeschlagen")) {
        throw error;
      }
      console.error(
        JSON.stringify({
          event: "email_transport_failed",
          attempt,
          retryable: attempt < MAX_ATTEMPTS,
          errorType: error instanceof Error ? error.name : "UnknownError",
        }),
      );
      if (attempt === MAX_ATTEMPTS) {
        throw new Error("[EMAIL] Versand nach drei Transportversuchen fehlgeschlagen", {
          cause: error,
        });
      }
    }

    await delay(RETRY_DELAYS_MS[attempt - 1] ?? RETRY_DELAYS_MS.at(-1)!);
  }

  throw new Error("[EMAIL] Unerwarteter Versandfehler");
}
