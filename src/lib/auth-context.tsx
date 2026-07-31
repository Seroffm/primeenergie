import {
  createContext,
  useContext,
  useEffect,
  useState,
  type ReactNode,
  createElement,
} from "react";
import type { Session } from "@supabase/supabase-js";
import { supabase } from "./supabase";
import { ApiError, getMeWithAccessToken } from "./api-client";
import { mapRole, getInitials } from "./api-types";
import type { Role } from "./mock-leads";

export interface AppUser {
  id: string;
  profileId: string;
  name: string;
  initials: string;
  email: string;
  role: Role;
}

interface AuthCtx {
  user: AppUser | null;
  isLoading: boolean;
  signIn: (email: string, password: string) => Promise<{ error: string | null }>;
  signOut: () => Promise<void>;
  hasRole: (...r: Role[]) => boolean;
}

const Ctx = createContext<AuthCtx | null>(null);

async function loadProfile(session: Session): Promise<AppUser> {
  let lastError: unknown;

  for (let attempt = 0; attempt < 3; attempt += 1) {
    try {
      // Das Token des Auth Events direkt verwenden. Ein erneutes getSession() innerhalb
      // von onAuthStateChange kann den Supabase Auth Lock blockieren.
      const profile = await getMeWithAccessToken(session.access_token);
      return {
        id: session.user.id,
        profileId: profile.profileId,
        name: profile.full_name,
        initials: getInitials(profile.full_name),
        email: profile.email,
        role: mapRole(profile.role),
      };
    } catch (error) {
      lastError = error;
      if (error instanceof ApiError && error.status >= 400 && error.status < 500) throw error;
      if (attempt < 2)
        await new Promise((resolve) => window.setTimeout(resolve, 200 * (attempt + 1)));
    }
  }

  throw lastError;
}

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<AppUser | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    let cancelled = false;
    let requestSequence = 0;
    let lastSessionToken: string | null | undefined;

    const syncSession = async (session: Session | null) => {
      const sessionToken = session?.access_token ?? null;
      if (sessionToken === lastSessionToken) return;
      lastSessionToken = sessionToken;
      const currentRequest = ++requestSequence;

      if (!session) {
        if (!cancelled) {
          setUser(null);
          setIsLoading(false);
        }
        return;
      }

      setIsLoading(true);
      try {
        const profile = await loadProfile(session);
        if (!cancelled && currentRequest === requestSequence) setUser(profile);
      } catch (error) {
        // Eine gültige Supabase Sitzung niemals wegen eines temporären API Fehlers löschen.
        // Geschützte API Routen prüfen Token und Rolle weiterhin serverseitig.
        console.error("Profil konnte nicht geladen werden:", error);
      } finally {
        if (!cancelled && currentRequest === requestSequence) setIsLoading(false);
      }
    };

    void supabase.auth.getSession().then(({ data: { session } }) => syncSession(session));

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      // Callback synchron beenden, damit Supabase seinen internen Auth Lock freigibt.
      void syncSession(session);
    });

    return () => {
      cancelled = true;
      subscription.unsubscribe();
    };
  }, []);

  const signIn = async (email: string, password: string): Promise<{ error: string | null }> => {
    const { error } = await supabase.auth.signInWithPassword({ email, password });
    if (error) return { error: error.message };
    return { error: null };
  };

  const signOut = async () => {
    await supabase.auth.signOut();
    setUser(null);
  };

  const hasRole = (...roles: Role[]): boolean => user !== null && roles.includes(user.role);

  return createElement(
    Ctx.Provider,
    { value: { user, isLoading, signIn, signOut, hasRole } },
    children,
  );
}

export function useAuth(): AuthCtx {
  const ctx = useContext(Ctx);
  if (!ctx) throw new Error("useAuth muss innerhalb von AuthProvider verwendet werden");
  return ctx;
}

export function useRequireUser(): AppUser {
  const { user, isLoading } = useAuth();
  if (isLoading) throw new Promise<void>(() => {});
  if (!user) throw new Error("Nicht eingeloggt");
  return user;
}

// Für RoleBadge-Labels – kompatibel mit mock-auth.ts
export const roleBadgeLabel: Record<Role, string> = {
  admin: "Admin",
  manager: "Manager",
  mitarbeiter: "Mitarbeiter",
};
