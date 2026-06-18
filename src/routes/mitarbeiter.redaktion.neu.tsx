import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useState } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { AdminShell } from "@/components/mitarbeiter/AdminShell";
import { ArticleEditor } from "@/components/redaktion/ArticleEditor";
import { createArticle } from "@/lib/api-client";
import type { BlogArticle } from "@/lib/api-types";

export const Route = createFileRoute("/mitarbeiter/redaktion/neu")({
  head: () => ({
    meta: [
      { title: "Neuer Artikel – Redaktion" },
      { name: "robots", content: "noindex,nofollow" },
    ],
  }),
  component: NeuArtikelPage,
});

function NeuArtikelPage() {
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const [isSaving, setIsSaving] = useState(false);

  const createMutation = useMutation({
    mutationFn: (data: Partial<BlogArticle>) => createArticle(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin-articles"] });
      queryClient.invalidateQueries({ queryKey: ["blog-articles"] });
      toast.success("Artikel erstellt");
      navigate({ to: "/mitarbeiter/redaktion" });
    },
    onError: (error: Error) => {
      toast.error(error.message || "Erstellen fehlgeschlagen");
    },
  });

  async function handleSave(data: Partial<BlogArticle>) {
    setIsSaving(true);
    try {
      await createMutation.mutateAsync(data);
    } finally {
      setIsSaving(false);
    }
  }

  return (
    <AdminShell title="Neuer Artikel" subtitle="Erstelle einen neuen Blog-Artikel">
      <ArticleEditor onSave={handleSave} isSaving={isSaving} />
    </AdminShell>
  );
}
