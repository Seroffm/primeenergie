import { createFileRoute } from "@tanstack/react-router";
import { requireAuth, ok, err } from "@/lib/api/helpers.server";
import { emailTemplateInputSchema } from "@/lib/api/catalog-schema";
import { createServiceClient } from "@/lib/supabase.server";

const SELECT = "id, name, subject, trigger_name, body, is_active, created_at, updated_at";

export const Route = createFileRoute("/api/email-templates")({
  server: {
    handlers: {
      GET: async ({ request }: { request: Request }) => {
        const auth = await requireAuth(request);
        if (!auth.ok) return auth.response;
        if (auth.user.role === "employee") return err("Zugriff verweigert", 403);
        const { data, error } = await createServiceClient()
          .from("email_templates")
          .select(SELECT)
          .order("name");
        if (error) return err("Vorlagen konnten nicht geladen werden", 500);
        return ok({ data: data ?? [] });
      },
      POST: async ({ request }: { request: Request }) => {
        const auth = await requireAuth(request);
        if (!auth.ok) return auth.response;
        if (auth.user.role === "employee") return err("Zugriff verweigert", 403);
        const parsed = emailTemplateInputSchema.safeParse(await request.json().catch(() => null));
        if (!parsed.success) return err("Ungültige Vorlagendaten", 400);
        const { data, error } = await createServiceClient()
          .from("email_templates")
          .insert(parsed.data)
          .select(SELECT)
          .single();
        if (error)
          return err(
            error.code === "23505"
              ? "Vorlage existiert bereits"
              : "Vorlage konnte nicht gespeichert werden",
            error.code === "23505" ? 409 : 500,
          );
        return ok({ data }, 201);
      },
    },
  },
});
