<template>
  <div v-show="!!data.length" class="w-full">
    <UCarousel
      v-slot="{ item }"
      :autoplay="{ delay: 8000 }"
      arrows
      dots
      :items="data"
      :ui="{
        container: 'transition-[height]',
        controls: 'absolute top-1/2 inset-x-16',
        arrows: 'mobile-max-xl:hidden',
        dots: 'top-16.5',
        dot: 'w-6 h-1 mobile-max-l:w-3',
      }"
    >
      <NuxtImg :src="item" class="inset-x-16 h-44 w-full rounded-lg object-cover" />
    </UCarousel>
  </div>
</template>

<script setup lang="ts">
import { mockArmenianComputerClubs } from '~/mock-data/club';

const data = mockArmenianComputerClubs.map((club) => club.posterPicture);
</script>
