export type LeadStatus =
  | "neu"
  | "in_pruefung"
  | "rueckfrage"
  | "angebot_erstellt"
  | "angebot_gesendet"
  | "interessiert"
  | "vertrag_vorbereitet"
  | "vertrag_gesendet"
  | "abgeschlossen"
  | "abgelehnt"
  | "nicht_erreichbar"
  | "wiedervorlage";

export type LeadType = "strom" | "gas" | "strom_gas" | "gewerbe";
export type Role = "admin" | "manager" | "mitarbeiter";

export const statusLabel: Record<LeadStatus, string> = {
  neu: "Neu",
  in_pruefung: "In Prüfung",
  rueckfrage: "Rückfrage offen",
  angebot_erstellt: "Angebot erstellt",
  angebot_gesendet: "Angebot gesendet",
  interessiert: "Kunde interessiert",
  vertrag_vorbereitet: "Vertrag vorbereitet",
  vertrag_gesendet: "Vertrag gesendet",
  abgeschlossen: "Abgeschlossen",
  abgelehnt: "Abgelehnt",
  nicht_erreichbar: "Nicht erreichbar",
  wiedervorlage: "Wiedervorlage",
};

export const statusColor: Record<LeadStatus, string> = {
  neu: "bg-blue-500/15 text-blue-700 dark:text-blue-300",
  in_pruefung: "bg-sky-500/15 text-sky-700 dark:text-sky-300",
  rueckfrage: "bg-amber-500/15 text-amber-700 dark:text-amber-300",
  angebot_erstellt: "bg-indigo-500/15 text-indigo-700 dark:text-indigo-300",
  angebot_gesendet: "bg-violet-500/15 text-violet-700 dark:text-violet-300",
  interessiert: "bg-teal-500/15 text-teal-700 dark:text-teal-300",
  vertrag_vorbereitet: "bg-purple-500/15 text-purple-700 dark:text-purple-300",
  vertrag_gesendet: "bg-fuchsia-500/15 text-fuchsia-700 dark:text-fuchsia-300",
  abgeschlossen: "bg-emerald-500/15 text-emerald-700 dark:text-emerald-300",
  abgelehnt: "bg-rose-500/15 text-rose-700 dark:text-rose-300",
  nicht_erreichbar: "bg-orange-500/15 text-orange-700 dark:text-orange-300",
  wiedervorlage: "bg-slate-500/15 text-slate-700 dark:text-slate-300",
};

export const typeLabel: Record<LeadType, string> = {
  strom: "Strom",
  gas: "Gas",
  strom_gas: "Strom + Gas",
  gewerbe: "Gewerbe",
};

export interface LeadNote {
  id: string;
  author: string;
  /** Rolle des Verfassers zum Zeitpunkt der Notiz – optional, da ältere Notizen sie ggf. nicht haben. */
  authorRole?: Role;
  date: string;
  text: string;
  /** Markiert die Notiz als wichtig (roter Rahmen + Label). Kein Löschen vorgesehen – CRM-Verlauf. */
  isImportant?: boolean;
}

/** Ein Eintrag im Aktivitäts-/Verlauf-Tab eines Leads (Status-Änderung, Wiedervorlage, etc.). */
export interface LeadHistoryEntry {
  id: string;
  date: string;
  author: string;
  type: "status_change" | "wiedervorlage" | "note" | "system";
  text: string;
}

/** Wiedervorlage-Termin eines Leads. Wird auf der Wiedervorlage-Übersichtsseite angezeigt. */
export interface LeadWiedervorlage {
  /** ISO-Datum (optional mit Uhrzeit), Fälligkeitszeitpunkt der Wiedervorlage. */
  date: string;
  comment?: string;
  createdBy?: string;
  createdAt?: string;
}

export interface LeadDocument {
  id: string;
  name: string;
  kind: "rechnung" | "angebot" | "vertrag" | "sonstiges";
  size: string;
  uploadedAt: string;
  /** Name des Mitarbeiters, der das Dokument hochgeladen hat (bei Session-Uploads). */
  uploadedBy?: string;
  /** Lokale Object-URL für den Download innerhalb der aktuellen Session (kein echtes Storage). */
  objectUrl?: string;
}

