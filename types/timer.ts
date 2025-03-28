import type { TClub } from '~/types';

export interface TTimer {
  _id: string;
  index?: number;
  name: string;
  allocatedTime: number;
  isInfinite: boolean;
  start: string;
  end: string;
  isActive: boolean;
  paused: boolean;
  price: number | null;
  waitingCount: number | null;
  manuallyStopped: boolean;
  pausePeriods: TPausePeriod[];
  club: string;
  author: string;
  createdAt: string;
  updatedAt: string;
}

export type TPausePeriod = {
  start: string;
  end: string | null;
};

export type TFetchTimersBody = {
  search?: string;
  page?: number;
  limit?: number;
  sort?: string;
  order?: 'asc' | 'desc';
  clubId?: string;
};

export type TFinishedTimer = {
  title: string;
  playedTime: string;
  price: number;
  pausePeriods: TPausePeriod[];
  _id: string;
};

export type TTimerHistories = {
  _id: string;
  title: string;
  time: string;
  start: string;
  end: string;
  price: number;
  finalPrice: number;
  isInfinite: boolean;
  manuallyStopped: boolean;
  club: TClub;
};

export type TTimerState = {};

export type TTimerValues = {
  passed: string;
  remaining: string;
  progress: number;
};
