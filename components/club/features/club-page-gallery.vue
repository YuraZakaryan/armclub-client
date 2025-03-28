<template>
  <div class="tablet-min:max-w-[700px]">
    <UCarousel
      v-if="images.length > 1"
      v-slot="{ item, index }"
      :autoplay="{ delay: 8000 }"
      :items="images || []"
      :ui="{
        container: 'transition-[height]',
        controls: 'absolute top-1/2 inset-x-16',
        arrows: 'mobile-max-xl:hidden',
        dots: 'top-52 tablet-max:top-22',
        dot: 'w-6 h-1 mobile-max-l:w-3',
      }"
      class="overflow-hidden rounded-lg"
      arrows
      dots
    >
      <div class="group relative flex items-center">
        <NuxtImg
          :src="item"
          :alt="'Image ' + (index + 1)"
          class="h-[475px] w-[700px] cursor-pointer overflow-hidden rounded-lg object-cover select-none laptop-max:h-[200px]"
          draggable="false"
          @contextmenu.prevent
          @click="showImg(index)"
        />
        <div
          class="pointer-events-none absolute inset-0 flex items-center justify-center bg-black/15 opacity-0 transition-opacity group-hover:opacity-100"
        >
          <Icon name="lets-icons:search-duotone" class="text-7xl text-white" />
        </div>
      </div>
    </UCarousel>

    <div v-else class="group relative">
      <NuxtImg
        :src="images[0]"
        :alt="'Image 1'"
        class="max-h-[475px] w-[700px] cursor-pointer overflow-hidden rounded-lg object-cover select-none tablet-max:h-[200px]"
        draggable="false"
        @contextmenu.prevent
        @click="showImg(0)"
      />
      <div
        class="pointer-events-none absolute inset-0 flex items-center justify-center bg-black/15 opacity-0 transition-opacity group-hover:opacity-100"
      >
        <Icon name="lets-icons:search-duotone" class="text-7xl text-white" />
      </div>
    </div>
    <VueEasyLightbox
      :move-disabled="true"
      :rotate-disabled="true"
      :visible="visibleRef"
      :imgs="images"
      :index="indexRef"
      :min-zoom="0.8"
      :max-zoom="3"
      :pinch-disabled="false"
      @hide="onHide"
    />
  </div>
</template>

<script lang="ts" setup>
import type { IClubPageGalleryProps } from '~/components/club/types';

const props = defineProps<IClubPageGalleryProps>();
const config = useRuntimeConfig();

const visibleRef = ref(false);
const indexRef = ref(0);

const images = computed(() => {
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

const onHide = () => (visibleRef.value = false);
const showImg = (index: number) => {
  indexRef.value = index;
  visibleRef.value = true;
};

const carouselRef = ref();

onMounted(() => {
  setInterval(() => {
    if (!carouselRef.value) return;

    if (carouselRef.value.page === carouselRef.value.pages) {
      return carouselRef.value.select(0);
    }

    carouselRef.value.next();
  }, 6000);
});
</script>
