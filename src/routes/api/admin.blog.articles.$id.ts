import { createFileRoute } from "@tanstack/react-router";
import { ok, err, requireAuth } from "@/lib/api/helpers.server";
import { createServiceClient } from "@/lib/supabase.server";

const SLUG_REGEX = /^[a-z0-9-]+$/;

export const Route = createFileRoute("/api/admin/blog/articles/$id")({
  server: {
    handlers: {
      PATCH: async ({ request, params }: { request: Request; params: { id: string } }) => {
        try {
          const auth = await requireAuth(request);
          if (!auth.ok) return auth.response;
          if (auth.user.role === "employee") return err("Keine Berechtigung", 403);

          const body = await request.json();
          const allowed = [
            "slug",
            "title",
            "teaser",
            "tag",
            "image",
            "author",
            "body",
            "seo_title",
            "seo_description",
            "read_time_min",
            "is_published",
          ] as const;

          const update: Record<string, unknown> = {};
          for (const key of allowed) {
            if (key in body) update[key] = body[key];
          }

          if (update.slug !== undefined && !SLUG_REGEX.test(update.slug as string)) {
            return err("Slug darf nur Kleinbuchstaben, Ziffern und Bindestriche enthalten", 400);
          }

          // Fetch current article to check published_at state
          const supabase = createServiceClient();
          const { data: current, error: fetchError } = await supabase
            .from("blog_articles")
            .select("is_published, published_at")
            .eq("id", params.id)
            .single();

          if (fetchError || !current) return err("Artikel nicht gefunden", 404);

          // Handle published_at logic
          if (update.is_published === true && !current.is_published && !current.published_at) {
            update.published_at = new Date().toISOString();
          } else if (update.is_published === false) {
            update.published_at = null;
          }

          const { data, error } = await supabase
            .from("blog_articles")
            .update(update)
            .eq("id", params.id)
            .select("*")
            .single();

          if (error) {
            if (error.code === "23505") return err("Slug bereits vergeben", 409);
            return err("Datenbankfehler", 500);
          }

          return ok({ data });
        } catch {
          return err("Interner Fehler", 500);
        }
      },

      DELETE: async ({ request, params }: { request: Request; params: { id: string } }) => {
        try {
          const auth = await requireAuth(request);
          if (!auth.ok) return auth.response;
          if (auth.user.role !== "admin") return err("Nur Admins dürfen Artikel löschen", 403);

          const supabase = createServiceClient();
          const { error } = await supabase
            .from("blog_articles")
            .delete()
            .eq("id", params.id);

          if (error) return err("Datenbankfehler", 500);

          return ok({ success: true });
        } catch {
          return err("Interner Fehler", 500);
        }
      },
    },
  },
});
