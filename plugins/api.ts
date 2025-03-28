import type { JWT } from 'next-auth/jwt';

export default defineNuxtPlugin(() => {
  const config = useRuntimeConfig();
  const sessionStore = useSessionStore();
  const { refresh } = useAuth();
  const toast = useToast();

  const { localSession } = storeToRefs(sessionStore);

  const api = $fetch.create({
    baseURL: config.public.NUXT_API_BASE_URL + '/api' || 'http://localhost:3000/api',
    onRequest({ options }) {
      const headers = new Headers(options.headers || {});
      if (localSession.value?.accessToken) {
        headers.set('Authorization', `Bearer ${localSession.value.accessToken}`);
      }
      options.headers = headers;
    },
    async onResponseError({ response, request, options }) {
      if (response.status !== 401) {
        console.error(`Ошибка API: ${response.status} - ${response.statusText}`);
        return;
      }

      try {
        const refreshedData = (await refresh()) as JWT;
        if (!refreshedData?.accessToken) {
          console.error('Нет токена после обновления');
          toast.add({
            title: 'Սեանսի ժամկետը սպառվել է: Խնդրում ենք կրկին մուտք գործել»',
          });
          throw new Error('No access token after refresh');
        }

        const headers = new Headers(options.headers || {});
        headers.set('Authorization', `Bearer ${refreshedData.accessToken}`);
        options.headers = headers;

        return await $fetch(request, options as any);
      } catch (error) {
        console.error('Ошибка при обновлении токена:', error);
        toast.add({
          title: 'Սեանսի ժամկետը սպառվել է: Խնդրում ենք կրկին մուտք գործել»',
        });
        throw error;
      }
    },
  });

  return {
    provide: {
      api,
    },
  };
});
