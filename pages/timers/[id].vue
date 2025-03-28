<template>
  <MyClubSection>
    <UCard
      class="w-full"
      :ui="{
        body: '!p-0',
      }"
    >
      <template #header>
        <MyClubHeader :title="$t('timer.label')" />
      </template>
      <div class="flex items-center justify-end gap-1.5 px-4 py-3">
        <UDropdownMenu
          :items="
            table?.tableApi
              ?.getAllColumns()
              .filter((column) => column.getCanHide())
              .map((column) => ({
                label: String(column.columnDef.header) || '',
                type: 'checkbox' as const,
                checked: column.getIsVisible(),
                onUpdateChecked(checked: boolean) {
                  table?.tableApi?.getColumn(column.id)?.toggleVisibility(checked);
                },
                onSelect(e?: Event) {
                  e?.preventDefault();
                },
              }))
          "
          :content="{ align: 'end' }"
          size="xs"
        >
          <UButton
            :label="$t('table.columns')"
            color="neutral"
            variant="outline"
            trailing-icon="i-lucide-chevron-down"
          />
        </UDropdownMenu>
      </div>
      <UTable
        ref="table"
        v-model:column-visibility="columnVisibility"
        :data="mockData"
        :columns="columns"
        :loading="status === 'pending'"
        :ui="{
          th: 'bg-white text-center text-primary z-1',
          td: 'bg-white text-center truncate max-w-[250px]',
        }"
        class="flex-1"
      >
        <template #loading>
          <div class="flex flex-col items-center gap-3">
            <Icon name="mdi:counterclockwise-arrows" size="26" />
            <span>{{ $t('table.loading') }}</span>
          </div>
        </template>
        <template #empty>
          <div class="flex flex-col items-center gap-3">
            <Icon name="mdi:database-outline" size="26" />
            <span>{{ $t('table.no_data_available') }}</span>
          </div>
        </template>
      </UTable>
    </UCard>
  </MyClubSection>
</template>

<script setup lang="ts">
import MyClubSection from '~/components/my-clubs/wrapper/my-club-section.vue';
import type { ICustomTableColumn, TReturnItem, TTimer, TTimerValues } from '~/types';
import { useTimerStore } from '~/stores/timer';
import MyClubHeader from '~/components/my-clubs/wrapper/my-club-header.vue';
import { Icon, UButton, UProgress, UTooltip } from '#components';

const { t } = useI18n();

useHead({
  title: t('timer.label'),
  meta: [
    {
      name: 'robots',
      content: 'noindex, nofollow',
    },
  ],
});

definePageMeta({
  validate: async (route) => {
    return typeof route.params.id === 'string' && /^[a-zA-Z0-9]+$/.test(route.params.id);
  },
});

const route = useRoute();
const timerStore = useTimerStore();
const table = useTemplateRef('table');

const columnVisibility = ref({
  _id: false,
  createdAt: false,
  updatedAt: false,
});
const timerValues = ref<Record<string, TTimerValues>>({});

let intervalId: NodeJS.Timeout | null = null;
onMounted(() => {
  DateService.updateTimerValues(timerValues, mockData);
  intervalId = setInterval(() => {
    DateService.updateTimerValues(timerValues, mockData);
  }, 1000);
});

onUnmounted(() => {
  if (intervalId) {
    clearInterval(intervalId);
  }
});

