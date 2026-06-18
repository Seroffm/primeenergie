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
import { getMe } from "./api-client";
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

async function loadProfile(session: Session): Promise<AppUser | null> {
  try {
    const profile = await getMe();
    return {
      id: session.user.id,
      profileId: profile.profileId,
      name: profile.full_name,
      initials: getInitials(profile.full_name),
      email: profile.email,
      role: mapRole(profile.role),
    };
  } catch {
    // Backend-API nicht erreichbar → Fallback auf Supabase-Basisdaten
    const name =
      (session.user.user_metadata?.full_name as string | undefined) ??
      session.user.email ??
      "Mitarbeiter";
    return {
      id: session.user.id,
      profileId: session.user.id,
      name,
      initials: getInitials(name),
      email: session.user.email ?? "",
      role: "mitarbeiter",
    };
  }
}

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<AppUser | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    supabase.auth.getSession().then(async ({ data: { session } }) => {
      if (session) {
        const profile = await loadProfile(session);
        setUser(profile);
      }
      setIsLoading(false);
    });

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange(async (_event, session) => {
      if (session) {
        const profile = await loadProfile(session);
        setUser(profile);
      } else {
        setUser(null);
      }
    });

    return () => subscription.unsubscribe();
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
