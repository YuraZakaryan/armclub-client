<template>
  <li class="rounded-md p-1 whitespace-nowrap text-black/65 transition hover:bg-white/40">
    <NuxtLink :to="props.path" class="text-sm">{{ props.title }} </NuxtLink>
  </li>
</template>

<script lang="ts" setup>
import type { INavItemProps } from '../types';

const props = defineProps<INavItemProps>();
</script>
