import { createFileRoute } from "@tanstack/react-router";
import { requireAuth, getPagination, err } from "@/lib/api/helpers.server";
import { createServiceClient } from "@/lib/supabase.server";

export const Route = createFileRoute("/api/leads")({
  server: {
    handlers: {
      GET: async ({ request }: { request: Request }) => {
        const auth = await requireAuth(request);
        if (!auth.ok) return auth.response;

        const { page, pageSize, from, to } = getPagination(request, 50);
        const supabase = createServiceClient();

        let query = supabase
          .from("leads")
          .select(
            "id, lead_number, first_name, last_name, email, phone, status, score, score_label, product_type, customer_type, assigned_to, created_at, updated_at",
            { count: "exact" },
          )
          .order("created_at", { ascending: false })
          .range(from, to);

        // Mitarbeiter (employee) sehen nur zugewiesene Leads
        if (auth.user.role === "employee") {
          query = query.eq("assigned_to", auth.user.userId);
        }

        const { data, count, error } = await query;
        if (error) return err("Datenbankfehler", 500);

        return new Response(
          JSON.stringify({ data: data ?? [], count: count ?? 0, page, pageSize }),
          { status: 200, headers: { "Content-Type": "application/json" } },
        );
      },
    },
  },
});
