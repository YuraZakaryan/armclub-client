<template>
  <section class="w-[420px] font-bold laptop-max:w-full">
    <div class="flex w-full items-start justify-between">
      <h1 class="relative -top-1 text-xl mobile-max-l:text-base">
        {{ props.club.name || 'Համակարգչային ակումբ' }}
      </h1>
      <span v-if="props.club.open" class="text-sm font-semibold text-green-600">
        Открыто до {{ DateService.formatDate(props.club.closingTime).dateWithTime }}
      </span>
      <span v-else class="text-sm font-semibold text-red-600">
        Закрыто до {{ DateService.formatDate(props.club.openingTime).dateWithTime }}
      </span>
    </div>
    <div class="text-sm underline">
      <p>{{ props.club.address }}, {{ $t('cities.' + props.club.city) }}, {{ $t('cities.' + props.club.region) }}</p>
    </div>
    <div class="text-sm">
      <p>
        Телефон:
        <a :href="'tel:' + props.club.countryCode + props.club.phone" class="underline">{{
          `${props.club.countryCode} ${props.club.phone}`
        }}</a>
      </p>
    </div>
    <USeparator class="my-3" />
    <div class="text-sm">
      <p>Тарифы:</p>
      <ul class="list-disc pl-5">
        <li v-for="(price, index) in props.club.prices" :key="index">{{ price }}</li>
      </ul>
    </div>
    <USeparator class="my-3" />
    <div class="space-y-3 laptop-max:hidden">
      <CustomYandexMap :latitude-map="props.club.latitudeMap" :longitude-map="props.club.longitudeMap" />
    </div>
  </section>
</template>

<script setup lang="ts">
import type { IClubPageProps } from '~/components/club/types';
import CustomYandexMap from '~/components/ui/custom-yandex-map.vue';
import { DateService } from '~/utils/dateService';

const props = defineProps<IClubPageProps>();
</script>
