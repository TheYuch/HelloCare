"use client";

import { useCallback } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/lib/auth-context";
import { db } from "@/lib/firebase";
import {
  useUserData,
  writeActionItem,
  deleteActionItem,
  deleteHealthNote,
  writeHealthNote,
  writeAppointment,
  deleteAppointment,
  writeSessionMetadata,
  deleteSessionMetadata,
} from "@/lib/firestore";
import {
  PAGE_ROUTES,
  type NavigateInput,
  type UpdateActionItemInput,
  type DeleteActionItemInput,
  type DeleteHealthNoteInput,
  type UpdateHealthNoteTypeInput,
  type DeleteAppointmentInput,
  type DeleteSessionInput,
  type CreateActionItemInput,
  type CreateHealthNoteInput,
  type CreateAppointmentInput,
  type CreateSessionInput,
} from "@/lib/chat-actions";

interface UseToolExecutorOptions {
  onOpenHealthNoteRecorder?: () => void;
}

export function useToolExecutor(options?: UseToolExecutorOptions) {
  const { user } = useAuth();
  const userData = useUserData();
  const router = useRouter();
  const uid = user?.uid ?? null;

  const executeToolCall = useCallback(
    async (toolName: string, input: unknown) => {
      if (!uid) return;

      switch (toolName) {
        case "navigate": {
          const { page, highlightId } = input as NavigateInput;
          const route = PAGE_ROUTES[page];
          if (route) {
            const url = highlightId ? `${route}?highlight=${highlightId}` : route;
            router.push(url);
          }
          break;
        }

        case "update_action_item": {
          const { id, ...fields } = input as UpdateActionItemInput;
          const item = userData.actionItems.find((a) => a.id === id);
          if (item) {
            await writeActionItem(db, uid, { ...item, ...fields });
          }
          break;
        }

        case "delete_action_item": {
          const { id } = input as DeleteActionItemInput;
          await deleteActionItem(db, uid, id);
          break;
        }

        case "delete_health_note": {
          const { id } = input as DeleteHealthNoteInput;
          await deleteHealthNote(db, uid, id);
          break;
        }

        case "update_health_note_type": {
          const { id, type } = input as UpdateHealthNoteTypeInput;
          const note = userData.healthNotes.find((n) => n.id === id);
          if (note) {
            await writeHealthNote(db, uid, { ...note, type });
          }
          break;
        }

        case "delete_appointment": {
          const { id } = input as DeleteAppointmentInput;
          await deleteAppointment(db, uid, id);
          break;
        }

        case "delete_session": {
          const { id } = input as DeleteSessionInput;
          await deleteSessionMetadata(db, uid, id);
          break;
        }

        case "open_health_note_recorder": {
          options?.onOpenHealthNoteRecorder?.();
          break;
        }

        case "create_action_item": {
          const { title, description, type, priority, dueBy } = input as CreateActionItemInput;
          const id = crypto.randomUUID();
          await writeActionItem(db, uid, {
            id,
            title,
            description: description ?? title,
            type: type ?? "Other",
            priority: priority ?? "medium",
            status: "pending",
            recurrence: "none",
            dueBy: dueBy ? new Date(dueBy) : new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
          });
          break;
        }

        case "create_health_note": {
          const { title, description, type } = input as CreateHealthNoteInput;
          const id = crypto.randomUUID();
          const now = new Date();
          await writeHealthNote(db, uid, {
            id,
            title,
            description,
            type: type ?? "Temporary pain",
            date: now,
            startedAt: now,
            endedAt: now,
          });
          break;
        }

        case "create_appointment": {
          const { appointmentTime } = input as CreateAppointmentInput;
          const id = crypto.randomUUID();
          await writeAppointment(db, uid, {
            id,
            appointmentTime: new Date(appointmentTime),
            scheduledOn: new Date(),
          });
          break;
        }

        case "create_session": {
          const { title, summary, date } = input as CreateSessionInput;
          const id = crypto.randomUUID();
          await writeSessionMetadata(db, uid, {
            id,
            title,
            summary: summary ?? "",
            date: date ? new Date(date) : new Date(),
            actionItemIds: [],
            documentIds: [],
          });
          break;
        }
      }
    },
    [uid, userData.actionItems, userData.healthNotes, router, options?.onOpenHealthNoteRecorder],
  );

  return { executeToolCall };
}
