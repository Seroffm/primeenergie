import { createFileRoute, Outlet, redirect } from "@tanstack/react-router";
import { supabase } from "@/lib/supabase";

export const Route = createFileRoute("/mitarbeiter")({
  beforeLoad: async ({ location }) => {
    const publicAuthPaths = new Set([
      "/mitarbeiter/login",
      "/mitarbeiter/passwort-vergessen",
      "/mitarbeiter/passwort-neu",
    ]);
    if (publicAuthPaths.has(location.pathname)) return;
    const {
      data: { session },
    } = await supabase.auth.getSession();
    if (!session) {
      throw redirect({ to: "/mitarbeiter/login" });
    }
  },
  head: () => ({
    meta: [
      { title: "Mitarbeiterbereich – PRIME ENERGIE" },
      { name: "robots", content: "noindex,nofollow" },
    ],
  }),
  component: () => <Outlet />,
});
