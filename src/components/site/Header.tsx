import { Link, useRouterState } from "@tanstack/react-router";
import { Phone, UserPlus, ChevronDown, Menu, X } from "lucide-react";
import { useState, useRef, useLayoutEffect } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { cn } from "@/lib/utils";
import { BrandLogo } from "./BrandLogo";

type SimpleLink = { to: string; label: string };
type Article = { to: string; params?: Record<string, string>; title: string; image: string };
type DropdownContent = {
  title: string;
  mainLinks: SimpleLink[];
  secondaryLinks?: SimpleLink[];
  articles?: Article[];
};
type NavItem = {
  to: string;
  label: string;
  activePaths?: string[];
  dropdown?: DropdownContent;
};

const mainNav: NavItem[] = [
  {
    to: "/strom",
    label: "Strom",
    activePaths: ["/strom", "/gewerbestrom"],
    dropdown: {
      title: "Strom",
      mainLinks: [
        { label: "Haushaltsstrom", to: "/strom" },
        { label: "Gewerbestrom", to: "/gewerbestrom" },
        { label: "Stromtarif prüfen", to: "/angebot" },
        { label: "Wechsel mit PRIME ENERGIE", to: "/ablauf" },
      ],
    },
  },
  {
    to: "/gas",
    label: "Gas",
    activePaths: ["/gas", "/gewerbegas"],
    dropdown: {
      title: "Gas",
      mainLinks: [
        { label: "Gas für Zuhause", to: "/gas" },
        { label: "Gewerbegas", to: "/gewerbegas" },
        { label: "Gastarif prüfen", to: "/angebot" },
        { label: "Wechsel mit PRIME ENERGIE", to: "/ablauf" },
      ],
    },
  },
  {
    to: "/strom-gas",
    label: "Strom + Gas",
  },
  {
    to: "/solar",
    label: "Solar",
    dropdown: {
      title: "Solar",
      mainLinks: [{ label: "Photovoltaik & Speicher", to: "/solar" }],
    },
  },
  {
    to: "/service",
    label: "Service",
    activePaths: ["/service", "/kontakt", "/faq", "/freunde-werben"],
    dropdown: {
      title: "Service",
      mainLinks: [
        { label: "Persönlich beraten lassen", to: "/kontakt" },
        { label: "Hilfe & FAQ", to: "/faq" },
        { label: "PRIME ENERGIE empfehlen", to: "/freunde-werben" },
      ],
    },
  },
  {
    to: "/ueber-uns",
    label: "Über uns",
  },
];

function isNavItemActive(item: NavItem, pathname: string) {
  return (item.activePaths ?? [item.to]).some(
    (path) => pathname === path || pathname.startsWith(`${path}/`),
  );
}

