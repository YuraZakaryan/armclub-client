<template>
  <div class="bg-slate-100" :class="fontClass">
    <Header />
    <main
      class="mx-auto min-h-[calc(100vh-3rem)] max-w-[1504px] px-7 py-4 mobile-min-xl:min-h-[calc(100vh-4rem)] mobile-max-xl:px-3"
    >
      <slot />
    </main>
    <MobileMenu />
  </div>
</template>

<script lang="ts" setup>
import Header from './../components/header/index.vue';
import MobileMenu from './../components/mobile-menu/index.vue';

const { locale } = useI18n();

const fontClass = computed(() => {
  if (locale.value === 'en') {
    return 'font-my-latin';
  } else if (locale.value === 'ru') {
    return 'font-my-cyrillic';
  } else {
    return 'font-noto-sans-armenian';
  }
});
</script>

<style scoped>
.font-my-latin {
  font-family: 'My Latin Font', sans-serif;
}

.font-my-cyrillic {
  font-family: 'My Cyrillic Font', sans-serif;
}

.font-noto-sans-armenian {
  font-family: 'Noto Sans Armenian', sans-serif;
}
</style>
