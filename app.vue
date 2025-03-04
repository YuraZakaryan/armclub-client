<template>
  <NuxtLoadingIndicator color="#6E5050" />
  <NuxtLayout>
    <TooltipProvider>
      <NuxtPage />
    </TooltipProvider>
  </NuxtLayout>
</template>

<script setup lang="ts">
import { TooltipProvider } from 'reka-ui';
</script>