const columns = computed<ICustomTableColumn<TTimer>[]>(() => [
  {
    accessorKey: '_id',
    header: t('table.id'),
  },
  {
    accessorKey: 'name',
    header: t('timer.name'),
  },
  {
    accessorKey: 'start',
    header: t('timer.start'),
    cell: ({ row }) => {
      const startTime = row.getValue('start') as string;
      return h(UTooltip, { text: DateService.convertMomentDateToMinutes(startTime) || '--:--:--' }, () =>
        h('span', DateService.convertMomentDateToMinutes(startTime) || '--:--:--'),
      );
    },
  },
  {
    accessorKey: 'allocatedTime',
    header: t('timer.allocated_time'),
    cell: ({ row }) => {
      const time = row.getValue('allocatedTime') as number;
      return h(UTooltip, { text: DateService.minutesToTimeString(time, 0, false) || '--:--:--' }, () =>
        h('span', DateService.minutesToTimeString(time, 0, false) || '--:--:--'),
      );
    },
  },
  {
    id: 'progress',
    header: t('timer.progress'),
    cell: ({ row }) => {
      const id = row.original._id;
      const progress = timerValues.value[id]?.progress || 0;

      return h(UProgress, {
        modelValue: progress,
        color: 'success',
        size: 'sm',
        min: 0,
        max: 100,
        status: true,
      });
    },
  },
  {
    id: 'passed',
    header: t('timer.passed'),
    cell: ({ row }) => {
      const id = row.original._id;
      const formattedPassed = timerValues.value[id]?.passed || '--:--:--';
      return h(UTooltip, { text: formattedPassed }, () => h('span', formattedPassed));
    },
  },
  {
    id: 'remaining',
    header: t('timer.remaining'),
    cell: ({ row }) => {
      const id = row.original._id;
      const formattedRemaining = timerValues.value[id]?.remaining || '--:--:--';
      return h(UTooltip, { text: formattedRemaining }, () => h('span', formattedRemaining));
    },
  },
  {
    accessorKey: 'end',
    header: t('timer.end'),
    cell: ({ row }) => {
      const endTime = row.getValue('end') as string;
      return h(UTooltip, { text: DateService.convertMomentDateToMinutes(endTime) || '--:--:--' }, () =>
        h('span', DateService.convertMomentDateToMinutes(endTime) || '--:--:--'),
      );
    },
  },
  {
    accessorKey: 'price',
    header: t('timer.price'),
    cell: ({ row }) => {
      const price = row.getValue('price') as number;
      return h(UTooltip, { text: ClubService.formattedPrice(price) || '--:--:--' }, () =>
        h('span', ClubService.formattedPrice(price) || '--:--:--'),
      );
    },
  },
  {
    accessorKey: 'updatedAt',
    header: t('table.updatedAt'),
    headerLabel: t('table.updatedAt'),
    cell: ({ row }) => {
      const date = row.getValue('updatedAt') as string;
      return h(UTooltip, { text: DateService.formatDate(date).dateWithTime || t('table.n/a') }, () =>
        h('span', DateService.formatDate(date).date || t('table.n/a')),
      );
    },
  },
  {
    accessorKey: 'createdAt',
    header: t('table.createdAt'),
    headerLabel: t('table.createdAt'),
    cell: ({ row }) => {
      const date = row.getValue('createdAt') as string;
      return h(UTooltip, { text: DateService.formatDate(date).dateWithTime || t('table.n/a') }, () =>
        h('span', DateService.formatDate(date).date || t('table.n/a')),
      );
    },
  },
]);

const mockData: TTimer[] = [
  {
    _id: '507f1f77bcf86cd799439011',
    index: 1,
    name: 'Morning Session',
    allocatedTime: 120,
    isInfinite: false,
    start: '2025-03-28T08:37:36Z',
    end: '2025-03-28T10:37:36Z',
    isActive: true,
    paused: false,
    price: 1000,
    waitingCount: 0,
    manuallyStopped: false,
    pausePeriods: [],
    club: '507f1f77bcf86cd799439012',
    author: '507f1f77bcf86cd799439013',
    createdAt: '2025-03-26T07:50:00Z',
    updatedAt: '2025-03-26T08:07:00Z',
  },
  {
    _id: '507f1f77bcf86cd799439016',
    name: 'Infinite Timer',
    allocatedTime: 0,
    isInfinite: true,
    start: '2025-03-28T08:37:36Z',
    end: '',
    isActive: true,
    paused: false,
    price: 800,
    waitingCount: null,
    manuallyStopped: false,
    pausePeriods: [],
    club: '507f1f77bcf86cd799439017',
    author: '507f1f77bcf86cd799439013',
    createdAt: '2025-03-26T09:50:00Z',
    updatedAt: '2025-03-26T10:35:00Z',
  },
];

const { data, status } = await useLazyAsyncData<TReturnItem<TTimer[]>>(
  'timers',
  () =>
    timerStore.fetchTimers({
      clubId: route.params.id as string,
    }),
  {
    default: () => ({
      total_items: 0,
      items: [],
    }),
  },
);
</script>