export interface LeadEmail {
  id: string;
  subject: string;
  from: string;
  to: string;
  date: string;
  direction: "in" | "out";
  preview: string;
}

export interface LeadOffer {
  id: string;
  providerName: string;
  tariffName: string;
  monthlyPrice: number;
  yearlyPrice: number;
  savings: number;
  sentAt?: string;
  status: "entwurf" | "gesendet" | "angenommen" | "abgelehnt";
}

export interface Lead {
  id: string;
  name: string;
  email: string;
  phone: string;
  city: string;
  plz: string;
  type: LeadType;
  consumption: number;
  currentProvider: string;
  monthlyPayment: number;
  status: LeadStatus;
  score: number;
  assignee: string;
  createdAt: string;
  expectedSavings: number;
  source: string;
  hasInvoice: boolean;
  notes: LeadNote[];
  documents: LeadDocument[];
  emails: LeadEmail[];
  offers: LeadOffer[];
  /** Aktivitäts-Verlauf (Status-Änderungen, Wiedervorlagen, ...) – Basis für den "Verlauf"-Tab. */
  history: LeadHistoryEntry[];
  /** Aktuell offene Wiedervorlage, falls eine gesetzt ist. */
  wiedervorlage?: LeadWiedervorlage;
}

export const leads: Lead[] = [
  {
    id: "K7MP4XA",
    name: "Markus Hoffmann",
    email: "m.hoffmann@example.de",
    phone: "+49 175 1234567",
    city: "Köln",
    plz: "50667",
    type: "strom_gas",
    consumption: 5800,
    currentProvider: "RheinEnergie",
    monthlyPayment: 189,
    status: "neu",
    score: 87,
    assignee: "Sarah Becker",
    createdAt: "2026-06-14T09:21:00",
    expectedSavings: 624,
    source: "Google Ads",
    hasInvoice: true,
    notes: [],
    documents: [
      {
        id: "d1",
        name: "Stromrechnung_2025.pdf",
        kind: "rechnung",
        size: "284 KB",
        uploadedAt: "2026-06-14T09:22:00",
      },
    ],
    emails: [
      {
        id: "e1",
        subject: "Ihre Anfrage für Strom & Gas ist eingegangen",
        from: "noreply@energieclever.de",
        to: "m.hoffmann@example.de",
        date: "2026-06-14T09:21:30",
        direction: "out",
        preview: "Vielen Dank für Ihre Anfrage. Wir prüfen passende Tarife…",
      },
    ],
    offers: [],
    history: [],
  },
  {
    id: "B9R2TQK",
    name: "Anna Weber",
    email: "anna.weber@example.de",
    phone: "+49 160 9988776",
    city: "Düsseldorf",
    plz: "40213",
    type: "strom",
    consumption: 3400,
    currentProvider: "E.ON",
    monthlyPayment: 98,
    status: "in_pruefung",
    score: 72,
    assignee: "Sarah Becker",
    createdAt: "2026-06-14T08:05:00",
    expectedSavings: 312,
    source: "Direkt",
    hasInvoice: false,
    notes: [
      {
        id: "n1",
        author: "Sarah Becker",
        authorRole: "admin",
        date: "2026-06-14T10:00:00",
        text: "Erstkontakt erfolgreich, Rückruf für morgen 14:00 vereinbart.",
      },
    ],
    documents: [],
    emails: [
      {
        id: "e1",
        subject: "Ihre Anfrage ist eingegangen",
        from: "noreply@energieclever.de",
        to: "anna.weber@example.de",
        date: "2026-06-14T08:06:00",
        direction: "out",
        preview: "Vielen Dank, wir prüfen Ihre Daten…",
      },
    ],
    offers: [],
    history: [],
  },
  {
    id: "X4H7MPC",
    name: "Bäckerei Krüger GmbH",
    email: "info@baeckerei-krueger.de",
    phone: "+49 221 5544332",
    city: "Köln",
    plz: "50823",
    type: "gewerbe",
    consumption: 42000,
    currentProvider: "Vattenfall",
    monthlyPayment: 1240,
    status: "angebot_gesendet",
    score: 95,
    assignee: "Daniel Kraus",
    createdAt: "2026-06-13T15:42:00",
    expectedSavings: 4820,
    source: "Empfehlung",
    hasInvoice: true,
    notes: [
      {
        id: "n1",
        author: "Daniel Kraus",
        authorRole: "manager",
        date: "2026-06-13T16:30:00",
        text: "Hoher Verbrauch, sehr gute Ersparnis möglich. Angebot mit 24-Monate-Preisgarantie verschickt.",
      },
    ],
    documents: [
      {
        id: "d1",
        name: "Jahresrechnung_2025_Vattenfall.pdf",
        kind: "rechnung",
        size: "412 KB",
        uploadedAt: "2026-06-13T15:50:00",
      },
      {
        id: "d2",
        name: "Angebot_EnBW_Gewerbe.pdf",
        kind: "angebot",
        size: "198 KB",
        uploadedAt: "2026-06-13T18:12:00",
      },
    ],
    emails: [
      {
        id: "e1",
        subject: "Ihre Anfrage für Gewerbestrom",
        from: "noreply@energieclever.de",
        to: "info@baeckerei-krueger.de",
        date: "2026-06-13T15:43:00",
        direction: "out",
        preview: "Vielen Dank, wir prüfen sofort…",
      },
      {
        id: "e2",
        subject: "Ihr persönliches Gewerbestrom-Angebot",
        from: "daniel.kraus@energieclever.de",
        to: "info@baeckerei-krueger.de",
        date: "2026-06-13T18:15:00",
        direction: "out",
        preview: "Anbei finden Sie Ihr persönliches Angebot mit 24-Monate-Preisgarantie…",
      },
      {
        id: "e3",
        subject: "Re: Ihr persönliches Gewerbestrom-Angebot",
        from: "info@baeckerei-krueger.de",
        to: "daniel.kraus@energieclever.de",
        date: "2026-06-14T08:32:00",
        direction: "in",
        preview: "Vielen Dank, sieht sehr gut aus. Eine Frage zur Kündigungsfrist…",
      },
    ],
    offers: [
      {
        id: "o1",
        providerName: "EnBW",
        tariffName: "Gewerbestrom 24 Fix",
        monthlyPrice: 818,
        yearlyPrice: 9816,
        savings: 4824,
        sentAt: "2026-06-13T18:15:00",
        status: "gesendet",
      },
    ],
    history: [],
  },
  {
    id: "T8GZ3WR",
    name: "Sophia Lang",
    email: "sophia.l@example.de",
    phone: "+49 152 3344556",
    city: "Bonn",
    plz: "53111",
    type: "gas",
    consumption: 18000,
    currentProvider: "Stadtwerke Bonn",
    monthlyPayment: 175,
    status: "vertrag_gesendet",
    score: 81,
    assignee: "Mira Aydin",
    createdAt: "2026-06-12T11:18:00",
    expectedSavings: 540,
    source: "Meta Ads",
    hasInvoice: true,
    notes: [],
    documents: [
      {
        id: "d1",
        name: "Gasrechnung_2025.pdf",
        kind: "rechnung",
        size: "256 KB",
        uploadedAt: "2026-06-12T11:19:00",
      },
      {
        id: "d2",
        name: "Vertrag_Eprimo_Gas.pdf",
        kind: "vertrag",
        size: "324 KB",
        uploadedAt: "2026-06-14T09:00:00",
      },
    ],
    emails: [],
    offers: [
      {
        id: "o1",
        providerName: "eprimo",
        tariffName: "Gas Direkt 12",
        monthlyPrice: 130,
        yearlyPrice: 1560,
        savings: 540,
        sentAt: "2026-06-13T10:00:00",
        status: "angenommen",
      },
    ],
    history: [],
  },
  {
    id: "M2VK7BH",
    name: "Thomas Richter",
    email: "t.richter@example.de",
    phone: "+49 171 2233445",
    city: "Leverkusen",
    plz: "51373",
    type: "strom",
    consumption: 2200,
    currentProvider: "EnBW",
    monthlyPayment: 71,
    status: "abgeschlossen",
    score: 64,
    assignee: "Sarah Becker",
    createdAt: "2026-06-10T14:02:00",
    expectedSavings: 198,
    source: "SEO",
    hasInvoice: false,
    notes: [
      {
        id: "n1",
        author: "Sarah Becker",
        authorRole: "admin",
        date: "2026-06-11T09:15:00",
        text: "Vertrag unterschrieben, Wechseltermin 01.08.2026.",
      },
    ],
    documents: [],
    emails: [],
    offers: [
      {
        id: "o1",
        providerName: "Yello",
        tariffName: "Klassik Strom 12",
        monthlyPrice: 55,
        yearlyPrice: 660,
        savings: 192,
        status: "angenommen",
      },
    ],
    history: [],
  },
  {
    id: "R5DQ9LT",
    name: "Julia Maier",
    email: "j.maier@example.de",
    phone: "",
    city: "Aachen",
    plz: "52062",
    type: "strom",
    consumption: 1800,
    currentProvider: "Unbekannt",
    monthlyPayment: 0,
    status: "nicht_erreichbar",
    score: 22,
    assignee: "—",
    createdAt: "2026-06-09T17:31:00",
    expectedSavings: 0,
    source: "Google Ads",
    hasInvoice: false,
    notes: [
      {
        id: "n1",
        author: "Daniel Kraus",
        authorRole: "manager",
        date: "2026-06-10T08:00:00",
        text: "Keine Telefonnummer, E-Mail bounced.",
      },
    ],
    documents: [],
    emails: [],
    offers: [],
    history: [],
  },
  {
    id: "H3WX8FN",
    name: "Familie Schuster",
    email: "schuster@example.de",
    phone: "+49 178 2244668",
    city: "Essen",
    plz: "45127",
    type: "strom_gas",
    consumption: 7200,
    currentProvider: "innogy",
    monthlyPayment: 234,
    status: "wiedervorlage",
    score: 68,
    assignee: "Mira Aydin",
    createdAt: "2026-06-08T13:14:00",
    expectedSavings: 412,
    source: "Empfehlung",
    hasInvoice: true,
    notes: [
      {
        id: "n1",
        author: "Mira Aydin",
        authorRole: "mitarbeiter",
        date: "2026-06-09T10:00:00",
        text: "Möchte nach Urlaub am 28.06. erneut kontaktiert werden.",
      },
    ],
    documents: [
      {
        id: "d1",
        name: "Strom_Gas_Rechnung.pdf",
        kind: "rechnung",
        size: "302 KB",
        uploadedAt: "2026-06-08T13:20:00",
      },
    ],
    emails: [],
    offers: [],
    history: [
      {
        id: "h1",
        date: "2026-06-09T10:01:00",
        author: "Mira Aydin",
        type: "wiedervorlage",
        text: "Mira Aydin hat eine Wiedervorlage für den 28.06.2026 erstellt.",
      },
    ],
    wiedervorlage: {
      date: "2026-06-28T09:00:00",
      comment: "Nach Urlaub erneut kontaktieren",
      createdBy: "Mira Aydin",
      createdAt: "2026-06-09T10:01:00",
    },
  },
  {
    id: "N6PY5JC",
    name: "Lukas Vogel",
    email: "lukas.vogel@example.de",
    phone: "+49 162 7788990",
    city: "Dortmund",
    plz: "44135",
    type: "gas",
    consumption: 14500,
    currentProvider: "DEW21",
    monthlyPayment: 142,
    status: "interessiert",
    score: 79,
    assignee: "Daniel Kraus",
    createdAt: "2026-06-13T11:08:00",
    expectedSavings: 286,
    source: "Google Ads",
    hasInvoice: true,
    notes: [],
    documents: [
      {
        id: "d1",
        name: "Rechnung_DEW21.pdf",
        kind: "rechnung",
        size: "228 KB",
        uploadedAt: "2026-06-13T11:09:00",
      },
    ],
    emails: [],
    offers: [
      {
        id: "o1",
        providerName: "Vattenfall",
        tariffName: "EasyGas 24",
        monthlyPrice: 119,
        yearlyPrice: 1428,
        savings: 276,
        sentAt: "2026-06-14T08:00:00",
        status: "gesendet",
      },
    ],
    history: [],
  },
];

