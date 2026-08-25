import { createFileRoute } from "@tanstack/react-router";
import { convertToModelMessages, streamText, type UIMessage } from "ai";
import { createOpenAIProvider } from "@/lib/ai-gateway.server";
import { consumeRateLimit, methodNotAllowed } from "@/lib/api/helpers.server";
import { chatRequestSchema } from "@/lib/api/chat-schema";

function chatError(message: string, status: number): Response {
  return new Response(message, {
    status,
    headers: { "Cache-Control": "no-store", "Content-Type": "text/plain; charset=utf-8" },
  });
}

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
  /angebot?start=gewerbe&kunde=gewerbe → Gewerbestrom anfragen
  /angebot?start=gas&kunde=gewerbe     → Gewerbegas anfragen
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
      GET: () => methodNotAllowed(["POST"]),
      POST: async ({ request }) => {
        const contentType = request.headers.get("content-type")?.split(";", 1)[0]?.trim();
        const declaredLength = Number(request.headers.get("content-length") ?? 0);
        if (contentType !== "application/json") return chatError("Ungültiger Inhaltstyp", 415);
        if (Number.isFinite(declaredLength) && declaredLength > 30_000) {
          return chatError("Anfrage ist zu groß", 413);
        }

        const allowed = await consumeRateLimit(request, "public_chat_ip", 20, 900);
        if (!allowed) return chatError("Zu viele Anfragen", 429);

        let rawBody: unknown;
        try {
          rawBody = await request.json();
        } catch {
          return chatError("Ungültige Anfrage", 400);
        }
        const validation = chatRequestSchema.safeParse(rawBody);
        if (!validation.success) return chatError("Ungültige Chatnachricht", 400);

        // Das Runtime-Schema erlaubt ausschließlich kurze Textteile. Dadurch können
        // keine fremden URLs, Dateien, Tool-Aufrufe oder Systemnachrichten an die
        // AI-SDK gelangen und dort serverseitige Downloads auslösen.
        const messages = validation.data.messages as UIMessage[];
        const key = process.env.OPENAI_API_KEY;
        if (!key) return chatError("Chat ist vorübergehend nicht verfügbar", 503);

        const openai = createOpenAIProvider(key);
        const result = streamText({
          model: openai("gpt-5.6-sol"),
          system: SYSTEM_PROMPT,
          messages: await convertToModelMessages(messages),
          maxOutputTokens: 350,
          abortSignal: AbortSignal.timeout(20_000),
          providerOptions: { openai: { store: false } },
        });

        return result.toUIMessageStreamResponse({
          originalMessages: messages,
          headers: { "Cache-Control": "no-store" },
        });
      },
    },
  },
});
