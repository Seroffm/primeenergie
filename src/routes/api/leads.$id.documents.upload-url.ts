import { createFileRoute } from "@tanstack/react-router";
import { z } from "zod";
import { requireAuth, requireLeadAccess, ok, err, methodNotAllowed } from "@/lib/api/helpers.server";
import { createServiceClient } from "@/lib/supabase.server";
import {
  MAX_UPLOAD_BYTES,
  MAX_UPLOAD_MB,
  STAFF_DOCUMENT_TYPES,
  isAllowedUploadType,
} from "@/lib/upload-limits";

const metadataSchema = z.object({
  file_name: z.string().trim().min(1).max(255),
  mime_type: z.string().trim().max(100),
  size_bytes: z.number().int().positive().max(MAX_UPLOAD_BYTES),
});

export const Route = createFileRoute("/api/leads/$id/documents/upload-url")({
  server: {
    handlers: {
      GET: () => methodNotAllowed(["POST"]),
      POST: async ({ request, params }: { request: Request; params: { id: string } }) => {
        const auth = await requireAuth(request);
        if (!auth.ok) return auth.response;

        const body = metadataSchema.safeParse(await request.json().catch(() => null));
        if (!body.success) return err(`Datei ist ungültig oder größer als ${MAX_UPLOAD_MB} MB`, 400);
        if (!isAllowedUploadType(body.data.mime_type, STAFF_DOCUMENT_TYPES)) {
          return err("Dateityp nicht erlaubt (PDF, JPG, PNG, WebP oder GIF)", 415);
        }

        const supabase = createServiceClient();
        const access = await requireLeadAccess(supabase, auth.user, params.id);
        if (!access.ok) return access.response;

        const safeName = body.data.file_name.replace(/[^a-zA-Z0-9._-]/g, "_");
        const path = `${params.id}/${crypto.randomUUID()}_${safeName}`;
        const { data, error } = await supabase.storage
          .from("lead-documents")
          .createSignedUploadUrl(path);
        if (error || !data) {
          console.error("Document signed upload URL error:", error);
          return err("Upload konnte nicht vorbereitet werden", 500);
        }

        return ok({ data: { path: data.path, token: data.token } });
      },
    },
  },
});
