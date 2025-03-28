<template>
  <AuthWrapper>
    <UForm :state="state" class="space-y-4" @submit="onSubmit">
      <UFormField :label="$t('auth.username_email')" name="login">
        <UInput
          v-model="state.login"
          :ui="{
            root: 'w-full',
          }"
          autofocus
        />
      </UFormField>

      <div class="space-y-1">
        <UFormField :label="$t('user.password')" name="password">
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

        <UButton variant="ghost" @click="userStore.setAuthMode('REQUEST_PASSWORD_RESET')">{{
          $t('auth.forgot_password')
        }}</UButton>
      </div>

      <UButton
        type="submit"
        :loading="isRequestLoading"
        :disabled="isEmpty || isRequestLoading"
        class="flex w-full items-center justify-center"
      >
        {{ $t('auth.login') }}
      </UButton>
    </UForm>
  </AuthWrapper>
</template>

<script setup lang="ts">
import type { FormSubmitEvent } from '#ui/types';
import { reactive, ref } from 'vue';
import { useCustomToast } from '~/hooks/useCustomToast';
import type { TAuthCredential, TLoginPayload } from '../types';
import AuthWrapper from './../wrapper/auth-wrapper.vue';

definePageMeta({
  auth: { unauthenticatedOnly: true, navigateAuthenticatedTo: '/' },
});

const userStore = useUserStore();
const { showToast } = useCustomToast();
const { t } = useI18n();
const { signIn } = useAuth();
const isRequestLoading = ref<boolean>(false);

const showPassword = ref(false);
const state = reactive<TLoginPayload>({
  login: '',
  password: '',
});

const isEmpty = computed(() => !state.login || !state.password);

const onSubmit = async (event: FormSubmitEvent<TLoginPayload>) => {
  event.preventDefault();
  isRequestLoading.value = true;

  const response = (await signIn('credentials', {
    ...event.data,
    redirect: false,
  })) as TAuthCredential;

  if (response?.error) {
    if (response.error === 'CredentialsSignin') {
      showToast(t('auth.errors.credentials_error'), 'error');
    } else {
      showToast(t('auth.errors.sign_in_error'), 'error');
    }
  } else {
    showToast(t('auth.successfully_logged_in'), 'success');
  }

  isRequestLoading.value = false;
};
</script>
