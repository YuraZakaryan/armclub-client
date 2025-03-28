<template>
  <UCarousel
    v-if="pictures.length > 1"
    v-slot="{ item, index }"
    ref="carouselRef"
    :items="pictures || []"
    :ui="{ dots: 'top-[110px] mobile-max-l:top-[70px]', dot: 'w-3 h-1' }"
    dots
    @mousemove="handleMouseMove"
  >
    <div
      class="mobile-max:h-[190px] overflow-hidden mobile-min-xl:transition-all mobile-min-xl:duration-350 mobile-min-xl:hover:scale-110"
    >
      <NuxtImg
        :src="item"
        :alt="'Image ' + (index + 1)"
        class="pointer-events-none mx-auto h-[160px] w-full object-cover select-none mobile-max-l:h-[120px]"
        draggable="false"
        @contextmenu.prevent
      />
    </div>
  </UCarousel>
  <div
    v-else
    class="mobile-max:h-[190px] overflow-hidden mobile-min-xl:transition-all mobile-min-xl:duration-350 mobile-min-xl:hover:scale-110 mobile-max-l:h-[120px]"
  >
    <NuxtImg
      :src="pictures[0]"
      :alt="'Image 1'"
      class="pointer-events-none mx-auto h-[160px] w-full object-cover select-none mobile-max-xl:h-[120px]"
      draggable="false"
      @contextmenu.prevent
    />
  </div>
</template>

<script lang="ts" setup>
import type { IPropertyImageCarouselProps } from '../types';

const props = defineProps<IPropertyImageCarouselProps>();
const config = useRuntimeConfig();

const carouselRef = ref();

const pictures = computed(() => {
  const baseURL = config.public.NUXT_SITE_URL.startsWith('https')
    ? config.public.NUXT_SITE_URL
    : config.public.NUXT_API_BASE_URL;

  const mainPicture = props.picture ? baseURL + '/' + props.picture : null;

  const pictures =
    props.pictures
      ?.map((picture) => ({
        ...picture,
        fullPath: baseURL + '/' + picture.path,
      }))
      .sort((a, b) => a.index - b.index) || [];

  return mainPicture ? [mainPicture, ...pictures.map((p) => p.fullPath)] : pictures.map((p) => p.fullPath);
});

// const startAutoplay = () => {
//   const autoplay = carouselRef.value?.emblaApi?.plugins().autoplay;
//   if (autoplay && !autoplay.isPlaying()) {
//     autoplay.play();
//   }
// };
//
// const stopAutoplay = () => {
//   const autoplay = carouselRef.value?.emblaApi?.plugins().autoplay;
//   if (autoplay && autoplay.isPlaying()) {
//     autoplay.stop();
//   }
// };

const handleMouseMove = (event: MouseEvent) => {
  if (!('onmousemove' in window) || window.matchMedia('(pointer: coarse)').matches) {
    return;
  }

  const emblaApi = carouselRef.value?.emblaApi;
  if (!emblaApi) return;

  const carouselNode = carouselRef.value.$el as HTMLElement;
  const rect = carouselNode.getBoundingClientRect();

  const mouseX = event.clientX - rect.left;
  const carouselWidth = rect.width;
  const progress = Math.max(0, Math.min(1, mouseX / carouselWidth));

  const scrollLength = emblaApi.scrollSnapList().length - 1;
  const targetIndex = progress * scrollLength;

  emblaApi.scrollTo(Math.round(targetIndex), false);
};
</script>
