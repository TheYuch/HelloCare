/**
 * Shared definitions for LLM-driven assistant tools.
 * Used by both the chat API route (tool schemas) and the client (tool dispatcher).
 *
 * Tool categories:
 * - navigate: Go to any app page with optional item highlighting
 * - update_action_item: Change status, priority, or type of an action item
 * - delete_action_item: Remove an action item
 * - delete_health_note: Remove a health note
 * - update_health_note_type: Change a health note's type classification
 * - delete_appointment: Remove an appointment
 * - delete_session: Remove a past session
 * - open_health_note_recorder: Open the voice health-note recording modal
 */

import { z } from "zod";

// ---------------------------------------------------------------------------
// Navigation
// ---------------------------------------------------------------------------

export const NAVIGATE_PAGES = [
  "home",
  "action_items",
  "health_notes",
  "appointments",
  "past_sessions",
  "schedule_appointment",
  "doctor_visit_conversation",
] as const;

export type NavigatePage = (typeof NAVIGATE_PAGES)[number];

/** Maps each navigate page to its client-side route. */
export const PAGE_ROUTES: Record<NavigatePage, string> = {
  home: "/",
  action_items: "/action-items",
  health_notes: "/health-notes",
  appointments: "/appointments",
  past_sessions: "/past-sessions",
  schedule_appointment: "/appointments/schedule",
  doctor_visit_conversation: "/appointments/conversation",
};

// ---------------------------------------------------------------------------
// Action item enums (must match lib/firestore/actionItems.ts)
// ---------------------------------------------------------------------------

export const ACTION_ITEM_STATUS_VALUES = [
  "pending",
  "in_progress",
  "done",
  "skipped",
] as const;

export const ACTION_ITEM_PRIORITY_VALUES = [
  "low",
  "medium",
  "high",
] as const;

export const ACTION_ITEM_TYPE_VALUES = [
  "Medication",
  "Exercise",
  "Appointment",
  "Other",
] as const;

// ---------------------------------------------------------------------------
// Health note enums (must match lib/firestore/healthNotes.ts)
// ---------------------------------------------------------------------------

export const HEALTH_NOTE_TYPE_VALUES = [
  "Injury",
  "Recurring pain",
  "Temporary pain",
] as const;

// ---------------------------------------------------------------------------
// Zod schemas for each tool's input (used by the API route)
// ---------------------------------------------------------------------------

export const navigateSchema = z.object({
  page: z.enum(NAVIGATE_PAGES),
  highlightId: z
    .string()
    .optional()
    .describe("Optional item ID to scroll to / highlight on the destination page"),
});

export const updateActionItemSchema = z.object({
  id: z.string().describe("The action item ID to update"),
  status: z.enum(ACTION_ITEM_STATUS_VALUES).optional().describe("New status"),
  priority: z.enum(ACTION_ITEM_PRIORITY_VALUES).optional().describe("New priority"),
  type: z.enum(ACTION_ITEM_TYPE_VALUES).optional().describe("New type"),
});

export const deleteActionItemSchema = z.object({
  id: z.string().describe("The action item ID to delete"),
});

export const deleteHealthNoteSchema = z.object({
  id: z.string().describe("The health note ID to delete"),
});

export const updateHealthNoteTypeSchema = z.object({
  id: z.string().describe("The health note ID to update"),
  type: z.enum(HEALTH_NOTE_TYPE_VALUES).describe("New type classification"),
});

export const deleteAppointmentSchema = z.object({
  id: z.string().describe("The appointment ID to delete"),
});

export const deleteSessionSchema = z.object({
  id: z.string().describe("The past session ID to delete"),
});

// open_health_note_recorder has no parameters

// ---------------------------------------------------------------------------
// Create schemas
// ---------------------------------------------------------------------------

export const createActionItemSchema = z.object({
  title: z.string().describe("Short title for the action item"),
  description: z.string().optional().describe("Longer description of what to do"),
  type: z.enum(ACTION_ITEM_TYPE_VALUES).optional().describe("Category (defaults to Other)"),
  priority: z.enum(ACTION_ITEM_PRIORITY_VALUES).optional().describe("Priority level (defaults to medium)"),
  dueBy: z.string().optional().describe("ISO 8601 date string for the due date (defaults to 7 days from now)"),
});

export const createHealthNoteSchema = z.object({
  title: z.string().describe("Short title for the health note"),
  description: z.string().describe("Description of the health note"),
  type: z.enum(HEALTH_NOTE_TYPE_VALUES).optional().describe("Classification (defaults to Temporary pain)"),
});

export const createAppointmentSchema = z.object({
  appointmentTime: z.string().describe("ISO 8601 date-time string for the appointment"),
});

export const createSessionSchema = z.object({
  title: z.string().describe("Short title for the past session / visit"),
  summary: z.string().optional().describe("Summary of what happened during the visit"),
  date: z.string().optional().describe("ISO 8601 date string for when the visit occurred (defaults to now)"),
});

// ---------------------------------------------------------------------------
// Discriminated union of all tool-call inputs (used by the client dispatcher)
// ---------------------------------------------------------------------------

export type NavigateInput = z.infer<typeof navigateSchema>;
export type UpdateActionItemInput = z.infer<typeof updateActionItemSchema>;
export type DeleteActionItemInput = z.infer<typeof deleteActionItemSchema>;
export type DeleteHealthNoteInput = z.infer<typeof deleteHealthNoteSchema>;
export type UpdateHealthNoteTypeInput = z.infer<typeof updateHealthNoteTypeSchema>;
export type DeleteAppointmentInput = z.infer<typeof deleteAppointmentSchema>;
export type DeleteSessionInput = z.infer<typeof deleteSessionSchema>;
export type CreateActionItemInput = z.infer<typeof createActionItemSchema>;
export type CreateHealthNoteInput = z.infer<typeof createHealthNoteSchema>;
export type CreateAppointmentInput = z.infer<typeof createAppointmentSchema>;
export type CreateSessionInput = z.infer<typeof createSessionSchema>;
