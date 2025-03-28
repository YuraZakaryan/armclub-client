<template>
  <div class="flex flex-col items-center gap-5 px-8 py-3 mobile-max-xl:px-0">
    <div class="flex flex-col gap-2">
      <div class="flex w-full items-center justify-between mobile-max-xl:justify-end">
        <UBreadcrumb :items="links" class="w-full mobile-max-xl:hidden" />
        <div class="flex items-center gap-1 text-sm whitespace-nowrap">
          <p class="text-gray-500">Просмотров:</p>
          <span>{{ data?.view }}</span>
        </div>
      </div>
      <div class="flex w-full space-x-5">
        <ClubPageMainContent v-show="data" :club="data as TClub" />
        <ClubPageInfo v-show="data" :club="data as TClub" class="laptop-max:hidden" />
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import type { TClub, TGetIp } from '~/types';
import ClubPageInfo from '~/components/club/ui/club-page-info.vue';
import ClubPageMainContent from '~/components/club/ui/club-page-main-content.vue';

const route = useRoute();
const { t } = useI18n();
const store = useClubStore();
const { $api } = useNuxtApp();

const paramId = route.params.id as string;
const clubId = paramId.split('-').pop();

if (!clubId) {
  throw createError({
    statusCode: 400,
    statusMessage: 'Incorrect club ID',
  });
}

definePageMeta({
  validate: async (route) => {
    const id = route.params.id;
    if (typeof id !== 'string') return false;
    const clubIdFromRoute = id.split('-').pop();
    return !!clubIdFromRoute && /^[a-zA-Z0-9]+$/.test(clubIdFromRoute);
  },
});

const { data: ipData } = useFetch<TGetIp>('/api/get-ip', {
  default: () => ({ ip: '127.0.0.1' }),
});

onMounted(async () => {
  try {
    await $api(`club/increment-view/${clubId}`, {
      method: 'PATCH',
      headers: {
        'x-forwarded-for': ipData.value?.ip,
      },
    });
  } catch (error) {
    console.warn('Error', error);
  }
});

const { data } = await useAsyncData<TClub | null>('clubs', () => store.fetchClubById(clubId), {
  default: () => null,
});

const links = computed(() => [
  {
    label: t('header.main'),
    icon: 'material-symbols:home-rounded',
    to: '/',
  },
  {
    label: t('club.label'),
    icon: 'hugeicons:real-estate-02',
    to: '/clubs',
  },
  {
    label: data.value?.name,
  },
]);
</script>
