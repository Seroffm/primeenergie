import { createFileRoute } from "@tanstack/react-router";
import { requireAuth, ok, err } from "@/lib/api/helpers.server";
import { createServiceClient } from "@/lib/supabase.server";

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
      POST: async ({
        request,
        params,
      }: {
        request: Request;
        params: { id: string };
      }) => {
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
        if (!ALLOWED_TYPES.has(file.type)) return err("Dateityp nicht erlaubt (PDF, JPG, PNG, WebP)", 415);

        const supabase = createServiceClient();

        // Prüfen ob Lead existiert und zugänglich ist
        const { data: lead, error: leadErr } = await supabase
          .from("leads")
          .select("id, assigned_to")
          .eq("id", params.id)
          .single();

        if (leadErr || !lead) return err("Lead nicht gefunden", 404);
        if (auth.user.role === "employee" && lead.assigned_to !== auth.user.userId) {
          return err("Zugriff verweigert", 403);
        }

        // Eindeutiger Dateipfad: lead-id / timestamp_originalname
        const ext = file.name.split(".").pop() ?? "bin";
        const safeName = file.name.replace(/[^a-zA-Z0-9._-]/g, "_");
        const path = `${params.id}/${Date.now()}_${safeName}`;

        const arrayBuf = await file.arrayBuffer();
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
            file_size: file.size,
            mime_type: file.type,
            storage_path: path,
          })
          .select("id, file_name, file_size, mime_type, created_at")
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
