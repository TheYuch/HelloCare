import { emitter, getTimeslots, type Timeslot } from "@/lib/timeslot-store";

export async function GET(request: Request) {
  const encoder = new TextEncoder();

  const stream = new ReadableStream({
    start(controller) {
      const send = (data: Timeslot[]) =>
        controller.enqueue(encoder.encode(`data: ${JSON.stringify(data)}\n\n`));

      const existing = getTimeslots();
      if (existing.length) send(existing);

      const onUpdate = (slots: Timeslot[]) => {
        try { send(slots); } catch { emitter.off("update", onUpdate); }
      };
      emitter.on("update", onUpdate);

      request.signal.addEventListener("abort", () => {
        emitter.off("update", onUpdate);
        try { controller.close(); } catch {}
      });
    },
  });

  return new Response(stream, {
    headers: { "Content-Type": "text/event-stream", "Cache-Control": "no-cache", Connection: "keep-alive" },
  });
}
