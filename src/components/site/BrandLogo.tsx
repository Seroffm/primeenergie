import logoUrl from "@/assets/prime-energie-logo.jpg";
import { cn } from "@/lib/utils";

type BrandLogoProps = {
  className?: string;
  priority?: boolean;
};

export function BrandLogo({ className, priority = false }: BrandLogoProps) {
  return (
    <img
      src={logoUrl}
      alt="PRIME ENERGIE"
      width={1163}
      height={322}
      loading={priority ? "eager" : "lazy"}
      fetchPriority={priority ? "high" : "auto"}
      decoding="async"
      className={cn("block h-auto scale-[1.3] object-contain", className)}
    />
  );
}
