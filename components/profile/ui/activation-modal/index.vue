<template>
  <CustomModal
    v-model:open="modalState.isActivationOpen"
    :label="modalLabel[state.activationMode]"
    :close-modal="closeModal"
  >
    <SendActivationMessage v-if="state.activationMode === 'REQUEST_ACTIVATION'" />
    <ConfirmAccountActivation v-else-if="state.activationMode === 'VERIFY_ACTIVATION_PASSWORD'" :refresh="refresh" />
  </CustomModal>
</template>

<script setup lang="ts">
import { useUserStore } from '~/stores/user';
import type { TActivationMode } from '~/types';
import CustomModal from '~/components/wrapper/custom-modal.vue';
import SendActivationMessage from '~/components/profile/ui/send-activation-message.vue';
import ConfirmAccountActivation from '~/components/profile/ui/confirm-account-activation.vue';
import { useModalStore } from '~/stores/modal';

defineProps<{
  refresh: () => Promise<void>;
}>();

const store = useUserStore();
const modalStore = useModalStore();

const { t } = useI18n();

const { state: modalState } = storeToRefs(modalStore);
const { state } = storeToRefs(store);

const closeModal = () => {
  modalStore.closeModal('activation');
  setTimeout(() => store.setActivationMode('REQUEST_ACTIVATION'), 300);
};

const modalLabel: Record<TActivationMode, string> = {
  REQUEST_ACTIVATION: t('profile.activate_account'),
  VERIFY_ACTIVATION_PASSWORD: t('profile.confirm_account_activation'),
};
</script>
