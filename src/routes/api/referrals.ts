import { createFileRoute } from "@tanstack/react-router";
import { requireAuth, ok, err } from "@/lib/api/helpers.server";
import { createServiceClient } from "@/lib/supabase.server";

export const Route = createFileRoute("/api/referrals")({
  server: {
    handlers: {
      GET: async ({ request }: { request: Request }) => {
        const auth = await requireAuth(request);
        if (!auth.ok) return auth.response;

        if (auth.user.role === "employee") {
          return err("Zugriff verweigert", 403);
        }

        const url = new URL(request.url);
        const statusFilter = url.searchParams.get("status");

        const supabase = createServiceClient();

        let query = supabase
          .from("referrals")
          .select(
            `
            id,
            referrer_lead_id,
            referred_lead_id,
            code_used,
            status,
            reward_amount_cents,
            reward_type,
            payout_after,
            paid_at,
            admin_notes,
            created_at,
            updated_at,
            referrer:leads!referrer_lead_id(first_name, last_name, email),
            referred:leads!referred_lead_id(first_name, last_name, email)
          `,
          )
          .order("created_at", { ascending: false });

        if (statusFilter && ["pending", "qualified", "paid", "expired"].includes(statusFilter)) {
          query = query.eq("status", statusFilter);
        }

        const { data: rows, error } = await query;

        if (error) {
          console.error("Referrals fetch error:", error);
          return err("Referrals konnten nicht geladen werden", 500);
        }

        const referrals = (rows ?? []).map((r) => {
          const referrerRaw = r.referrer as unknown;
          const referredRaw = r.referred as unknown;
          const referrer = (Array.isArray(referrerRaw) ? referrerRaw[0] : referrerRaw) as { first_name: string; last_name: string; email: string } | null;
          const referred = (Array.isArray(referredRaw) ? referredRaw[0] : referredRaw) as { first_name: string; last_name: string; email: string } | null;
          return {
            id: r.id,
            referrer_lead_id: r.referrer_lead_id,
            referred_lead_id: r.referred_lead_id,
            code_used: r.code_used,
            status: r.status,
            reward_amount_cents: r.reward_amount_cents,
            reward_type: r.reward_type,
            payout_after: r.payout_after,
            paid_at: r.paid_at,
            admin_notes: r.admin_notes,
            created_at: r.created_at,
            updated_at: r.updated_at,
            referrer_name: referrer
              ? `${referrer.first_name} ${referrer.last_name}`.trim()
              : null,
            referrer_email: referrer?.email ?? null,
            referred_name: referred
              ? `${referred.first_name} ${referred.last_name}`.trim()
              : null,
            referred_email: referred?.email ?? null,
          };
        });

        return ok({ data: referrals });
      },
    },
  },
});
