import { Link } from "@tanstack/react-router";
import { Phone, UserPlus, Smartphone, User, ChevronDown, Menu, X } from "lucide-react";
import logoUrl from "@/assets/logo.svg";
import { useState, useRef, useLayoutEffect } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { cn } from "@/lib/utils";
import imgAutostrom from "@/assets/solution-autostrom.jpg";
import imgWaerme from "@/assets/solution-waermestrom.jpg";
import imgSolar from "@/assets/solution-solar.jpg";

type SimpleLink = { to: string; label: string };
type Article = { to: string; params?: Record<string, string>; title: string; image: string };
type DropdownContent = {
  title: string;
  mainLinks: SimpleLink[];
  secondaryLinks?: SimpleLink[];
  articles?: Article[];
};
type NavItem = { to: string; label: string; highlight?: boolean; dropdown?: DropdownContent };

const mainNav: NavItem[] = [
  {
    to: "/strom",
    label: "Strom",
    dropdown: {
      title: "Strom",
      mainLinks: [
        { label: "Unsere Stromtarife", to: "/strom" },
        { label: "Haushaltsstrom", to: "/strom" },
        { label: "Ökostrom 100 %", to: "/strom" },
        { label: "Autostrom für E-Autos", to: "/strom" },
        { label: "Wärmestrom", to: "/strom" },
        { label: "Gewerbestrom", to: "/gewerbestrom" },
      ],
      secondaryLinks: [
        { label: "Anbieter wechseln. So geht's", to: "/ablauf" },
        { label: "Alles über Strom. Ratgeber", to: "/wissen" },
      ],
      articles: [
        {
          to: "/wissen/$slug",
          params: { slug: "strompreis-2026" },
          title: "Strompreis 2026: Was Haushalte jetzt wissen müssen",
          image: imgAutostrom,
        },
        {
          to: "/wissen/$slug",
          params: { slug: "oekostrom-labels" },
          title: "Ökostrom erkennen: Echte Labels im Vergleich",
          image: imgSolar,
        },
        {
          to: "/wissen/$slug",
          params: { slug: "e-auto-laden" },
          title: "E-Auto laden zuhause: Der günstigste Weg",
          image: imgWaerme,
        },
      ],
    },
  },
  {
    to: "/gas",
    label: "Gas",
    dropdown: {
      title: "Gas",
      mainLinks: [
        { label: "Unsere Gastarife", to: "/gas" },
        { label: "Erdgas Privat", to: "/gas" },
        { label: "Bio-Erdgas", to: "/gas" },
        { label: "Gewerbegas", to: "/gewerbegas" },
      ],
      secondaryLinks: [
        { label: "Gasanbieter wechseln", to: "/ablauf" },
        { label: "Alles über Gas. Ratgeber", to: "/wissen" },
      ],
      articles: [
        {
          to: "/wissen/$slug",
          params: { slug: "gaspreise-2026" },
          title: "Gaspreise 2026: Prognose & Tipps zum Sparen",
          image: imgWaerme,
        },
        { to: "/wissen/heizkosten-senken", title: "Heizkosten senken: 7 schnelle Maßnahmen", image: imgAutostrom },
      ],
    },
  },
  {
    to: "/strom-gas",
    label: "Strom + Gas",
    highlight: true,
    dropdown: {
      title: "Strom + Gas",
      mainLinks: [
        { label: "Komfort-Bundle", to: "/strom-gas" },
        { label: "Familien-Tarif", to: "/strom-gas" },
        { label: "Öko-Komplett", to: "/strom-gas" },
        { label: "Bundle berechnen", to: "/strom-gas" },
      ],
      secondaryLinks: [{ label: "Doppel-Bonus erklärt", to: "/wissen" }],
      articles: [
        {
          to: "/wissen/$slug",
          params: { slug: "bundle-doppelbonus" },
          title: "Strom & Gas bündeln: Wann sich der Doppel-Bonus lohnt",
          image: imgSolar,
        },
        {
          to: "/wissen/ein-vertrag-statt-zwei",
          title: "Ein Vertrag statt zwei: So einfach geht der Wechsel",
          image: imgAutostrom,
        },
      ],
    },
  },
  {
    to: "/solar",
    label: "Solar",
    dropdown: {
      title: "Solar & Wärmepumpe",
      mainLinks: [
        { label: "Unsere Energielösungen", to: "/solar" },
        { label: "Solaranlage", to: "/solar" },
        { label: "Stromspeicher", to: "/solar" },
        { label: "Wärmepumpe", to: "/solar" },
      ],
      secondaryLinks: [
        { label: "Gewerbe Photovoltaik", to: "/kontakt" },
        { label: "Alles über Solar. Ratgeber", to: "/wissen" },
      ],
      articles: [
        {
          to: "/wissen/$slug",
          params: { slug: "solaranlage-kosten-2026" },
          title: "Solaranlage-Kosten 2026: Alle Infos auf einen Blick",
          image: imgSolar,
        },
        { to: "/wissen/solaranlage-installation", title: "Solaranlagen Installation | So geht's", image: imgWaerme },
        {
          to: "/wissen/solaranlage-foerderungen-2026",
          title: "Förderungen & Zuschüsse für Solaranlagen 2026",
          image: imgAutostrom,
        },
      ],
    },
  },

  { to: "/wissen", label: "Wissen" },
  {
    to: "/service",
    label: "Service",
    dropdown: {
      title: "Service",
      mainLinks: [
        { label: "Kontakt aufnehmen", to: "/kontakt" },
        { label: "Hilfe & FAQ", to: "/faq" },
        { label: "Wechsel-Service", to: "/service" },
        { label: "Dokumente & Verträge", to: "/service" },
      ],
      secondaryLinks: [{ label: "Freunde werben & profitieren", to: "/freunde-werben" }],
      articles: [
        {
          to: "/wissen/anbieterwechsel-schritt-fuer-schritt",
          title: "So einfach läuft dein Anbieterwechsel mit uns",
          image: imgAutostrom,
        },
        { to: "/wissen/unterlagen-beim-wechsel", title: "Diese Unterlagen brauchst du beim Wechsel", image: imgWaerme },
      ],
    },
  },
  {
    to: "/ueber-uns",
    label: "Über uns",
    dropdown: {
      title: "Über uns",
      mainLinks: [
        { label: "Unser Team", to: "/ueber-uns" },
        { label: "Auszeichnungen", to: "/ueber-uns" },
        { label: "Nachhaltigkeit", to: "/ueber-uns" },
        { label: "Karriere", to: "/ueber-uns" },
      ],
      secondaryLinks: [{ label: "Presse & Medien", to: "/ueber-uns" }],
      articles: [
        {
          to: "/ueber-uns",
          title: "Unsere Mission: Energie einfach & ehrlich machen",
          image: imgSolar,
        },
        {
          to: "/ueber-uns",
          title: "Ausgezeichnet vom TÜV | Das steckt dahinter",
          image: imgAutostrom,
        },
      ],
    },
  },
];

