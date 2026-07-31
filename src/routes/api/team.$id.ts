import { createFileRoute } from "@tanstack/react-router";
import { requireAuth, ok, err } from "@/lib/api/helpers.server";
import { createServiceClient } from "@/lib/supabase.server";

export const Route = createFileRoute("/api/team/$id")({
  server: {
    handlers: {
      // PATCH /api/team/$id — Rolle oder is_active ändern
      PATCH: async ({ request, params }: { request: Request; params: { id: string } }) => {
        const auth = await requireAuth(request);
        if (!auth.ok) return auth.response;
        if (auth.user.role !== "admin") return err("Nur Admins dürfen Rollen ändern", 403);

        let body: { role?: string; is_active?: boolean; full_name?: string; phone?: string };
        try {
          body = await request.json();
        } catch {
          return err("Ungültiger Body", 400);
        }

        const validRoles = new Set(["employee", "manager", "admin"]);
        if (body.role && !validRoles.has(body.role)) return err("Ungültige Rolle", 400);
        if (body.is_active !== undefined && typeof body.is_active !== "boolean") {
          return err("Ungültiger Aktivstatus", 400);
        }
        if (
          params.id === auth.user.profileId &&
          ((body.role !== undefined && body.role !== auth.user.role) || body.is_active === false)
        ) {
          return err(
            "Die eigene Rolle und der eigene Aktivstatus können hier nicht geändert werden",
            400,
          );
        }

        const supabase = createServiceClient();

        const update: Record<string, unknown> = {};
        if (body.role !== undefined) update.role = body.role;
        if (body.is_active !== undefined) update.is_active = body.is_active;
        if (body.full_name !== undefined) {
          const fullName = body.full_name.trim();
          if (fullName.length < 2 || fullName.length > 150) return err("Ungültiger Name", 400);
          update.full_name = fullName;
        }
        if (body.phone !== undefined) {
          const phone = body.phone.trim();
          if (phone.length > 50) return err("Telefonnummer ist zu lang", 400);
          update.phone = phone || null;
        }

        if (Object.keys(update).length === 0) return err("Keine Felder zum Aktualisieren", 400);

        const { data, error } = await supabase
          .from("profiles")
          .update(update)
          .eq("id", params.id)
          .select("id")
          .maybeSingle();

        if (error) return err("Aktualisierung fehlgeschlagen", 500);
        if (!data) return err("Mitarbeiter nicht gefunden", 404);
        return ok({ data: { ok: true } });
      },

      // DELETE /api/team/$id — Mitarbeiter deaktivieren (kein echtes Löschen)
      DELETE: async ({ request, params }: { request: Request; params: { id: string } }) => {
        const auth = await requireAuth(request);
        if (!auth.ok) return auth.response;
        if (auth.user.role !== "admin") return err("Nur Admins dürfen deaktivieren", 403);

        // Eigenen Account nicht deaktivierbar
        if (params.id === auth.user.profileId)
          return err("Du kannst dich nicht selbst deaktivieren", 400);

        const supabase = createServiceClient();
        const { data, error } = await supabase
          .from("profiles")
          .update({ is_active: false })
          .eq("id", params.id)
          .select("id")
          .maybeSingle();

        if (error) return err("Fehler beim Deaktivieren", 500);
        if (!data) return err("Mitarbeiter nicht gefunden", 404);
        return ok({ data: { ok: true } });
      },
    },
  },
});
