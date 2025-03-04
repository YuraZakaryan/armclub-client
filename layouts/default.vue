<template>
  <div class="bg-slate-100">
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
</script>
