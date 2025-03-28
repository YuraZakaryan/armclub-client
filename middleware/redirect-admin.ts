export default defineNuxtRouteMiddleware(async (to) => {
  const localePath = useLocalePath();

  if (to.path === '/admin') {
    return navigateTo(localePath('/admin/properties'));
  }
});
