import type { BackendLead, BackendLeadStatus } from "./api-types";

export const OPEN_TASK_STATUSES = [
  "follow_up",
  "question_open",
  "new",
] as const satisfies readonly BackendLeadStatus[];

type LeadTaskSource = Pick<BackendLead, "id" | "status" | "created_at" | "wiedervorlage_at">;

const TASK_PRIORITY: Record<(typeof OPEN_TASK_STATUSES)[number], number> = {
  follow_up: 1,
  question_open: 2,
  new: 3,
};

export function isOpenLeadTask(
  lead: Pick<LeadTaskSource, "status" | "wiedervorlage_at">,
  now: Date = new Date(),
): boolean {
  if (!OPEN_TASK_STATUSES.includes(lead.status as (typeof OPEN_TASK_STATUSES)[number])) {
    return false;
  }

  if (lead.status !== "follow_up") return true;
  if (!lead.wiedervorlage_at) return true;
  return new Date(lead.wiedervorlage_at).getTime() <= now.getTime();
}

export function getOpenLeadTasks<T extends LeadTaskSource>(
  leads: T[],
  now: Date = new Date(),
): T[] {
  return leads
    .filter((lead) => isOpenLeadTask(lead, now))
    .sort((a, b) => {
      const priorityDiff =
        TASK_PRIORITY[a.status as (typeof OPEN_TASK_STATUSES)[number]] -
        TASK_PRIORITY[b.status as (typeof OPEN_TASK_STATUSES)[number]];
      if (priorityDiff !== 0) return priorityDiff;

      const aDue = a.wiedervorlage_at ?? a.created_at;
      const bDue = b.wiedervorlage_at ?? b.created_at;
      return new Date(aDue).getTime() - new Date(bDue).getTime();
    });
}

export function getNextOpenLead<T extends LeadTaskSource>(
  leads: T[],
  currentLeadId?: string,
  now: Date = new Date(),
): T | undefined {
  return getOpenLeadTasks(leads, now).find((lead) => lead.id !== currentLeadId);
}
