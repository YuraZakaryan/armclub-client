<template>
  <header class="sticky top-0 z-30 flex h-16 min-h-[60px] w-full items-center bg-slate-100 px-7">
    <HeaderLogo />
    <HeaderNav />
  </header>
</template>

<script lang="ts" setup>
import HeaderLogo from './ui/header-logo/index.vue';
import HeaderNav from './ui/header-nav/index.vue';
</script>
