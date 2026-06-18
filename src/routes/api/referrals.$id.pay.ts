import { createFileRoute } from "@tanstack/react-router";
import { requireAuth, ok, err } from "@/lib/api/helpers.server";
import { createServiceClient } from "@/lib/supabase.server";

export const Route = createFileRoute("/api/referrals/$id/pay")({
  server: {
    handlers: {
      PATCH: async ({
        request,
        params,
      }: {
        request: Request;
        params: { id: string };
      }) => {
        const auth = await requireAuth(request);
        if (!auth.ok) return auth.response;

        if (auth.user.role !== "admin") {
          return err("Nur Admins dürfen Prämien als bezahlt markieren", 403);
        }

        let body: { admin_notes?: string } = {};
        try {
          body = (await request.json()) as { admin_notes?: string };
        } catch {
          // body ist optional
        }

        const supabase = createServiceClient();

        const { data: referral, error: fetchError } = await supabase
          .from("referrals")
          .select("id, status, payout_after")
          .eq("id", params.id)
          .single();

        if (fetchError || !referral) {
          return err("Referral nicht gefunden", 404);
        }

        if (referral.status !== "qualified") {
          return err(
            `Nur qualifizierte Referrals können als bezahlt markiert werden (aktueller Status: ${referral.status})`,
            400,
          );
        }

        if (referral.payout_after && new Date(referral.payout_after as string) > new Date()) {
          const payoutDate = new Date(referral.payout_after as string).toLocaleDateString("de-DE", {
            day: "2-digit",
            month: "2-digit",
            year: "numeric",
          });
          return err(
            `Wartezeit noch nicht abgelaufen. Auszahlung frühestens ab ${payoutDate} möglich.`,
            400,
          );
        }

        const { error: updateError } = await supabase
          .from("referrals")
          .update({
            status: "paid",
            paid_at: new Date().toISOString(),
            ...(body.admin_notes ? { admin_notes: body.admin_notes } : {}),
          })
          .eq("id", params.id);

        if (updateError) {
          return err("Aktualisierung fehlgeschlagen", 500);
        }

        return ok({ data: { ok: true } });
      },
    },
  },
});
