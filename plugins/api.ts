import type { JWT } from 'next-auth/jwt';

export default defineNuxtPlugin((nuxtApp) => {
  const config = useRuntimeConfig();
  // const sessionStore = useSessionStore();
  // const { refresh } = useAuth();
  const toast = useToast();

  // const { localSession } = storeToRefs(sessionStore);

  const api = $fetch.create({
    baseURL: config.public.NUXT_SITE_URL + '/api' || 'http://localhost:3000/api',
    onRequest({ options }) {
      const headers = new Headers(options.headers || {});

      // if (localSession.value?.accessToken) {
      //   headers.set('Authorization', `Bearer ${localSession.value.accessToken}`);
      // }

      options.headers = headers;
    },
    async onResponseError({ response, request, options }): Promise<any> {
      if (response.status === 401) {
        const toastId = toast.add({
          title: 'Refreshing token...',
          color: 'primary',
          icon: 'mdi:loading',
        });
        try {
          // const refreshedData = (await refresh()) as JWT;
          // if (refreshedData?.accessToken) {
          //   const headers = new Headers(options.headers || {});
          //   headers.set('Authorization', `Bearer ${refreshedData.accessToken}`);
          //   options.headers = headers;
          //
          //   setTimeout(() => {
          //     toast.remove(toastId.id);
          //   }, 1000);
          //
          //   toast.add({
          //     title: 'Retrying request and token refreshed successfully!',
          //     color: 'green',
          //     icon: 'mdi:check-circle',
          //     timeout: 4000,
          //   });
          //
          //   const retryResponse = await $fetch(request, options as any);
          //   return retryResponse;
          // } else {
          //   console.error('No access token after refresh');
          //
          //   setTimeout(() => {
          //     toast.remove(toastId.id);
          //   }, 1000);
          //
          //   toast.add({
          //     title: 'Failed to refresh token',
          //     color: 'red',
          //     icon: 'mdi:alert',
          //     timeout: 4000,
          //   });
          // }
        } catch (error) {
          console.error('Error refreshing token:', error);

          setTimeout(() => {
            toast.remove(toastId.id);
          }, 1000);

          // toast.add({
          //   title: 'Error refreshing token',
          //   color: 'red',
          //   icon: 'mdi:alert',
          //   timeout: 4000,
          // });
        }
      } else {
        console.error(`API error: ${response.status} - ${response.statusText}`);
      }
    },
  });

  return {
    provide: {
      api,
    },
  };
});
