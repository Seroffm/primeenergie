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
          .select("id, auth_user_id, role, full_name, email, is_active")
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
          },
        });
      },
    },
  },
});
