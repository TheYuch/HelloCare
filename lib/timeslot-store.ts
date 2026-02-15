import { EventEmitter } from "events";

export type Timeslot = { label: string; available: boolean };

const g = globalThis as unknown as {
  __tsEmitter?: EventEmitter;
  __tsData?: Timeslot[];
  __tsConfirmResolve?: ((label: string) => void) | null;
};
if (!g.__tsEmitter) g.__tsEmitter = new EventEmitter();
if (!g.__tsData) g.__tsData = [];

export const emitter = g.__tsEmitter;

export function setTimeslots(slots: Timeslot[]) {
  console.log(`[timeslot-store] setTimeslots called with ${slots.length} slot(s):`, JSON.stringify(slots));
  g.__tsData = slots;
  emitter.emit("update", slots);
  console.log(`[timeslot-store] Emitted "update" event. Listener count: ${emitter.listenerCount("update")}`);
}

export function getTimeslots(): Timeslot[] {
  const slots = g.__tsData ?? [];
  console.log(`[timeslot-store] getTimeslots → ${slots.length} slot(s)`);
  return slots;
}

/**
 * Returns a promise that resolves with the confirmed slot label
 * once `confirmTimeslot` is called, or rejects if `timeoutMs` elapses first.
 */
export function waitForConfirmation(timeoutMs: number): Promise<string> {
  console.log(`[timeslot-store] waitForConfirmation started (timeout: ${timeoutMs}ms)`);
  return new Promise<string>((resolve, reject) => {
    const timer = setTimeout(() => {
      console.error("[timeslot-store] ⏰ waitForConfirmation timed out");
      g.__tsConfirmResolve = null;
      reject(new Error("Confirmation timed out"));
    }, timeoutMs);

    g.__tsConfirmResolve = (label: string) => {
      console.log(`[timeslot-store] ✅ Confirmation received for: "${label}"`);
      clearTimeout(timer);
      resolve(label);
    };
    console.log("[timeslot-store] __tsConfirmResolve callback registered, waiting…");
  });
}

/**
 * Called by the frontend (via API) to confirm the selected timeslot.
 * Resolves the pending `waitForConfirmation` promise.
 */
export function confirmTimeslot(label: string) {
  console.log(`[timeslot-store] confirmTimeslot called for: "${label}". Resolver exists: ${!!g.__tsConfirmResolve}`);
  if (g.__tsConfirmResolve) {
    g.__tsConfirmResolve(label);
    g.__tsConfirmResolve = null;
  } else {
    console.warn("[timeslot-store] ⚠️ No pending confirmation resolver – confirmation ignored!");
  }
}
