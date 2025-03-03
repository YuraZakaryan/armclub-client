<template>
  <div class="bg-slate-100">
    <Header />
    <main class="min-h-[calc(100vh-3rem)] px-7 py-4 mobile-min-xl:min-h-[calc(100vh-4rem)]"><slot /></main>
    <MobileMenu />
  </div>
</template>

<script lang="ts" setup>
import Header from './../components/header/index.vue';
import MobileMenu from './../components/mobile-menu/index.vue';
</script>
