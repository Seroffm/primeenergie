// Vorgangsnummern (Lead-Nummer im Mitarbeiterbereich, "Ihre Vorgangsnummer" auf /danke).
//
// Format: genau 7 Zeichen aus einem 32-stelligen Alphabet:
//   - Großbuchstaben A-Z ohne O und I
//   - Ziffern 2-9 ohne 0 und 1
// O/0 und I/1 werden bewusst ausgeschlossen, da sie am Telefon und bei manueller
// Eingabe häufig verwechselt werden.
//
// Beispiele: K7MP4XA, B9R2TQK, X4H7MPC
//
// TODO Supabase-Migration:
// - Spalte `leads.lead_number varchar(7) not null unique` (ersetzt das bisherige
//   "L-YYYY-XXXX"-Format, siehe BACKEND_SPEC.md Abschnitt 2.2 "leads").
// - Generierung serverseitig mit derselben Logik (gleiches Alphabet, Länge 7), z. B. als
//   Postgres-Funktion. Da rein zufällige Werte Eindeutigkeit nicht garantieren (auch wenn
//   bei 32^7 ≈ 34 Mrd. Kombinationen extrem unwahrscheinlich), beim Insert mit
//   `on conflict (lead_number) do nothing` + Retry-Loop arbeiten, statt der zuvor
//   geplanten Jahres-Zählertabelle (lead_number_counters) – die wird damit hinfällig.

const LEAD_NUMBER_LENGTH = 7;

/** 24 Buchstaben (A-Z ohne O/I) + 8 Ziffern (2-9 ohne 0/1) = 32 Zeichen. */
export const LEAD_NUMBER_ALPHABET = "ABCDEFGHJKLMNPQRSTUVWXYZ23456789";

/**
 * Erzeugt eine neue Vorgangsnummer im Format AAAAAAA (7 Zeichen aus LEAD_NUMBER_ALPHABET).
 * Nutzt crypto.getRandomValues für gleichverteilte Zufallswerte – 256 ist durch 32 teilbar,
 * daher führt `byte % 32` zu keiner Verzerrung (Modulo-Bias).
 */
export function generateLeadNumber(): string {
  const bytes = new Uint8Array(LEAD_NUMBER_LENGTH);
  if (typeof crypto !== "undefined" && typeof crypto.getRandomValues === "function") {
    crypto.getRandomValues(bytes);
  } else {
    for (let i = 0; i < bytes.length; i++) bytes[i] = Math.floor(Math.random() * 256);
  }

  let result = "";
  for (let i = 0; i < bytes.length; i++) {
    result += LEAD_NUMBER_ALPHABET[bytes[i] % LEAD_NUMBER_ALPHABET.length];
  }
  return result;
}

/** Prüft, ob ein String dem Vorgangsnummer-Format entspricht (z. B. für Eingabefelder/Suche). */
export function isValidLeadNumber(value: string): boolean {
  if (value.length !== LEAD_NUMBER_LENGTH) return false;
  return [...value.toUpperCase()].every((c) => LEAD_NUMBER_ALPHABET.includes(c));
}
