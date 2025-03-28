<template>
  <AuthWrapper>
    <UForm
      :schema="registrationSchema"
      :state="state"
      :validate-on="['blur', 'input']"
      class="space-y-4"
      @submit="onSubmit"
      @error="onError"
    >
      <UFormField
        :label="$t('user.firstName')"
        name="firstName"
        :ui="{
          error: 'text-xs',
        }"
        required
        eager-validation
      >
        <UInput
          v-model="state.firstName"
          :ui="{
            root: 'w-full',
          }"
        />
      </UFormField>
      <UFormField
        :label="$t('user.lastName')"
        name="lastName"
        :ui="{
          error: 'text-xs',
        }"
        eager-validation
      >
        <UInput
          v-model="state.lastName as string"
          :ui="{
            root: 'w-full',
          }"
        />
      </UFormField>
      <UFormField
        :label="$t('user.email')"
        name="email"
        :ui="{
          error: 'text-xs',
        }"
        required
        eager-validation
      >
        <UInput
          v-model="state.email"
          :ui="{
            root: 'w-full',
          }"
        />
      </UFormField>
      <UFormField
        :label="$t('user.username')"
        name="username"
        :ui="{
          error: 'text-xs',
        }"
        required
        eager-validation
      >
        <UInput
          v-model="state.username"
          :ui="{
            root: 'w-full',
          }"
        />
      </UFormField>
      <UFormField
        :label="$t('user.phone')"
        name="phone"
        :ui="{
          error: 'text-xs',
        }"
        eager-validation
      >
        <div class="flex w-full gap-2">
          <USelect
            v-model="state.countryCode"
            :items="countryCodes"
            :placeholder="$t('auth.code')"
            class="w-24 min-w-[80px]"
          />
          <UInput
            v-model="state.phone"
            v-mask="phoneMask"
            class="w-full"
            :ui="{
              root: 'w-full',
            }"
            :placeholder="phonePlaceholder"
          />
        </div>
      </UFormField>
      <UFormField
        :label="$t('user.password')"
        name="password"
        :ui="{
          error: 'text-xs',
        }"
        required
        eager-validation
      >
        <UInput
          v-model="state.password"
          :ui="{ root: 'w-full', trailing: 'pe-1' }"
          :type="showPassword ? 'text' : 'password'"
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
      <UButton
        type="submit"
        :loading="userState.isRequestLoading"
        :disabled="!isFormValid || userState.isRequestLoading"
        class="flex w-full items-center justify-center"
        >{{ $t('auth.registration') }}</UButton
      >
    </UForm>
  </AuthWrapper>
</template>

<script setup lang="ts">
import type { FormErrorEvent, FormSubmitEvent } from '#ui/types';
import { reactive, ref, watchEffect } from 'vue';
import type { InferType } from 'yup';
import { useCustomToast } from '~/hooks/useCustomToast';
import { registrationSchema as schema } from '~/schema/schema';
import { countryCodes, phoneNumberData } from '~/utils';

definePageMeta({
  auth: { unauthenticatedOnly: true, navigateAuthenticatedTo: '/' },
});

const { t } = useI18n();

const registrationSchema = computed(() => schema(t));

type Schema = InferType<typeof registrationSchema.value>;

const state = reactive<Schema>({
  firstName: '',
  lastName: '',
  email: '',
  username: '',
  countryCode: '+374',
  phone: '',
  password: '',
});

const showPassword = ref(false);
const isFormValid = ref(false);
const { showToast } = useCustomToast();
const userStore = useUserStore();
const { state: userState } = storeToRefs(userStore);

watchEffect(async () => {
  try {
    await registrationSchema.value.validate(state, { abortEarly: false });
    isFormValid.value = true;
  } catch {
    isFormValid.value = false;
  }
});

const phoneData = computed(() => {
  return (
    phoneNumberData[state.countryCode as '+1' | '+374' | '+7'] || {
      mask: '(##) ###-####',
      placeholder: '(##) ###-####',
    }
  );
});

const phoneMask = computed(() => phoneData.value.mask);
const phonePlaceholder = computed(() => phoneData.value.placeholder);

async function onSubmit(event: FormSubmitEvent<Schema>) {
  const { success, message } = await userStore.registration({
    ...event.data,
    phone: event.data.phone ? event.data.phone.replace(/\D/g, '') : '',
  });

  if (success) {
    showToast(t('auth.successfully_registered'), 'success');
    userStore.setAuthMode('LOGIN');
  } else {
    switch (message) {
      case 'username_already_exists':
        showToast(t('auth.errors.username_is_taken'), 'error');
        break;

      case 'email_already_exists':
        showToast(t('auth.errors.email_is_taken'), 'error');
        break;

      default:
        showToast(t('auth.errors.issue_during_registration'), 'error');
        break;
    }
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
</script>
