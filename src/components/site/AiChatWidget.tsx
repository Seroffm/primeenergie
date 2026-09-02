import { useEffect, useRef, useState } from "react";
import { useChat } from "@ai-sdk/react";
import { DefaultChatTransport, type UIMessage } from "ai";
import { useNavigate } from "@tanstack/react-router";
import { MessageCircle, X, Send, Sparkles, ArrowRight, Star, RefreshCw } from "lucide-react";
import { cn } from "@/lib/utils";
import { COOKIE_CONSENT_EVENT, COOKIE_CONSENT_STORAGE_KEY } from "@/lib/cookie-consent";
import { parseChatMessage } from "@/lib/chat-actions";

const WELCOME_TEXT =
  "Willkommen bei PRIME ENERGIE.\n\nIch beantworte kurze Fragen zu Strom, Gas, Tarifprüfung und Anbieterwechsel und führe Sie direkt zum passenden nächsten Schritt.\n\nWobei kann ich Sie unterstützen?";

const QUICK_ACTIONS = [
  "Tarif prüfen lassen",
  "Strom und Gas vergleichen",
  "Wie läuft der Wechsel ab?",
];

const INITIAL: UIMessage[] = [
  {
    id: "welcome",
    role: "assistant",
    parts: [{ type: "text", text: WELCOME_TEXT }],
  } as UIMessage,
];

function hasAiConsent(): boolean {
  try {
    const raw = localStorage.getItem(COOKIE_CONSENT_STORAGE_KEY);
    if (!raw) return false;
    const consent = JSON.parse(raw) as { aiAssistant?: unknown };
    return consent.aiAssistant === true;
  } catch {
    return false;
  }
}

