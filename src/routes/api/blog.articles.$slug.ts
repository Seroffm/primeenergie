import { createFileRoute } from "@tanstack/react-router";
import { ok, err } from "@/lib/api/helpers.server";
import { createServiceClient } from "@/lib/supabase.server";

export const Route = createFileRoute("/api/blog/articles/$slug")({
  server: {
    handlers: {
      GET: async ({ params }: { request: Request; params: { slug: string } }) => {
        try {
          const supabase = createServiceClient();

          const { data, error } = await supabase
            .from("blog_articles")
            .select("*")
            .eq("slug", params.slug)
            .eq("is_published", true)
            .single();

          if (error || !data) return err("Artikel nicht gefunden", 404);

          return ok({ data });
        } catch {
          return err("Interner Fehler", 500);
        }
      },
    },
  },
});
