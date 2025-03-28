<template>
  <NuxtLoadingIndicator color="#6E5050" />
  <NuxtLayout>
    <UApp>
      <NuxtPage />
    </UApp>
  </NuxtLayout>
</template>

<script lang="ts" setup>
const sessionStore = useSessionStore();

const { data: session } = useAuth();

await sessionStore.fetchSession();

watch(
  () => session.value,
  (newSession) => {
    if (newSession) {
      sessionStore.updateSession(session.value || null);
    }
  },
  { deep: true, immediate: true },
);
</script>
