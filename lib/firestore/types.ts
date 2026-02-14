/**
 * Firestore document types and API result types.
 * All field names are lowerCamelCase. Enum-like fields use string for now.
 */

/** Generic Firestore API result for single-doc read/write. */
export type FirestoreResult<T, E = Error> =
  | { ok: true; data: T }
  | { ok: false; error: E };

/** User-scoped data document at users/{uid}/data/userData. One mutable doc per user (e.g. note or preferences). */
export type UserDataDoc = {
  message: string;
  updatedAt: string;
};

/** Health note document. type: e.g. "Injury" | "Recurring pain" | "Temporary pain". */
export type HealthNote = {
  id: string;
  userId: string;
  date: Date;
  startedAt: Date;
  endedAt: Date;
  type: string;
  title: string;
  description: string;
};

/** Nested metadata for medication action items. */
export type MedicationMetadata = {
  name: string;
  dose: number;
  dosageUnit: string;
  count: number;
  route: string;
};

/** Action item document. type, status, priority, recurrence are strings. */
export type ActionItem = {
  id: string;
  userId: string;
  dueBy: Date;
  type: string;
  title: string;
  description: string;
  status: string;
  priority: string;
  recurrence: string;
  medication?: MedicationMetadata;
};

/** Session document. documentIds: optional list of stored document references. */
export type SessionMetadata = {
  id: string;
  userId: string;
  date: Date;
  title: string;
  summary: string;
  actionItems: ActionItem[];
  documentIds: string[];
};
