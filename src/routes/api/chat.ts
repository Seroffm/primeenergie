import { createFileRoute } from "@tanstack/react-router";
import { convertToModelMessages, streamText, type UIMessage } from "ai";
import { createLovableAiGatewayProvider } from "@/lib/ai-gateway.server";

const SYSTEM_PROMPT = `Du bist der "Prime Assistent", der digitale Energieberater von Prime Energie.

Stil:
- Seriös, freundlich, sachlich. Sprich wie ein deutscher Energieberater. Immer siezen.
- Antworte sehr kurz: maximal 2 bis 3 kurze Sätze. Keine Aufzählungen, keine Floskeln, keine Marketing-Sprache.
- Erwähnen Sie nie, dass Sie eine KI, ein Sprachmodell oder ein Bot sind.

Themen: Strom, Gas, Tarifvergleich, Anbieterwechsel, Vertrag, Preisgarantie, Ökostrom, Verbrauch. Andere Themen freundlich abgrenzen.

Aktionen am Ende jeder Antwort:
- Schließen Sie jede Antwort mit 1 bis 3 Aktions-Buttons ab, die den Nutzer in den passenden Prozess führen.
- Buttons stehen am Ende der Nachricht jeweils in einer eigenen Zeile im Format:
  [[ACTION:Beschriftung|/pfad]]
- Erlaubte Pfade (genau so verwenden):
  /angebot?start=strom      → Stromtarif berechnen
  /angebot?start=gas        → Gastarif berechnen
  /angebot?start=beides     → Strom & Gas im Bundle
  /angebot?start=gewerbe    → Gewerbetarif anfragen
  /kontakt                  → Persönliche Beratung
  /ablauf                   → So läuft der Wechsel
  /faq                      → Häufige Fragen
- Wählen Sie die Buttons passend zum Anliegen. Wenn nicht klar ist, ob Strom oder Gas, fragen Sie kurz nach und bieten Sie beide Buttons an.
- Beispiel (Nutzer fragt nach Stromwechsel):
  "Gerne. Geben Sie kurz Ihre PLZ und den Jahresverbrauch an, dann zeige ich passende Tarife.
  [[ACTION:Stromtarif berechnen|/angebot?start=strom]]
  [[ACTION:So läuft der Wechsel|/ablauf]]"

Bei unklaren Angaben gezielt nachfragen (PLZ, Verbrauch, Personen, aktueller Anbieter). Keine verbindlichen Preise nennen.`;

export const Route = createFileRoute("/api/chat")({
  server: {
    handlers: {
      POST: async ({ request }) => {
        const { messages } = (await request.json()) as { messages?: UIMessage[] };
        if (!Array.isArray(messages)) {
          return new Response("Messages are required", { status: 400 });
        }
        const key = process.env.LOVABLE_API_KEY;
        if (!key) return new Response("Missing LOVABLE_API_KEY", { status: 500 });

        const gateway = createLovableAiGatewayProvider(key);
        const result = streamText({
          model: gateway("google/gemini-3-flash-preview"),
          system: SYSTEM_PROMPT,
          messages: await convertToModelMessages(messages),
        });

        return result.toUIMessageStreamResponse({ originalMessages: messages });
      },
    },
  },
});