export function Header() {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [openKey, setOpenKey] = useState<string | null>(null);
  const closeTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const navRef = useRef<HTMLElement | null>(null);
  const itemRefs = useRef<Record<string, HTMLDivElement | null>>({});
  const [caretLeft, setCaretLeft] = useState<number>(0);

  const open = (key: string) => {
    if (closeTimer.current) clearTimeout(closeTimer.current);
    setOpenKey(key);
  };
  const scheduleClose = () => {
    if (closeTimer.current) clearTimeout(closeTimer.current);
    closeTimer.current = setTimeout(() => setOpenKey(null), 140);
  };

  const activeItem = mainNav.find((n) => n.label === openKey && n.dropdown);
  // Ref always reflects the latest render — used in dropdown onMouseEnter to avoid
  // the stale-closure bug where AnimatePresence exit elements reopen the menu.
  const activeItemRef = useRef<typeof activeItem>(undefined);
  activeItemRef.current = activeItem;

  useLayoutEffect(() => {
    if (!activeItem || !navRef.current) return;
    const el = itemRefs.current[activeItem.label];
    if (!el) return;
    const navRect = navRef.current.getBoundingClientRect();
    const itemRect = el.getBoundingClientRect();
    // Panel is right-0 (820px wide), so caret position is relative to panel's left edge
    const panelWidth = Math.min(820, window.innerWidth - 32);
    setCaretLeft(itemRect.left + itemRect.width / 2 - navRect.right + panelWidth);
  }, [activeItem]);

  return (
    <header className="sticky top-0 z-40 w-full border-b border-border bg-background">
      <div className="mx-auto max-w-6xl px-4">
        {/* Top utility row */}
        <div className="grid grid-cols-[auto_1fr_auto] items-center gap-4 py-3 md:py-4">
          <Link to="/" className="flex items-center">
            <img src={logoUrl} alt="PRIME ENERGIE" className="h-12 w-auto" />
          </Link>

          <div />

          <div className="flex items-center gap-1 md:gap-5">
            <a
              href="tel:08001234567"
              className="hidden items-center gap-2 text-sm font-semibold text-primary transition hover:text-success md:inline-flex"
            >
              <Phone className="h-4 w-4 text-success" />
              <span>0800 123 4567</span>
            </a>
            <Link
              to="/freunde-werben"
              className="hidden items-center gap-2 text-sm font-medium text-primary transition hover:text-success md:inline-flex"
            >
              <UserPlus className="h-4 w-4 text-success" />
              <span>Freunde werben</span>
            </Link>
            <Link
              to="/angebot"
              className="hidden items-center gap-2 text-sm font-medium text-primary transition hover:text-success md:inline-flex"
            >
              <Smartphone className="h-4 w-4 text-success" />
              <span>App</span>
            </Link>
            <Link
              to="/mitarbeiter/login"
              className="hidden items-center gap-2 text-sm font-medium text-primary transition hover:text-success md:inline-flex"
            >
              <User className="h-4 w-4 text-success" />
              <span>Login</span>
            </Link>

            <button
              type="button"
              aria-label={mobileOpen ? "Menü schließen" : "Menü öffnen"}
              onClick={() => setMobileOpen((o) => !o)}
              className="grid h-10 w-10 place-items-center rounded-full border border-border text-primary md:hidden"
            >
              {mobileOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
            </button>
          </div>
        </div>

        {/* Main nav row */}
        <nav
          ref={navRef}
          className="relative hidden h-14 items-center justify-end gap-8 md:flex"
          onMouseLeave={scheduleClose}
        >
          {mainNav.map((n) => {
            const isOpen = openKey === n.label && !!n.dropdown;
            return (
              <div
                key={n.label}
                ref={(el) => {
                  itemRefs.current[n.label] = el;
                }}
                onMouseEnter={() => (n.dropdown ? open(n.label) : scheduleClose())}
                onFocus={() => (n.dropdown ? open(n.label) : scheduleClose())}
                className="relative"
              >
                {isOpen && (
                  <motion.span
                    layoutId="nav-pill"
                    transition={{ type: "spring", stiffness: 380, damping: 32 }}
                    className="absolute inset-0 -z-0 rounded-full bg-muted"
                    aria-hidden
                  />
                )}
                <Link
                  to={n.to}
                  className={cn(
                    "relative z-10 inline-flex items-center gap-1 rounded-full px-3 py-1.5 text-sm transition-colors",
                    n.highlight
                      ? "font-bold text-primary"
                      : "font-medium text-primary hover:text-success",
                  )}
                  activeProps={{ className: "font-bold text-primary" }}
                >
                  {n.highlight && (
                    <span className="mr-1 h-2 w-2 rounded-full bg-success" aria-hidden />
                  )}
                  <span>{n.label}</span>
                  {n.dropdown && (
                    <ChevronDown
                      className={cn(
                        "h-3.5 w-3.5 text-muted-foreground transition-transform duration-300",
                        isOpen && "rotate-180 text-success",
                      )}
                    />
                  )}
                </Link>
              </div>
            );
          })}

          {/* Floating dropdown card. Persistent shell so switching slides instead of fading */}
          <AnimatePresence>
            {activeItem?.dropdown && (
              <motion.div
                initial={{ opacity: 0, y: -8, scale: 0.97 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: -4, scale: 0.98 }}
                transition={{ type: "spring", stiffness: 340, damping: 30, mass: 0.8 }}
                onMouseEnter={() => {
                  const item = activeItemRef.current;
                  if (item) open(item.label);
                }}
                onMouseLeave={scheduleClose}
                className="absolute right-0 top-full z-50 mt-2 w-[820px] max-w-[calc(100vw-2rem)] origin-top"
              >
                {/* Caret. Slides smoothly between triggers */}
                <motion.div
                  className="absolute -top-1.5 h-3 w-3 rotate-45 bg-background border-l border-t border-border"
                  animate={{ left: Math.max(16, Math.min(caretLeft - 6, 820 - 24)) }}
                  transition={{ type: "spring", stiffness: 420, damping: 36 }}
                  aria-hidden
                />
                <div className="overflow-hidden rounded-2xl border border-border bg-background shadow-2xl">
                  <AnimatePresence mode="popLayout" initial={false}>
                    <motion.div
                      key={activeItem.label}
                      initial={{ opacity: 0, x: 16 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, x: -16 }}
                      transition={{ type: "spring", stiffness: 380, damping: 34, mass: 0.7 }}
                      className="grid grid-cols-[minmax(220px,1fr)_1.6fr]"
                    >
                      {/* Left column */}
                      <div className="bg-background p-7">
                        <div className="text-base font-bold text-primary">
                          {activeItem.dropdown.title}
                        </div>
                        <ul className="mt-5 space-y-3">
                          {activeItem.dropdown.mainLinks.map((l) => (
                            <li key={l.label}>
                              <Link
                                to={l.to}
                                onClick={() => setOpenKey(null)}
                                className="text-sm text-primary transition hover:text-success"
                              >
                                {l.label}
                              </Link>
                            </li>
                          ))}
                        </ul>
                        {activeItem.dropdown.secondaryLinks &&
                          activeItem.dropdown.secondaryLinks.length > 0 && (
                            <>
                              <div className="my-5 h-px bg-border" />
                              <ul className="space-y-3">
                                {activeItem.dropdown.secondaryLinks.map((l) => (
                                  <li key={l.label}>
                                    <Link
                                      to={l.to}
                                      onClick={() => setOpenKey(null)}
                                      className="text-sm text-primary transition hover:text-success"
                                    >
                                      {l.label}
                                    </Link>
                                  </li>
                                ))}
                              </ul>
                            </>
                          )}
                      </div>

                      {/* Right column. Articles */}
                      <div className="bg-muted/60 p-7">
                        <div className="grid grid-cols-2 gap-5">
                          {activeItem.dropdown.articles?.map((a) => (
                            <Link
                              key={a.title}
                              to={a.to}
                              params={a.params}
                              onClick={() => setOpenKey(null)}
                              className="group block"
                            >
                              <div className="overflow-hidden rounded-lg bg-background">
                                <img
                                  src={a.image}
                                  alt=""
                                  className="h-28 w-full object-cover transition duration-500 group-hover:scale-105"
                                />
                              </div>
                              <div className="mt-2 text-sm font-medium leading-snug text-primary transition group-hover:text-success">
                                {a.title}
                              </div>
                            </Link>
                          ))}
                        </div>
                      </div>
                    </motion.div>
                  </AnimatePresence>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </nav>
      </div>

      {/* Mobile menu */}
      <AnimatePresence>
        {mobileOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.25, ease: [0.22, 1, 0.36, 1] }}
            className="overflow-hidden border-t border-border bg-background md:hidden"
          >
            <nav className="mx-auto flex max-w-6xl flex-col px-4 py-2">
              {mainNav.map((n) => (
                <MobileNavItem key={n.label} item={n} onNavigate={() => setMobileOpen(false)} />
              ))}
              <div className="grid grid-cols-2 gap-2 py-4">
                <a
                  href="tel:08001234567"
                  className="inline-flex items-center justify-center gap-2 rounded-full border border-border px-3 py-2 text-sm font-semibold text-primary"
                >
                  <Phone className="h-4 w-4 text-success" /> Anrufen
                </a>
                <Link
                  to="/angebot"
                  onClick={() => setMobileOpen(false)}
                  className="inline-flex items-center justify-center gap-2 rounded-full bg-success px-3 py-2 text-sm font-semibold text-success-foreground"
                >
                  Jetzt vergleichen
                </Link>
              </div>
            </nav>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}

function MobileNavItem({ item, onNavigate }: { item: NavItem; onNavigate: () => void }) {
  const [open, setOpen] = useState(false);
  if (!item.dropdown) {
    return (
      <Link
        to={item.to}
        onClick={onNavigate}
        className="flex items-center justify-between border-b border-border py-3 text-sm font-medium text-primary"
      >
        <span className="flex items-center gap-2">
          {item.highlight && <span className="h-2 w-2 rounded-full bg-success" />}
          {item.label}
        </span>
      </Link>
    );
  }
  return (
    <div className="border-b border-border">
      <button
        type="button"
        onClick={() => setOpen((o) => !o)}
        className="flex w-full items-center justify-between py-3 text-sm font-medium text-primary"
      >
        <span className="flex items-center gap-2">
          {item.highlight && <span className="h-2 w-2 rounded-full bg-success" />}
          {item.label}
        </span>
        <ChevronDown
          className={cn(
            "h-4 w-4 text-muted-foreground transition-transform duration-300",
            open && "rotate-180 text-success",
          )}
        />
      </button>
      <AnimatePresence initial={false}>
        {open && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.25, ease: [0.22, 1, 0.36, 1] }}
            className="overflow-hidden"
          >
            <div className="flex flex-col gap-1 pb-3 pl-4">
              {item.dropdown.mainLinks.map((link) => (
                <Link
                  key={link.label}
                  to={link.to}
                  onClick={onNavigate}
                  className="rounded-lg py-2 text-sm text-muted-foreground hover:text-success"
                >
                  {link.label}
                </Link>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
