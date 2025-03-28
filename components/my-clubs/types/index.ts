import type { TClub, TPrice } from '~/types';
import type { TPicture } from '~/components/types';

export interface ICrudClubsProps {
  club?: TClub;
  refresh: () => Promise<void>;
}

export interface IPicturePickerCloseProps {
  show: boolean;
  handleRemove: (event: Event) => void;
}

export interface IClubImagePickerProps {
  picture: string;
  editPicture: boolean;
}

export interface IClubImagePickerMultipleProps {
  pictures: TPicture[];
}

export interface IMyClubPriceListProps {
  prices: TPrice[];
  deletedPricesIds: string[];
}
