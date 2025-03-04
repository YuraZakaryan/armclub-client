<template>
  <li
    class="flex max-w-[300px] shrink-0 flex-col overflow-hidden rounded-lg bg-gradient-to-b from-gray-50 to-white pb-2 shadow-lg mobile-min-m:w-full mobile-max-m:max-w-full"
  >
    <section class="relative">
      <CustomBadge
        v-show="props.club.open !== null"
        class="absolute top-2 right-2 z-10"
        :color="ClubService.colorOfClubOpenStatus[props.club.open ? 'true' : 'false']"
      >
        {{ props.club.open ? 'Բաց է' : 'Փակ է' }}
      </CustomBadge>
      <button class="w-full" @click="handleNavigate">
        <CardImageCarousel v-if="props.club.pictures?.length" :pictures="props.club.pictures" />
        <NuxtImg v-else src="/img/no_image.png" class="h-[160px] w-full object-cover" alt="Нет изображения" />
      </button>
    </section>

    <section class="flex flex-col px-3 py-2 text-black">
      <div class="flex items-start justify-between mobile-min-xl:mb-1 mobile-max-xl:min-h-9">
        <h3
          class="line-clamp-2 cursor-pointer text-sm font-semibold tracking-tight transition-colors hover:opacity-85 mobile-max-xl:text-xs"
          @click="handleNavigate"
        >
          {{ props.club.title }}
        </h3>
        <span class="text-xs font-medium whitespace-nowrap text-gray-500"
          >{{ ClubService.calculateAverageRating(props.club.ratings) || 0 }} ★</span
        >
      </div>

      <div class="flex flex-col gap-1 text-xs text-gray-700">
        <div class="flex items-center gap-1">
          <Icon name="mdi:location-on-outline" size="16" />
          <span class="max-w-[90%] truncate">{{ props.club.address }}</span>
        </div>
        <div class="flex items-center gap-1">
          <Icon name="mdi:seat-outline" size="16" />
          <span>Քանակը: {{ props.club.timers.length || 0 }} տեղ</span>
        </div>
      </div>

      <div class="mt-2 h-[1px] w-full bg-gray-200" />
      <p class="mt-1 line-clamp-2 text-xs text-gray-600 first-letter:uppercase mobile-max-xl:hidden">
        {{ props.club.description || 'Նկարագրությունը բացակայում է' }}
      </p>

      <div class="mt-2 flex items-center justify-between text-xs">
        <span class="flex items-center gap-1">
          <Icon
            name="mdi:account-group-outline"
            size="16"
            :class="ClubService.getOccupancyColorClass(ClubService.calculateClubOccupancy(props.club.timers) || 0)"
          />
          <span class="mobile-max-l:hidden">Զբաղվածություն: </span>
          <span>{{ ClubService.calculateClubOccupancy(props.club.timers) || 0 }}%</span>
        </span>
        <GlitchButton
          label="Ավելին"
          class="bg-emerald-500 px-2 py-1 text-sm hover:bg-emerald-600 mobile-max-xl:hidden"
          @click="handleNavigate"
        />
      </div>
    </section>
  </li>
</template>

<script setup lang="ts">
import type { IClubCard } from '~/components/types';
import CustomBadge from './../ui/custom-badge.vue';
import CardImageCarousel from '~/components/ui/card-image-carousel.vue';
import { useRouter } from 'vue-router';
import { ClubService } from '~/utils/clubService';
import GlitchButton from '~/components/wrapper/glitch-button.vue';

const props = defineProps<IClubCard>();
const router = useRouter();

const handleNavigate = () => {
  router.push(`/properties/${props.club._id}`);
};
</script>
