import type { TClub, TReturnItem, TUser } from '~/types';

export type TFavorite = {
  _id: string;
  club: TClub;
  author: TUser;
  createdAt: string;
  updatedAt: string;
};

export type TFavoriteState = {
  favorites: TReturnItem<TFavorite[]>;
  isRequestLoading: boolean;
};

export type TFetchFavoritesBody = {
  authorId: string;
  page?: number;
  limit?: number;
};
