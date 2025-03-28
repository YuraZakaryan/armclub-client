import type { TComment, TFavorite, TRating, TUser, TTimer, TTimerHistories, TReturnItem, TSelectOption } from '~/types';
import type { TPicture } from '~/components/types';

export type TPrice = {
  _id?: string;
  name: string;
  amount: number;
  currency?: 'AMD' | 'USD' | 'RUB';
  club?: string;
  active?: boolean;
};

export type TClub = {
  _id: string;
  name: string;
  info: string;
  additionalInfo: string;
  region: string;
  city: string;
  address: string;
  countryCode: string;
  phone: string;
  view: number;
  picture: string;
  posterPicture: string;
  pictures: TPicture[];
  comments: TComment[];
  ratings: TRating[];
  prices: TPrice[];
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
  authorId?: string;
  clubStatuses?: boolean[];
  updateState?: boolean;
};
