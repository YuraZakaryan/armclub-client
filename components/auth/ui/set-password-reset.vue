<template>
  <AuthWrapper>
    <UForm :schema="setPasswordResetSchema" :state="state" class="space-y-4" @error="onError" @submit="onSubmit">
      <UFormField :label="$t('profile.new_password')" name="password" required eager-validation>
        <UInput
          v-model="state.password"
          :type="showPassword ? 'text' : 'password'"
          :ui="{ root: 'w-full', trailing: 'pe-1' }"
        >
          <template #trailing>
            <UButton
              color="neutral"
              variant="link"
              size="sm"
              :icon="showPassword ? 'i-lucide-eye-off' : 'i-lucide-eye'"
              aria-label="show ? 'Hide password' : 'Show password'"
              :aria-pressed="showPassword"
              aria-controls="password"
              @click.stop="showPassword = !showPassword"
            />
          </template>
        </UInput>
      </UFormField>
      <UFormField :label="$t('profile.re_password')" name="rePassword" required eager-validation>
        <UInput
          v-model="state.rePassword"
          :ui="{ root: 'w-full', trailing: 'pe-1' }"
          :type="showRePassword ? 'text' : 'password'"
        >
          <template #trailing>
            <UButton
              color="neutral"
              variant="link"
              size="sm"
              :icon="showRePassword ? 'i-lucide-eye-off' : 'i-lucide-eye'"
              aria-label="show ? 'Hide password' : 'Show password'"
              :aria-pressed="showRePassword"
              aria-controls="password"
              @click.stop="showRePassword = !showRePassword"
            />
          </template>
        </UInput>
        <small class="text-gray-600 select-none"
          >{{ t('reset_password.info_change_password_first') }}
          <span class="text-blue-500 underline">{{ userState.resetPassword.email }}</span>
          {{ t('reset_password.info_change_password_second') }}</small
        >
      </UFormField>
      <UButton
        type="submit"
        :loading="userState.isRequestLoading"
        :disabled="!isFormValid || userState.isRequestLoading"
        class="flex w-full items-center justify-center"
        >{{ t('reset_password.change_current_password') }}</UButton
      >
    </UForm>
  </AuthWrapper>
</template>

<script lang="ts" setup>
import type { FormErrorEvent, FormSubmitEvent } from '#ui/types';
import type { InferType } from 'yup';
import { useCustomToast } from '~/hooks/useCustomToast';
import { setPasswordResetSchema as schema } from '~/schema/schema';

const { t } = useI18n();
const userStore = useUserStore();
const { showToast } = useCustomToast();

const { state: userState } = storeToRefs(userStore);

const setPasswordResetSchema = computed(() => schema(t));

type Schema = InferType<typeof setPasswordResetSchema.value>;

const showPassword = ref(false);
const showRePassword = ref(false);

const isFormValid = ref(false);
const state = reactive<Schema>({
  password: '',
  rePassword: '',
});

async function onSubmit(event: FormSubmitEvent<Schema>) {
  if (!userState.value.resetPassword.email) {
    showToast(t('reset_password.issue_while_changing'), 'error');
  }

  const updated = await userStore.resetPassword(event.data.password);

  if (updated) {
    userStore.setAuthMode('LOGIN');
    showToast(t('reset_password.success_changing_password'), 'success');
  } else {
    showToast(t('reset_password.issue_while_changing'), 'success');
  }
}

watchEffect(async () => {
  try {
    await setPasswordResetSchema.value.validate(state, {
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
