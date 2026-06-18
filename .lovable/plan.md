## Ziel

Den aktuellen interaktiven Stepper in der Section **„So einfach geht's"** (`src/routes/index.tsx`, ca. Zeile 296–416) durch ein Layout im Stil der hochgeladenen Referenzgrafik ersetzen — passend zum Inhalt „3 Schritte zum Wechsel".

## Neues Layout

```text
┌─────────────────────────────────────────────────────────────┐
│                    Headline + Sub                            │
├──────────────────────────┬──────────────────────────────────┤
│  LINKS (Soft-Card)       │  RECHTS (Accordion)              │
│                          │                                  │
│   ┌──┐   ┌──┐   ┌──┐    │  So läuft dein Wechsel:          │
│   │📝│ + │📞│ + │✍│    │  ▸ 1. Daten eingeben             │
│   └──┘   └──┘   └──┘    │  ▸ 2. Persönliches Angebot       │
│   Daten  Beratung Wechsel│  ▾ 3. Wechseln & sparen          │
│                          │     [Detailtext + Checks]        │
│                          │  ────────────────────────────    │
│                          │  [CTA: Jetzt starten]            │
└──────────────────────────┴──────────────────────────────────┘
```

### Linke Karte (Icon-Combo)
- Beige/Soft-Hintergrund (`bg-surface` / `bg-success-soft`), abgerundet (`rounded-3xl`), Padding `p-8 md:p-12`.
- Drei weiße abgerundete Icon-Tiles (`rounded-2xl`, `shadow-soft`) mit jeweiligem Lucide-Icon (`FileText`, `PhoneCall`, `FileSignature`) in `text-success`.
- Dazwischen zwei dezente `+`-Zeichen (`text-muted-foreground`).
- Unter jedem Tile ein kurzes Label (`Daten eingeben`, `Persönliche Beratung`, `Vertragswechsel`).
- Sanftes Stagger-In via `framer-motion` beim Scrollen in den Viewport.

### Rechte Karte (Accordion)
- Weiße Section-Überschrift: „So läuft dein Wechsel".
- shadcn `<Accordion type="single" collapsible>` mit 3 Items (Schritt-Nummer + Titel als Trigger; Content = Beschreibung + Bullet-Checks + Mini-Meta „Dauer ≤ 24 Std." etc.).
- Standardmäßig Item 1 geöffnet.
- Darunter primärer CTA-Button (`Jetzt passendes Angebot sichern` → `/angebot`).

## Responsivität (kritisch)

- Wrapper: `grid gap-6 lg:grid-cols-2 lg:items-stretch` — auf Mobile gestapelt, ab `lg` zweispaltig gleich hoch.
- Icon-Reihe: `flex flex-wrap items-center justify-center gap-4 sm:gap-6`, Tiles `h-20 w-20 sm:h-24 sm:w-24 md:h-28 md:w-28`, `+`-Zeichen `shrink-0`. So bricht nichts auf 320px.
- Labels: `text-xs sm:text-sm`, mittig unter Tile, `max-w-[7rem]` damit zwei Zeilen sauber brechen.
- Accordion-Trigger: `min-w-0` + `truncate` auf den Titeln verhindert Overflow auf schmalen Screens.
- Container `mx-auto max-w-6xl px-4` bleibt.
- Keine fixen `width:`-Pixelwerte; alles über Tailwind-Tokens.

## Technische Änderungen

- **Nur** `src/routes/index.tsx`, Funktion `HowItWorksSection` (ca. Z. 296–417) wird ersetzt.
- State `useState(active)` wird entfernt (wird durch Accordion-State ersetzt).
- Imports: `Accordion, AccordionItem, AccordionTrigger, AccordionContent` aus `@/components/ui/accordion` ergänzen; `ArrowRight` weiter genutzt; nicht mehr benötigte Imports (`useState` nur falls woanders gebraucht — prüfen) bleiben unangetastet.
- Inhalte (3 Schritte, Bullets, Dauer-Werte) bleiben 1:1 erhalten — nur neu visualisiert.
- Design-Tokens aus `src/styles.css` (success, surface, card) — keine harten Farben.
- Keine Backend-Änderungen.

## Was nicht geändert wird

- Hero, Header, andere Sections.
- Bestehende Routen / Daten / Logik.
