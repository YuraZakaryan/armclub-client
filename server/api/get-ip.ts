import type { H3Event } from 'h3';

export default defineEventHandler((event: H3Event) => {
  const ip = getRequestHeader(event, 'x-forwarded-for') || event.node.req.socket.remoteAddress || '127.0.0.1';
  return { ip };
});
