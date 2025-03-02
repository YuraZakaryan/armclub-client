<template>
  <div class="bg-slate-100">
    <Header />
    <Main><slot /></Main>
    <MobileMenu />
  </div>
</template>

<script lang="ts" setup>
import Header from './../components/header/index.vue';
import MobileMenu from './../components/mobile-menu/index.vue';
</script>
