import type { RequestHandler } from '@sveltejs/kit';
import { eventBus } from '$lib/server/events';

export const GET: RequestHandler = async () => {
  let closed = false;
  let iv: ReturnType<typeof setInterval> | undefined;
  let onImages: (() => void) | undefined;

  const stream = new ReadableStream({
    start(controller) {
      const encoder = new TextEncoder();
      const send = (data: string) => {
        if (closed) return;
        try {
          controller.enqueue(encoder.encode(`data: ${data}\n\n`));
        } catch {
          // controller already closed; ignore
        }
      };
      onImages = () => send('images');
      eventBus.on('images', onImages);
      // heartbeat to keep connection alive
      iv = setInterval(() => send('ping'), 25000);
    },
    cancel() {
      closed = true;
      if (iv) clearInterval(iv);
      if (onImages) eventBus.off('images', onImages);
    }
  });

  return new Response(stream, {
    headers: {
      'content-type': 'text/event-stream',
      'cache-control': 'no-cache',
      connection: 'keep-alive'
    }
  });
};


