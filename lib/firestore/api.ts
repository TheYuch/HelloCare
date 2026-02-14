/**
 * Firestore API layer: pure read/write commands.
 * All functions require userId so they work with auth and are testable.
 * Use these from hooks or from server/API routes (with a verified token).
 */

import {
  doc,
  getDoc,
  setDoc,
  type Firestore,
  type DocumentReference,
  type DocumentSnapshot,
} from "firebase/firestore";
import { COLLECTIONS, userDocPathSegments, USER_PATHS } from "./collections";
import type { CollectionKey } from "./collections";
import { toFirestoreValue } from "./serialize";
import type { ActionItem, HealthNote, SessionMetadata, UserDataDoc } from "./types";
import type { FirestoreResult } from "./types";

function getUserDataDocRef(db: Firestore, uid: string): DocumentReference {
  return doc(db, ...userDocPathSegments(uid, USER_PATHS.userData));
}

/**
 * Returns a document reference for a top-level collection by id.
 * Reusable for any collection that uses document id as the key.
 */
function getCollectionDocRef(
  db: Firestore,
  collectionName: (typeof COLLECTIONS)[CollectionKey],
  docId: string
): DocumentReference {
  return doc(db, collectionName, docId);
}

function snapshotToUserData(snap: DocumentSnapshot): UserDataDoc | null {
  const data = snap.data();
  if (!data || typeof data.message !== "string" || typeof data.updatedAt !== "string") {
    return null;
  }
  return { message: data.message, updatedAt: data.updatedAt };
}

/**
 * Reads the user's data document (users/{uid}/data/userData). Returns null if missing or invalid.
 */
export async function readUserDataDoc(
  db: Firestore,
  uid: string
): Promise<FirestoreResult<UserDataDoc | null>> {
  try {
    const ref = getUserDataDocRef(db, uid);
    const snap = await getDoc(ref);
    const data = snapshotToUserData(snap);
    return { ok: true, data };
  } catch (err) {
    return { ok: false, error: err instanceof Error ? err : new Error(String(err)) };
  }
}

/**
 * Writes the user's data document. Creates or overwrites.
 */
export async function writeUserDataDoc(
  db: Firestore,
  uid: string,
  payload: { message: string }
): Promise<FirestoreResult<UserDataDoc>> {
  try {
    const ref = getUserDataDocRef(db, uid);
    const now = new Date().toISOString();
    const docData: UserDataDoc = { message: payload.message, updatedAt: now };
    await setDoc(ref, docData);
    return { ok: true, data: docData };
  } catch (err) {
    return { ok: false, error: err instanceof Error ? err : new Error(String(err)) };
  }
}

/**
 * Writes a document to a top-level collection by id. Serializes Date to Timestamp.
 * Reusable for any collection type; use the typed write functions for specific types.
 */
async function writeCollectionDoc<T extends { id: string }>(
  db: Firestore,
  collectionName: (typeof COLLECTIONS)[CollectionKey],
  data: T
): Promise<FirestoreResult<T>> {
  try {
    const ref = getCollectionDocRef(db, collectionName, data.id);
    const serialized = toFirestoreValue(data) as Record<string, unknown>;
    await setDoc(ref, serialized);
    return { ok: true, data };
  } catch (err) {
    return { ok: false, error: err instanceof Error ? err : new Error(String(err)) };
  }
}

/**
 * Writes a health note to Firestore. Uses healthNotes collection and document id.
 */
export async function writeHealthNote(
  db: Firestore,
  data: HealthNote
): Promise<FirestoreResult<HealthNote>> {
  return writeCollectionDoc(db, COLLECTIONS.healthNotes, data);
}

/**
 * Writes an action item to Firestore. Uses actionItems collection and document id.
 */
export async function writeActionItem(
  db: Firestore,
  data: ActionItem
): Promise<FirestoreResult<ActionItem>> {
  return writeCollectionDoc(db, COLLECTIONS.actionItems, data);
}

/**
 * Writes a session metadata document to Firestore. Uses sessionMetadata collection and document id.
 */
export async function writeSessionMetadata(
  db: Firestore,
  data: SessionMetadata
): Promise<FirestoreResult<SessionMetadata>> {
  return writeCollectionDoc(db, COLLECTIONS.sessionMetadata, data);
}
