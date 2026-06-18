import { createFileRoute } from "@tanstack/react-router";
import { requireAuth, ok, err } from "@/lib/api/helpers.server";
import { createServiceClient } from "@/lib/supabase.server";

export const Route = createFileRoute("/api/leads/$id/assign")({
  server: {
    handlers: {
      PATCH: async ({
        request,
        params,
      }: {
        request: Request;
        params: { id: string };
      }) => {
        const auth = await requireAuth(request);
        if (!auth.ok) return auth.response;
        if (auth.user.role === "employee") return err("Nur Manager/Admins dürfen zuweisen", 403);

        let body: { assigned_to: string | null };
        try { body = await request.json(); } catch { return err("Ungültiger Body", 400); }

        const supabase = createServiceClient();

        // Prüfen ob Mitarbeiter existiert (falls assigned_to gesetzt)
        if (body.assigned_to) {
          const { data: profile } = await supabase
            .from("profiles")
            .select("id, auth_user_id, is_active")
            .eq("auth_user_id", body.assigned_to)
            .single();
          if (!profile || !profile.is_active) return err("Mitarbeiter nicht gefunden oder inaktiv", 404);
        }

        const { error } = await supabase
          .from("leads")
          .update({ assigned_to: body.assigned_to })
          .eq("id", params.id);

        if (error) return err("Zuweisung fehlgeschlagen", 500);
        return ok({ data: { ok: true } });
      },
    },
  },
});
