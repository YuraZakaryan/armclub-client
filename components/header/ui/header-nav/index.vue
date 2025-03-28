<template>
  <section class="laptop-hd-min:hidden">
    <!--    <MenuMobile />-->
  </section>
  <section class="laptop-hd-max:hidden w-full">
    <NavLinkWrapper>
      <HeaderSearch />
      <NavLinkItem :title="$t('header.main')" path="/" />
      <NavLinkItem :title="$t('header.about_us')" path="/about-us" />
      <NavInfoWrapper>
        <NavInfoItem class="border-r pr-2.5 opacity-80">
          <div class="flex w-full items-center space-x-1">
            <div v-if="localSession?.user">
              <UserMenu />
            </div>
            <Auth v-else />
          </div>
        </NavInfoItem>
        <NavInfoItem class="text-[10px] whitespace-nowrap opacity-90">
          <HeaderLanguageSwitcher />
        </NavInfoItem>
      </NavInfoWrapper>
    </NavLinkWrapper>
  </section>
</template>

<script lang="ts" setup>
import NavLinkWrapper from './../../wrapper/nav-link-wrapper.vue';
import NavLinkItem from './../../wrapper/nav-link-item.vue';
import HeaderSearch from './../../ui/header-search/index.vue';
import HeaderLanguageSwitcher from './../../ui/header-language-switcher/index.vue';
import NavInfoWrapper from './../../wrapper/nav-info-wrapper.vue';
import NavInfoItem from './../../wrapper/nav-info-item.vue';
import { useSessionStore } from '~/stores/session';
import UserMenu from '~/components/ui/user-menu.vue';

const sessionStore = useSessionStore();
const { localSession } = storeToRefs(sessionStore);
</script>
