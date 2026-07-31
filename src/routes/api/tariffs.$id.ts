import { createFileRoute } from "@tanstack/react-router";
import { requireAuth, ok, err } from "@/lib/api/helpers.server";
import { tariffInputSchema } from "@/lib/api/catalog-schema";
import { createServiceClient } from "@/lib/supabase.server";

export const Route = createFileRoute("/api/tariffs/$id")({
  server: {
    handlers: {
      PATCH: async ({ request, params }: { request: Request; params: { id: string } }) => {
        const auth = await requireAuth(request);
        if (!auth.ok) return auth.response;
        if (auth.user.role === "employee") return err("Zugriff verweigert", 403);
        const parsed = tariffInputSchema
          .partial()
          .safeParse(await request.json().catch(() => null));
        if (!parsed.success || Object.keys(parsed.data).length === 0)
          return err("Ungültige Tarifdaten", 400);
        const { data, error } = await createServiceClient()
          .from("tariffs")
          .update(parsed.data)
          .eq("id", params.id)
          .select(
            "id, provider_id, name, energy_type, segment, price_per_kwh, base_price, duration_months, price_guarantee_months, is_eco, is_active, created_at, updated_at, providers(name)",
          )
          .single();
        if (error || !data) return err("Tarif konnte nicht gespeichert werden", 500);
        return ok({ data });
      },
    },
  },
});