export function AiChatWidget() {
  const [cookiesAccepted, setCookiesAccepted] = useState(false);
  const [open, setOpen] = useState(false);
  const [input, setInput] = useState("");
  const [keyboardViewport, setKeyboardViewport] = useState<{
    top: number;
    height: number;
  } | null>(null);
  const viewportBaselineRef = useRef(0);
  const scrollRef = useRef<HTMLDivElement>(null);
  const navigate = useNavigate();
  const transport = useRef(new DefaultChatTransport({ api: "/api/chat" })).current;

  useEffect(() => {
    const updateConsent = () => setCookiesAccepted(hasAiConsent());
    updateConsent();
    const handler = () => updateConsent();
    window.addEventListener(COOKIE_CONSENT_EVENT, handler);
    return () => window.removeEventListener(COOKIE_CONSENT_EVENT, handler);
  }, []);

  const { messages, sendMessage, regenerate, status, error, setMessages, clearError, stop } =
    useChat({
      id: "site-assistant",
      messages: INITIAL,
      transport,
    });

  const busy = status === "submitted" || status === "streaming";
  const showQuickActions = messages.length <= 1 && !busy;

  // Zählt Reset-Klicks – dient als `key` für das Refresh-Icon, damit die
  // kurze Dreh-Animation bei jedem Klick neu startet (nicht bei Erstanzeige).
  const [resetCount, setResetCount] = useState(0);

  useEffect(() => {
    if (scrollRef.current) scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
  }, [messages, open]);

  useEffect(() => {
    if (!open || typeof window === "undefined" || !window.visualViewport) {
      setKeyboardViewport(null);
      return;
    }

    const viewport = window.visualViewport;
    viewportBaselineRef.current = viewport.height;

    const updateViewport = () => {
      const isMobile = window.matchMedia("(max-width: 639px)").matches;
      const visibleHeightLoss = Math.max(
        window.innerHeight - viewport.height,
        viewportBaselineRef.current - viewport.height,
      );
      const keyboardIsOpen = isMobile && visibleHeightLoss > 150;

      if (!keyboardIsOpen) {
        viewportBaselineRef.current = Math.max(viewportBaselineRef.current, viewport.height);
      }

      setKeyboardViewport(
        keyboardIsOpen
          ? {
              top: viewport.offsetTop + 4,
              height: Math.max(120, viewport.height - 8),
            }
          : null,
      );

      requestAnimationFrame(() => {
        if (scrollRef.current) scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
      });
    };

    updateViewport();
    viewport.addEventListener("resize", updateViewport);
    viewport.addEventListener("scroll", updateViewport);
    const handleOrientationChange = () => {
      viewportBaselineRef.current = viewport.height;
      updateViewport();
    };
    window.addEventListener("orientationchange", handleOrientationChange);

    return () => {
      viewport.removeEventListener("resize", updateViewport);
      viewport.removeEventListener("scroll", updateViewport);
      window.removeEventListener("orientationchange", handleOrientationChange);
    };
  }, [open]);

  const send = (text: string) => {
    if (!text.trim() || busy) return;
    clearError();
    void sendMessage({ text: text.trim() });
  };

  const onSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const text = input;
    setInput("");
    send(text);
  };

  // Chat zurücksetzen: laufenden Stream abbrechen, Verlauf auf die Begrüßung zurücksetzen,
  // Eingabefeld leeren, Fehlerstatus löschen. Der Chat selbst bleibt geöffnet.
  const handleResetChat = () => {
    stop();
    setMessages(INITIAL);
    setInput("");
    clearError();
    setResetCount((c) => c + 1);
  };

  if (!cookiesAccepted) return null;

  return (
    <>
      <button
        type="button"
        aria-label={open ? "Chat schließen" : "Prime Assistent öffnen"}
        onClick={() => setOpen((v) => !v)}
        className={cn(
          "ai-chat-launcher fixed bottom-5 right-5 z-40 grid h-14 w-14 place-items-center rounded-full text-primary-foreground shadow-hero transition-all hover:scale-105",
          "bg-gradient-to-br from-primary to-success",
          open && "hidden sm:grid",
        )}
      >
        {open ? <X className="h-6 w-6" /> : <MessageCircle className="h-6 w-6" />}
        {!open && (
          <span className="absolute -top-1 -right-1 grid h-6 w-6 place-items-center rounded-full bg-success text-white ring-2 ring-background">
            <Sparkles className="h-4 w-4" />
          </span>
        )}
      </button>

      {open && (
        <div
          role="dialog"
          aria-label="Prime Assistent"
          style={
            keyboardViewport
              ? {
                  top: keyboardViewport.top,
                  bottom: "auto",
                  height: keyboardViewport.height,
                }
              : undefined
          }
          className="fixed inset-x-2 bottom-[max(0.5rem,env(safe-area-inset-bottom))] z-50 flex h-[min(72dvh,34rem)] max-h-[calc(100dvh-1rem)] flex-col overflow-hidden rounded-2xl border border-border bg-background shadow-hero animate-in slide-in-from-bottom-4 fade-in sm:inset-x-auto sm:bottom-24 sm:right-5 sm:z-40 sm:h-[min(620px,calc(100vh-7rem))] sm:max-h-none sm:w-[min(380px,calc(100vw-2.5rem))]"
        >
          <header className="flex items-center gap-2.5 border-b border-border bg-primary px-3 py-2.5 text-primary-foreground sm:gap-3 sm:px-4 sm:py-3">
            <div className="grid h-8 w-8 place-items-center rounded-full bg-success/20 sm:h-9 sm:w-9">
              <Sparkles className="h-4 w-4 text-success sm:h-5 sm:w-5" />
            </div>
            <div className="flex-1">
              <div className="text-sm font-semibold">Prime Assistent</div>
              <div className="text-xs text-primary-foreground/70">
                Digitale Orientierung rund um Energie
              </div>
            </div>
            <button
              type="button"
              aria-label="Chat neu starten"
              title="Chat neu starten"
              onClick={handleResetChat}
              className="grid h-8 w-8 flex-none place-items-center rounded-full text-primary-foreground/70 transition hover:bg-primary-foreground/10 hover:text-primary-foreground"
            >
              <RefreshCw
                key={resetCount}
                className={cn("h-4 w-4", resetCount > 0 && "animate-[spin_0.4s_ease-in-out]")}
              />
            </button>
            <button
              type="button"
              aria-label="Chat schließen"
              onClick={() => setOpen(false)}
              className="grid h-9 w-9 flex-none place-items-center rounded-full text-primary-foreground transition hover:bg-primary-foreground/10 sm:hidden"
            >
              <X className="h-5 w-5" />
            </button>
          </header>

          <div
            ref={scrollRef}
            className="flex-1 space-y-3 overflow-y-auto bg-surface px-3 py-3 sm:px-4 sm:py-4"
          >
            {messages.map((m) => {
              const text = m.parts.map((p) => (p.type === "text" ? p.text : "")).join("");
              const isUser = m.role === "user";
              const { body, actions } = isUser
                ? { body: text, actions: [] as { label: string; href: string }[] }
                : parseChatMessage(text);
              return (
                <div
                  key={m.id}
                  className={cn("flex flex-col gap-2", isUser ? "items-end" : "items-start")}
                >
                  <div
                    className={cn(
                      "max-w-full whitespace-pre-wrap rounded-2xl px-3 py-2 text-sm shadow-soft sm:max-w-[85%]",
                      isUser
                        ? "rounded-br-sm bg-primary text-primary-foreground"
                        : "rounded-bl-sm bg-background text-foreground",
                    )}
                  >
                    {body || (busy && !isUser ? "…" : "")}
                  </div>
                  {!isUser && actions.length > 0 && (
                    <div className="flex w-full flex-col gap-1.5 sm:w-[85%]">
                      {actions.map((a, i) => (
                        <button
                          key={`${m.id}-a-${i}`}
                          type="button"
                          onClick={() => {
                            setOpen(false);
                            void navigate({ to: a.href });
                          }}
                          className="group inline-flex items-center justify-between gap-2 rounded-xl border border-primary/30 bg-background px-3 py-2 text-left text-sm font-medium text-primary transition hover:border-primary hover:bg-primary/5"
                        >
                          <span>{a.label}</span>
                          <ArrowRight className="h-4 w-4 transition group-hover:translate-x-0.5" />
                        </button>
                      ))}
                    </div>
                  )}
                </div>
              );
            })}
            {status === "submitted" && (
              <div className="flex justify-start">
                <div className="rounded-2xl rounded-bl-sm bg-background px-3 py-2 text-sm text-muted-foreground shadow-soft">
                  <span className="inline-flex gap-1">
                    <span className="h-2 w-2 animate-bounce rounded-full bg-muted-foreground/60 [animation-delay:-0.3s]" />
                    <span className="h-2 w-2 animate-bounce rounded-full bg-muted-foreground/60 [animation-delay:-0.15s]" />
                    <span className="h-2 w-2 animate-bounce rounded-full bg-muted-foreground/60" />
                  </span>
                </div>
              </div>
            )}
            {showQuickActions && (
              <div className="space-y-2 pt-2">
                {QUICK_ACTIONS.map((q) => (
                  <button
                    key={q}
                    type="button"
                    onClick={() => send(q)}
                    className="block w-full rounded-full border border-primary/30 bg-background px-4 py-2 text-left text-sm text-primary transition hover:border-primary hover:bg-primary/5"
                  >
                    {q}
                  </button>
                ))}
              </div>
            )}
            {error && (
              <div className="flex items-center justify-between gap-3 rounded-md bg-destructive/10 px-3 py-2 text-xs text-destructive">
                <span>Die Antwort konnte nicht geladen werden.</span>
                <button
                  type="button"
                  onClick={() => {
                    clearError();
                    void regenerate();
                  }}
                  className="shrink-0 rounded-full border border-destructive/30 px-2.5 py-1 font-semibold transition hover:bg-destructive/10"
                >
                  Erneut versuchen
                </button>
              </div>
            )}
          </div>

          <form
            onSubmit={onSubmit}
            className="flex items-center gap-2 border-t border-border bg-background px-2.5 py-2 sm:px-3 sm:py-3"
          >
            <input
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Ihre Frage zu Strom oder Gas…"
              className="min-w-0 flex-1 rounded-full border border-border bg-surface px-4 py-2 text-base outline-none transition focus:border-success sm:text-sm"
              disabled={busy}
            />
            <button
              type="submit"
              disabled={busy || !input.trim()}
              aria-label="Senden"
              className="grid h-9 w-9 place-items-center rounded-full bg-primary text-primary-foreground transition hover:bg-primary/90 disabled:opacity-50"
            >
              <Send className="h-4 w-4" />
            </button>
          </form>
          <div className="px-3 pb-[max(0.5rem,env(safe-area-inset-bottom))] text-[10px] text-muted-foreground">
            Automatisierte Orientierung. Verbindlich sind nur konkrete Vertragsunterlagen.
          </div>
        </div>
      )}
    </>
  );
}
