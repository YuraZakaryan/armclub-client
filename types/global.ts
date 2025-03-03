export type TReturnItem<T> = {
  total_items: number;
  items: T;
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

export type TLocale = 'en' | 'ru' | 'am';
export type TBadgeColor = 'primary' | 'secondary' | 'success' | 'info' | 'warning' | 'error' | 'neutral' | undefined;
export type ButtonSize = 'sm' | 'md' | 'lg' | 'xl';
export type TSelectOption = { label: string; value: string };
