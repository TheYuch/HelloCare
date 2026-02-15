import { EventEmitter } from "events";

export type Timeslot = { label: string; available: boolean };

const g = globalThis as unknown as { __tsEmitter?: EventEmitter; __tsData?: Timeslot[] };
if (!g.__tsEmitter) g.__tsEmitter = new EventEmitter();
if (!g.__tsData) g.__tsData = [];

export const emitter = g.__tsEmitter;

export function setTimeslots(slots: Timeslot[]) {
  g.__tsData = slots;
  emitter.emit("update", slots);
}

export function getTimeslots(): Timeslot[] {
  return g.__tsData ?? [];
}
