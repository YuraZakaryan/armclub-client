<template>
  <UButton
    :icon="props.club ? 'mdi:edit' : 'mdi:plus'"
    :label="props.club ? t('table.edit') : t('table.create')"
    color="neutral"
    :variant="props.club ? 'ghost' : 'outline'"
    :size="props.club ? 'md' : 'xs'"
    :class="{ 'px-0': props.club }"
    @click.stop="openModal"
  />

  <CustomModal
    v-model:open="modalState.isClubCrudOpen"
    :label="props.club ? $t('club.edit_club') : $t('club.create_club')"
    :close-modal="closeModal"
  >
    <UForm
      :schema="clubSchema"
      :state="stateCrud"
      :validate-on="['blur', 'input']"
      class="space-y-4"
      @submit.prevent="onSubmit"
      @error="onError"
    >
      <UFormField :label="$t('club.name')" name="name" required eager-validation>
        <UInput v-model="stateCrud.name" :ui="{ root: 'w-full' }" />
      </UFormField>
      <UFormField :label="$t('filter.region')" name="region" required eager-validation>
        <USelectMenu
          v-model="stateCrud.region"
          :items="translatedRegions as TSelectItem[]"
          :placeholder="$t('filter.choose_region')"
          class="w-full"
        />
      </UFormField>
      <UFormField
        v-if="stateCrud.region.value"
        :label="$t('filter.choose_cities', 2)"
        name="city"
        required
        eager-validation
      >
        <USelectMenu
          v-model="stateCrud.city"
          :searchable-placeholder="$t('filter.search')"
          :items="translatedCities as TSelectItem[]"
          :placeholder="$t('filter.choose_cities')"
          class="w-full"
          searchable
        />
      </UFormField>
      <UFormField :label="$t('club.address')" name="address" required eager-validation>
        <UInput v-model="stateCrud.address" :ui="{ root: 'w-full' }" />
      </UFormField>
      <UFormField :label="$t('club.info')" name="info" required eager-validation>
        <UTextarea
          v-model="stateCrud.info"
          :ui="{
            root: 'w-full',
            base: 'h-20 resize-none mobile-max-xl:h-16 placeholder:text-xs',
          }"
        />
      </UFormField>
      <UFormField :label="$t('club.picture')" required>
        <ClubImagePicker
          :picture="stateCrud.picture || ''"
          :edit-picture="editPictureState.picture"
          @update:picture="stateCrud.picture = $event"
          @update:edit-picture="editPictureState.picture = $event"
        />
      </UFormField>
      <UFormField :label="$t('club.posterPicture')">
        <ClubImagePicker
          :picture="stateCrud.posterPicture || ''"
          :edit-picture="editPictureState.posterPicture"
          @update:picture="stateCrud.posterPicture = $event"
          @update:edit-picture="editPictureState.posterPicture = $event"
        />
      </UFormField>
      <UFormField :label="$t('club.pictures')">
        <ClubImagePickerMultiple
          :pictures="stateCrud.pictures as TPicture[]"
          @update:pictures="stateCrud.pictures = $event"
        />
      </UFormField>
      <UFormField :label="$t('club.prices')" name="prices">
        <MyClubPriceList
          :prices="stateCrud.prices as TPrice[]"
          :deleted-prices-ids="deletedPricesIds as string[]"
          @update:prices="stateCrud.prices = $event"
          @update:deleted-prices-ids="deletedPricesIds = $event"
        />
      </UFormField>
      <UFormField :label="$t('club.add_coordinates')">
        <SearchMapCoordinates
          @update:latitude-map="stateCrud.latitudeMap = $event"
          @update:longitude-map="stateCrud.longitudeMap = $event"
        >
          <UFormField name="latitudeMap" eager-validation>
            <UInput
              v-model="stateCrud.latitudeMap"
              type="text"
              :ui="{ root: 'w-full' }"
              :placeholder="$t('club.coordinate_latitude')"
            >
              <template #trailing>
                <span class="flex items-center text-gray-500 dark:text-gray-400">
                  <Icon name="mdi:latitude" />
                </span>
              </template>
            </UInput>
          </UFormField>
          <UFormField name="longitudeMap" eager-validation>
            <UInput
              v-model="stateCrud.longitudeMap"
              type="text"
              :ui="{ root: 'w-full' }"
              :placeholder="$t('club.coordinate_longitude')"
            >
              <template #trailing>
                <span class="flex items-center text-gray-500 dark:text-gray-400">
                  <Icon name="mdi:longitude" />
                </span>
              </template>
            </UInput>
          </UFormField>
        </SearchMapCoordinates>
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
            v-model="stateCrud.countryCode"
            :items="countryCodes"
            :placeholder="$t('auth.code')"
            class="w-24 min-w-[80px]"
          />
          <UInput
            v-model="stateCrud.phone"
            v-mask="phoneMask"
            class="w-full"
            :ui="{
              root: 'w-full',
            }"
            :placeholder="phonePlaceholder"
          />
        </div>
      </UFormField>
      <div class="flex w-full justify-end">
        <UButton type="submit" :loading="clubState.isRequestLoading" :disabled="clubState.isRequestLoading"
          >{{ props.club ? $t('table.update') : $t('table.create') }}
        </UButton>
      </div>
    </UForm>
  </CustomModal>
</template>

