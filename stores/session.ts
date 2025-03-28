import type { Session } from 'next-auth';

export const useSessionStore = defineStore('session', () => {
  const localSession = ref(null as Session | null);

  const updateSession = (session: Session | null) => {
    localSession.value = session;
  };

  const fetchSession = async () => {
    const { data } = await useFetch<Session | null>('/api/protected');

    localSession.value = data.value;
  };

  return {
    localSession,
    updateSession,
    fetchSession,
  };
});
