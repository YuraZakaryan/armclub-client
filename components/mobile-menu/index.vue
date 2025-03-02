<template>
  <div class="sticky bottom-0 z-30 flex h-24 w-full items-center bg-white tablet-min:hidden">
    <MobileMenuList> </MobileMenuList>
  </div>
</template>

<script setup lang="ts">
import MobileMenuList from '~/components/mobile-menu/wrapper/mobile-menu-list.vue';

const isLoggedIn = true;
</script>
