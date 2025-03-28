<template>
  <section class="space-y-2 laptop-max:m-0">
    <div class="rounded-lg">
      <ClubPageGallery :picture="props.club.picture" :pictures="props.club.pictures" />
    </div>
    <ClubPageInfo v-show="props.club" :club="props.club" class="laptop-min:hidden" />
    <div class="space-y-3 laptop-min:hidden">
      <CustomYandexMap :latitude-map="props.club.latitudeMap" :longitude-map="props.club.longitudeMap" />
    </div>
    <ClubComments :club-id="props.club._id" />
  </section>
</template>

<script setup lang="ts">
import type { IClubPageProps } from '~/components/club/types';
import ClubPageGallery from '~/components/club/features/club-page-gallery.vue';
import ClubPageInfo from '~/components/club/ui/club-page-info.vue';
import CustomYandexMap from '~/components/ui/custom-yandex-map.vue';
import ClubComments from '~/components/club-comments/index.vue';

const props = defineProps<IClubPageProps>();
</script>
