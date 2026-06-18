import { createFileRoute } from "@tanstack/react-router";
import { ok, err, requireAuth } from "@/lib/api/helpers.server";
import { createServiceClient } from "@/lib/supabase.server";

const SLUG_REGEX = /^[a-z0-9-]+$/;

export const Route = createFileRoute("/api/admin/blog/articles")({
  server: {
    handlers: {
      GET: async ({ request }: { request: Request }) => {
        try {
          const auth = await requireAuth(request);
          if (!auth.ok) return auth.response;
          if (auth.user.role === "employee") return err("Keine Berechtigung", 403);

          const supabase = createServiceClient();

          const { data, count, error } = await supabase
            .from("blog_articles")
            .select("*", { count: "exact" })
            .order("updated_at", { ascending: false });

          if (error) return err("Datenbankfehler", 500);

          return ok({ data: data ?? [], count: count ?? 0 });
        } catch {
          return err("Interner Fehler", 500);
        }
      },

      POST: async ({ request }: { request: Request }) => {
        try {
          const auth = await requireAuth(request);
          if (!auth.ok) return auth.response;
          if (auth.user.role === "employee") return err("Keine Berechtigung", 403);

          const body = await request.json();
          const {
            slug,
            title,
            teaser,
            tag = "Allgemein",
            image = "",
            author = "EnergieClever Redaktion",
            body: articleBody = [],
            seo_title = null,
            seo_description = null,
            read_time_min = 5,
            is_published = false,
          } = body as Record<string, unknown>;

          if (!slug || typeof slug !== "string") return err("Slug ist erforderlich", 400);
          if (!title || typeof title !== "string") return err("Titel ist erforderlich", 400);
          if (!teaser || typeof teaser !== "string") return err("Teaser ist erforderlich", 400);
          if (!SLUG_REGEX.test(slug as string))
            return err("Slug darf nur Kleinbuchstaben, Ziffern und Bindestriche enthalten", 400);

          const supabase = createServiceClient();

          const insert: Record<string, unknown> = {
            slug,
            title,
            teaser,
            tag,
            image,
            author,
            body: articleBody,
            seo_title,
            seo_description,
            read_time_min,
            is_published,
            created_by: auth.user.profileId,
          };

          if (is_published) {
            insert.published_at = new Date().toISOString();
          }

          const { data, error } = await supabase
            .from("blog_articles")
            .insert(insert)
            .select("*")
            .single();

          if (error) {
            if (error.code === "23505") return err("Slug bereits vergeben", 409);
            return err("Datenbankfehler", 500);
          }

          return ok({ data }, 201);
        } catch {
          return err("Interner Fehler", 500);
        }
      },
    },
  },
});
