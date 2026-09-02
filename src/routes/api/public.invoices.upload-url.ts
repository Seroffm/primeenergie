import { createFileRoute } from "@tanstack/react-router";
import { z } from "zod";
import { consumeRateLimit, err, methodNotAllowed, ok } from "@/lib/api/helpers.server";
import { createServiceClient } from "@/lib/supabase.server";
import {
  isAllowedUploadType,
  MAX_UPLOAD_BYTES,
  MAX_UPLOAD_MB,
  PUBLIC_INVOICE_TYPES,
} from "@/lib/upload-limits";

const metadataSchema = z.object({
  file_name: z.string().trim().min(1).max(255),
  mime_type: z.string().trim().max(100),
  size_bytes: z.number().int().positive().max(MAX_UPLOAD_BYTES),
});

export const Route = createFileRoute("/api/public/invoices/upload-url")({
  server: {
    handlers: {
      GET: () => methodNotAllowed(["POST"]),
      POST: async ({ request }: { request: Request }) => {
        const body = metadataSchema.safeParse(await request.json().catch(() => null));
        if (!body.success) return err(`Datei ist ungültig oder größer als ${MAX_UPLOAD_MB} MB`, 400);
        if (!isAllowedUploadType(body.data.mime_type, PUBLIC_INVOICE_TYPES)) {
          return err("Dateityp nicht erlaubt (PDF, JPG oder PNG)", 415);
        }

        const withinLimit = await consumeRateLimit(request, "public_invoice_upload", 10, 900);
        if (!withinLimit) return err("Zu viele Uploads. Bitte versuchen Sie es später erneut.", 429);

        const safeName = body.data.file_name.replace(/[^a-zA-Z0-9._-]/g, "_");
        const path = `pending-invoices/${crypto.randomUUID()}_${safeName}`;
        const { data, error } = await createServiceClient().storage
          .from("lead-documents")
          .createSignedUploadUrl(path);
        if (error || !data) {
          console.error("Public invoice signed upload URL error:", error);
          return err("Upload konnte nicht vorbereitet werden", 500);
        }

        return ok({ data: { path: data.path, token: data.token } });
      },
    },
  },
});
