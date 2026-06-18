# Design System — EnergieClever

> Dieses Dokument beschreibt den visuellen Stil, die Design-Tokens und die UI-Konventionen der EnergieClever-Website. Jede KI, die an diesem Projekt weiterarbeitet, muss diese Regeln befolgen, um visuelle Konsistenz zu gewährleisten.

---

## 1. Design-Philosophie

**Werte:** Vertrauen, Frische, Klarheit, Effizienz.

Die Website positioniert sich als moderner Energievergleichsdienst — keine langweilige Vergleichsplatine, sondern ein vertrauenswürdiger, frischer Markenauftritt. Das Design balanciert zwischen:
- **Professioneller Seriosität** (dunkles Navy, saubere Typografie, klare Struktur)
- **Frischem Optimismus** (lebhaftes Grün als Akzent, freundliche Sprache, offene Flächen)

Keine generischen AI-Ästhetiken (keine Purple-Gradienten, kein Inter/Poppins-Standard). Der Stil ist markant und wiedererkennbar.

---

## 2. Farbpalette

### Primärfarben
| Token | Wert | Verwendung |
|-------|------|-----------|
| `--primary` | `#0a1f44` | Haupttext, Überschriften, dunkle Flächen |
| `--primary-foreground` | `#ffffff` | Text auf dunklen Flächen |
| `--success` | `#00c389` | CTA-Buttons, Akzente, positive Status, Highlights |
| `--success-foreground` | `#ffffff` | Text auf grünen Buttons |
| `--success-soft` | `#e6faf3` | Subtile grüne Hintergründe (Karten, Badges) |

### Oberflächen
| Token | Wert | Verwendung |
|-------|------|-----------|
| `--background` | `#ffffff` | Seitenhintergrund |
| `--foreground` | `#0a1f44` | Standard-Text |
| `--surface` | `#f2f6f4` | Alternierende Sektionshintergründe |
| `--surface-muted` | `#e8efea` | Noch subtilere Flächen |
| `--card` | `#ffffff` | Kartenhintergrund |
| `--card-foreground` | `#0a1f44` | Text auf Karten |
| `--popover` | `#ffffff` | Dropdowns, Overlays |

### Neutrale Farben
| Token | Wert | Verwendung |
|-------|------|-----------|
| `--muted` | `#f2f6f4` | Muted-Elemente, Hover-States |
| `--muted-foreground` | `#586480` | Sekundärer Text, Beschreibungen |
| `--border` | `#e3e8ec` | Rahmen, Trennlinien |
| `--input` | `#e3e8ec` | Formular-Felder |
| `--ring` | `#00c389` | Focus-Ringe, aktive Zustände |
| `--accent` | `#e6faf3` | Akzent-Hintergründe |
| `--accent-foreground` | `#007a55` | Text in Akzent-Flächen |
| `--destructive` | `#e23b3b` | Fehler, Warnungen |
| `--destructive-foreground` | `#ffffff` | Text auf Fehler-Flächen |
| `--secondary` | `#f2f6f4` | Sekundäre Flächen |
| `--secondary-foreground` | `#0a1f44` | Text auf sekundären Flächen |

### Farbregeln
- **Grün (`--success`)** ist die einzige Akzentfarbe. Sie wird sparsam und gezielt eingesetzt: Buttons, Badges, Icons, positive Indikatoren.
- **Navy (`--primary`)** dominiert den Text und die Überschriften. Nie reines Schwarz.
- **Weiß (`--background`)** ist die dominante Flächenfarbe. Dunkle Sektionen nur mit Bedacht (z. B. Final-CTA mit Overlay).

---

## 3. Typografie

### Schriftarten
| Rolle | Font | Fallback |
|-------|------|----------|
| Display (H1–H4) | **Sora** | `Manrope, ui-sans-serif, system-ui, sans-serif` |
| Body / UI | **Manrope** | `ui-sans-serif, system-ui, sans-serif` |
| Serif (dekorativ) | **Fraunces** | `Iowan Old Style, Georgia, serif` |

### Schriftgewichte
- Display-Überschriften: `700` (bold), `extrabold` für H1
- Body-Text: `400` (normal)
- Labels / Badges: `600` (semibold), `font-medium`
- Kleine Texte: `text-xs`, `text-sm`

### Typografie-Muster
- **Überschriften:** `letter-spacing: -0.02em` (enger Tracking für Headlines)
- **H1:** `text-4xl md:text-6xl`, `font-extrabold`, `leading-[1.05]`
- **H2:** `text-3xl md:text-5xl`, `font-bold`
- **H3:** `text-xl md:text-2xl`, `font-semibold`
- **Kicker / Badge:** `text-xs`, `font-semibold`, `uppercase`, `tracking-wide` oder `tracking-wider`
- **Lead-Text:** `text-lg`, `text-muted-foreground`
- **Body:** `text-sm` bis `text-base`, `text-foreground` oder `text-muted-foreground`

