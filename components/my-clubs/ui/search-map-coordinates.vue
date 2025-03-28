<template>
  <div class="mt-1.5 w-full space-y-2 rounded-lg border border-slate-300 p-2">
    <USelectMenu
      v-model:search-term="searchTerm"
      :items="searchResults"
      :loading="loading"
      :search-input="{
        placeholder: $t('club.search_address_label') + '...',
        icon: 'i-lucide-search',
      }"
      :placeholder="$t('club.search_address_label')"
      ignore-filter
      value-key="label"
      class="w-full"
      trailing
      @update:search-term="onSearch"
      @update:model-value="onAddressSelect"
    >
      <template #empty>
        <span>{{ $t('not_found', 2) }}</span>
      </template>
    </USelectMenu>
    <div class="grid grid-cols-2 gap-3">
      <slot />
    </div>
  </div>
</template>

<script lang="ts" setup>
import { initYmaps } from 'vue-yandex-maps';

const emit = defineEmits(['update:latitudeMap', 'update:longitudeMap']);
const clubStore = useClubStore();

const loading = ref<boolean>(false);
const searchTerm = ref<string>('');
const searchResults = ref<{ label: string }[]>([]);

const onSearch = async (newTerm: string) => {
  if (newTerm.trim() === '') {
    searchResults.value = [];
    return;
  }
  await fetchAddressSuggestions(newTerm);
};

const fetchAddressSuggestions = async (query: string) => {
  loading.value = true;
  try {
    await initYmaps();
    const response = await ymaps3.suggest({ text: query });
    searchResults.value = response.map((item) => ({ label: item.title.text }));
  } catch {
    searchResults.value = [];
  } finally {
    loading.value = false;
  }
};

const onAddressSelect = async (selectedAddress: string | undefined) => {
  if (!selectedAddress) return;

  searchTerm.value = selectedAddress;

  const coordinates = await clubStore.getCoordinatesFromAddress(selectedAddress);

  if (coordinates) {
    emit('update:latitudeMap', coordinates.latitude.toString());
    emit('update:longitudeMap', coordinates.longitude.toString());
  } else {
    console.error('Unable to fetch coordinates for the selected address');
  }
};
</script>
