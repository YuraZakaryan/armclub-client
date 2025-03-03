import type { TComment, TFavorite, TRating, TUser, TTimer, TTimerHistories, TReturnItem, TSelectOption } from '~/types';
import type { TPicture } from '~/components/types';

export type TClub = {
  _id: string;
  title: string;
  description: string;
  info: string;
  region: string;
  city: string;
  address: string;
  phone: string;
  views: number;
  picture: string;
  posterPicture: string;
  pictures: TPicture[];
  comments: TComment[];
  ratings: TRating[];
  prices: string[];
  timers: TTimer[];
  timerHistories: TTimerHistories[];
  favourites: TFavorite[];
  latitudeMap: string;
  longitudeMap: string;
  open: boolean;
  openingTime: string;
  closingTime: string;
  author: TUser;
  createdAt: string;
  updatedAt: string;
};

export type TClubState = {
  currentClub: TClub | null;
  clubs: TReturnItem<TClub[]>;
  filters: TFilters;
  mapSuggestions: string[];
  isRequestLoading: boolean;
  editPicture: boolean;
};

export type TFilters = {
  roomCounts: number[];
  cities: TSelectOption[];
  region: TSelectOption;
};

export type TFetchClubsBody = {
  search?: string;
  page?: number;
  limit?: number;
  sort?: string;
  order?: 'asc' | 'desc';
  clubStatuses?: boolean[];
  updateState?: boolean;
};
