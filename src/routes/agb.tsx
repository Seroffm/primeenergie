import { createFileRoute } from "@tanstack/react-router";
import { StaticPage } from "@/components/site/StaticPage";

export const Route = createFileRoute("/agb")({
  head: () => ({
    meta: [
      { title: "Allgemeine Geschäftsbedingungen von PRIME ENERGIE" },
      { name: "robots", content: "noindex" },
    ],
  }),
  component: () => (
    <StaticPage title="Allgemeine Geschäftsbedingungen">
      <p>
        Die abschließend geprüften Geschäftsbedingungen werden vor der öffentlichen Inbetriebnahme
        zusammen mit den verifizierten Anbieterangaben veröffentlicht.
      </p>
      <p>
        Bis dahin ist diese Testversion nicht für den rechtsgeschäftlichen Abschluss von
        Energieverträgen bestimmt.
      </p>
    </StaticPage>
  ),
});
