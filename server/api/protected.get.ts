import { getServerSession } from '#auth';
import type { Session } from 'next-auth';

export default eventHandler(async (event) => {
  const session = await getServerSession(event);
  if (!session) {
    return null;
  }
  return {
    accessToken: session.accessToken,
    refreshToken: session.refreshToken,
    accessTokenExpires: session.accessTokenExpires,
    user: session.user,
    expires: session.expires,
  } as Session;
});
