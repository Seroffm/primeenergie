// @lovable.dev/vite-tanstack-config already includes the following — do NOT add them manually
// or the app will break with duplicate plugins:
//   - tanstackStart, viteReact, tailwindcss, tsConfigPaths, nitro (build-only using cloudflare as a default target),
//     componentTagger (dev-only), VITE_* env injection, @ path alias, React/TanStack dedupe,
//     error logger plugins, and sandbox detection (port/host/strictPort).
// You can pass additional config via defineConfig({ vite: { ... }, etc... }) if needed.
import { defineConfig } from "@lovable.dev/vite-tanstack-config";

const backendUrl = process.env.BACKEND_URL ?? "https://strom-sandy.vercel.app";

export default defineConfig({
  tanstackStart: {
    // Redirect TanStack Start's bundled server entry to src/server.ts (our SSR error wrapper).
    // nitro/vite builds from this
    server: { entry: "server" },
  },
  vite: {
    server: {
      proxy: {
        // Im lokalen Dev-Modus werden alle /api-Anfragen an das Live-Backend weitergeleitet.
        // Damit entfallen CORS-Probleme bei Frontend auf localhost → Backend auf anderer Domain.
        // In Production nicht aktiv (Vite-Proxy ist nur Dev-Server-Feature).
        "/api": {
          target: backendUrl,
          changeOrigin: true,
        },
      },
    },
  },
});
