// Aufgaben-Engine für das Mitarbeiter-CRM – arbeitet ausschließlich auf Basis der
// vorhandenen Mock-Leads (src/lib/mock-leads.ts). Es gibt KEINE eigene "tasks"-Tabelle:
// Aufgaben werden bei jedem Aufruf live aus den Leads abgeleitet.
//
// TODO Supabase-Migration:
// - Wiedervorlage-Aufgaben entsprechen `leads.wiedervorlage_at` (Spalte) – "erledigt" = NULL setzen.
// - Status-Aufgaben (Rückfrage/Neu/Sonstiges) entsprechen `leads.status`. "Aufgabe abgeschlossen"
//   sollte dann vermutlich als eigene Spalte/Tabelle `task_completed_at` abgebildet werden,
//   damit der CRM-Status des Leads davon unabhängig bleibt (siehe completedTaskIds unten).

import { leads, statusLabel, type Lead, type LeadStatus } from "./mock-leads";

export type TaskType = "wiedervorlage" | "rueckfrage" | "neu" | "sonstiges";

export interface Task {
  id: string;
  leadId: string;
  leadName: string;
  type: TaskType;
  title: string;
  description?: string;
  /** ISO-Datum/Zeit, ab wann die Aufgabe fällig ist. */
  dueAt: string;
  /** 1 = höchste Priorität (fällige Wiedervorlage) ... 4 = sonstige offene Vorgänge. */
  priority: 1 | 2 | 3 | 4;
  assignee: string;
}

export const TASK_TYPE_LABEL: Record<TaskType, string> = {
  wiedervorlage: "Wiedervorlage",
  rueckfrage: "Rückfrage",
  neu: "Neuer Lead",
  sonstiges: "Offener Vorgang",
};

/** Default-Uhrzeit für Wiedervorlagen ohne explizite Zeitangabe (Anforderung 7). */
export const DEFAULT_WIEDERVORLAGE_TIME = "07:30";

/** Status, die als "sonstige offene Vorgänge" (Priorität 4) gelten. */
const OTHER_OPEN_STATUSES: LeadStatus[] = [
  "in_pruefung",
  "angebot_erstellt",
  "angebot_gesendet",
  "interessiert",
  "vertrag_vorbereitet",
  "vertrag_gesendet",
  "nicht_erreichbar",
];

// Status-Aufgaben (Rückfrage/Neu/Sonstiges) haben keine eigene "erledigt"-Spalte im Lead.
// Bis zur Supabase-Migration merken wir uns erledigte Aufgaben hier im Speicher (pro Session).
const completedTaskIds = new Set<string>();

export function isTaskDone(id: string): boolean {
  return completedTaskIds.has(id);
}

function markTaskDone(id: string): void {
  completedTaskIds.add(id);
}

function statusTaskApplies(status: LeadStatus): boolean {
  return status === "rueckfrage" || status === "neu" || OTHER_OPEN_STATUSES.includes(status);
}

function statusTask(lead: Lead): Task | null {
  const id = `status-${lead.id}`;
  if (isTaskDone(id)) return null;

  // Abgeschlossene und abgelehnte Leads erzeugen keine Status-Aufgabe.
  // Wiedervorlage-Ausnahme wird separat über wiedervorlageTask() behandelt.
  if (lead.status === "abgeschlossen" || lead.status === "abgelehnt") return null;

  if (lead.status === "rueckfrage") {
    return {
      id,
      leadId: lead.id,
      leadName: lead.name,
      type: "rueckfrage",
      title: `Rückfrage: ${lead.name}`,
      dueAt: lead.createdAt,
      priority: 2,
      assignee: lead.assignee,
    };
  }
  if (lead.status === "neu") {
    return {
      id,
      leadId: lead.id,
      leadName: lead.name,
      type: "neu",
      title: `Neuer Lead: ${lead.name}`,
      dueAt: lead.createdAt,
      priority: 3,
      assignee: lead.assignee,
    };
  }
  if (OTHER_OPEN_STATUSES.includes(lead.status)) {
    return {
      id,
      leadId: lead.id,
      leadName: lead.name,
      type: "sonstiges",
      title: `${statusLabel[lead.status]}: ${lead.name}`,
      dueAt: lead.createdAt,
      priority: 4,
      assignee: lead.assignee,
    };
  }
  return null;
}

function wiedervorlageTask(lead: Lead): Task | null {
  if (!lead.wiedervorlage) return null;
  return {
    id: `wv-${lead.id}`,
    leadId: lead.id,
    leadName: lead.name,
    type: "wiedervorlage",
    title: `Wiedervorlage: ${lead.name}`,
    description: lead.wiedervorlage.comment,
    dueAt: lead.wiedervorlage.date,
    priority: 1,
    assignee: lead.assignee,
  };
}

/** Ob für diesen Lead aktuell irgendeine offene Aufgabe existiert (unabhängig vom Fälligkeitsdatum). */
export function leadHasOpenTask(lead: Lead): boolean {
  return wiedervorlageTask(lead) !== null || statusTask(lead) !== null;
}

/** Alle offenen Aufgaben über alle Leads – live berechnet, kein Caching. */
export function getOpenTasks(): Task[] {
  const tasks: Task[] = [];
  for (const lead of leads) {
    const wv = wiedervorlageTask(lead);
    if (wv) tasks.push(wv);
    const st = statusTask(lead);
    if (st) tasks.push(st);
  }
  return tasks;
}

/** Aufgaben, die jetzt (oder früher) fällig sind – Basis für "Offene Aufgaben heute". */
export function getDueTasks(now: Date = new Date()): Task[] {
  return getOpenTasks()
    .filter((t) => new Date(t.dueAt) <= now)
    .sort(
      (a, b) =>
        a.priority - b.priority || new Date(a.dueAt).getTime() - new Date(b.dueAt).getTime(),
    );
}

/** Höchste Priorität, älteste fällige Aufgabe – für den "Nächste Aufgabe öffnen"-Button. */
export function getNextTask(now: Date = new Date()): Task | undefined {
  return getDueTasks(now)[0];
}

/**
 * Markiert alle offenen Aufgaben eines Leads als erledigt:
 * - Wiedervorlage wird entfernt (lead.wiedervorlage = undefined)
 * - eine ggf. vorhandene Status-Aufgabe (Rückfrage/Neu/Sonstiges) wird als erledigt vermerkt,
 *   ohne den eigentlichen CRM-Status des Leads zu verändern.
 * Gibt zurück, ob überhaupt etwas zu erledigen war.
 */
export function completeTasksForLead(lead: Lead): boolean {
  let changed = false;

  if (lead.wiedervorlage) {
    lead.wiedervorlage = undefined;
    changed = true;
  }

  const statusId = `status-${lead.id}`;
  if (!isTaskDone(statusId) && statusTaskApplies(lead.status)) {
    markTaskDone(statusId);
    changed = true;
  }

  return changed;
}
