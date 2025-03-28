<template>
  <div class="my-auto dark:bg-gray-900">
    <Loader v-if="!isClientLoaded" />
    <div v-else class="mx-auto flex gap-4">
      <div class="mx-auto h-fit w-full self-center rounded-xl p-4 shadow-2xl dark:bg-gray-800/40">
        <!-- information -->
        <div class="border-secondary mb-4 rounded-md border-l-4 bg-blue-50 p-4">
          <p class="text-sm text-blue-800">
            <span class="text-red-500">* </span>
            <strong>{{ $t('profile.attention') }}</strong>
            {{ $t('profile.info_text') }}
          </p>
        </div>
        <div class="text-black">
          <h1 class="xs:text-xl mb-2 font-serif font-extrabold sm:text-xl md:text-2xl lg:text-3xl">
            {{ $t('profile.label') }}
          </h1>
          <UForm :schema="profileSchema" :state="state" :validate-on="['blur', 'input']" @submit.prevent="onSubmit">
            <section
              class="flex w-full items-center justify-center rounded-sm bg-[url('https://images.unsplash.com/photo-1449844908441-8829872d2607?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w0NzEyNjZ8MHwxfHNlYXJjaHw2fHxob21lfGVufDB8MHx8fDE3MTA0MDE1NDZ8MA&ixlib=rb-4.0.3&q=80&w=1080')] bg-cover bg-center bg-no-repeat p-2"
            >
              <div class="rounded-full bg-black/40 p-5">
                <Icon name="ep:avatar" class="text-secondary" size="75" />
              </div>
            </section>
            <section class="flex flex-col gap-3 py-3">
              <div class="flex items-start gap-3 tablet-max:flex-col">
                <UFormField
                  v-model="state.firstName"
                  :label="$t('user.firstName')"
                  name="firstName"
                  class="w-full"
                  :ui="{
                    error: 'text-xs',
                  }"
                  required
                >
                  <UInput
                    v-model="state.firstName"
                    :label="$t('user.firstName')"
                    :ui="{
                      root: 'w-full',
                    }"
                    size="xl"
                  />
                </UFormField>
                <UFormField
                  v-model="state.lastName"
                  :ui="{
                    error: 'text-xs',
                  }"
                  :label="$t('user.lastName')"
                  name="lastName"
                  class="w-full"
                >
                  <UInput
                    v-model="state.lastName as string"
                    :label="$t('user.lastName')"
                    :ui="{
                      root: 'w-full',
                    }"
                    size="xl"
                  />
                </UFormField>
              </div>
              <div class="flex items-start gap-3 tablet-max:flex-col">
                <UFormField
                  v-model="state.username"
                  :label="$t('user.username')"
                  name="username"
                  class="w-full"
                  :ui="{
                    error: 'text-xs',
                  }"
                  required
                >
                  <UInput
                    v-model="state.username"
                    :label="$t('user.username')"
                    :ui="{
                      root: 'w-full',
                    }"
                    size="xl"
                  />
                </UFormField>
                <UFormField
                  v-model="state.email"
                  :ui="{
                    error: 'text-xs',
                  }"
                  :label="$t('user.email')"
                  name="email"
                  class="w-full"
                  required
                >
                  <UInput
                    v-model="state.email"
                    :label="$t('user.email')"
                    :ui="{
                      root: 'w-full',
                    }"
                    size="xl"
                  />
                </UFormField>
              </div>
              <div class="flex items-end gap-3 tablet-max:flex-col">
                <UFormField
                  v-model="state.phone"
                  :label="$t('user.phone')"
                  name="phone"
                  class="w-full"
                  :ui="{
                    error: 'text-xs',
                  }"
                >
                  <div class="flex h-full w-full gap-2">
                    <USelect
                      v-model="state.countryCode"
                      :items="countryCodes"
                      :placeholder="$t('auth.code')"
                      size="xl"
                      class="min-w-[100px]"
                    />
                    <client-only>
                      <UInput
                        v-model="state.phone"
                        v-mask="phoneMask"
                        :label="$t('user.phone')"
                        :placeholder="phonePlaceholder"
                        size="xl"
                        class="w-full"
                      />
                    </client-only>
                  </div>
                </UFormField>
                <UAlert
                  variant="outline"
                  orientation="horizontal"
                  :icon="data?.activated ? 'mdi:check' : ''"
                  :description="
                    data?.activated
                      ? $t('profile.your_account_activated')
                      : $t('profile.your_account_not_yet_activated')
                  "
                  :color="data?.activated ? 'success' : 'error'"
                  :ui="{
                    root: data?.activated ? 'py-3' : 'py-2 px-0 pr-3',
                    wrapper: !data?.activated ? 'px-3' : '',
                    description: 'font-semibold',
                  }"
                  :actions="
                    data?.activated
                      ? []
                      : [
                          {
                            label: $t('profile.activate'),
                            onClick: handleOpenActivationModal,
                          },
                        ]
                  "
                />
              </div>
              <UButton
                type="submit"
                :loading="userState.isRequestLoading"
                :disabled="!isFormValid || userState.isRequestLoading"
                class="self-end"
                >{{ $t('table.update') }}</UButton
              >
            </section>
          </UForm>

          <UForm
            :schema="data?.password ? passwordSchema : createPasswordSchema"
            :state="passwordState"
            :validate-on="['blur', 'input']"
            @submit.prevent="onSubmitPassword"
          >
            <div class="flex flex-col gap-3">
              <div class="flex items-start gap-3 tablet-max:flex-col">
                <UFormField
                  v-model="passwordState.oldPassword"
                  :label="$t('profile.old_password')"
                  name="oldPassword"
                  :ui="{
                    error: 'text-xs',
                  }"
                  class="w-full"
                  :class="{ 'opacity-40': !data?.password }"
                >
                  <UInput
                    v-model="passwordState.oldPassword"
                    size="xl"
                    :disabled="!data?.password || false"
                    :ui="{ root: 'w-full', trailing: 'pe-1' }"
                    :type="showOldPassword ? 'text' : 'password'"
                  >
                    <template #trailing>
                      <UButton
                        v-if="data?.password || false"
                        color="neutral"
                        variant="link"
                        size="sm"
                        :icon="showOldPassword ? 'i-lucide-eye-off' : 'i-lucide-eye'"
                        aria-label="show ? 'Hide password' : 'Show password'"
                        :aria-pressed="showOldPassword"
                        aria-controls="password"
                        @click.stop="showOldPassword = !showOldPassword"
                      />
                    </template>
                  </UInput>
                </UFormField>
                <UFormField
                  v-model="passwordState.newPassword"
                  :label="$t('profile.new_password')"
                  name="newPassword"
                  :ui="{
                    error: 'text-xs',
                  }"
                  class="w-full"
                >
                  <UInput
                    v-model="passwordState.newPassword"
                    size="xl"
                    :ui="{ root: 'w-full', trailing: 'pe-1' }"
                    :type="showNewPassword ? 'text' : 'password'"
                  >
                    <template #trailing>
                      <UButton
                        color="neutral"
                        variant="link"
                        size="sm"
                        :icon="showNewPassword ? 'i-lucide-eye-off' : 'i-lucide-eye'"
                        aria-label="show ? 'Hide password' : 'Show password'"
                        :aria-pressed="showNewPassword"
                        aria-controls="password"
                        @click.stop="showNewPassword = !showNewPassword"
                      />
                    </template>
                  </UInput>
                </UFormField>
              </div>
              <UButton
                type="submit"
                :loading="userState.isPasswordRequestLoading"
                :disabled="!isPasswordFormValid || userState.isPasswordRequestLoading"
                class="self-end"
                >{{ $t(data?.password ? 'profile.update_password' : 'profile.create_password') }}</UButton
              >
            </div>
          </UForm>
          <ProfileUiActivationModal :refresh="refresh" />
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts" setup>
import type { FormSubmitEvent } from '#ui/types';
import type { InferType } from 'yup';
import { useCustomToast } from '~/hooks/useCustomToast';
import { updatePasswordSchema, updateProfileSchema, setPasswordSchema } from '~/schema/schema';
import { countryCodes, phoneNumberData } from '~/utils';
import Loader from './../components/ui/loader.vue';
import { useModalStore } from '~/stores/modal';

