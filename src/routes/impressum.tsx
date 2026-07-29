import { createFileRoute } from "@tanstack/react-router";
import { StaticPage } from "@/components/site/StaticPage";

export const Route = createFileRoute("/impressum")({
  head: () => ({
    meta: [{ title: "Impressum – PRIME ENERGIE" }, { name: "robots", content: "noindex" }],
  }),
  component: () => (
    <StaticPage title="Impressum">
      <p>
        Die verifizierten Anbieterangaben für PRIME ENERGIE werden vor der öffentlichen
        Inbetriebnahme ergänzt.
      </p>
      <p>
        Bis dahin ist diese Testversion nicht für den rechtsgeschäftlichen Abschluss von
        Energieverträgen bestimmt.
      </p>
    </StaticPage>
  ),
});
