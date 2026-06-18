import { createFileRoute } from "@tanstack/react-router";
import { requireAuth, ok, err } from "@/lib/api/helpers.server";
import { createServiceClient } from "@/lib/supabase.server";

export const Route = createFileRoute("/api/team")({
  server: {
    handlers: {
      // GET /api/team — alle Profile (nur manager/admin)
      GET: async ({ request }: { request: Request }) => {
        const auth = await requireAuth(request);
        if (!auth.ok) return auth.response;
        if (auth.user.role === "employee") return err("Zugriff verweigert", 403);

        const supabase = createServiceClient();
        const { data, error } = await supabase
          .from("profiles")
          .select("id, auth_user_id, full_name, email, role, is_active, phone, avatar_url, created_at")
          .order("created_at", { ascending: true });

        if (error) return err("Datenbankfehler", 500);
        return ok({ data: data ?? [] });
      },

      // POST /api/team — Mitarbeiter einladen
      POST: async ({ request }: { request: Request }) => {
        const auth = await requireAuth(request);
        if (!auth.ok) return auth.response;
        if (auth.user.role !== "admin") return err("Nur Admins dürfen einladen", 403);

        let body: { email?: string; full_name?: string; role?: string };
        try { body = await request.json(); } catch { return err("Ungültiger Body", 400); }

        const { email, full_name, role = "employee" } = body;
        if (!email) return err("E-Mail fehlt", 400);

        const validRoles = new Set(["employee", "manager", "admin"]);
        if (!validRoles.has(role)) return err("Ungültige Rolle", 400);

        const supabase = createServiceClient();

        // User über Supabase Admin API anlegen (E-Mail bestätigt, temporäres Passwort)
        const tempPassword = Math.random().toString(36).slice(2, 10) + "A1!";
        const { data: newUser, error: createErr } = await supabase.auth.admin.createUser({
          email,
          password: tempPassword,
          email_confirm: true,
        });

        if (createErr) {
          if (createErr.message?.includes("already")) return err("E-Mail bereits registriert", 409);
          return err("Nutzer konnte nicht angelegt werden", 500);
        }

        // Profil-Rolle + Name setzen (Trigger hat Profil angelegt)
        await supabase
          .from("profiles")
          .update({ role, full_name: full_name ?? null })
          .eq("auth_user_id", newUser.user.id);

        return ok({
          data: {
            id: newUser.user.id,
            email,
            role,
            temp_password: tempPassword,
          },
        }, 201);
      },
    },
  },
});
