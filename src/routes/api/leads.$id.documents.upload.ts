import { createFileRoute } from "@tanstack/react-router";
import { requireAuth, requireLeadAccess, ok, err } from "@/lib/api/helpers.server";
import { createServiceClient } from "@/lib/supabase.server";
import { hasValidFileSignature } from "@/lib/api/upload-validation.server";

const MAX_SIZE = 10 * 1024 * 1024; // 10 MB
const ALLOWED_TYPES = new Set([
  "application/pdf",
  "image/jpeg",
  "image/png",
  "image/webp",
  "image/gif",
]);

export const Route = createFileRoute("/api/leads/$id/documents/upload")({
  server: {
    handlers: {
      POST: async ({ request, params }: { request: Request; params: { id: string } }) => {
        const auth = await requireAuth(request);
        if (!auth.ok) return auth.response;

        let formData: FormData;
        try {
          formData = await request.formData();
        } catch {
          return err("Ungültiger multipart/form-data Body", 400);
        }

        const file = formData.get("file") as File | null;
        if (!file || typeof file === "string") return err("Kein file-Feld gefunden", 400);

        if (file.size > MAX_SIZE) return err("Datei zu groß (max. 10 MB)", 413);
        if (!ALLOWED_TYPES.has(file.type))
          return err("Dateityp nicht erlaubt (PDF, JPG, PNG, WebP)", 415);

        const supabase = createServiceClient();
        const access = await requireLeadAccess(supabase, auth.user, params.id);
        if (!access.ok) return access.response;

        // Eindeutiger Dateipfad: lead-id / timestamp_originalname
        const safeName = file.name.replace(/[^a-zA-Z0-9._-]/g, "_");
        const path = `${params.id}/${Date.now()}-${crypto.randomUUID()}_${safeName}`;

        const arrayBuf = await file.arrayBuffer();
        if (!hasValidFileSignature(file.type, arrayBuf)) {
          return err("Dateiinhalt stimmt nicht mit dem Dateityp überein", 415);
        }
        const { error: uploadErr } = await supabase.storage
          .from("lead-documents")
          .upload(path, arrayBuf, {
            contentType: file.type,
            upsert: false,
          });

        if (uploadErr) {
          console.error("Storage upload error:", uploadErr);
          return err("Upload fehlgeschlagen", 500);
        }

        // Eintrag in lead_documents
        const { data: doc, error: dbErr } = await supabase
          .from("lead_documents")
          .insert({
            lead_id: params.id,
            uploaded_by: auth.user.userId,
            file_name: file.name,
            file_size_bytes: file.size,
            mime_type: file.type,
            storage_path: path,
          })
          .select("id, file_name, file_size_bytes, mime_type, created_at")
          .single();

        if (dbErr) {
          // Storage-Datei wieder löschen bei DB-Fehler
          await supabase.storage.from("lead-documents").remove([path]);
          return err("Dokument konnte nicht gespeichert werden", 500);
        }

        return ok({ data: doc }, 201);
      },
    },
  },
});