export interface Employee {
  id: string;
  name: string;
  role: Role;
  email: string;
  closed: number;
  open: number;
  conversion: number;
  active: boolean;
}

export const employees: Employee[] = [
  {
    id: "u1",
    name: "Sarah Becker",
    role: "admin",
    email: "sarah.becker@energieclever.de",
    closed: 18,
    open: 12,
    conversion: 41,
    active: true,
  },
  {
    id: "u2",
    name: "Daniel Kraus",
    role: "manager",
    email: "daniel.kraus@energieclever.de",
    closed: 14,
    open: 9,
    conversion: 38,
    active: true,
  },
  {
    id: "u3",
    name: "Mira Aydin",
    role: "mitarbeiter",
    email: "mira.aydin@energieclever.de",
    closed: 11,
    open: 7,
    conversion: 34,
    active: true,
  },
  {
    id: "u4",
    name: "Jonas Vetter",
    role: "mitarbeiter",
    email: "jonas.vetter@energieclever.de",
    closed: 6,
    open: 4,
    conversion: 28,
    active: true,
  },
  {
    id: "u5",
    name: "Lena Fuchs",
    role: "mitarbeiter",
    email: "lena.fuchs@energieclever.de",
    closed: 0,
    open: 0,
    conversion: 0,
    active: false,
  },
];

