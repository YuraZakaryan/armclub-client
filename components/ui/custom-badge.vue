<template>
  <UBadge :color="color || 'success'" class="z-20">
    <span class="font-bold text-white select-none"><slot /></span>
  </UBadge>
</template>

<script lang="ts" setup>
import type { TBadgeColor } from '~/types';

export interface ICustomBadgeProps {
  color?: TBadgeColor | null;
}

const { color } = defineProps<ICustomBadgeProps>();
</script>

<style></style>
