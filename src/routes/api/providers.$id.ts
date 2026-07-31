import { createFileRoute } from "@tanstack/react-router";
import { requireAuth, ok, err } from "@/lib/api/helpers.server";
import { providerInputSchema } from "@/lib/api/catalog-schema";
import { createServiceClient } from "@/lib/supabase.server";

export const Route = createFileRoute("/api/providers/$id")({
  server: {
    handlers: {
      PATCH: async ({ request, params }: { request: Request; params: { id: string } }) => {
        const auth = await requireAuth(request);
        if (!auth.ok) return auth.response;
        if (auth.user.role === "employee") return err("Zugriff verweigert", 403);
        const parsed = providerInputSchema
          .partial()
          .safeParse(await request.json().catch(() => null));
        if (!parsed.success || Object.keys(parsed.data).length === 0)
          return err("Ungültige Anbieterdaten", 400);
        const { data, error } = await createServiceClient()
          .from("providers")
          .update(parsed.data)
          .eq("id", params.id)
          .select("id, name, energy_type, rating, is_partner, is_active, created_at, updated_at")
          .single();
        if (error || !data) return err("Anbieter konnte nicht gespeichert werden", 500);
        return ok({ data });
      },
    },
  },
});