<script setup lang="ts">
import { useModalStore } from '~/stores/modal';
import type { ICrudClubsProps } from '~/components/my-clubs/types';
import type { TPrice, TSelectItem } from '~/types';
import { clubSchema as schema } from '~/schema/schema';
import CustomModal from '~/components/wrapper/custom-modal.vue';
import type { TPicture } from '~/components/types';
import type { InferType } from 'yup';
import { UButton } from '#components';
import { cities, countryCodes, phoneNumberData } from '~/utils';
import SearchMapCoordinates from '~/components/my-clubs/ui/search-map-coordinates.vue';
import ClubImagePicker from '~/components/my-clubs/ui/club-image-picker.vue';
import ClubImagePickerMultiple from '~/components/my-clubs/ui/club-image-picker-multiple.vue';
import type { FormErrorEvent, FormSubmitEvent } from '#ui/types';
import { useCustomToast } from '~/hooks/useCustomToast';
import MyClubPriceList from '~/components/my-clubs/features/my-club-price-list.vue';

const props = defineProps<ICrudClubsProps>();
const modalStore = useModalStore();
const clubStore = useClubStore();
const { t } = useI18n();
const { showToast } = useCustomToast();

const { state: modalState } = storeToRefs(modalStore);
const { state: clubState } = storeToRefs(clubStore);

const clubSchema = computed(() => schema(t));

type Schema = InferType<typeof clubSchema.value>;

const events = ['dragenter', 'dragleave', 'dragover', 'drop'];

onMounted(() => {
  events.forEach((event) => document.body.addEventListener(event, (e) => e.preventDefault()));
});

onUnmounted(() => {
  events.forEach((event) => document.body.removeEventListener(event, (e) => e.preventDefault()));
});

const defaultRegion: TSelectItem = { label: '', value: '' };
const defaultCity: TSelectItem = { label: '', value: '' };

const deletedPricesIds = ref<string[]>([]);

const editPictureState = ref<{ picture: boolean; posterPicture: boolean }>({
  picture: !props.club?.picture,
  posterPicture: !props.club?.posterPicture,
});

const stateCrud = ref<Schema & { pictures: TPicture[] }>({
  name: props?.club?.name || '',
  address: props?.club?.address || '',
  info: props?.club?.info || '',
  additionalInfo: props?.club?.additionalInfo || '',
  countryCode: props?.club?.countryCode || '',
  phone: props?.club?.phone || '',
  region: props.club
    ? ({ label: t(`cities.${props.club.region}`), value: props.club.region } as TSelectItem)
    : defaultRegion,
  city: props.club ? ({ label: t(`cities.${props.club.city}`), value: props.club.city } as TSelectItem) : defaultCity,
  latitudeMap: props?.club?.latitudeMap || '',
  longitudeMap: props?.club?.longitudeMap || '',
  isChildAllowed: false,
  picture: props?.club?.picture || null,
  posterPicture: props?.club?.posterPicture || null,
  pictures: props?.club?.pictures || [],
  prices: props?.club?.prices || [],
});

const phoneData = computed(() => {
  return (
    phoneNumberData[stateCrud.value.countryCode as '+1' | '+374' | '+7'] || {
      mask: '(##) ###-####',
      placeholder: '(##) ###-####',
    }
  );
});

const phoneMask = computed(() => phoneData.value.mask);
const phonePlaceholder = computed(() => phoneData.value.placeholder);

const translatedRegions = computed(() =>
  Object.keys(cities).map(
    (regionKey) =>
      ({
        label: t(`cities.${regionKey}`),
        value: regionKey,
      }) as TSelectItem,
  ),
);

const translatedCities = computed(() => {
  const regionKey = stateCrud.value.region.value as string;
  if (regionKey && cities[regionKey]) {
    return cities[regionKey].map(
      (cityKey) =>
        ({
          label: t(`cities.${cityKey}`),
          value: cityKey,
        }) as TSelectItem,
    );
  }
  return [];
});

const openModal = (): void => {
  modalStore.openModal('club');
};

const closeModal = (): void => {
  modalStore.closeModal('club');
};

const onSubmit = async (event: FormSubmitEvent<Schema>) => {
  if (props.club) {
    const updated = await clubStore.update({
      ...event.data,
      picture: stateCrud.value.picture?.includes('webp') ? null : stateCrud.value.picture,
      posterPicture: stateCrud.value.posterPicture?.includes('webp') ? null : stateCrud.value.posterPicture,
      priceDeleteIds: deletedPricesIds.value,
      prices: stateCrud.value.prices,
      clubId: props.club._id,
    });

    if (updated) {
      showToast(t('club.success_update_message'), 'success');
      modalStore.closeModal('club');

      await props.refresh();
    } else {
      showToast(t('club.crud_errors.error_update_message'), 'error');
    }
  } else {
    const created = await clubStore.create(event.data);

    if (created) {
      showToast(t('club.success_create_message'), 'success');
      modalStore.closeModal('club');

      await props.refresh();
    } else {
      showToast(t('club.crud_errors.error_create_message'), 'error');
    }
  }
};

async function onError(event: FormErrorEvent) {
  const firstError = event.errors[0];
  if (firstError && firstError.id) {
    const element = document.getElementById(firstError.id);
    element?.focus();
    element?.scrollIntoView({ behavior: 'smooth', block: 'center' });
  }
}

watch(
  () => stateCrud.value.region.value,
  (newRegion) => {
    if (newRegion) {
      const citiesForRegion = cities[newRegion] || [];
      if (citiesForRegion.length > 0) {
        const firstCity = citiesForRegion[0];
        stateCrud.value.city = {
          label: t(`cities.${firstCity}`),
          value: firstCity,
        };
      } else {
        stateCrud.value.city = defaultCity;
      }
    }
  },
);
</script>
