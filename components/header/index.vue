<template>
  <header class="sticky top-0 z-30 flex h-16 w-full items-center bg-slate-100 px-7 mobile-max-xl:hidden">
    <HeaderLogo />
    <HeaderNav />
  </header>
</template>

<script lang="ts" setup>
import HeaderLogo from './ui/header-logo/index.vue';
import HeaderNav from './ui/header-nav/index.vue';
</script>
