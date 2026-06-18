import { createFileRoute } from "@tanstack/react-router";
import { requireAuth, getPagination, ok, err } from "@/lib/api/helpers.server";
import { createServiceClient } from "@/lib/supabase.server";

export const Route = createFileRoute("/api/leads/$id/notes")({
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
          .from("lead_notes")
          .select("id, lead_id, created_by, note, created_at, updated_at", { count: "exact" })
          .eq("lead_id", params.id)
          .order("created_at", { ascending: false })
          .range(from, to);

        if (error) return err("Datenbankfehler", 500);

        return ok({ data: data ?? [], count: count ?? 0, page, pageSize });
      },

      POST: async ({
        request,
        params,
      }: {
        request: Request;
        params: { id: string };
      }) => {
        const auth = await requireAuth(request);
        if (!auth.ok) return auth.response;

        let body: { note?: string };
        try {
          body = await request.json();
        } catch {
          return err("Ungültiger Request-Body", 400);
        }

        const note = body.note?.trim();
        if (!note) return err("Notiz darf nicht leer sein", 400);

        const supabase = createServiceClient();
        const { data, error } = await supabase
          .from("lead_notes")
          .insert({ lead_id: params.id, created_by: auth.user.userId, note })
          .select()
          .single();

        if (error) return err("Notiz konnte nicht gespeichert werden", 500);

        return ok({ data }, 201);
      },
    },
  },
});