export const roleLabel: Record<Role, string> = {
  admin: "Admin",
  manager: "Manager",
  mitarbeiter: "Mitarbeiter",
};

export interface Provider {
  id: string;
  name: string;
  type: "strom" | "gas" | "beide";
  tariffsCount: number;
  rating: number;
  partner: boolean;
}
export const providers: Provider[] = [
  { id: "p1", name: "E.ON", type: "beide", tariffsCount: 24, rating: 4.2, partner: true },
  { id: "p2", name: "EnBW", type: "beide", tariffsCount: 18, rating: 4.4, partner: true },
  { id: "p3", name: "Vattenfall", type: "beide", tariffsCount: 21, rating: 4.0, partner: true },
  { id: "p4", name: "Yello", type: "strom", tariffsCount: 9, rating: 4.5, partner: true },
  { id: "p5", name: "eprimo", type: "beide", tariffsCount: 14, rating: 4.1, partner: true },
  { id: "p6", name: "LichtBlick", type: "strom", tariffsCount: 6, rating: 4.7, partner: true },
  { id: "p7", name: "Naturstrom", type: "beide", tariffsCount: 8, rating: 4.6, partner: true },
  { id: "p8", name: "RheinEnergie", type: "beide", tariffsCount: 11, rating: 3.9, partner: false },
  {
    id: "p9",
    name: "Stadtwerke München",
    type: "beide",
    tariffsCount: 7,
    rating: 4.3,
    partner: false,
  },
];

