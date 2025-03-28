import type { ColumnDef } from '@tanstack/table-core';
import type { InferType } from 'yup';
import type { clubSchema } from '~/schema/schema';

export type ICustomTableColumn<T> = ColumnDef<T> & {
  headerLabel?: string;
};

export type TReturnItem<T> = {
  total_items: number;
  items: T;
};

export type TSelectItem = {
  label?: string | undefined;
  value?: string | undefined;
};

export type TCommandPaletteOption = {
  click?: () => void;
  to?: string;
  href?: string;
};

export interface IDialogOpenProps {
  isOpen: boolean;
  block?: boolean;
  size?: string;
  classButton?: string;
}

export type TResponse = {
  success: boolean;
  status: number;
  message: string;
};

export type TGeocodeResponse = {
  response: {
    GeoObjectCollection: {
      featureMember: Array<{
        GeoObject: {
          Point: {
            pos: string;
          };
        };
      }>;
    };
  };
};

export type TGetIp = {
  ip: string;
};

export type TRequestQueryProps = {
  page?: number;
  limit?: number;
};

export type Locale = {
  code: 'en' | 'ru' | 'am';
};

export type TSort = {
  column: string;
  direction: 'asc' | 'desc';
};

export type TLocale = 'en' | 'ru' | 'am';
export type TBadgeColor = 'primary' | 'secondary' | 'success' | 'info' | 'warning' | 'error' | 'neutral' | undefined;
export type ButtonSize = 'sm' | 'md' | 'lg' | 'xl';
export type TSelectOption = { label: string; value: string };

export type TClubSchema = InferType<ReturnType<typeof clubSchema>>;
