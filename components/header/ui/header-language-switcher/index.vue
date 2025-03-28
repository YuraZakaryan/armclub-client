<template>
  <UDropdownMenu :items="[languageItems]" :popper="{ placement: 'bottom-start' }">
    <UButton
      :label="$t(`header.${locale}`)"
      variant="ghost"
      class="flex w-full items-center justify-between p-0 whitespace-nowrap hover:bg-inherit"
    >
      <div class="flex items-center space-x-2">
        <Icon name="material-symbols:language" size="20" />
        <span>{{ $t(`header.${locale}`) }}</span>
      </div>
      <Icon name="i-heroicons-chevron-down-20-solid" size="20" class="ml-auto" />
    </UButton>
    <template #item="{ item }">
      <span class="truncate">
        {{ item.label }}
      </span>
    </template>
  </UDropdownMenu>
</template>

<script lang="ts" setup>
import type { Locale } from '~/types';

const { t, locales, locale, setLocale } = useI18n();

const languageItems = locales.value.map((lang: Locale) => ({
  label: t(`header.${lang.code}`),
  value: lang.code.split('-')[0],
  onSelect: () => {
    setLocale(lang.code);
  },
}));
</script>