export interface Tariff {
  id: string;
  provider: string;
  name: string;
  type: "strom" | "gas";
  segment: "privat" | "gewerbe";
  pricePerKwh: number;
  basePrice: number;
  duration: number;
  priceGuarantee: number;
  eco: boolean;
}
export const tariffs: Tariff[] = [
  {
    id: "t1",
    provider: "E.ON",
    name: "PrivatStrom Plus",
    type: "strom",
    segment: "privat",
    pricePerKwh: 28.4,
    basePrice: 11.9,
    duration: 12,
    priceGuarantee: 12,
    eco: false,
  },
  {
    id: "t2",
    provider: "EnBW",
    name: "Gewerbestrom 24 Fix",
    type: "strom",
    segment: "gewerbe",
    pricePerKwh: 24.1,
    basePrice: 14.5,
    duration: 24,
    priceGuarantee: 24,
    eco: false,
  },
  {
    id: "t3",
    provider: "Yello",
    name: "Klassik Strom 12",
    type: "strom",
    segment: "privat",
    pricePerKwh: 27.8,
    basePrice: 10.5,
    duration: 12,
    priceGuarantee: 12,
    eco: false,
  },
  {
    id: "t4",
    provider: "LichtBlick",
    name: "ÖkoStrom Premium",
    type: "strom",
    segment: "privat",
    pricePerKwh: 30.2,
    basePrice: 12.9,
    duration: 12,
    priceGuarantee: 12,
    eco: true,
  },
  {
    id: "t5",
    provider: "Naturstrom",
    name: "Bio-Erdgas Komfort",
    type: "gas",
    segment: "privat",
    pricePerKwh: 11.4,
    basePrice: 9.9,
    duration: 24,
    priceGuarantee: 24,
    eco: true,
  },
  {
    id: "t6",
    provider: "Vattenfall",
    name: "EasyGas 24",
    type: "gas",
    segment: "privat",
    pricePerKwh: 9.8,
    basePrice: 8.9,
    duration: 24,
    priceGuarantee: 24,
    eco: false,
  },
  {
    id: "t7",
    provider: "eprimo",
    name: "Gas Direkt 12",
    type: "gas",
    segment: "privat",
    pricePerKwh: 9.1,
    basePrice: 8.0,
    duration: 12,
    priceGuarantee: 12,
    eco: false,
  },
  {
    id: "t8",
    provider: "EnBW",
    name: "Gewerbegas Fix 24",
    type: "gas",
    segment: "gewerbe",
    pricePerKwh: 8.6,
    basePrice: 12.5,
    duration: 24,
    priceGuarantee: 24,
    eco: false,
  },
];

