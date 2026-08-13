import { createFileRoute } from "@tanstack/react-router";
import { requireAuth, getPagination, err } from "@/lib/api/helpers.server";
import { createServiceClient } from "@/lib/supabase.server";
import { isValidLeadNumber } from "@/lib/lead-number";

export const Route = createFileRoute("/api/leads")({
  server: {
    handlers: {
      GET: async ({ request }: { request: Request }) => {
        const auth = await requireAuth(request);
        if (!auth.ok) return auth.response;

        const { page, pageSize, from, to } = getPagination(request, 50);
        const search = new URL(request.url).searchParams.get("q")?.trim() ?? "";
        const supabase = createServiceClient();

        let query = supabase
          .from("leads")
          .select(
            "id, lead_number, first_name, last_name, email, phone, status, score, score_label, product_type, customer_type, assigned_to, wiedervorlage_at, wiedervorlage_note, created_at, updated_at",
            { count: "exact" },
          )
          .order("created_at", { ascending: false })
          .range(from, to);

        // Mitarbeiter (employee) sehen nur zugewiesene Leads
        if (auth.user.role === "employee") {
          query = query.eq("assigned_to", auth.user.userId);
        }

        if (search) {
          const normalized = search.toUpperCase();
          if (isValidLeadNumber(normalized)) {
            query = query.eq("lead_number", normalized);
          } else {
            const safeSearch = search.replace(/[%_,()]/g, "");
            if (safeSearch) {
              query = query.or(
                `first_name.ilike.%${safeSearch}%,last_name.ilike.%${safeSearch}%,email.ilike.%${safeSearch}%,phone.ilike.%${safeSearch}%,lead_number.ilike.%${safeSearch}%`,
              );
            }
          }
        }

        const { data, count, error } = await query;
        if (error) return err("Datenbankfehler", 500);

        return new Response(
          JSON.stringify({ data: data ?? [], count: count ?? 0, page, pageSize }),
          {
            status: 200,
            headers: {
              "Content-Type": "application/json",
              "Cache-Control": "private, no-store",
              Vary: "Authorization",
            },
          },
        );
      },
    },
  },
});
