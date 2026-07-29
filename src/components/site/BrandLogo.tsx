import blackLogoUrl from "@/assets/prime-energie-logo-black.png";
import whiteLogoUrl from "@/assets/prime-energie-logo-white.png";
import { cn } from "@/lib/utils";

type BrandLogoProps = {
  className?: string;
  priority?: boolean;
  variant?: "black" | "white";
};

export function BrandLogo({ className, priority = false, variant = "black" }: BrandLogoProps) {
  return (
    <img
      src={variant === "white" ? whiteLogoUrl : blackLogoUrl}
      alt="PRIME ENERGIE"
      width={4064}
      height={1011}
      loading={priority ? "eager" : "lazy"}
      fetchPriority={priority ? "high" : "auto"}
      decoding="async"
      className={cn("block h-auto object-contain", className)}
    />
  );
}
