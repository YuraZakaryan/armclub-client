<template>
  <div class="w-full">
    <UCarousel
      v-slot="{ item }"
      :autoplay="{ delay: 8000 }"
      :items="props.posters"
      :ui="{
        container: 'transition-[height]',
        controls: 'absolute top-1/2 inset-x-16',
        arrows: 'mobile-max-xl:hidden',
        dots: 'top-16.5',
        dot: 'w-6 h-1 mobile-max-l:w-3',
      }"
      arrows
      dots
    >
      <NuxtImg
        :src="baseURL + '/' + item.poster"
        class="inset-x-16 h-44 w-full cursor-pointer rounded-lg object-cover"
        @click="handleNavigate(item)"
      />
    </UCarousel>
  </div>
</template>

<script setup lang="ts">
import { ClubService } from '~/utils/clubService';
import type { IPosterCarouselProps } from '~/components/home/types';
import type { TClubsPosters } from '~/components/types';

const props = defineProps<IPosterCarouselProps>();

const localePath = useLocalePath();
const config = useRuntimeConfig();
const router = useRouter();

const baseURL = config.public.NUXT_SITE_URL.startsWith('https')
  ? config.public.NUXT_SITE_URL
  : config.public.NUXT_API_BASE_URL;

const handleNavigate = (poster: TClubsPosters) => {
  const clubSlug = ClubService.slugifyClubName(poster.name);
  const path = `${clubSlug}-${poster._id}`;

  if (!clubSlug || !poster._id) {
    console.error('Invalid club data for navigation');
    return;
  }

  router.push(localePath(`/clubs/${path}`));
};
</script>
