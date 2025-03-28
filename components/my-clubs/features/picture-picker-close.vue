<template>
  <button v-if="props.show || false" class="absolute top-2 right-3 cursor-pointer" @click="props.handleRemove">
    <Icon name="mdi:close-thick" style="color: red" size="20" />
  </button>
</template>

<script lang="ts" setup>
import type { IPicturePickerCloseProps } from '../types';

const props = defineProps<IPicturePickerCloseProps>();
</script>
