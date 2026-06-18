// Backward-Compat-Wrapper: Delegiert an den echten AuthProvider (auth-context.tsx).
// Alle Komponenten, die `useMockAuth` / `MockAuthProvider` importieren, funktionieren
// weiterhin ohne Änderung, zeigen aber jetzt echte Supabase-Auth-Daten.

export {
  AuthProvider as MockAuthProvider,
  useAuth as useMockAuth,
  roleBadgeLabel,
  type AppUser as MockUser,
} from "./auth-context";
