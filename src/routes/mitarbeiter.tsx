import { createFileRoute, Outlet, redirect } from "@tanstack/react-router";
import { supabase } from "@/lib/supabase";

export const Route = createFileRoute("/mitarbeiter")({
  beforeLoad: async ({ location }) => {
    if (location.pathname === "/mitarbeiter/login") return;
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
