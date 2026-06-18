import { createFileRoute, Link, Outlet, useNavigate, useRouterState } from "@tanstack/react-router";
import { useState, useEffect } from "react";
import { Plus, Pencil, Trash2, Newspaper } from "lucide-react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { AdminShell } from "@/components/mitarbeiter/AdminShell";
import { getMe, getAdminArticles, deleteArticle } from "@/lib/api-client";
import type { BlogArticle } from "@/lib/api-types";

export const Route = createFileRoute("/mitarbeiter/redaktion")({
  head: () => ({
    meta: [
      { title: "Redaktion – Mitarbeiter" },
      { name: "robots", content: "noindex,nofollow" },
    ],
  }),
  component: RedaktionPage,
});

function formatDate(iso: string): string {
  return new Date(iso).toLocaleDateString("de-DE", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
  });
}

function RedaktionPage() {
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const { location } = useRouterState();
  if (location.pathname !== "/mitarbeiter/redaktion") return <Outlet />;

  const [deleteTarget, setDeleteTarget] = useState<BlogArticle | null>(null);

  const { data: me } = useQuery({
    queryKey: ["me"],
    queryFn: getMe,
  });

  // Redirect wenn kein Zugriff
  useEffect(() => {
    if (me && me.role === "employee") {
      navigate({ to: "/mitarbeiter/dashboard" });
    }
  }, [me, navigate]);

  const {
    data: articles = [],
    isLoading,
    isError,
  } = useQuery({
    queryKey: ["admin-articles"],
    queryFn: getAdminArticles,
    enabled: me?.role === "manager" || me?.role === "admin",
  });

  const deleteMutation = useMutation({
    mutationFn: (id: string) => deleteArticle(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin-articles"] });
      queryClient.invalidateQueries({ queryKey: ["blog-articles"] });
      toast.success("Artikel gelöscht");
      setDeleteTarget(null);
    },
    onError: () => toast.error("Löschen fehlgeschlagen"),
  });

  const isAdmin = me?.role === "admin";

  return (
    <AdminShell
      title="Redaktion"
      subtitle="Blog-Artikel verwalten und veröffentlichen"
      actions={
        <Button size="sm" onClick={() => navigate({ to: "/mitarbeiter/redaktion/neu" })}>
          <Plus className="mr-2 h-4 w-4" />
          Neuer Artikel
        </Button>
      }
    >
      {isError && (
        <div className="mb-4 rounded-md border border-rose-200 bg-rose-50 px-4 py-3 text-sm text-rose-700">
          Artikel konnten nicht geladen werden.
        </div>
      )}

      {isLoading ? (
        <div className="flex h-32 items-center justify-center text-sm text-muted-foreground">
          Artikel werden geladen…
        </div>
      ) : articles.length === 0 ? (
        <Card>
          <CardContent className="flex flex-col items-center justify-center gap-4 py-16 text-center">
            <div className="rounded-full bg-muted p-4">
              <Newspaper className="h-8 w-8 text-muted-foreground" />
            </div>
            <div>
              <p className="font-medium">Noch keine Artikel</p>
              <p className="mt-1 text-sm text-muted-foreground">
                Erstelle deinen ersten Artikel.
              </p>
            </div>
            <Button
              size="sm"
              onClick={() => navigate({ to: "/mitarbeiter/redaktion/neu" })}
            >
              <Plus className="mr-2 h-4 w-4" />
              Artikel erstellen
            </Button>
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-2">
          {articles.map((article) => (
            <Card key={article.id} className="overflow-hidden">
              <CardContent className="flex flex-col gap-3 p-4 sm:flex-row sm:items-center sm:justify-between">
                <div className="min-w-0 flex-1 space-y-1">
                  <div className="flex flex-wrap items-center gap-2">
                    <span className="font-medium">{article.title}</span>
                    <Badge
                      className={
                        article.is_published
                          ? "border-0 bg-emerald-500/15 text-emerald-700"
                          : "border-0 bg-slate-500/15 text-slate-600"
                      }
                    >
                      {article.is_published ? "Veröffentlicht" : "Entwurf"}
                    </Badge>
                    <Badge variant="outline" className="text-xs">
                      {article.tag}
                    </Badge>
                  </div>
                  <div className="flex flex-wrap gap-x-4 gap-y-1 text-xs text-muted-foreground">
                    <span className="font-mono">/wissen/{article.slug}</span>
                    <span>Geändert: {formatDate(article.updated_at)}</span>
                    {article.published_at && (
                      <span>Veröffentlicht: {formatDate(article.published_at)}</span>
                    )}
                  </div>
                </div>
                <div className="flex shrink-0 gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    asChild
                  >
                    <Link to="/mitarbeiter/redaktion/$id" params={{ id: article.id }}>
                      <Pencil className="mr-1.5 h-3.5 w-3.5" />
                      Bearbeiten
                    </Link>
                  </Button>
                  {isAdmin && (
                    <Button
                      variant="outline"
                      size="sm"
                      className="text-rose-600 hover:border-rose-300 hover:bg-rose-50 hover:text-rose-700"
                      onClick={() => setDeleteTarget(article)}
                    >
                      <Trash2 className="mr-1.5 h-3.5 w-3.5" />
                      Löschen
                    </Button>
                  )}
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      {/* Delete-Dialog */}
      <Dialog open={!!deleteTarget} onOpenChange={() => setDeleteTarget(null)}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Artikel löschen?</DialogTitle>
          </DialogHeader>
          <p className="text-sm text-muted-foreground">
            Willst du den Artikel{" "}
            <span className="font-medium text-foreground">"{deleteTarget?.title}"</span>{" "}
            wirklich löschen? Diese Aktion kann nicht rückgängig gemacht werden.
          </p>
          <DialogFooter>
            <Button variant="outline" onClick={() => setDeleteTarget(null)}>
              Abbrechen
            </Button>
            <Button
              variant="destructive"
              disabled={deleteMutation.isPending}
              onClick={() => deleteTarget && deleteMutation.mutate(deleteTarget.id)}
            >
              {deleteMutation.isPending ? "Löschen…" : "Endgültig löschen"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </AdminShell>
  );
}
