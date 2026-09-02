import { MotionConfig } from "framer-motion";
import { useEffect, useState, type ReactNode } from "react";

/**
 * Entry animations are pleasant on desktop, but layout transforms are a common
 * source of flashing and dropped frames in Mobile Safari.  On small screens we
 * deliberately prefer a stable page over decorative scroll animations.
 */
export function MotionPreferences({ children }: { children: ReactNode }) {
  const [reduceMotion, setReduceMotion] = useState(false);

  useEffect(() => {
    const media = window.matchMedia("(max-width: 767px), (prefers-reduced-motion: reduce)");
    const update = () => setReduceMotion(media.matches);
    update();
    media.addEventListener("change", update);
    return () => media.removeEventListener("change", update);
  }, []);

  return <MotionConfig reducedMotion={reduceMotion ? "always" : "user"}>{children}</MotionConfig>;
}
