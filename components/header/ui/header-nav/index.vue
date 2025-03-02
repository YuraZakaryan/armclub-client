<template>
  <section class="laptop-hd-min:hidden">
    <!--    <MenuMobile />-->
  </section>
  <section class="w-full laptop-hd-max:hidden">
    <NavLinkWrapper>
      <!--      <HeaderUiHeaderNavSearch />-->
      <NavLinkItem title="Գլխավոր" path="/" />
      <NavLinkItem title="Մեր մասին" path="/about-us" />
      <!--      <NavInfoWrapper>-->
      <!--        <NavInfoItem class="opacity-80 border-r pr-2.5">-->
      <!--          <div class="w-full flex items-center space-x-1">-->
      <!--            <div v-if="localSession?.user">-->
      <!--              <UiUserMenu />-->
      <!--            </div>-->
      <!--            <Auth v-else />-->
      <!--          </div>-->
      <!--        </NavInfoItem>-->
      <!--        <NavInfoItem class="whitespace-nowrap opacity-90 text-[10px]">-->
      <!--          <LanguageSwitcher />-->
      <!--        </NavInfoItem>-->
      <!--        <NavInfoItem class="whitespace-nowrap text-[10px]">-->
      <!--          <Icon name="mdi:email" size="15" />-->
      <!--          <p>{{ INFO_EMAIL }}</p>-->
      <!--        </NavInfoItem>-->
      <!--      </NavInfoWrapper>-->
    </NavLinkWrapper>
  </section>
</template>

<script lang="ts" setup>
import NavLinkWrapper from './../../wrapper/nav-link-wrapper.vue';
import NavLinkItem from './../../wrapper/nav-link-item.vue';
</script>
