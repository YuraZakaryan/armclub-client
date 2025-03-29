<template>
  <UButton variant="outline" icon="mdi:edit" @click.stop="openModal" />

  <CustomModal v-model:open="isModalOpen" :label="props.timer.name" :close-modal="closeModal">
    <UForm :state="stateTimeForm" class="space-y-4">
      <div class="flex gap-5">
        <UFormField :label="$t('timer.allocated_time')" name="allocatedTime" required eager-validation>
          <UInput v-model="stateTimeForm.allocatedTime" :ui="{ root: 'w-full' }" />
        </UFormField>
        <UFormField :label="$t('timer.price')" name="price" required eager-validation>
          <UCheckbox v-model="stateTimeForm.isInfinite" label="Անորոշ" />
        </UFormField>
      </div>
      <div class="flex gap-2">
        <UFormField :label="$t('timer.price')" name="price" required eager-validation>
          <UInputNumber v-model="stateTimeForm.price" :ui="{ root: 'w-full' }" orientation="vertical" />
        </UFormField>
        <UFormField :label="$t('timer.price')" name="price" required eager-validation>
          <UInputNumber v-model="stateTimeForm.waitingCount" :ui="{ root: 'w-full' }" orientation="vertical" />
        </UFormField>
      </div>
      <div class="flex w-full justify-end">
        <UButton type="submit">{{ $t('table.edit') }}</UButton>
      </div>
    </UForm>
  </CustomModal>
</template>

<script setup lang="ts">
import CustomModal from '~/components/wrapper/custom-modal.vue';
import type { TTimer } from '~/types';

const props = defineProps<{
  timer: TTimer;
}>();

const modalStore = useModalStore();

const stateTimeForm = ref<Partial<TTimer>>({});

watch(
  () => props.timer,
  (newTimer) => {
    stateTimeForm.value = {
      allocatedTime: newTimer?.allocatedTime || 0,
      price: newTimer?.price || 0,
      waitingCount: newTimer?.waitingCount || 0,
      isInfinite: newTimer?.isInfinite || false,
    };
  },
  { immediate: true },
);

const isModalOpen = computed(() => modalStore.getModalState(`setTimer_${props.timer._id}`));

const openModal = (): void => {
  modalStore.openModal(`setTimer_${props.timer._id}`);
};

const closeModal = (): void => {
  modalStore.closeModal(`setTimer_${props.timer._id}`);
};
</script>
