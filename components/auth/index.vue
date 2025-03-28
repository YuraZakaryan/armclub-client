<template>
  <div>
    <UButton
      v-show="!props.hideButton"
      :label="$t('header.sign_in')"
      color="info"
      class="w-full whitespace-nowrap"
      @click="handleOpen"
    />

    <CustomModal v-model:open="modalState.isAuthOpen" :label="modalLabel[state.authMode]" :close-modal="closeModal">
      <AuthUiLogin v-if="state.authMode === 'LOGIN'" />
      <AuthUiRegistration v-else-if="state.authMode === 'REGISTRATION'" />
      <AuthUiRequestPasswordReset v-else-if="state.authMode === 'REQUEST_PASSWORD_RESET'" />
      <AuthUiVerifyOtpPasswordReset v-if="state.authMode === 'VERIFY_PASSWORD_RESET'" />
      <AuthUiSetPasswordReset v-else-if="state.authMode === 'SET_PASSWORD_RESET'" />
    </CustomModal>
  </div>
</template>

<script setup lang="ts">
import type { IAuthProps } from './types';
import type { TAuthMode } from '~/types';
import { useUserStore } from '~/stores/user';
import CustomModal from '~/components/wrapper/custom-modal.vue';
import { useModalStore } from '~/stores/modal';

const props = defineProps<IAuthProps>();
const store = useUserStore();
const modalStore = useModalStore();
const { t } = useI18n();

const { state } = storeToRefs(store);
const { state: modalState } = storeToRefs(modalStore);

const handleOpen = () => {
  modalStore.openModal('auth');
};

const closeModal = () => {
  modalStore.closeModal('auth');
  setTimeout(() => store.setAuthMode('LOGIN'), 300);
};

const modalLabel: Record<TAuthMode, string> = {
  LOGIN: t('auth.login'),
  REGISTRATION: t('auth.registration'),
  REQUEST_PASSWORD_RESET: t('reset_password.restore_access'),
  VERIFY_PASSWORD_RESET: t('reset_password.restore_access'),
  SET_PASSWORD_RESET: t('reset_password.restore_access'),
};
</script>
