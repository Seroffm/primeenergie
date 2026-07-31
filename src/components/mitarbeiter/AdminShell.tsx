import { Link, useRouterState, useNavigate } from "@tanstack/react-router";
import {
  LayoutDashboard,
  Users,
  Inbox,
  BarChart3,
  Settings,
  LogOut,
  Bell,
  Search,
  Building2,
  Tag,
  UserCog,
  Mail,
  CalendarClock,
  Newspaper,
  Gift,
} from "lucide-react";
import { type FormEvent, type ReactNode, useState } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Toaster } from "@/components/ui/sonner";
import { BrandLogo } from "@/components/site/BrandLogo";
import { useAuth, roleBadgeLabel } from "@/lib/auth-context";
import type { Role } from "@/lib/mock-leads";

type NavEntry = { to: string; label: string; icon: typeof Inbox; badge?: number; roles?: Role[] };

const navMain: NavEntry[] = [
  { to: "/mitarbeiter/dashboard", label: "Dashboard", icon: LayoutDashboard },
  { to: "/mitarbeiter/leads", label: "Leads", icon: Inbox },
  { to: "/mitarbeiter/wiedervorlage", label: "Wiedervorlage", icon: CalendarClock },
  { to: "/mitarbeiter/kunden", label: "Kunden", icon: Users },
  {
    to: "/mitarbeiter/statistiken",
    label: "Statistiken",
    icon: BarChart3,
    roles: ["admin", "manager"],
  },
];

const navAdmin: NavEntry[] = [
  { to: "/mitarbeiter/anbieter", label: "Anbieter", icon: Building2, roles: ["admin", "manager"] },
  { to: "/mitarbeiter/tarife", label: "Tarife", icon: Tag, roles: ["admin", "manager"] },
  { to: "/mitarbeiter/team", label: "Team", icon: UserCog, roles: ["admin"] },
  {
    to: "/mitarbeiter/redaktion",
    label: "Redaktion",
    icon: Newspaper,
    roles: ["admin", "manager"],
  },
  {
    to: "/mitarbeiter/referrals",
    label: "Referral-Prämien",
    icon: Gift,
    roles: ["admin", "manager"],
  },
  {
    to: "/mitarbeiter/vorlagen",
    label: "E-Mail-Vorlagen",
    icon: Mail,
    roles: ["admin", "manager"],
  },
  { to: "/mitarbeiter/einstellungen", label: "Einstellungen", icon: Settings, roles: ["admin"] },
];