---

## 4. Layout-System

### Container
- **Max-Breite:** `max-w-6xl` (standard Content-Container)
- **Padding:** `px-4` (Mobil), kein extra horizontal Padding auf Desktop
- **Sektions-Vertikalabstand:** `py-20 md:py-28`

### Raster
- Primär: `grid-cols-2`, `grid-cols-3`, `grid-cols-[1fr_1fr]`
- Hero: `lg:grid-cols-[1.05fr_1fr]`
- Karten-Grids: `gap-6`, responsive mit `md:grid-cols-2 lg:grid-cols-3`
- Admin/Dashboard: Sidebar `w-64` + flexibles Content-Area

### Border Radius
| Token | Wert | Verwendung |
|-------|------|-----------|
| `--radius-sm` | `calc(var(--radius) - 4px)` | Kleine Elemente |
| `--radius-md` | `calc(var(--radius) - 2px)` | Buttons, Inputs |
| `--radius-lg` | `0.75rem` | Karten, Modals |
| `--radius-xl` | `calc(var(--radius) + 4px)` | Große Karten |
| `--radius-2xl` | `calc(var(--radius) + 8px)` | Hero-Container |

Standard für Karten: `rounded-2xl`, `rounded-3xl` für große Blöcke.

---

## 5. Schatten-System

```css
--shadow-soft: 0 1px 2px rgb(10 31 68 / 0.04), 0 4px 16px rgb(10 31 68 / 0.05);
--shadow-card: 0 10px 40px -12px rgb(10 31 68 / 0.18);
--shadow-hero: 0 24px 60px -20px rgb(10 31 68 / 0.22);
```

| Schatten | Verwendung |
|----------|-----------|
| `shadow-soft` | Buttons, kleine Karten, Hover-States |
| `shadow-card` | Feature-Karten, Content-Karten |
| `shadow-hero` | Hero-Formular, prominente CTA-Boxen |

---

## 6. Komponenten-Muster

### Kicker / Badge
```tsx
<span className="inline-flex items-center gap-2 rounded-full border border-success/30 bg-success/10 px-3 py-1 text-xs font-semibold text-success">
  <Icon className="h-3.5 w-3.5" /> Badge-Text
</span>
```
- Runde Pillenform (`rounded-full`)
- Border mit 30% Opazität der Akzentfarbe
- Hintergrund mit 10% Opazität
- Kleine Icons (h-3.5 w-3.5)

### Feature-Karte
```tsx
<div className="group rounded-2xl border border-border bg-card p-6 shadow-soft transition-all hover:-translate-y-1 hover:border-success/40 hover:shadow-card">
  <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-br from-success/15 to-success/5 text-success ring-1 ring-success/20">
    <Icon className="h-6 w-6" />
  </div>
  <h3 className="mt-4 text-lg font-semibold text-primary">Titel</h3>
  <p className="mt-2 text-sm text-muted-foreground">Beschreibung</p>
</div>
```
- Icon in abgerundetem Quadrat mit Grün-Gradient
- Hover: leichtes Anheben (`-translate-y-1`), Border wird grün, Schatten verstärkt

### Primärer CTA-Button
```tsx
<Button size="lg" className="bg-success text-success-foreground hover:bg-success/90">
  Aktion <ArrowRight className="ml-1 h-4 w-4" />
</Button>
```
- `size="lg"`, `h-12`
- Hintergrund: `--success`
- Text: `--success-foreground` (weiß)
- Hover: `hover:bg-success/90`
- Icon: `ArrowRight` nach rechts mit `ml-1` oder `ml-2`

### Sekundärer Button
```tsx
<Button variant="outline">Aktion</Button>
```
- Standard Outline-Style mit `--border`

### Hero-Bereich
- Hintergrund: Foto mit mehrfachem Gradient-Overlay (weiß → transparent)
- Blur-Elemente als Dekoration: `bg-success/20 blur-3xl`, `rounded-full`
- Calculator/Formular in `rounded-2xl` Karte mit `shadow-hero`

### Trust-Strip
```tsx
<section className="border-y border-border bg-surface">
  <div className="mx-auto flex max-w-6xl flex-wrap items-center justify-center gap-x-8 gap-y-3 px-4 py-5 text-sm text-muted-foreground">
```
- Horizontal gescrollte oder gewrappte Liste von Vertrauenssignalen
- Icon + Text, Icon in `--success`

### Image-Split (Text + Bild)
- Abwechselnd: Text links / Bild rechts und umgekehrt (`reverse`)
- Bild in `rounded-3xl`, `border border-border`, `shadow-card`
- Optional: `eyebrow` als `--success` Text mit `uppercase tracking-wider`
- Bullet-Listen mit grünem Punkt (`bg-success`, `rounded-full`, `h-1.5 w-1.5`)

