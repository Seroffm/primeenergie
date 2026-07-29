import { createFileRoute } from "@tanstack/react-router";
import { requireAuth, ok, err } from "@/lib/api/helpers.server";
import { createServiceClient } from "@/lib/supabase.server";

export const Route = createFileRoute("/api/leads/$id/documents/$docId")({
  server: {
    handlers: {
      DELETE: async ({
        request,
        params,
      }: {
        request: Request;
        params: { id: string; docId: string };
      }) => {
        try {
          const auth = await requireAuth(request);
          if (!auth.ok) return auth.response;

          const supabase = createServiceClient();
          const { data: lead, error: leadError } = await supabase
            .from("leads")
            .select("id, assigned_to")
            .eq("id", params.id)
            .single();

          if (leadError || !lead) return err("Lead nicht gefunden", 404);
          if (auth.user.role === "employee" && lead.assigned_to !== auth.user.userId) {
            return err("Zugriff verweigert", 403);
          }

          const { data: document, error: documentError } = await supabase
            .from("lead_documents")
            .select("id, storage_path, storage_bucket")
            .eq("id", params.docId)
            .eq("lead_id", params.id)
            .single();

          if (documentError || !document) return err("Dokument nicht gefunden", 404);

          const bucket = (document.storage_bucket as string) || "lead-documents";
          const path = document.storage_path as string;
          const { error: storageError } = await supabase.storage.from(bucket).remove([path]);

          if (storageError) {
            console.error("Storage delete error:", storageError);
            return err("Datei konnte nicht gelöscht werden", 500);
          }

          const { error: deleteError } = await supabase
            .from("lead_documents")
            .delete()
            .eq("id", params.docId)
            .eq("lead_id", params.id);

          if (deleteError) {
            console.error("Document delete error:", deleteError);
            return err("Dokument konnte nicht gelöscht werden", 500);
          }

          return ok({ success: true });
        } catch (error) {
          console.error("Document delete error:", error);
          return err("Interner Fehler", 500);
        }
      },
    },
  },
});
