import { createFileRoute } from "@tanstack/react-router";
import { requireAuth, ok, err } from "@/lib/api/helpers.server";
import { tariffInputSchema } from "@/lib/api/catalog-schema";
import { createServiceClient } from "@/lib/supabase.server";

const SELECT =
  "id, provider_id, name, energy_type, segment, price_per_kwh, base_price, duration_months, price_guarantee_months, is_eco, is_active, created_at, updated_at, providers(name)";

export const Route = createFileRoute("/api/tariffs")({
  server: {
    handlers: {
      GET: async ({ request }: { request: Request }) => {
        const auth = await requireAuth(request);
        if (!auth.ok) return auth.response;
        if (auth.user.role === "employee") return err("Zugriff verweigert", 403);
        const { data, error } = await createServiceClient()
          .from("tariffs")
          .select(SELECT)
          .order("name");
        if (error) return err("Tarife konnten nicht geladen werden", 500);
        return ok({ data: data ?? [] });
      },
      POST: async ({ request }: { request: Request }) => {
        const auth = await requireAuth(request);
        if (!auth.ok) return auth.response;
        if (auth.user.role === "employee") return err("Zugriff verweigert", 403);
        const parsed = tariffInputSchema.safeParse(await request.json().catch(() => null));
        if (!parsed.success) return err("Ungültige Tarifdaten", 400);
        const { data, error } = await createServiceClient()
          .from("tariffs")
          .insert(parsed.data)
          .select(SELECT)
          .single();
        if (error)
          return err(
            error.code === "23505"
              ? "Tarif existiert bereits"
              : "Tarif konnte nicht gespeichert werden",
            error.code === "23505" ? 409 : 500,
          );
        return ok({ data }, 201);
      },
    },
  },
});
