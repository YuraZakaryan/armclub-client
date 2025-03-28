<template>
  <UForm :schema="requestAccountActivationSchema" :state="state" class="space-y-4" @error="onError" @submit="onSubmit">
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
      :loading="userState.isActivationRequestLoading"
      :disabled="!isFormValid || userState.isActivationRequestLoading"
      class="flex w-full items-center justify-center"
      >{{ t('continue') }}</UButton
    >
  </UForm>
</template>

<script lang="ts" setup>
import type { FormErrorEvent, FormSubmitEvent } from '#ui/types';
import type { InferType } from 'yup';
import { useCustomToast } from '~/hooks/useCustomToast';
import { requestEmailSchema as schema } from '~/schema/schema';

const { t } = useI18n();
const userStore = useUserStore();
const sessionStore = useSessionStore();
const requestAccountActivationSchema = computed(() => schema(t));

const { showToast } = useCustomToast();
const { state: userState } = storeToRefs(userStore);
const { localSession } = storeToRefs(sessionStore);

type Schema = InferType<typeof requestAccountActivationSchema.value>;

const isFormValid = ref(false);
const state = reactive<Schema>({
  email: '',
});

async function onSubmit(event: FormSubmitEvent<Schema>) {
  const sent = await userStore.requestAccountActivation(event.data.email);

  if (sent) {
    userStore.setActivationAccount({ email: state.email });
    userStore.setActivationMode('VERIFY_ACTIVATION_PASSWORD');
  } else {
    showToast(t('user.request_error'), 'error');
  }
}

async function onError(event: FormErrorEvent) {
  const firstError = event.errors[0];
  if (firstError && firstError.id) {
    const element = document.getElementById(firstError.id);
    element?.focus();
    element?.scrollIntoView({ behavior: 'smooth', block: 'center' });
  }
}

watchEffect(async () => {
  try {
    await requestAccountActivationSchema.value.validate(state, {
      abortEarly: false,
    });
    isFormValid.value = true;
  } catch {
    isFormValid.value = false;
  }
});

watch(
  () => localSession?.value?.user,
  (newData) => {
    if (newData) {
      state.email = newData.email || '';
    }
  },
  { immediate: true },
);
</script>
