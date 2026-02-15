/**
 * Helpers for health notes (sorting, etc.).
 */

import type { HealthNote } from "./types";

/**
 * Sort health notes by most recent first: by date (visit date) descending,
 * then by startedAt descending. This approximates "most recently created" when
 * creation time is not stored.
 */
export function sortHealthNotesByCreatedDesc(notes: HealthNote[]): HealthNote[] {
  return [...notes].sort((a, b) => {
    const byDate =
      new Date(b.date).getTime() - new Date(a.date).getTime();
    if (byDate !== 0) return byDate;
    return (
      new Date(b.startedAt).getTime() - new Date(a.startedAt).getTime()
    );
  });
}
