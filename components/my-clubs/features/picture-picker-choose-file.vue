<template>
  <div class="flex flex-col items-center justify-center">
    <Icon name="mdi:picture-360" size="23" style="color: gray" />
    <span class="text-center text-xs">{{ $t(`club.${props.text}`) }}</span>
    <span class="my-1 text-xs">{{ $t(`club.${props.text}`, 2) }}</span>
    <slot />
  </div>
</template>

<script lang="ts" setup>
const props = defineProps<{
  text: string;
}>();
</script>
