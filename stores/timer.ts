import type { TFetchTimersBody, TReturnItem, TTimer, TTimerState } from '~/types';

export const useTimerStore = defineStore('timer', () => {
  const state = ref<TTimerState>({});

  const { $api } = useNuxtApp();

  const fetchTimers = async ({
    search,
    page,
    limit,
    sort,
    order,
    clubId,
  }: TFetchTimersBody): Promise<TReturnItem<TTimer[]>> => {
    try {
      const params: Record<string, string | number | boolean | 'asc' | 'desc' | undefined> = {
        name: search || '',
        limit: limit || 0,
        skip: page && limit ? (page - 1) * limit : 0,
        sort,
        order,
        clubId,
      };

      return await $api<TReturnItem<TTimer[]>>('/timer/all', {
        method: 'GET',
        params,
      });
    } catch {
      return {
        total_items: 0,
        items: [],
      };
    }
  };

  return { fetchTimers };
});
