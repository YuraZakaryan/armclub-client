<template>
  <li class="w-full">
    <NuxtLink :to="props.path" class="flex flex-col items-center justify-center text-xs transition-all">
      <Icon :name="props.icon" :class="{ 'text-red-400': props.isActive }" size="20" /> <slot />
    </NuxtLink>
  </li>
</template>

<script setup lang="ts">
import type { IMobileMenuItemProps } from '~/components/mobile-menu/types';

const props = defineProps<IMobileMenuItemProps>();
</script>
