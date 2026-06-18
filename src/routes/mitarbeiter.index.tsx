import { createFileRoute, redirect } from "@tanstack/react-router";

export const Route = createFileRoute("/mitarbeiter/")({
  beforeLoad: () => {
    throw redirect({ to: "/mitarbeiter/login" });
  },
});
