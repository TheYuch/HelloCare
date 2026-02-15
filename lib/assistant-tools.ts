/**
 * Shared AI SDK tool definitions for the LLM assistant.
 * Used by both the chat route (streaming) and voice-command route (one-shot).
 */

import { tool } from "ai";
import { z } from "zod";
import {
  navigateSchema,
  updateActionItemSchema,
  deleteActionItemSchema,
  deleteHealthNoteSchema,
  updateHealthNoteTypeSchema,
  deleteAppointmentSchema,
  deleteSessionSchema,
  createActionItemSchema,
  createHealthNoteSchema,
  createAppointmentSchema,
  createSessionSchema,
} from "@/lib/chat-actions";

/**
 * Returns the full set of assistant tools with server-side execute functions.
 * The execute functions return acknowledgment strings; actual side-effects
 * (navigation, Firestore mutations) happen client-side via useToolExecutor.
 */
export function createAssistantTools() {
  return {
    navigate: tool({
      description:
        "Navigate to an app page. Optionally highlight a specific item by ID.",
      inputSchema: navigateSchema,
      execute: async ({ page }) => `Navigated to ${page}.`,
    }),
    update_action_item: tool({
      description:
        "Update an action item's status, priority, and/or type.",
      inputSchema: updateActionItemSchema,
      execute: async ({ id, ...fields }) =>
        `Updated action item ${id}: ${Object.entries(fields).map(([k, v]) => `${k}=${v}`).join(", ")}.`,
    }),
    delete_action_item: tool({
      description: "Permanently delete an action item.",
      inputSchema: deleteActionItemSchema,
      execute: async ({ id }) => `Deleted action item ${id}.`,
    }),
    delete_health_note: tool({
      description: "Permanently delete a health note.",
      inputSchema: deleteHealthNoteSchema,
      execute: async ({ id }) => `Deleted health note ${id}.`,
    }),
    update_health_note_type: tool({
      description: "Change a health note's type classification.",
      inputSchema: updateHealthNoteTypeSchema,
      execute: async ({ id, type }) =>
        `Updated health note ${id} type to ${type}.`,
    }),
    delete_appointment: tool({
      description: "Permanently delete an appointment.",
      inputSchema: deleteAppointmentSchema,
      execute: async ({ id }) => `Deleted appointment ${id}.`,
    }),
    delete_session: tool({
      description: "Permanently delete a past session.",
      inputSchema: deleteSessionSchema,
      execute: async ({ id }) => `Deleted session ${id}.`,
    }),
    open_health_note_recorder: tool({
      description:
        "Open the voice health-note recording modal so the user can dictate a new health note.",
      inputSchema: z.object({}),
      execute: async () => "Opened health note recorder.",
    }),
    create_action_item: tool({
      description:
        "Create a new action item (task, reminder, medication, exercise, etc.).",
      inputSchema: createActionItemSchema,
      execute: async ({ title }) => `Created action item: ${title}.`,
    }),
    create_health_note: tool({
      description:
        "Create a new health note to record a symptom, injury, or health observation.",
      inputSchema: createHealthNoteSchema,
      execute: async ({ title }) => `Created health note: ${title}.`,
    }),
    create_appointment: tool({
      description:
        "Create a new upcoming appointment.",
      inputSchema: createAppointmentSchema,
      execute: async ({ appointmentTime }) => `Created appointment for ${appointmentTime}.`,
    }),
    create_session: tool({
      description:
        "Create a new past session / visit record.",
      inputSchema: createSessionSchema,
      execute: async ({ title }) => `Created past session: ${title}.`,
    }),
  };
}
