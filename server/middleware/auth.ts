import { getServerSession } from '#auth';

export default defineEventHandler(async (event) => {
  const session = await getServerSession(event);

  const protectedRoutes: string[] = ['/profile', '/favorites', '/my-clubs', '/admin'];

  const url: string = event.node.req.url || '';
  const urlSegments: string[] = url.split('/').filter(Boolean);

  const isProtectedRoute: boolean = protectedRoutes.some((route: string) =>
    urlSegments.some((segment) => route === `/${segment}`),
  );

  if (isProtectedRoute && !session) {
    event.node.res.writeHead(302, { Location: '/' });
    event.node.res.end();
    return;
  }

  const isAdminRoute: boolean = urlSegments.includes('admin');
  if (isAdminRoute && session?.user?.role !== 'ADMIN') {
    event.node.res.writeHead(302, { Location: '/' });
    event.node.res.end();
    return;
  }
});
