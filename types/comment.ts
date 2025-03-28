import type { TClub, TReturnItem, TUser } from '~/types';

export enum ETypeComment {
  SUB = 'sub',
}

export type TSubComment = {
  _id: string;
  author: TUser;
  mainComment: string;
  text: string;
  like: number;
  dislike: number;
  commentAuthRole: string;
  answerToUser: TUser;
  usersWhoLiked: string[];
  club: TClub;
  status: boolean;
  createdAt: string;
  updatedAt: string;
};

export type TComment = {
  _id: string;
  author: TUser;
  mainComment?: string;
  text: string;
  like: number;
  usersWhoLiked: string[];
  dislike: number;
  subComments: TSubComment[];
  club: TClub;
  status: boolean;
  createdAt: string;
  updatedAt: string;
};

export type TSetAndUnset = {
  commentId: string;
  userId: string;
  typeComment?: ETypeComment;
};
export type PromiseLikeAndUnlike = {
  data: {
    message: string;
    comment: TComment | TSubComment;
  };
  userId: string;
  typeComment: ETypeComment;
};

export type TNewCommentState = {
  text: string;
  clubId?: string | null;
  mainCommentId?: string | null;
};

export type TCommentState = {
  page: number;
  limit: number;
  comments: TReturnItem<TComment[]>;
  replyMainCommentId: string | null;
  loadingAddCommentRequest: boolean;
  loadingAddSubCommentRequest: boolean;
  loadingDeleteCommentRequest: boolean;
};

export type TFetchCommentsBody = {
  clubId: string;
};

export type TLikeResponse = {
  comment: TComment | TSubComment;
  message: string;
};
