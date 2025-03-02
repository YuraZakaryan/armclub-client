<template>
  <div class="sticky bottom-0 z-30 flex h-12 w-full items-center bg-white mobile-min-xl:hidden">
    <MobileMenuList>
      <MobileMenuItem
        v-for="item in mobileMenuItems"
        :key="item.href"
        :path="item.href"
        :icon="item.icon"
        :is-active="route.path === item.href"
      >
        {{ item.label }}
      </MobileMenuItem>
    </MobileMenuList>
  </div>
</template>

<script setup lang="ts">
import MobileMenuList from '~/components/mobile-menu/wrapper/mobile-menu-list.vue';
import MobileMenuItem from '~/components/mobile-menu/wrapper/mobile-menu-item.vue';

const route = useRoute();
const isLoggedIn = true;

const mobileMenuItems = computed(() => [
  {
    icon: 'material-symbols:home-outline-rounded',
    label: 'Գլխավոր',
    href: '/',
  },
  {
    icon: 'material-symbols:computer-outline-rounded',
    label: 'Ակումբներ',
    href: '/clubs',
  },
  {
    icon: 'material-symbols:info-outline',
    label: 'Մեր մասին',
    href: '/about',
  },
  {
    icon: 'material-symbols:person-outline-rounded',
    label: isLoggedIn ? 'Իմ էջը' : 'Մուտք գործել',
    href: '/profile',
  },
]);
</script>
