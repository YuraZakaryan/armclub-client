<template>
  <NuxtLink :to="localePath(props.to)">
    <slot />
  </NuxtLink>
</template>

<script lang="ts" setup>
const props = defineProps<{ to: string }>();

const localePath = useLocalePath();
</script>
