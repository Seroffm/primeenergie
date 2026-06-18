import { createFileRoute, useParams } from "@tanstack/react-router";
import { useState } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { AdminShell } from "@/components/mitarbeiter/AdminShell";
import { ArticleEditor } from "@/components/redaktion/ArticleEditor";
import { getAdminArticles, updateArticle } from "@/lib/api-client";
import type { BlogArticle } from "@/lib/api-types";

export const Route = createFileRoute("/mitarbeiter/redaktion/$id")({
  head: () => ({
    meta: [
      { title: "Artikel bearbeiten – Redaktion" },
      { name: "robots", content: "noindex,nofollow" },
    ],
  }),
  component: EditArtikelPage,
});

function EditArtikelPage() {
  const { id } = useParams({ from: "/mitarbeiter/redaktion/$id" });
  const queryClient = useQueryClient();
  const [isSaving, setIsSaving] = useState(false);

  const { data: articles = [], isLoading } = useQuery({
    queryKey: ["admin-articles"],
    queryFn: getAdminArticles,
  });

  const article = articles.find((a) => a.id === id);

  const updateMutation = useMutation({
    mutationFn: (data: Partial<BlogArticle>) => updateArticle(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin-articles"] });
      queryClient.invalidateQueries({ queryKey: ["blog-articles"] });
      queryClient.invalidateQueries({ queryKey: ["article", article?.slug] });
      toast.success("Artikel gespeichert");
    },
    onError: (error: Error) => {
      toast.error(error.message || "Speichern fehlgeschlagen");
    },
  });

  async function handleSave(data: Partial<BlogArticle>) {
    setIsSaving(true);
    try {
      await updateMutation.mutateAsync(data);
    } finally {
      setIsSaving(false);
    }
  }

  if (isLoading) {
    return (
      <AdminShell title="Artikel bearbeiten">
        <div className="flex h-32 items-center justify-center text-sm text-muted-foreground">
          Laden…
        </div>
      </AdminShell>
    );
  }

  if (!article) {
    return (
      <AdminShell title="Artikel bearbeiten">
        <div className="rounded-lg border border-dashed p-12 text-center text-sm text-muted-foreground">
          Artikel nicht gefunden.
        </div>
      </AdminShell>
    );
  }

  return (
    <AdminShell
      title="Artikel bearbeiten"
      subtitle={article.title}
    >
      <ArticleEditor initial={article} onSave={handleSave} isSaving={isSaving} />
    </AdminShell>
  );
}
