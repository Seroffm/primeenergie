import { createFileRoute } from "@tanstack/react-router";
import { requireAuth, ok, err } from "@/lib/api/helpers.server";
import { createServiceClient } from "@/lib/supabase.server";

export const Route = createFileRoute("/api/me")({
  server: {
    handlers: {
      GET: async ({ request }: { request: Request }) => {
        const auth = await requireAuth(request);
        if (!auth.ok) return auth.response;

        const supabase = createServiceClient();
        const { data: profile, error } = await supabase
          .from("profiles")
          .select("id, auth_user_id, role, full_name, email, is_active, phone, notification_prefs")
          .eq("auth_user_id", auth.user.userId)
          .single();

        if (error || !profile) return err("Profil nicht gefunden", 404);

        return ok({
          data: {
            profileId: profile.id,
            authUserId: profile.auth_user_id,
            role: profile.role,
            full_name: profile.full_name,
            email: profile.email,
            is_active: profile.is_active,
            phone: profile.phone,
            notification_prefs: profile.notification_prefs ?? {},
          },
        });
      },
      PATCH: async ({ request }: { request: Request }) => {
        const auth = await requireAuth(request);
        if (!auth.ok) return auth.response;

        let body: {
          full_name?: string;
          phone?: string | null;
          notification_prefs?: Record<string, boolean>;
        };
        try {
          body = await request.json();
        } catch {
          return err("Ungültiger Request-Body", 400);
        }

        const update: Record<string, unknown> = {};
        if (body.full_name !== undefined) {
          const fullName = body.full_name.trim();
          if (fullName.length < 2 || fullName.length > 150) return err("Ungültiger Name", 400);
          update.full_name = fullName;
        }
        if (body.phone !== undefined) {
          const phone = body.phone?.trim() || null;
          if (phone && phone.length > 50) return err("Telefonnummer ist zu lang", 400);
          update.phone = phone;
        }
        if (body.notification_prefs !== undefined) {
          const allowedKeys = new Set([
            "new_lead",
            "no_reaction",
            "contract_signed",
            "weekly_report",
          ]);
          const prefs = body.notification_prefs;
          if (
            !prefs ||
            Object.entries(prefs).some(
              ([key, value]) => !allowedKeys.has(key) || typeof value !== "boolean",
            )
          ) {
            return err("Ungültige Benachrichtigungseinstellungen", 400);
          }
          update.notification_prefs = prefs;
        }
        if (Object.keys(update).length === 0) return err("Keine Änderungen", 400);

        const supabase = createServiceClient();
        const { data, error } = await supabase
          .from("profiles")
          .update(update)
          .eq("auth_user_id", auth.user.userId)
          .select("id, auth_user_id, role, full_name, email, is_active, phone, notification_prefs")
          .single();
        if (error || !data) return err("Profil konnte nicht gespeichert werden", 500);
        return ok({
          data: {
            profileId: data.id,
            authUserId: data.auth_user_id,
            role: data.role,
            full_name: data.full_name,
            email: data.email,
            is_active: data.is_active,
            phone: data.phone,
            notification_prefs: data.notification_prefs ?? {},
          },
        });
      },
    },
  },
});