export function Header() {
  const pathname = useRouterState({ select: (state) => state.location.pathname });
  const [mobileOpen, setMobileOpen] = useState(false);
  const [openKey, setOpenKey] = useState<string | null>(null);
  const closeTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const navRef = useRef<HTMLElement | null>(null);
  const itemRefs = useRef<Record<string, HTMLDivElement | null>>({});
  const [panelLeft, setPanelLeft] = useState<number>(0);
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
  const dropdownHasArticles = Boolean(activeItem?.dropdown?.articles?.length);
  const dropdownWidth = dropdownHasArticles ? 820 : 320;

  useLayoutEffect(() => {
    if (!activeItem || !navRef.current) return;
    const el = itemRefs.current[activeItem.label];
    if (!el) return;
    const navRect = navRef.current.getBoundingClientRect();
    const itemRect = el.getBoundingClientRect();
    const panelWidth = Math.min(dropdownWidth, window.innerWidth - 32, navRect.width);
    const triggerCenter = itemRect.left - navRect.left + itemRect.width / 2;
    const nextPanelLeft = Math.max(
      0,
      Math.min(triggerCenter - panelWidth / 2, navRect.width - panelWidth),
    );

    setPanelLeft(nextPanelLeft);
    setCaretLeft(triggerCenter - nextPanelLeft);
  }, [activeItem, dropdownWidth]);

  return (
    <header className="sticky top-0 z-40 w-full border-b border-border bg-background">
      <div className="mx-auto max-w-6xl px-4">
        {/* Top utility row */}
        <div className="grid grid-cols-[auto_1fr_auto] items-center gap-4 py-3 md:py-4">
          <Link
            to="/"
            aria-label="PRIME ENERGIE Startseite"
            className="flex items-center rounded-md transition-opacity hover:opacity-80"
          >
            <BrandLogo priority className="w-[11.5rem] sm:w-[13.8rem]" />
          </Link>

          <div />

          <div className="flex items-center gap-1 md:gap-5">
            <Link
              to="/kontakt"
              className="hidden items-center gap-2 text-sm font-semibold text-primary transition hover:text-success md:inline-flex"
            >
              <Phone className="h-4 w-4 text-success" />
              <span>Anrufen</span>
            </Link>
            <Link
              to="/freunde-werben"
              className="hidden items-center gap-2 text-sm font-medium text-primary transition hover:text-success md:inline-flex"
            >
              <UserPlus className="h-4 w-4 text-success" />
              <span>Weiterempfehlen</span>
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
            const isActive = isNavItemActive(n, pathname);
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
                {(isOpen || isActive) && (
                  <span
                    className={cn(
                      "absolute inset-0 -z-0 rounded-full",
                      isActive ? "bg-success/10" : "bg-muted",
                    )}
                    aria-hidden
                  />
                )}
                <Link
                  to={n.to}
                  aria-current={isActive ? "page" : undefined}
                  className={cn(
                    "relative z-10 inline-flex items-center gap-1 rounded-full px-3 py-1.5 text-sm transition-colors",
                    isActive
                      ? "font-semibold text-success"
                      : "font-medium text-primary hover:text-success",
                  )}
                >
                  <span>{n.label}</span>
                  {n.dropdown && (
                    <ChevronDown
                      className={cn(
                        "h-3.5 w-3.5 text-muted-foreground transition-transform duration-300",
                        (isOpen || isActive) && "text-success",
                        isOpen && "rotate-180",
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
                className="absolute top-full z-50 mt-2 max-w-[calc(100vw-2rem)] origin-top"
                style={{ left: panelLeft, width: dropdownWidth }}
              >
                {/* Caret. Slides smoothly between triggers */}
                <motion.div
                  className="absolute -top-1.5 h-3 w-3 rotate-45 bg-background border-l border-t border-border"
                  animate={{ left: Math.max(16, Math.min(caretLeft - 6, dropdownWidth - 24)) }}
                  transition={{ type: "spring", stiffness: 420, damping: 36 }}
                  aria-hidden
                />
                <div className="overflow-hidden rounded-2xl border border-border bg-background shadow-2xl">
                  <>
                    <div
                      key={activeItem.label}
                      className={cn(
                        "grid",
                        dropdownHasArticles && "grid-cols-[minmax(220px,1fr)_1.6fr]",
                      )}
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
                      {dropdownHasArticles && (
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
                      )}
                    </div>
                  </>
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
                <MobileNavItem
                  key={n.label}
                  item={n}
                  pathname={pathname}
                  onNavigate={() => setMobileOpen(false)}
                />
              ))}
              <div className="grid grid-cols-2 gap-2 py-4">
                <Link
                  to="/kontakt"
                  onClick={() => setMobileOpen(false)}
                  className="inline-flex items-center justify-center gap-2 rounded-full border border-border px-3 py-2 text-sm font-semibold text-primary"
                >
                  <Phone className="h-4 w-4 text-success" /> Anrufen
                </Link>
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

function MobileNavItem({
  item,
  pathname,
  onNavigate,
}: {
  item: NavItem;
  pathname: string;
  onNavigate: () => void;
}) {
  const [open, setOpen] = useState(false);
  const isActive = isNavItemActive(item, pathname);
  if (!item.dropdown) {
    return (
      <Link
        to={item.to}
        aria-current={isActive ? "page" : undefined}
        onClick={onNavigate}
        className={cn(
          "flex items-center justify-between border-b border-border px-3 py-3 text-sm font-medium",
          isActive ? "bg-success/10 text-success" : "text-primary",
        )}
      >
        <span>{item.label}</span>
      </Link>
    );
  }
  return (
    <div className="border-b border-border">
      <button
        type="button"
        onClick={() => setOpen((o) => !o)}
        aria-current={isActive ? "page" : undefined}
        className={cn(
          "flex w-full items-center justify-between px-3 py-3 text-sm font-medium",
          isActive ? "bg-success/10 text-success" : "text-primary",
        )}
      >
        <span>{item.label}</span>
        <ChevronDown
          className={cn(
            "h-4 w-4 text-muted-foreground transition-transform duration-300",
            (open || isActive) && "text-success",
            open && "rotate-180",
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
