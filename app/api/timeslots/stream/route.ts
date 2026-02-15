import { emitter, getTimeslots, type Timeslot } from "@/lib/timeslot-store";

export async function GET(request: Request) {
  console.log("[timeslots/stream] ▶ SSE connection opened");
  const encoder = new TextEncoder();

  const stream = new ReadableStream({
    start(controller) {
      const send = (data: Timeslot[]) => {
        console.log(`[timeslots/stream] Sending ${data.length} slot(s) to client`);
        controller.enqueue(encoder.encode(`data: ${JSON.stringify(data)}\n\n`));
      };

      const existing = getTimeslots();
      if (existing.length) {
        console.log(`[timeslots/stream] Flushing ${existing.length} existing slot(s)`);
        send(existing);
      } else {
        console.log("[timeslots/stream] No existing slots, waiting for update…");
      }

      const onUpdate = (slots: Timeslot[]) => {
        console.log(`[timeslots/stream] "update" event received with ${slots.length} slot(s)`);
        try { send(slots); } catch (err) {
          console.error("[timeslots/stream] Error sending update, removing listener:", err);
          emitter.off("update", onUpdate);
        }
      };
      emitter.on("update", onUpdate);
      console.log(`[timeslots/stream] Listener registered. Total listeners: ${emitter.listenerCount("update")}`);

      request.signal.addEventListener("abort", () => {
        console.log("[timeslots/stream] Client disconnected (abort signal)");
        emitter.off("update", onUpdate);
        try { controller.close(); } catch {}
      });
    },
  });

  return new Response(stream, {
    headers: { "Content-Type": "text/event-stream", "Cache-Control": "no-cache", Connection: "keep-alive" },
  });
}
