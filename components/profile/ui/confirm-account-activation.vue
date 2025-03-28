<template>
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
      <button
        v-else
        type="button"
        class="ml-1 text-blue-500 underline"
        :disabled="userState.isResendLoading"
        @click.prevent="resendCode"
      >
        <span v-if="!userState.isResendLoading">{{ t('try_again') }}</span>
        <span v-else>...</span>
      </button>
    </small>
    <UButton
      type="submit"
      :loading="userState.isActivationRequestLoading"
      :disabled="isEmpty || userState.isActivationRequestLoading"
      class="flex w-full items-center justify-center"
      >{{ $t('continue') }}</UButton
    >
  </UForm>
</template>

<script lang="ts" setup>
import type { FormSubmitEvent } from '#ui/types';
import { computed, onMounted, ref } from 'vue';
import { useCustomToast } from '~/hooks/useCustomToast';
import type { TOtpState } from '~/components/auth/types';
import { useModalStore } from '~/stores/modal';

const { t } = useI18n();
const userStore = useUserStore();
const modalStore = useModalStore();
const { showToast } = useCustomToast();
const { state: userState } = storeToRefs(userStore);

const props = defineProps<{
  refresh: () => Promise<void>;
}>();

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

onMounted(() => {
  startTimer();
});

const resendCode = async () => {
  if (!userState.value.activationProfile.email) {
    showToast(t('profile.activation_errors.issue_while_sending_otp'), 'error');
  }

  const sent = await userStore.requestAccountActivation(userState.value.activationProfile.email || '', true);

  if (sent) {
    startTimer();
  } else {
    showToast(t('profile.activation_errors.issue_while_sending_otp'), 'error');
  }
};

async function onSubmit(event: FormSubmitEvent<TOtpState>) {
  if (!userState.value.activationProfile.email) {
    showToast(t('profile.activation_errors.issue_while_activation'), 'error');
    return;
  }

  const verified = await userStore.confirmAccountActivation(event.data.otp.join(''));

  if (verified) {
    modalStore.closeModal('activation');
    await props.refresh();

    setTimeout(() => {
      userStore.setActivationAccount({ otp: event.data.otp.join('') });
    }, 300);
  } else {
    showToast(t('user.verify_error'), 'error');
  }
}
</script>
