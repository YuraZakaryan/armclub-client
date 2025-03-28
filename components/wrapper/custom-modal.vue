<template>
  <UModal :dismissible="false">
    <template #header>
      <div class="flex w-full items-center justify-between">
        <h3 class="text-sm leading-6 font-semibold text-gray-900">{{ props.label }}</h3>
        <UButton variant="ghost" icon="mdi:close" class="-my-1" @click="props.closeModal" />
      </div>
    </template>
    <template #body>
      <slot />
    </template>
  </UModal>
</template>

<script setup lang="ts">
import type { ICustomModalProps } from '~/components/types';

const props = defineProps<ICustomModalProps>();
</script>
