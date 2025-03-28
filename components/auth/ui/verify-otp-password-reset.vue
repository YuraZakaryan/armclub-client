<template>
  <AuthWrapper>
    <UForm :state="state" class="space-y-4" @submit="onSubmit">
      <h3 class="text-dark text-center text-xl font-semibold">
        {{ t('user.confirm_on_time_password') }}
      </h3>
      <div class="flex justify-center">
        <UPinInput v-model="state.otp" :length="6" size="xl" otp />
      </div>
      <small class="block text-center text-gray-600 select-none">
        {{ t('user.did_not_receive_password') }}
        <span v-if="timer > 0" class="ml-1 text-gray-500"> ({{ timer }} {{ t('reset_password.second') }}) </span>
        <button v-else class="ml-1 text-blue-500 underline" :disabled="userState.isResendLoading" @click="resendCode">
          <span v-if="!userState.isResendLoading">{{ t('try_again') }}</span>
          <span v-else>...</span>
        </button>
      </small>
      <UButton
        type="submit"
        :loading="userState.isRequestLoading"
        :disabled="isEmpty || userState.isRequestLoading"
        class="flex w-full items-center justify-center"
        >{{ t('continue') }}</UButton
      >
    </UForm>
  </AuthWrapper>
</template>

<script lang="ts" setup>
import type { FormSubmitEvent } from '#ui/types';
import { computed, onMounted, ref } from 'vue';
import { useCustomToast } from '~/hooks/useCustomToast';
import type { TOtpState } from '../types';

const { t } = useI18n();
const userStore = useUserStore();
const { showToast } = useCustomToast();
const { state: userState } = storeToRefs(userStore);

const state = ref<TOtpState>({
  otp: [],
});

let timerInterval: ReturnType<typeof setInterval> | null = null;
const timer = ref(60);
const isEmpty = computed(() => state.value.otp.length !== 6);

const startTimer = () => {
  if (timerInterval !== null) {
    clearInterval(timerInterval);
  }

  timer.value = 60;

  timerInterval = setInterval(() => {
    if (timer.value > 0) {
      timer.value -= 1;
    } else {
      if (timerInterval !== null) {
        clearInterval(timerInterval);
        timerInterval = null;
      }
    }
  }, 1000);
};

const resendCode = async () => {
  if (!userState.value.resetPassword.email) {
    showToast(t('reset_password.issue_while_changing'), 'error');
  }

  const sent = await userStore.requestPasswordReset(userState.value.resetPassword.email || '', true);

  if (sent) {
    startTimer();
  } else {
    showToast(t('reset_password.issue_while_changing'), 'error');
  }
};

onMounted(() => {
  startTimer();
});

async function onSubmit(event: FormSubmitEvent<TOtpState>) {
  if (!userState.value.resetPassword.email) {
    showToast(t('reset_password.issue_while_changing'), 'error');
    return;
  }

  const verified = await userStore.verifyPasswordReset(event.data.otp.join(''));

  if (verified) {
    userStore.setResetPassword({ otp: event.data.otp.join('') });
    userStore.setAuthMode('SET_PASSWORD_RESET');
  } else {
    showToast(t('user.verify_error'), 'error');
  }
}
</script>
