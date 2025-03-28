import type { User } from 'next-auth';
import type { TComment, TSubComment, TUser } from '~/types';

export class UserService {
  static isAdmin(user: User): boolean {
    if (!user) return false;
    return user.role === 'ADMIN' || user.role === 'MODERATOR';
  }

  static checkAccess(user: User, authorId: string | null): boolean {
    if (!user) return false;

    if (user.role === 'ADMIN' || user.role === 'MODERATOR') return true;

    if (!authorId) return false;
    return user._id === authorId;
  }

  static isClubOwner = (comment: TComment | TSubComment): boolean => {
    if (!comment?.club?.author?._id || !comment?.author?._id) {
      return false;
    }

    return comment.club.author._id === comment.author._id;
  };

  static isCommentAdmin(comment: TComment | TSubComment): boolean {
    return comment.author.role === 'ADMIN' || comment.author.role === 'MODERATOR';
  }

  static getFullName(author: TUser | null): string {
    if (author) {
      return `${author.firstName} ${author.lastName}`.trim();
    } else {
      return 'DELETED USER';
    }
  }
}
