import { AlertCircle, RefreshCw } from "lucide-react";
import { Button } from "@/components/ui/button";

export function QueryErrorState({
  message = "Die Daten konnten nicht geladen werden.",
  onRetry,
}: {
  message?: string;
  onRetry: () => void;
}) {
  return (
    <div className="rounded-2xl border border-destructive/25 bg-destructive/5 px-5 py-8 text-center">
      <AlertCircle className="mx-auto h-8 w-8 text-destructive" />
      <p className="mt-3 text-sm font-medium text-foreground">{message}</p>
      <p className="mt-1 text-xs text-muted-foreground">
        Prüfen Sie Ihre Verbindung und versuchen Sie es erneut.
      </p>
      <Button type="button" variant="outline" size="sm" className="mt-4" onClick={onRetry}>
        <RefreshCw className="mr-2 h-4 w-4" /> Erneut laden
      </Button>
    </div>
  );
}
