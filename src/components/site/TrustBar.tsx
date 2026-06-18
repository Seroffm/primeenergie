import { ShieldCheck, Lock, BadgeCheck, Zap, HeartHandshake } from "lucide-react";

const items = [
  { icon: BadgeCheck, label: "100% kostenlos" },
  { icon: Lock, label: "DSGVO-konform" },
  { icon: ShieldCheck, label: "Geprüfte Anbieter" },
  { icon: Zap, label: "Keine Versorgungsunterbrechung" },
  { icon: HeartHandshake, label: "Persönliche Beratung" },
];

export function TrustBar({ compact = false }: { compact?: boolean }) {
  return (
    <div
      className={
        compact
          ? "flex flex-wrap items-center gap-x-6 gap-y-3 text-xs text-muted-foreground"
          : "border-y border-border bg-surface"
      }
    >
      <div
        className={
          compact
            ? "contents"
            : "mx-auto flex max-w-6xl flex-wrap items-center justify-center gap-x-8 gap-y-4 px-4 py-5 text-sm text-muted-foreground"
        }
      >
        {items.map((i) => (
          <div key={i.label} className="flex items-center gap-2">
            <i.icon className="h-4 w-4 text-success" />
            <span>{i.label}</span>
          </div>
        ))}
      </div>
    </div>
  );
}
