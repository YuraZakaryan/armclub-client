import type { TClub } from '~/types';
import type { TPicture } from '~/components/types';

export interface IClubPageProps {
  club: TClub;
}

export interface IClubPageGalleryProps {
  picture: string;
  pictures: TPicture[];
}
