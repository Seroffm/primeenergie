import { createFileRoute } from "@tanstack/react-router";
import { requireAuth, ok, err } from "@/lib/api/helpers.server";
import { createServiceClient } from "@/lib/supabase.server";

export const Route = createFileRoute("/api/leads/$id/documents/$docId/url")({
  server: {
    handlers: {
      GET: async ({
        request,
        params,
      }: {
        request: Request;
        params: { id: string; docId: string };
      }) => {
        const auth = await requireAuth(request);
        if (!auth.ok) return auth.response;

        const supabase = createServiceClient();

        const { data: doc, error: docError } = await supabase
          .from("lead_documents")
          .select("id, lead_id, storage_path, storage_bucket, file_name")
          .eq("id", params.docId)
          .eq("lead_id", params.id)
          .single();

        if (docError || !doc) return err("Dokument nicht gefunden", 404);

        if (auth.user.role === "employee" && auth.user.userId !== params.id) {
          const { data: lead } = await supabase
            .from("leads")
            .select("assigned_to")
            .eq("id", params.id)
            .single();
          if (lead?.assigned_to !== auth.user.userId) return err("Zugriff verweigert", 403);
        }

        const bucket = (doc.storage_bucket as string) || "lead-documents";
        const path = doc.storage_path as string;

        const { data: signedData, error: signError } = await supabase.storage
          .from(bucket)
          .createSignedUrl(path, 300);

        if (signError || !signedData?.signedUrl) {
          return err("Download-URL konnte nicht erstellt werden", 500);
        }

        return ok({ data: { url: signedData.signedUrl, file_name: doc.file_name } });
      },
    },
  },
});
