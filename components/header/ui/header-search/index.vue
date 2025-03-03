<template>
  <div>
    <UButton v-show="!hideButton" icon="mdi:search" label="Փնտրել" variant="outline" @click="isOpen = true" />
    <UModal v-model:open="isOpen" prevent-close>
      <template #header>
        <div class="flex w-full items-center justify-between">
          <h3 class="text-sm leading-6 font-semibold text-gray-900">Փնտրել</h3>
          <UButton variant="ghost" icon="mdi:close" class="-my-1" @click="closeModal" />
        </div>
      </template>

      <template #body>
        <div class="w-full space-y-1 text-black/65">
          <div class="flex items-center gap-2 pr-2">
            <UInput
              v-model="searchQuery"
              icon="mdi:search"
              variant="none"
              class="flex w-full items-center border-b text-black"
              placeholder="Փնտրել"
            />
            <UButton icon="mdi:filter-outline" variant="outline" @click="(router.push('/clubs'), (isOpen = false))" />
          </div>
          <div v-if="!!data?.total_items" class="p-2">
            <button
              v-for="club in data?.items"
              :key="club._id"
              class="hover:bg-secondary/10 flex w-full items-center justify-between gap-2 py-2 transition"
              @click="handleNavigate(club._id)"
            >
              <div class="flex items-center gap-2 truncate">
                <NuxtImg
                  :src="club.picture"
                  class="pointer-events-none h-14 w-[4.5rem] rounded-lg select-none"
                  :lazy="false"
                />
                <div class="flex items-center gap-1.5 text-sm tablet-max:text-xs">
                  <span v-show="club && club.title" class="flex-none truncate">{{ club?.title }}</span>
                  <span class="text-gray-400">
                    {{ club?.address }}
                  </span>
                </div>
              </div>
              <span class="hidden flex-shrink-0 gap-0.5 mobile-min-xl:inline-flex">
                <kbd
                  class="inline-flex h-5 min-w-[20px] items-center justify-center rounded bg-gray-100 px-1.5 font-sans text-[11px] font-medium text-gray-900 ring-1 ring-gray-300 ring-inset dark:text-white"
                >
                  Բաց է
                </kbd>
              </span>
            </button>

            <div class="flex w-full justify-end">
              <UPagination
                v-if="data.total_items > limit"
                v-model="page"
                :total="data?.total_items"
                :page-count="limit"
                size="xs"
                show-last
                show-first
              />
            </div>
          </div>
          <div v-else class="flex flex-col items-center justify-center gap-2 p-10">
            <Icon name="i-heroicons-magnifying-glass-20-solid" size="22" />
            <span class="text-center text-sm"> Could not find any clubs with this search query. </span>
          </div>
        </div>
      </template>
    </UModal>
  </div>
</template>

<script setup lang="ts">
import type { IHeaderSearchProps } from '~/components/header/types';
import type { TClub, TReturnItem } from '~/types';
import { mockArmenianComputerClubs } from '~/mock-data/club';

const props = defineProps<IHeaderSearchProps>();
const emit = defineEmits(['update:open']);

const isOpen = ref<boolean>(false);
const searchQuery = ref<string>('');
const limit: number = 5;
const page = ref<number>(1);

const config = useRuntimeConfig();
const router = useRouter();

const data: TReturnItem<TClub[]> = {
  items: mockArmenianComputerClubs,
  total_items: 5,
};

const handleNavigate = (id: string) => {
  router.push(`/clubs/${id}`);
  isOpen.value = false;
};

const closeModal = () => {
  if (props.hideButton) {
    emit('update:open', false);
  } else {
    isOpen.value = false;
  }
};

// const { data, status } = await useLazyAsyncData<TReturnItem<TClub[]>>(
//   'search-club',
//   () =>
//     useClubStore.fetchClubs({
//       search: searchQuery.value,
//       page: page.value,
//       limit,
//       propertyStatuses: [true],
//       updateState: false,
//     }),
//   {
//     watch: [page, searchQuery],
//   },
// );

watch(
  () => props.open,
  (newVal: boolean) => {
    isOpen.value = newVal;
  },
  { immediate: true },
);
</script>
