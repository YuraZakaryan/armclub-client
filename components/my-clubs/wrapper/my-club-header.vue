<template>
  <div class="flex w-full items-center justify-between">
    <h1 class="text-xl">{{ title }}</h1>
  </div>
</template>
<script lang="ts" setup>
defineProps<{
  title: string;
}>();
</script>
