<template>
  <div class="flex flex-col gap-5">
    <PosterCarousel />
    <CardWrapper>
      <ClubCard v-for="club in mockArmenianComputerClubs" :key="club._id" :club="club" />
    </CardWrapper>
  </div>
</template>

<script setup lang="ts">
import PosterCarousel from './../components/home/ui/poster-carousel/index.vue';
import CardWrapper from '~/components/wrapper/card-wrapper.vue';
import ClubCard from '~/components/wrapper/club-card.vue';
import { mockArmenianComputerClubs } from '~/mock-data/club';
</script>
