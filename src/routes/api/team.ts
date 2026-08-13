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
        const fields =
          auth.user.role === "admin"
            ? "id, auth_user_id, full_name, email, role, is_active, phone, avatar_url, created_at"
            : "id, auth_user_id, full_name, role, is_active";
        const { data, error } = await supabase
          .from("profiles")
          .select(fields)
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
        try {
          body = await request.json();
        } catch {
          return err("Ungültiger Body", 400);
        }

        const { email, full_name, role = "employee" } = body;
        if (!email) return err("E-Mail fehlt", 400);
        const normalizedEmail = email.trim().toLowerCase();
        if (normalizedEmail.length > 254 || !/^\S+@\S+\.\S+$/.test(normalizedEmail)) {
          return err("Ungültige E-Mail", 400);
        }
        const normalizedName = full_name?.trim() || null;
        if (normalizedName && (normalizedName.length < 2 || normalizedName.length > 150)) {
          return err("Ungültiger Name", 400);
        }

        const validRoles = new Set(["employee", "manager", "admin"]);
        if (!validRoles.has(role)) return err("Ungültige Rolle", 400);

        const supabase = createServiceClient();

        // User über Supabase Admin API anlegen (E-Mail bestätigt, temporäres Passwort)
        const tempPassword = `${crypto.randomUUID().replace(/-/g, "").slice(0, 14)}Aa1!`;
        const { data: newUser, error: createErr } = await supabase.auth.admin.createUser({
          email: normalizedEmail,
          password: tempPassword,
          email_confirm: true,
        });

        if (createErr) {
          if (createErr.message?.includes("already")) return err("E-Mail bereits registriert", 409);
          return err("Nutzer konnte nicht angelegt werden", 500);
        }

        // Profil-Rolle + Name setzen (Trigger hat Profil angelegt)
        const { error: profileUpdateError } = await supabase
          .from("profiles")
          .update({ role, full_name: normalizedName, is_active: true })
          .eq("auth_user_id", newUser.user.id);

        if (profileUpdateError) {
          await supabase.auth.admin.deleteUser(newUser.user.id);
          return err("Profil konnte nicht angelegt werden", 500);
        }

        return ok(
          {
            data: {
              id: newUser.user.id,
              email: normalizedEmail,
              role,
              temp_password: tempPassword,
            },
          },
          201,
        );
      },
    },
  },
});
