import { createFileRoute } from "@tanstack/react-router";
import { requireAuth, ok, err } from "@/lib/api/helpers.server";
import { providerInputSchema } from "@/lib/api/catalog-schema";
import { createServiceClient } from "@/lib/supabase.server";

export const Route = createFileRoute("/api/providers")({
  server: {
    handlers: {
      GET: async ({ request }: { request: Request }) => {
        const auth = await requireAuth(request);
        if (!auth.ok) return auth.response;
        if (auth.user.role === "employee") return err("Zugriff verweigert", 403);
        const { data, error } = await createServiceClient()
          .from("providers")
          .select(
            "id, name, energy_type, rating, is_partner, is_active, created_at, updated_at, tariffs(count)",
          )
          .order("name");
        if (error) return err("Anbieter konnten nicht geladen werden", 500);
        return ok({ data: data ?? [] });
      },
      POST: async ({ request }: { request: Request }) => {
        const auth = await requireAuth(request);
        if (!auth.ok) return auth.response;
        if (auth.user.role === "employee") return err("Zugriff verweigert", 403);
        const parsed = providerInputSchema.safeParse(await request.json().catch(() => null));
        if (!parsed.success) return err("Ungültige Anbieterdaten", 400);
        const { data, error } = await createServiceClient()
          .from("providers")
          .insert(parsed.data)
          .select("id, name, energy_type, rating, is_partner, is_active, created_at, updated_at")
          .single();
        if (error)
          return err(
            error.code === "23505"
              ? "Anbieter existiert bereits"
              : "Anbieter konnte nicht gespeichert werden",
            error.code === "23505" ? 409 : 500,
          );
        return ok({ data }, 201);
      },
    },
  },
});
