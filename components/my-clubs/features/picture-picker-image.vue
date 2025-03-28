<template>
  <div class="flex items-center justify-center pt-5">
    <NuxtImg :src="src" class="max-h-44 w-64 rounded-lg" />
  </div>
</template>

<script lang="ts" setup>
defineProps<{
  src: string;
}>();
</script>
