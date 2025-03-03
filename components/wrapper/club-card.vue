<template>
  <li
    class="flex max-w-[320px] shrink-0 flex-col overflow-hidden rounded-lg bg-gradient-to-b from-gray-50 to-white pb-2 shadow-lg mobile-min-m:w-full mobile-max-m:max-w-full"
  >
    <section class="relative">
      <CustomBadge
        v-show="props.club.open !== null"
        class="absolute top-2 right-2 z-10"
        :color="colorOfClubOpenStatus[String(props.club.open)]"
      >
        {{ props.club.open ? 'Այս պահին բաց է' : 'Այս պահին փակ է' }}
      </CustomBadge>
      <button class="w-full" @click="handleNavigate">
        <CardImageCarousel
          v-if="props.club.pictures?.length"
          :pictures="props.club.pictures"
          class="h-[160px] w-full object-cover"
        />
        <NuxtImg v-else src="/img/no_image.png" class="h-[160px] w-full object-cover" alt="Нет изображения" />
      </button>
    </section>

    <section class="flex flex-col px-3 py-2 text-black">
      <div class="flex items-start justify-between pb-2">
        <h3
          class="line-clamp-2 cursor-pointer text-sm font-semibold transition-colors hover:text-blue-600"
          @click="handleNavigate"
        >
          {{ props.club.title }}
        </h3>
        <span class="text-xs font-medium text-gray-500">{{ props.club.rating || 'Տ/Չ' }} ★</span>
      </div>

      <div class="flex flex-col gap-1 text-xs text-gray-700">
        <div class="flex items-center gap-1">
          <Icon name="mdi:location-on-outline" size="16" />
          <span class="max-w-[90%] truncate">{{ props.club.address }}</span>
        </div>
        <div class="flex items-center gap-1">
          <Icon name="mdi:currency-usd" size="16" />
          <span>{{ props.club.pricePerHour ? `${props.club.pricePerHour} руб/час` : 'Գինը բացակայում է' }}</span>
        </div>
        <div class="flex items-center gap-1">
          <Icon name="mdi:seat-outline" size="16" />
          <span>Ազատ է: {{ props.club.availableSeats || 'N/A' }} տեղ</span>
        </div>
      </div>

      <div class="mt-2 h-[1px] w-full bg-gray-200" />
      <p class="mt-1 line-clamp-2 text-xs text-gray-600 first-letter:uppercase">
        {{ props.club.description || 'Նկարագրությունը բացակայում է' }}
      </p>

      <div class="mt-2 flex items-center justify-between text-xs">
        <span class="flex items-center gap-1">
          <Icon name="mdi:account-group-outline" size="16" />
          Զբաղվածություն: 20%
        </span>
        <button class="rounded bg-blue-500 px-2 py-1 text-white hover:bg-blue-600" @click="handleNavigate">
          Ավելին
        </button>
      </div>
    </section>
  </li>
</template>

<script setup lang="ts">
import type { IClubCard } from '~/components/types';
import CustomBadge from './../ui/custom-badge.vue';
import CardImageCarousel from '~/components/ui/card-image-carousel.vue';
import { computed } from 'vue';
import { useRouter } from 'vue-router';
import type { TBadgeColor } from '~/types';

const props = defineProps<IClubCard>();
const router = useRouter();

const colorOfClubOpenStatus = computed<{
  [key: string]: TBadgeColor;
}>(() => ({
  true: 'success',
  false: 'error',
}));

const handleNavigate = () => {
  router.push(`/properties/${props.club._id}`);
};
</script>
