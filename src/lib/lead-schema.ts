import { z } from "zod";

export const energyTypes = ["strom", "gas", "beides", "gewerbe"] as const;
export const customerTypes = ["privat", "gewerbe", "hausverwaltung", "mehrere_standorte"] as const;
export const heatingTypes = ["gasheizung", "etagenheizung", "kombitherme", "andere"] as const;
export const reachability = ["vormittag", "nachmittag", "abend", "egal"] as const;
export const goals = [
  "guenstigster_preis",
  "preisgarantie",
  "oekostrom",
  "kurze_laufzeit",
  "persoenliche_beratung",
] as const;
export const priceGuarantee = ["ja", "nein", "weiss_nicht"] as const;

// Verbrauchs-Schätzwerte (kWh / Jahr)
export const ESTIMATED_STROM_KWH: Record<number, number> = {
  1: 1500,
  2: 2500,
  3: 3500,
  4: 4250,
  5: 5500,
};

export function estimateGasKwh(wohnflaecheM2: number, withWarmwater: boolean): number {
  // Faustformel: ~140 kWh / m² + 200 kWh/Pers für Warmwasser eingerechnet pauschal
  return Math.round(wohnflaecheM2 * 140 + (withWarmwater ? 800 : 0));
}

export const leadSchema = z.object({
  energyType: z.enum(energyTypes),
  customerType: z.enum(customerTypes),

  plz: z.string().regex(/^\d{5}$/, "PLZ muss 5-stellig sein"),
  ort: z.string().min(2, "Ort fehlt"),
  strasse: z.string().optional(),

  stromVerbrauchKwh: z.number().int().positive().optional(),
  stromPersonen: z.number().int().min(1).max(8).optional(),
  gasVerbrauchKwh: z.number().int().positive().optional(),
  gasWohnflaeche: z.number().int().positive().optional(),
  gasHeizart: z.enum(heatingTypes).optional(),
  gasPersonen: z.number().int().min(1).max(12).optional(),
  gasWarmwasser: z.boolean().optional(),

  aktuellerAnbieter: z.string().optional(),
  monatlicherAbschlag: z.number().nonnegative().optional(),
  vertragsende: z.string().optional(),
  preisgarantie: z.enum(priceGuarantee).optional(),

  ziele: z.array(z.enum(goals)).default([]),

  vorname: z.string().min(2, "Vorname fehlt"),
  nachname: z.string().min(2, "Nachname fehlt"),
  email: z.string().email("Ungültige E-Mail"),
  telefon: z.string().min(5, "Telefonnummer fehlt"),
  erreichbarkeit: z.enum(reachability),

  rechnungDateiname: z.string().optional(),
  rechnungGroesseKb: z.number().optional(),

  datenschutzAkzeptiert: z.literal(true, { message: "Bitte Datenschutz akzeptieren" }),
  kontaktAkzeptiert: z.literal(true, { message: "Bitte Kontaktaufnahme zustimmen" }),
});

export type LeadInput = z.infer<typeof leadSchema>;

export const energyTypeLabels: Record<(typeof energyTypes)[number], string> = {
  strom: "Strom",
  gas: "Gas",
  beides: "Strom & Gas",
  gewerbe: "Gewerbe",
};
export const customerTypeLabels: Record<(typeof customerTypes)[number], string> = {
  privat: "Privatkunde",
  gewerbe: "Gewerbekunde",
  hausverwaltung: "Hausverwaltung",
  mehrere_standorte: "Mehrere Standorte",
};
export const goalLabels: Record<(typeof goals)[number], string> = {
  guenstigster_preis: "Günstigster Preis",
  preisgarantie: "Preisgarantie",
  oekostrom: "Ökostrom",
  kurze_laufzeit: "Kurze Laufzeit",
  persoenliche_beratung: "Persönliche Beratung",
};
