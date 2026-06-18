import { createFileRoute } from "@tanstack/react-router";
import { requireAuth, getPagination, ok, err } from "@/lib/api/helpers.server";
import { createServiceClient } from "@/lib/supabase.server";

export const Route = createFileRoute("/api/leads/$id/documents")({
  server: {
    handlers: {
      GET: async ({
        request,
        params,
      }: {
        request: Request;
        params: { id: string };
      }) => {
        const auth = await requireAuth(request);
        if (!auth.ok) return auth.response;

        const { page, pageSize, from, to } = getPagination(request, 100);
        const supabase = createServiceClient();

        const { data, count, error } = await supabase
          .from("lead_documents")
          .select(
            "id, lead_id, uploaded_by, document_type, file_name, storage_path, storage_bucket, mime_type, file_size_bytes, ocr_status, created_at, updated_at",
            { count: "exact" },
          )
          .eq("lead_id", params.id)
          .order("created_at", { ascending: false })
          .range(from, to);

        if (error) return err("Datenbankfehler", 500);

        return ok({ data: data ?? [], count: count ?? 0, page, pageSize });
      },
    },
  },
});
