import { createFileRoute } from "@tanstack/react-router";
import { requireAuth, requireLeadAccess, ok, err } from "@/lib/api/helpers.server";
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
          const access = await requireLeadAccess(supabase, auth.user, params.id);
          if (!access.ok) return access.response;

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
