<template>
  <AuthWrapper>
    <UForm :schema="requestPasswordResetSchema" :state="state" class="space-y-4" @error="onError" @submit="onSubmit">
      <UFormField
        :label="t('user.enter_email')"
        :ui="{
          error: 'hidden',
        }"
        name="email"
        eager-validation
      >
        <UInput
          v-model="state.email"
          :ui="{
            root: 'w-full',
          }"
          autofocus
          placeholder="info@mynewhome.am"
        />
        <small class="text-gray-600 underline select-none">{{ t('user.info_about_otp') }}</small>
      </UFormField>
      <UButton
        type="submit"
        :loading="userState.isPasswordRequestLoading"
        :disabled="!isFormValid || userState.isPasswordRequestLoading"
        class="flex w-full items-center justify-center"
        >{{ t('continue') }}</UButton
      >
    </UForm>
  </AuthWrapper>
</template>

<script lang="ts" setup>
import type { FormErrorEvent, FormSubmitEvent } from '#ui/types';
import type { InferType } from 'yup';
import { useCustomToast } from '~/hooks/useCustomToast';
import { requestEmailSchema as schema } from '~/schema/schema';

const { t } = useI18n();
const userStore = useUserStore();
const { showToast } = useCustomToast();
const { state: userState } = storeToRefs(userStore);

const requestPasswordResetSchema = computed(() => schema(t));

type Schema = InferType<typeof requestPasswordResetSchema.value>;

const isFormValid = ref(false);
const state = reactive<Schema>({
  email: '',
});

async function onSubmit(event: FormSubmitEvent<Schema>) {
  const sent = await userStore.requestPasswordReset(event.data.email);

  if (sent) {
    userStore.setResetPassword({ email: state.email });
    userStore.setAuthMode('VERIFY_PASSWORD_RESET');
  } else {
    showToast(t('reset_password.request_error'), 'error');
  }
}

watchEffect(async () => {
  try {
    await requestPasswordResetSchema.value.validate(state, {
      abortEarly: false,
    });
    isFormValid.value = true;
  } catch {
    isFormValid.value = false;
  }
});

async function onError(event: FormErrorEvent) {
  const firstError = event.errors[0];
  if (firstError && firstError.id) {
    const element = document.getElementById(firstError.id);
    element?.focus();
    element?.scrollIntoView({ behavior: 'smooth', block: 'center' });
  }
}
</script>