### Final CTA (Conversion-Ende)
- Hintergrund: Bild mit starkem Overlay (`bg-primary/85`)
- Text: `--primary-foreground` (weiß)
- Primär-Button: `--success`
- Sekundär-Button: `border-white/30 bg-transparent text-primary-foreground hover:bg-white/10`

---

## 7. Animation & Motion

### Standard-Fade-Up
```tsx
const fadeUp = {
  initial: { opacity: 0, y: 16 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true, margin: "-80px" },
  transition: { duration: 0.5, ease: [0.22, 1, 0.36, 1] },
};
```
- Easing: `[0.22, 1, 0.36, 1]` (ease-out-cubic, entspricht Framer Motions `easeOut`)
- Stagger bei Listen: `delay: i * 0.05` oder `delay: i * 0.12`

### Image-Scale-In
```tsx
initial={{ opacity: 0, scale: 0.96 }}
animate={{ opacity: 1, scale: 1 }}
transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
```

### Header-Dropdown
```tsx
initial={{ opacity: 0, y: -6, scale: 0.98 }}
animate={{ opacity: 1, y: 0, scale: 1 }}
exit={{ opacity: 0, y: -6, scale: 0.98 }}
transition={{ duration: 0.22, ease: [0.22, 1, 0.36, 1] }}
```

### Mobile Menu
```tsx
initial={{ opacity: 0, height: 0 }}
animate={{ opacity: 1, height: "auto" }}
exit={{ opacity: 0, height: 0 }}
transition={{ duration: 0.25, ease: [0.22, 1, 0.36, 1] }}
```

### Nav-Pill (Header)
```tsx
<motion.span layoutId="nav-pill" transition={{ type: "spring", stiffness: 380, damping: 32 }} />
```

### AnimatePresence
- Dropdowns nutzen `mode="popLayout"` für flüssigen Inhaltswechsel
- Slide-Effekt bei Dropdown-Wechsel: `initial={{ opacity: 0, x: 24 }}` / `exit={{ opacity: 0, x: -24 }}`

---

## 8. Iconographie

- **Bibliothek:** `lucide-react` (ausschließlich)
- **Standard-Größen:**
  - Inline-Text: `h-3.5 w-3.5`
  - Listen/Formulare: `h-4 w-4`
  - Buttons: `h-4 w-4` oder `h-5 w-5`
  - Feature-Icons: `h-6 w-6`
  - Große Dekoration: `h-7 w-7` bis `h-10 w-10`
- **Icon-Farbe:** Meist `--success` für positive Akzente, `--primary` für neutrale, `--muted-foreground` für deaktivierte Zustände

### Häufige Icons
| Verwendung | Icon |
|-----------|------|
| Strom | `Zap` |
| Gas | `Flame` |
| Kombination | `Layers` |
| Erfolg/Check | `CheckCircle2` |
| Sicherheit | `ShieldCheck` |
| Bewertung | `Star` |
| Telefon | `Phone`, `PhoneCall` |
| Pfeil | `ArrowRight`, `ChevronRight`, `ChevronDown` |
| Menü | `Menu`, `X` |
| Ort | `MapPin` |
| Benutzer | `User`, `UserPlus`, `Users` |
| Dokumente | `FileSignature`, `FileSearch` |
| Warnung | `AlertTriangle` |
| Geschäftlich | `Briefcase`, `Building2` |
| Sparkle/Deko | `Sparkles`, `BadgeCheck`, `Award` |

---

## 9. Formular- & Input-Stil

### Text-Input
```tsx
<Input className="h-12 pl-9 text-base" />
```
- Höhe: `h-12`
- Textgröße: `text-base`
- Icon links: `absolute left-3 top-1/2 -translate-y-1/2`
- Fehler: `border-destructive focus-visible:ring-destructive`
- Label: `text-xs font-semibold uppercase tracking-wide text-muted-foreground`

### Slider
- Standard `Slider` Komponente
- Label zeigt aktuellen Wert: `Jahresverbrauch · {kwh.toLocaleString("de-DE")} kWh`

### Preset-Buttons (Verbrauchswahl)
```tsx
<button className="rounded-full border px-3 py-1.5 text-sm transition">
```
- Aktiv: `border-success bg-success/10 text-success`
- Inaktiv: `border-border text-muted-foreground hover:border-success/50 hover:text-primary`

---

## 10. Header & Navigation

### Header-Struktur
- Sticky Top: `sticky top-0 z-40`
- Hintergrund: `bg-background` mit `border-b border-border`
- Max-Breite: `max-w-6xl px-4`
- Zwei Zeilen: Logo + Utility / Navigation