export function AdminShell({
  children,
  title,
  subtitle,
  actions,
}: {
  children: ReactNode;
  title: string;
  subtitle?: string;
  actions?: ReactNode;
}) {
  const pathname = useRouterState({ select: (s) => s.location.pathname });
  const navigate = useNavigate();
  const { user, hasRole, signOut } = useAuth();
  const [globalSearch, setGlobalSearch] = useState("");

  const visibleMain = navMain.filter((i) => !i.roles || hasRole(...i.roles));
  const visibleAdmin = navAdmin.filter((i) => !i.roles || hasRole(...i.roles));

  async function handleSignOut() {
    await signOut();
    navigate({ to: "/mitarbeiter/login" });
  }

  function handleGlobalSearch(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const query = globalSearch.trim();
    navigate({
      to: "/mitarbeiter/leads",
      search: query ? { q: query } : {},
    });
  }

  return (
    <div className="min-h-screen bg-muted/30">
      <Toaster position="top-right" richColors closeButton />
      <aside className="fixed inset-y-0 left-0 z-30 hidden w-64 flex-col border-r bg-background lg:flex">
        <div className="flex h-24 items-center border-b px-5">
          <Link to="/mitarbeiter/dashboard" className="block min-w-0" aria-label="Zum Dashboard">
            <BrandLogo priority className="w-full max-w-[12rem]" />
            <div className="mt-1 text-xs font-medium text-muted-foreground">Mitarbeiter CRM</div>
          </Link>
        </div>
        <nav className="flex-1 space-y-1 overflow-y-auto p-3">
          {visibleMain.map((item) => (
            <NavLink key={item.to} item={item} pathname={pathname} />
          ))}
          {visibleAdmin.length > 0 && (
            <>
              <div className="px-3 pb-1 pt-4 text-[10px] font-semibold uppercase tracking-wider text-muted-foreground">
                Verwaltung
              </div>
              {visibleAdmin.map((item) => (
                <NavLink key={item.to} item={item} pathname={pathname} />
              ))}
            </>
          )}
        </nav>
        <div className="border-t p-3">
          <button
            onClick={handleSignOut}
            className="flex w-full items-center gap-3 rounded-md px-3 py-2 text-sm text-muted-foreground hover:bg-muted hover:text-foreground"
          >
            <LogOut className="h-4 w-4" /> Abmelden
          </button>
        </div>
      </aside>

      <div className="lg:pl-64">
        <header className="sticky top-0 z-20 flex h-16 items-center gap-4 border-b bg-background/80 px-4 backdrop-blur lg:px-8">
          <Link
            to="/mitarbeiter/dashboard"
            aria-label="Zum Dashboard"
            className="flex min-w-0 items-center lg:hidden"
          >
            <BrandLogo priority className="w-[9.5rem] sm:w-[10.5rem]" />
          </Link>
          <form
            className="relative hidden flex-1 max-w-md md:block"
            role="search"
            onSubmit={handleGlobalSearch}
          >
            <button
              type="submit"
              aria-label="Suche starten"
              className="absolute left-0 top-0 flex h-full w-10 items-center justify-center text-muted-foreground transition-colors hover:text-foreground"
            >
              <Search className="h-4 w-4" />
            </button>
            <Input
              type="search"
              aria-label="Leads durchsuchen"
              placeholder="Leads, Kunden, Verträge suchen…"
              value={globalSearch}
              onChange={(event) => setGlobalSearch(event.target.value)}
              className="pl-10"
            />
          </form>
          <div className="flex flex-1 items-center justify-end gap-2">
            <Button variant="ghost" size="icon">
              <Bell className="h-5 w-5" />
            </Button>
            {user && (
              <div className="flex items-center gap-2 rounded-full border px-2 py-1">
                <Avatar className="h-7 w-7">
                  <AvatarFallback className="text-xs">{user.initials}</AvatarFallback>
                </Avatar>
                <div className="hidden text-xs sm:block text-left">
                  <div className="font-medium leading-none">{user.name}</div>
                  <div className="text-muted-foreground">{roleBadgeLabel[user.role]}</div>
                </div>
              </div>
            )}
          </div>
        </header>

        <div className="px-4 py-6 lg:px-8">
          <div className="mb-6 flex flex-wrap items-end justify-between gap-4">
            <div>
              <h1 className="text-2xl font-semibold tracking-tight">{title}</h1>
              {subtitle && <p className="mt-1 text-sm text-muted-foreground">{subtitle}</p>}
            </div>
            {actions && <div className="flex flex-wrap gap-2">{actions}</div>}
          </div>
          {children}
        </div>
      </div>
    </div>
  );
}

function NavLink({ item, pathname }: { item: NavEntry; pathname: string }) {
  const active = pathname === item.to || pathname.startsWith(item.to + "/");
  const Icon = item.icon;
  return (
    <Link
      to={item.to}
      className={`flex items-center justify-between rounded-md px-3 py-2 text-sm font-medium transition-colors ${
        active
          ? "bg-primary/10 text-primary"
          : "text-muted-foreground hover:bg-muted hover:text-foreground"
      }`}
    >
      <span className="flex items-center gap-3">
        <Icon className="h-4 w-4" />
        {item.label}
      </span>
      {item.badge ? (
        <Badge variant="secondary" className="h-5 px-1.5 text-[10px]">
          {item.badge}
        </Badge>
      ) : null}
    </Link>
  );
}

export function RoleGate({
  allow,
  children,
  fallback,
}: {
  allow: Role[];
  children: ReactNode;
  fallback?: ReactNode;
}) {
  const { hasRole } = useAuth();
  if (!hasRole(...allow)) {
    return (
      fallback ?? (
        <div className="rounded-lg border border-dashed bg-muted/30 p-12 text-center">
          <div className="text-sm font-medium">Keine Berechtigung</div>
          <p className="mt-1 text-xs text-muted-foreground">
            Dieser Bereich ist nur für {allow.map((r) => roleBadgeLabel[r]).join(", ")} sichtbar.
          </p>
        </div>
      )
    );
  }
  return <>{children}</>;
}
