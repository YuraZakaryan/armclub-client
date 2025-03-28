import type { TClub } from '~/types';

export interface IClubCard {
  club: TClub;
  showPcCount?: boolean;
}

export type TPicture = {
  _id?: string;
  index: number;
  path: string;
  createdAt?: string;
  numberAt?: string;
};

export interface IPropertyImageCarouselProps {
  picture?: string;
  pictures?: TPicture[];
}

export type TClubsPosters = {
  _id: string;
  name: string;
  poster: string;
};

export interface ICustomModalProps {
  label: string;
  closeModal: () => void;
}

export interface ICustomYandexMapProps {
  latitudeMap: string;
  longitudeMap: string;
}
