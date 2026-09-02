import { createFileRoute } from "@tanstack/react-router";
import { z } from "zod";
import { requireAuth, requireLeadAccess, ok, err, methodNotAllowed } from "@/lib/api/helpers.server";
import { createServiceClient } from "@/lib/supabase.server";
import { hasValidFileSignature } from "@/lib/api/upload-validation.server";
import {
  MAX_UPLOAD_BYTES,
  MAX_UPLOAD_MB,
  STAFF_DOCUMENT_TYPES,
  isAllowedUploadType,
} from "@/lib/upload-limits";

const metadataSchema = z.object({
  path: z.string().trim().min(1).max(500),
  file_name: z.string().trim().min(1).max(255),
  mime_type: z.string().trim().max(100),
  size_bytes: z.number().int().positive().max(MAX_UPLOAD_BYTES),
});

export const Route = createFileRoute("/api/leads/$id/documents/upload-complete")({
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
        if (!body.data.path.startsWith(`${params.id}/`)) return err("Ungültiger Uploadpfad", 400);

        const supabase = createServiceClient();
        const access = await requireLeadAccess(supabase, auth.user, params.id);
        if (!access.ok) return access.response;

        const { data: existing } = await supabase
          .from("lead_documents")
          .select("id, file_name, file_size_bytes, mime_type, created_at")
          .eq("lead_id", params.id)
          .eq("storage_path", body.data.path)
          .maybeSingle();
        if (existing) return ok({ data: existing });

        const { data: blob, error: downloadError } = await supabase.storage
          .from("lead-documents")
          .download(body.data.path);
        if (downloadError || !blob) return err("Hochgeladene Datei wurde nicht gefunden", 400);
        if (blob.size !== body.data.size_bytes || blob.size > MAX_UPLOAD_BYTES) {
          await supabase.storage.from("lead-documents").remove([body.data.path]);
          return err(`Datei ist ungültig oder größer als ${MAX_UPLOAD_MB} MB`, 413);
        }

        const buffer = await blob.arrayBuffer();
        if (!hasValidFileSignature(body.data.mime_type, buffer)) {
          await supabase.storage.from("lead-documents").remove([body.data.path]);
          return err("Dateiinhalt stimmt nicht mit dem Dateityp überein", 415);
        }

        const { data: doc, error: dbError } = await supabase
          .from("lead_documents")
          .insert({
            lead_id: params.id,
            uploaded_by: auth.user.userId,
            file_name: body.data.file_name,
            file_size_bytes: blob.size,
            mime_type: body.data.mime_type,
            storage_path: body.data.path,
          })
          .select("id, file_name, file_size_bytes, mime_type, created_at")
          .single();
        if (dbError || !doc) {
          await supabase.storage.from("lead-documents").remove([body.data.path]);
          return err("Dokument konnte nicht gespeichert werden", 500);
        }

        return ok({ data: doc }, 201);
      },
    },
  },
});
