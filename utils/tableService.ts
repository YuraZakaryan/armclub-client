import type { Column } from '@tanstack/table-core';
import { UButton } from '#components';
import type { TSort } from '~/types';

export class TableService {
  static createSortableHeader = <T>(sort: Ref<TSort>, label: string) => {
    return ({ column }: { column: Column<T> }) => {
      const currentSort = sort.value;
      const isColumnSorted = currentSort.column === column.id;
      const sortDirection = isColumnSorted ? currentSort.direction : null;

      return h(UButton, {
        color: 'neutral',
        variant: 'ghost',
        label,
        icon: sortDirection
          ? sortDirection === 'asc'
            ? 'i-lucide-arrow-up-narrow-wide'
            : 'i-lucide-arrow-down-wide-narrow'
          : 'i-lucide-arrow-up-down',
        class: '-mx-2.5 font-semibold',
        onClick: () => {
          const currentSort = sort.value;
          if (currentSort.column !== column.id) {
            sort.value = { column: column.id, direction: 'asc' };
          } else if (currentSort.direction === 'asc') {
            sort.value = { column: column.id, direction: 'desc' };
          } else {
            sort.value = { column: '', direction: 'asc' };
          }
        },
      });
    };
  };
}
