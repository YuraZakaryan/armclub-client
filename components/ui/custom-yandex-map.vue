<template>
  <div v-show="props.latitudeMap && props.longitudeMap" class="h-64 overflow-hidden rounded-lg">
    <yandex-map
      v-model="map"
      :settings="{
        location: {
          center: [Number(props.longitudeMap), Number(props.latitudeMap)],
          zoom: 17,
        },
      }"
      width="100%"
    >
      <YandexMapDefaultSchemeLayer />
      <YandexMapDefaultFeaturesLayer />

      <YandexMapMarker
        :settings="{
          coordinates: [Number(props.longitudeMap), Number(props.latitudeMap)],
        }"
      >
        <Icon name="mdi:address-marker" class="text-red-500" size="30" />
      </YandexMapMarker>
    </yandex-map>
  </div>
</template>

<script setup lang="ts">
import type { YMap } from '@yandex/ymaps3-types';
import { shallowRef } from 'vue';
import {
  YandexMap,
  YandexMapDefaultFeaturesLayer,
  YandexMapDefaultSchemeLayer,
  YandexMapMarker,
} from 'vue-yandex-maps';
import type { ICustomYandexMapProps } from '../types';

const props = defineProps<ICustomYandexMapProps>();
const map = shallowRef<null | YMap>(null);
</script>
