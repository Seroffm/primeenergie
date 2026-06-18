import { createFileRoute } from "@tanstack/react-router";
import { requireAuth, ok, err } from "@/lib/api/helpers.server";
import { createServiceClient } from "@/lib/supabase.server";

export const Route = createFileRoute("/api/leads/$id")({
  server: {
    handlers: {
      GET: async ({
        request,
        params,
      }: {
        request: Request;
        params: { id: string };
      }) => {
        const auth = await requireAuth(request);
        if (!auth.ok) return auth.response;

        const supabase = createServiceClient();
        const { data: lead, error } = await supabase
          .from("leads")
          .select(
            `id, lead_number, first_name, last_name, email, phone,
             status, score, score_label, product_type, customer_type,
             assigned_to, privacy_consent, contact_consent,
             created_at, updated_at,
             lead_addresses ( id, lead_id, address_type, street, house_number,
               address_addition, postal_code, city, state, country, created_at, updated_at ),
             energy_demands ( id, lead_id, energy_type, annual_consumption_kwh,
               consumption_known, household_size, living_area_sqm, heating_type,
               hot_water_with_gas, current_provider, current_tariff,
               monthly_payment, contract_end_date, meter_number, created_at, updated_at )`,
          )
          .eq("id", params.id)
          .single();

        if (error || !lead) return err("Lead nicht gefunden", 404);

        // Mitarbeiter darf nur eigene Leads sehen
        if (auth.user.role === "employee" && lead.assigned_to !== auth.user.userId) {
          return err("Zugriff verweigert", 403);
        }

        return ok({
          data: {
            ...lead,
            addresses: (lead as { lead_addresses?: unknown[] }).lead_addresses ?? [],
            energy_demands: (lead as { energy_demands?: unknown[] }).energy_demands ?? [],
          },
        });
      },
    },
  },
});
