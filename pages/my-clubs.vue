<template>
  <MyClubSection>
    <UCard
      class="w-full"
      :ui="{
        body: '!p-0',
      }"
    >
      <template #header>
        <MyClubHeader :title="$t('club.my_clubs')" />
      </template>
      <div class="flex items-center justify-between gap-3 px-4 py-3">
        <UInput v-model="searchQuery" icon="mdi:search" :placeholder="$t('table.search')" size="sm" />
      </div>
      <!-- Header and Action buttons -->
      <div class="flex w-full items-center justify-between px-4 py-3">
        <div class="flex items-center gap-1.5">
          <span class="text-sm leading-5">{{ $t('table.lines_per_page') }}:</span>

          <USelect v-model="limit" :items="[3, 5, 10, 20, 30, 40]" class="me-2 w-20" size="xs" />
        </div>

        <div class="flex items-center gap-1.5">
          <CrudClub :refresh="refresh" />
          <UDropdownMenu
            :items="
              table?.tableApi
                ?.getAllColumns()
                .filter((column) => column.getCanHide())
                .map((column) => ({
                  label: (column.columnDef as ICustomTableColumn<TClub>).headerLabel || '',
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
              size="xs"
              trailing-icon="i-lucide-chevron-down"
            />
          </UDropdownMenu>

          <UButton icon="mdi:funnel-outline" size="xs" :disabled="searchQuery === ''" @click="resetFilters">
            {{ $t('table.reset') }}
          </UButton>
        </div>
      </div>
      <UTable
        ref="table"
        v-model:sort="sort"
        v-model:column-pinning="columnPinning"
        v-model:column-visibility="columnVisibility"
        :data="data.items"
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
        <template #view-cell="{ row }">
          <UButton
            icon="mdi:timer-outline"
            color="neutral"
            variant="ghost"
            @click="navigateTimer(row.getValue('_id'))"
          />
        </template>
        <template #action-cell="{ row }">
          <UDropdownMenu :items="getDropdownActions(row.original)">
            <UButton icon="i-lucide-ellipsis-vertical" color="neutral" variant="ghost" />

            <template #edit>
              <CrudClub :club="row.original" :refresh="refresh" />
            </template>
          </UDropdownMenu>
        </template>
        <template #action-header>
          <span />
        </template>
      </UTable>
      <template v-if="status == 'success' && data.total_items > limit" #footer>
        <div class="flex w-full justify-end">
          <UPagination v-model="page" :total="data.total_items" :page-count="limit" size="xs" show-last show-first />
        </div>
      </template>
    </UCard>
  </MyClubSection>
</template>

<script setup lang="ts">
import MyClubSection from '~/components/my-clubs/wrapper/my-club-section.vue';
import MyClubHeader from '~/components/my-clubs/wrapper/my-club-header.vue';
import type { ICustomTableColumn, TClub, TRating, TReturnItem, TSort, TTimer } from '~/types';
import type { DropdownMenuItem } from '#ui/components/DropdownMenu.vue';
import { Icon, UButton, UTooltip } from '#components';
import { TableService } from '~/utils/tableService';
import CrudClub from '~/components/my-clubs/ui/crud-club.vue';

const clubStore = useClubStore();
const { t } = useI18n();
const router = useRouter();
const table = useTemplateRef('table');

useHead({
  title: t('club.my_clubs'),
  meta: [
    {
      name: 'robots',
      content: 'noindex, nofollow',
    },
  ],
});

const searchQuery = ref<string>('');
const sort = ref<TSort>({ column: 'createdAt', direction: 'desc' as const });
const page = ref<number>(1);
const limit = ref<number>(10);

const resetFilters = () => {
  searchQuery.value = '';
};

const columnPinning = ref({
  left: ['view'],
  right: ['action'],
});

const navigateTimer = (clubId: string) => {
  router.push(`timers/${clubId}`);
};

const columns = computed<ICustomTableColumn<TClub>[]>(() => [
  {
    accessorKey: '_id',
    header: t('table.id'),
    headerLabel: t('table.id'),
  },
  {
    accessorKey: 'name',
    header: TableService.createSortableHeader(sort, t('club.name')),
    headerLabel: t('club.name'),
  },
  {
    accessorKey: 'info',
    header: TableService.createSortableHeader(sort, t('club.name')),
    headerLabel: t('club.info'),
    cell: ({ row }) => {
      const info = row.getValue('info') as string;

      return h(UTooltip, { text: info || t('table.n/a') }, () =>
        h('span', { class: 'truncate' }, info || t('table.n/a')),
      );
    },
  },
  {
    accessorKey: 'additionalInfo',
    header: t('club.additionalInfo'),
    headerLabel: t('club.additionalInfo'),
    cell: ({ row }) => {
      const additionalInfo = row.getValue('additionalInfo') as string;

      return h(UTooltip, { text: additionalInfo || t('table.n/a') }, () =>
        h('span', { class: 'truncate' }, additionalInfo || t('table.n/a')),
      );
    },
  },
  {
    accessorKey: 'region',
    header: TableService.createSortableHeader(sort, t('club.region')),
    headerLabel: t('club.region'),
    cell: ({ row }) => t('cities.' + row.getValue('region')),
  },
  {
    accessorKey: 'city',
    header: TableService.createSortableHeader(sort, t('club.city')),
    headerLabel: t('club.city'),
    cell: ({ row }) => t('cities.' + row.getValue('city')),
  },
  {
    accessorKey: 'address',
    header: t('club.address'),
    headerLabel: t('club.address'),
  },
  {
    accessorKey: 'ratings',
    header: t('club.rating'),
    headerLabel: t('club.rating'),
    cell: ({ row }) => {
      const ratings = row.getValue('ratings') as TRating[];
      return ClubService.calculateAverageRating(ratings);
    },
  },
  {
    accessorKey: 'timers',
    header: t('timer.numberOfTimers'),
    headerLabel: t('timer.numberOfTimers'),
    cell: ({ row }) => {
      const ratings = row.getValue('timers') as TTimer[];
      return ratings.length || 0;
    },
  },
  {
    accessorKey: 'active',
    header: TableService.createSortableHeader(sort, t('club.active')),
    headerLabel: t('club.active'),
    cell: ({ row }) => {
      const isActive = row.getValue('active') as boolean;
      return h(
        'span',
        { class: 'flex justify-center' },
        h(Icon, {
          name: isActive ? 'mdi:check' : 'mdi:close',
          class: isActive ? 'text-green-500' : 'text-red-500',
          size: '20',
        }),
      );
    },
  },
  {
    accessorKey: 'createdAt',
    header: TableService.createSortableHeader(sort, t('table.createdAt')),
    headerLabel: t('table.createdAt'),
    cell: ({ row }) => {
      const date = row.getValue('createdAt') as string;
      return h(UTooltip, { text: DateService.formatDate(date).dateWithTime || t('table.n/a') }, () =>
        h('span', DateService.formatDate(date).date || t('table.n/a')),
      );
    },
  },
  {
    accessorKey: 'updatedAt',
    header: TableService.createSortableHeader(sort, t('table.updatedAt')),
    headerLabel: t('table.updatedAt'),
    cell: ({ row }) => {
      const date = row.getValue('updatedAt') as string;
      return h(UTooltip, { text: DateService.formatDate(date).dateWithTime || t('table.n/a') }, () =>
        h('span', DateService.formatDate(date).date || t('table.n/a')),
      );
    },
  },
  {
    accessorKey: 'view',
    header: t('timer.label'),
    headerLabel: t('timer.label'),
    id: 'view',
  },
  {
    header: t('table.edit'),
    headerLabel: t('table.edit'),
    id: 'action',
  },
]);

const columnVisibility = ref({
  _id: false,
});

const getDropdownActions = (club: TClub): DropdownMenuItem[][] => {
  return [
    [
      {
        slot: 'edit',
      },
      {
        label: t('table.delete'),
        icon: 'mdi:delete-outline',
        color: 'error',
        onSelect: () => {
          console.log(`Delete club with ID: ${club._id}`);
        },
      },
    ],
  ];
};

const { data, status, refresh } = await useLazyAsyncData<TReturnItem<TClub[]>>(
  'my-clubs',
  () =>
    clubStore.fetchClubs({
      search: searchQuery.value,
      page: page.value,
      limit: limit.value,
      sort: sort.value.column,
      order: sort.value.direction,
    }),
  {
    default: () => ({
      total_items: 0,
      items: [],
    }),
    watch: [searchQuery, page, limit, sort],
  },
);
</script>
