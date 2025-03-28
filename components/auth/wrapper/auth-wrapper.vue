<template>
  <div class="flex w-full flex-col gap-4">
    <slot />
    <UButton variant="outline" block icon="mdi:google" @click="signInWithGoogle">{{
      $t('auth.sign_in_with_google')
    }}</UButton>
    <UButton
      class="block w-full"
      color="neutral"
      variant="outline"
      @click="setAuthMode(state.authMode === 'LOGIN' ? 'REGISTRATION' : 'LOGIN')"
    >
      {{ state.authMode === 'LOGIN' ? $t('auth.do_not_have_account') : $t('auth.have_an_account') }}
    </UButton>
  </div>
</template>

<script lang="ts" setup>
const store = useUserStore();
const { setAuthMode } = store;
const { signIn } = useAuth();

const { state } = storeToRefs(store);

const signInWithGoogle = async () => {
  try {
    await signIn('google', { callbackUrl: '/' });
  } catch (error) {
    console.error('Error signing in with Google:', error);
  }
};
</script>
