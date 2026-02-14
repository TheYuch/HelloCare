/**
 * Firestore module: types, paths, API, and hooks.
 * Import from "@/lib/firestore" or from specific files for tree-shaking.
 */

export { COLLECTIONS, USER_PATHS, userDocPath, userDocPathSegments } from "./collections";
export type { CollectionKey } from "./collections";
export type {
  ActionItem,
  FirestoreResult,
  HealthNote,
  MedicationMetadata,
  SessionMetadata,
  UserDataDoc,
} from "./types";
export { toFirestoreValue } from "./serialize";
export {
  readUserDataDoc,
  writeActionItem,
  writeHealthNote,
  writeSessionMetadata,
  writeUserDataDoc,
} from "./api";
export { useUserData } from "./hooks";