### Logo
```tsx
<Link className="flex items-center gap-2.5 font-display font-extrabold text-primary">
  <span className="grid h-10 w-10 place-items-center rounded-full bg-success text-success-foreground shadow-soft">
    <Zap className="h-5 w-5" />
  </span>
  <span className="text-lg tracking-tight">EnergieClever</span>
</Link>
```
- Grüner Kreis mit weißem Blitz-Icon
- Display-Font, extrabold, tracking-tight

### Navigation
- Desktop: Horizontale Links mit `rounded-full px-3 py-1.5`
- Aktiver Link: `font-bold text-primary`
- Hover: `hover:text-success`
- Highlight-Item (z. B. "Strom + Gas"): Grüner Punkt davor (`h-2 w-2 rounded-full bg-success`)
- Dropdown: Große Karte mit zwei Spalten (Links + Artikel-Vorschau)

### Mobile Navigation
- Hamburger-Button: `rounded-full border border-border`
- Accordion-Style Aufklappen
- Sticky CTA-Buttons am Ende

---

## 11. Admin / Mitarbeiter-Bereich

- **Layout:** Sidebar links (`w-64`, `border-r`, `bg-background`), Content rechts
- **Sidebar:** Logo oben, Navigation mit Icons, untere Sektion (Einstellungen, Logout)
- **Nav-Items:** Icon + Label, aktiver Zustand mit `bg-muted` und `border-l-2 border-success`
- **Farben:** Gleiche Palette, aber mehr `--surface` und `--muted` Flächen
- **Tabellen:** `border-border`, Header `bg-muted`, Hover `hover:bg-muted/50`
- **Status-Badges:**
  - Grün (`bg-success/10 text-success`): Aktiv, Abgeschlossen
  - Gelb/Orange: Warnung, Warten
  - Grau: Inaktiv
- **Charts:** Einfach, dezent, mit `--success` als Hauptfarbe

---

## 12. Content-Richtlinien

### Sprache
- Deutsch (Du-Form)
- Aktiv und ermutigend
- Konkrete Zahlen statt vager Versprechen ("bis zu 850 €", "in 2 Minuten")

### SEO-Metadaten
Jede Route hat eigene `head()` mit:
- `title`: Max. 60 Zeichen, Keyword-optimiert
- `meta name="description"`: Max. 160 Zeichen
- `og:title`, `og:description`

### Bilder
- Hero-Bilder: `aspect-[16/9]`, `rounded-3xl`, `shadow-card`
- Content-Bilder: `aspect-[4/3]`, `rounded-3xl`, `shadow-card`
- Lazy loading: `loading="lazy"` für unterhalb des Folds
- Alt-Text: Immer vorhanden, beschreibend

---

## 13. Responsives Verhalten

| Breakpoint | Anpassungen |
|-----------|-------------|
| Mobile (<768px) | Single-Column, vereinfachte Navigation, `px-4`, `py-16` |
| Tablet (768px+) | Zwei Spalten wo sinnvoll, `md:text-5xl` |
| Desktop (1024px+) | Vollständiges Layout, `lg:grid-cols-3`, Mega-Dropdowns |

- `md:` und `lg:` als primäre Breakpoint-Präfixe
- Navigation kollabiert bei `md:` von Dropdown zu Mobile-Menu

---

## 14. Was vermieden werden muss

- **KEINE** Purple/Blau-Gradienten (kein generischer AI-Look)
- **KEINE** Serifen-Fonts für Überschriften (nur Sora/Manrope)
- **KEINE** Box-Shadows mit Farbe außerhalb des definierten Systems
- **KEINE** animierten Zahlen/Roulettes (Vertrauenskiller)
- **KEINE** `text-white` ohne `bg-` Context — immer semantische Tokens nutzen
- **KEINE** zu dichte Layouts — negative Fläche ist ein Design-Element
- **KEIN** Reines-Schwarz (`#000000`) — `--primary` (`#0a1f44`) stattdessen

---

## 15. Dateien zur Referenz

| Datei | Inhalt |
|-------|--------|
| `src/styles.css` | Alle CSS-Variablen, Theme-Definitionen |
| `src/components/site/TopicSections.tsx` | Wiederverwendbare Sektions-Komponenten |
| `src/components/site/Header.tsx` | Header mit Dropdown-Navigation |
| `src/routes/index.tsx` | Homepage mit allen Sektions-Mustern |
| `src/components/ui/button.tsx` | Button-Varianten (shadcn/ui) |
| `src/components/mitarbeiter/AdminShell.tsx` | Admin-Layout-Struktur |

---

*Dieses Design System ist lebendig — bei neuen Komponenten sollten die etablierten Muster und Tokens erweitert, nicht ersetzt werden.*
