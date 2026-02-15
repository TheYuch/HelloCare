/**
 * Helpers for action items (sorting, etc.).
 */

/** Canonical status definitions for action items. Single source of truth. */
export const ACTION_ITEM_STATUSES = [
  { value: "pending", label: "Pending" },
  { value: "in_progress", label: "In progress" },
  { value: "done", label: "Done" },
] as const;

export type ActionItemStatus = (typeof ACTION_ITEM_STATUSES)[number]["value"];

const PRIORITY_ORDER: Record<string, number> = {
  high: 0,
  medium: 1,
  low: 2,
};

function priorityRank(p: string): number {
  const key = (p || "").toLowerCase();
  return key in PRIORITY_ORDER ? PRIORITY_ORDER[key] : 3;
}

function dueByTime(d: Date | string | null): number {
  if (d == null) return Infinity;
  return new Date(d).getTime();
}

/**
 * Sort action items by priority (high → medium → low) then by due date (soonest first).
 * Items with no due date appear last within each priority.
 */
export function sortActionItemsByPriorityAndDueDate<
  T extends { priority: string; dueBy: Date | string | null }
>(items: T[]): T[] {
  return [...items].sort((a, b) => {
    const byPriority = priorityRank(a.priority) - priorityRank(b.priority);
    if (byPriority !== 0) return byPriority;
    return dueByTime(a.dueBy) - dueByTime(b.dueBy);
  });
}