const modalStore = useModalStore();
const userStore = useUserStore();
const { showToast } = useCustomToast();
const { t } = useI18n();

const handleOpenActivationModal = () => {
  modalStore.openModal('activation');
};

useHead({
  title: t('profile.label'),
  meta: [
    {
      name: 'robots',
      content: 'noindex, nofollow',
    },
  ],
});

const { state: userState } = storeToRefs(userStore);
const isClientLoaded = ref(false);

const { data, status, refresh } = await useLazyAsyncData('profile', () => userStore.fetchProfile());

const profileSchema = computed(() => updateProfileSchema(t));
const passwordSchema = computed(() => updatePasswordSchema(t));
const createPasswordSchema = computed(() => setPasswordSchema(t));

type profileSchema = InferType<typeof profileSchema.value>;
type passwordSchema = InferType<typeof passwordSchema.value>;

const state = reactive<profileSchema>({
  firstName: '',
  lastName: '',
  username: '',
  email: '',
  countryCode: '+374',
  phone: '',
});

if (status.value === 'success' && data.value) {
  state.firstName = data.value.firstName || '';
  state.lastName = data.value.lastName || '';
  state.username = data.value.username || '';
  state.email = data.value.email || '';
  state.countryCode = data.value.countryCode || '+374';
  state.phone = data.value.phone || '';
}

