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
