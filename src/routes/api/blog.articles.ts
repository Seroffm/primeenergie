import { createFileRoute } from "@tanstack/react-router";
import { ok, err } from "@/lib/api/helpers.server";
import { createServiceClient } from "@/lib/supabase.server";

export const Route = createFileRoute("/api/blog/articles")({
  server: {
    handlers: {
      GET: async ({ request }: { request: Request }) => {
        try {
          const url = new URL(request.url);
          const tag = url.searchParams.get("tag");

          const supabase = createServiceClient();

          let query = supabase
            .from("blog_articles")
            .select("*", { count: "exact" })
            .eq("is_published", true)
            .order("published_at", { ascending: false });

          if (tag) {
            query = query.eq("tag", tag);
          }

          const { data, count, error } = await query;
          if (error) return err("Datenbankfehler", 500);

          return ok({ data: data ?? [], count: count ?? 0 });
        } catch {
          return err("Interner Fehler", 500);
        }
      },
    },
  },
});
