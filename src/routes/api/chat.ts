import { createFileRoute } from "@tanstack/react-router";
import { convertToModelMessages, streamText, type UIMessage } from "ai";
import { createOpenAIProvider } from "@/lib/ai-gateway.server";
import { consumeRateLimit } from "@/lib/api/helpers.server";

const SYSTEM_PROMPT = `Du bist der "Prime Assistent", die digitale Orientierungshilfe von PRIME ENERGIE.

Stil:
- Seriös, freundlich und sachlich. Sprich konsequent in der Sie-Form.
- Antworte sehr kurz: maximal 2 bis 3 kurze Sätze. Keine Floskeln und keine Werbeversprechen.
- Stelle PRIME ENERGIE als persönliche Tarifberatung und Vermittlungsunterstützung dar, nicht als Energieversorger.

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
  /kontakt                  → PRIME ENERGIE kontaktieren
  /ablauf                   → So begleitet PRIME ENERGIE
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
        const allowed = await consumeRateLimit(request, "public_chat_ip", 20, 900);
        if (!allowed) return new Response("Zu viele Anfragen", { status: 429 });

        let body: { messages?: UIMessage[] };
        try {
          body = (await request.json()) as { messages?: UIMessage[] };
        } catch {
          return new Response("Ungültige Anfrage", { status: 400 });
        }
        const { messages } = body;
        if (!Array.isArray(messages) || messages.length === 0 || messages.length > 20) {
          return new Response("Messages are required", { status: 400 });
        }
        if (JSON.stringify(messages).length > 20_000) {
          return new Response("Anfrage ist zu groß", { status: 413 });
        }
        const key = process.env.OPENAI_API_KEY;
        if (!key) return new Response("Missing OPENAI_API_KEY", { status: 500 });

        const openai = createOpenAIProvider(key);
        const result = streamText({
          model: openai("gpt-5.6-sol"),
          system: SYSTEM_PROMPT,
          messages: await convertToModelMessages(messages),
        });

        return result.toUIMessageStreamResponse({ originalMessages: messages });
      },
    },
  },
});
