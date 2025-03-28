<template>
  <div class="space-y-2">
    <!-- List of prices -->
    <div v-if="prices.length" class="space-y-2">
      <div
        v-for="(priceItem, index) in prices"
        :key="index"
        :class="{ 'border-green-400': editingIndex === index, 'border-slate-300': editingIndex !== index }"
        class="flex items-center justify-between rounded-lg border p-2"
      >
        <div>
          <span v-if="priceItem.name" class="font-semibold text-gray-600">{{ priceItem.name }}: </span>
          <span>{{ priceItem.amount }}</span>
        </div>
        <div class="flex gap-2">
          <UButton icon="mdi:pencil" color="primary" variant="ghost" size="xs" @click="editPrice(index)" />
          <UButton icon="mdi:delete" color="error" variant="ghost" size="xs" @click="removePrice(index)" />
        </div>
      </div>
    </div>
    <div v-else class="text-gray-500">
      {{ $t('club.no_prices_yet') }}
    </div>

    <!-- Button to add price -->
    <UButton
      icon="mdi:plus"
      :label="$t('club.add_price')"
      color="neutral"
      variant="outline"
      size="xs"
      @click="showPriceInput = true"
    />

    <!-- Field to type prices -->
    <div v-if="showPriceInput" class="mt-2 space-y-2">
      <UInput v-model="newPrice.name" :placeholder="$t('club.price_name')" :ui="{ root: 'w-full' }" />
      <UInput v-model="newPrice.amount" type="number" :placeholder="$t('club.amount')" :ui="{ root: 'w-full' }" />
      <div class="flex gap-2">
        <UButton :label="$t('save')" color="primary" size="xs" @click="savePrice" />
        <UButton :label="$t('cancel')" variant="ghost" size="xs" @click="cancelPriceInput" />
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { useCustomToast } from '~/hooks/useCustomToast';
import type { TPrice } from '~/types';
import type { IMyClubPriceListProps } from '~/components/my-clubs/types';

const props = defineProps<IMyClubPriceListProps>();

const emit = defineEmits<{
  (e: 'update:prices', value: TPrice[]): void;
  (e: 'update:deleted-prices-ids', value: string[]): void;
}>();

const { showToast } = useCustomToast();
const { t } = useI18n();

const showPriceInput = ref<boolean>(false);
const newPrice = ref<Partial<TPrice>>({
  name: '',
  amount: 0,
});
const editingIndex = ref<number | null>(null);

const cancelPriceInput = (): void => {
  newPrice.value = { name: '', amount: 0 };
  showPriceInput.value = false;
  editingIndex.value = null;
};

const removePrice = (index: number): void => {
  const priceToRemove = props.prices[index];
  const updatedPrices = [...props.prices];
  updatedPrices.splice(index, 1);
  emit('update:prices', updatedPrices);

  if (priceToRemove._id) {
    const updatedDeletedPricesIds = [...props.deletedPricesIds, priceToRemove._id];
    emit('update:deleted-prices-ids', updatedDeletedPricesIds);
  }
};

const editPrice = (index: number): void => {
  const priceToEdit = props.prices[index];
  newPrice.value = { name: priceToEdit.name, amount: priceToEdit.amount };
  showPriceInput.value = true;
  editingIndex.value = index;
};

const savePrice = (): void => {
  if (newPrice.value.amount) {
    const updatedPrices: TPrice[] = [...props.prices];

    if (editingIndex.value !== null) {
      updatedPrices[editingIndex.value] = {
        ...updatedPrices[editingIndex.value],
        name: newPrice.value.name || '',
        amount: newPrice.value.amount,
      };
    } else {
      const newPriceItem: TPrice = {
        name: newPrice.value.name || '',
        amount: newPrice.value.amount,
      };
      updatedPrices.push(newPriceItem);
    }

    emit('update:prices', updatedPrices);
    cancelPriceInput();
  } else {
    showToast(t('club.crud_errors.fill_all_price_fields'), 'error');
  }
};
</script>
