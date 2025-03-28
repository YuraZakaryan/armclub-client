import type { TComment, TRequestQueryProps, TSubComment } from '~/types';

export interface IClubComments {
  clubId: string;
}

export interface ICommentItemProps {
  comment: TComment;
}

export interface ISubCommentItemProps {
  comment: TSubComment;
}

export interface ICommentContentProps {
  comment: TComment | TSubComment;
  commentType?: 'comment' | 'subcomment';
  hideReply?: boolean;
}

export interface ICommentFormProps {
  replyMainCommentId?: string | null;
  commentType?: 'comment' | 'subcomment';
  clubId: string;
  loading: boolean;
}

export interface ICommentMenuProps {
  comment: TComment | TSubComment;
  commentType: 'comment' | 'subcomment';
}
