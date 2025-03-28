<template>
  <UDropdownMenu :items="items" :popper="{ placement: 'bottom-start' }">
    <UButton
      :label="localSession?.user.firstName"
      icon="mdi:chevron-down"
      variant="ghost"
      trailing
      class="flex w-full justify-between p-0 pl-1 hover:bg-inherit"
    />
  </UDropdownMenu>
</template>

<script lang="ts" setup>
const { signOut } = useAuth();
const { t } = useI18n();
const sessionStore = useSessionStore();
const localePath = useLocalePath();

const { localSession } = storeToRefs(sessionStore);

const items = computed(() => {
  const adminItems = [
    {
      label: t('profile.label'),
      icon: 'mdi:account',
      to: localePath('/profile'),
    },
    {
      label: t('club.my_clubs'),
      icon: 'material-symbols:computer-outline',
      to: localePath('/my-clubs'),
    },
    {
      label: t('user.administration'),
      icon: 'mdi:administrator',
      to: localePath('/admin'),
    },
    {
      label: t('favorite.label'),
      icon: 'mdi:heart-outline',
      to: localePath('/favorites'),
    },
    {
      label: t('exit'),
      icon: 'mdi:exit-to-app',
      onSelect: () => {
        signOut();
      },
    },
  ];

  if (localSession.value?.user && localSession.value.user.role !== 'USER') {
    return [adminItems];
  }

  return [adminItems.filter((item) => item.label !== t('user.administration'))];
});
</script>