export interface EmailTemplate {
  id: string;
  name: string;
  subject: string;
  trigger: string;
  lastEdited: string;
  active: boolean;
}
export const emailTemplates: EmailTemplate[] = [
  {
    id: "et1",
    name: "Anfrage-Bestätigung",
    subject: "Ihre Anfrage für Strom/Gas ist eingegangen",
    trigger: "Lead erstellt",
    lastEdited: "2026-05-12",
    active: true,
  },
  {
    id: "et2",
    name: "Rückfrage Jahresrechnung",
    subject: "Uns fehlt noch Ihre letzte Jahresrechnung",
    trigger: "Status: Rückfrage offen",
    lastEdited: "2026-04-28",
    active: true,
  },
  {
    id: "et3",
    name: "Angebot versendet",
    subject: "Ihr persönliches Strom-/Gasangebot ist da",
    trigger: "Status: Angebot gesendet",
    lastEdited: "2026-05-30",
    active: true,
  },
  {
    id: "et4",
    name: "Vertrag zur Unterschrift",
    subject: "Hier können Sie Ihr Angebot bestätigen",
    trigger: "Status: Vertrag gesendet",
    lastEdited: "2026-06-02",
    active: true,
  },
  {
    id: "et5",
    name: "Erinnerung Nicht erreichbar",
    subject: "Wir versuchen, Sie zu erreichen",
    trigger: "48 Std. ohne Reaktion",
    lastEdited: "2026-03-19",
    active: true,
  },
  {
    id: "et6",
    name: "Wiedervorlage",
    subject: "Wir melden uns wie vereinbart zurück",
    trigger: "Wiedervorlage-Datum erreicht",
    lastEdited: "2026-05-22",
    active: false,
  },
];

export function getLead(id: string) {
  return leads.find((l) => l.id === id);
}