const showOldPassword = ref(false);
const showNewPassword = ref(false);
const passwordState = reactive<passwordSchema>({
  oldPassword: '',
  newPassword: '',
});

const isFormValid = ref<boolean>(false);
const isPasswordFormValid = ref<boolean>(false);

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

const onSubmit = async (event: FormSubmitEvent<profileSchema>) => {
  const updated = await userStore.updateProfile({
    ...event.data,
    phone: event.data.phone ? event.data.phone.replace(/\D/g, '') : '',
  });

  if (updated) {
    showToast(t('user.success_update_message'), 'success');
  } else {
    showToast(t('user.error_update_message'), 'error');
  }
};

const onSubmitPassword = async (event: FormSubmitEvent<passwordSchema>) => {
  if (data?.value?.password) {
    const updated = await userStore.updatePassword(event.data);

    if (updated) {
      showToast(t('profile.success_update_password_message'), 'success');

      await refresh();
      passwordState.oldPassword = '';
      passwordState.newPassword = '';
    } else {
      showToast(t('profile.error_update_password_message'), 'error');
    }
  } else {
    const created = await userStore.createNewPassword(event.data);

    if (created) {
      showToast(t('profile.success_create_password_message'), 'success');

      await refresh();
      passwordState.oldPassword = '';
      passwordState.newPassword = '';
    } else {
      showToast(t('profile.error_create_password_message'), 'error');
    }
  }
};

onMounted(() => {
  isClientLoaded.value = true;
});

watch(
  () => data.value,
  (newData) => {
    if (newData) {
      state.firstName = newData.firstName || '';
      state.lastName = newData.lastName || '';
      state.username = newData.username || '';
      state.email = newData.email || '';
      state.countryCode = newData.countryCode || '+374';
      state.phone = newData.phone || '';
    }
  },
  { immediate: true },
);

watchEffect(async () => {
  try {
    await profileSchema.value.validate(state, { abortEarly: false });
    isFormValid.value = true;
  } catch {
    isFormValid.value = false;
  }
});

watchEffect(async () => {
  try {
    await passwordSchema.value.validate(passwordState, { abortEarly: false });
    isPasswordFormValid.value = true;
  } catch {
    isPasswordFormValid.value = false;
  }
});

watchEffect(async () => {
  try {
    await createPasswordSchema.value.validate(passwordState, { abortEarly: false });
    isPasswordFormValid.value = true;
  } catch {
    isPasswordFormValid.value = false;
  }
});
</script>
