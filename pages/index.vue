<template>
  <div class="flex flex-col gap-5">
    <PosterCarousel v-show="!!clubsPosters" :posters="clubsPosters" />
    <CardWrapper v-show="!!data.total_items">
      <ClubCard v-for="club in data.items" :key="club._id" :club="club" />
    </CardWrapper>
  </div>
</template>

<script setup lang="ts">
import PosterCarousel from './../components/home/ui/poster-carousel/index.vue';
import CardWrapper from '~/components/wrapper/card-wrapper.vue';
import ClubCard from '~/components/wrapper/club-card.vue';
import type { TClub, TReturnItem } from '~/types';
import type { TClubsPosters } from '~/components/types';

const store = useClubStore();

const { data } = await useAsyncData<TReturnItem<TClub[]>>(
  'clubs',
  () =>
    store.fetchClubs({
      limit: 10,
      clubStatuses: [true],
    }),
  {
    default: () => ({ total_items: 0, items: [] }),
  },
);

const clubsPosters: TClubsPosters[] = data.value.items
  .filter((club: TClub) => club.posterPicture)
  .map((club: TClub) => ({
    _id: club._id,
    name: club.name,
    poster: club.posterPicture,
  }));
</script>
