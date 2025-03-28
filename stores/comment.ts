import type { TComment, TCommentState, TLikeResponse, TNewCommentState, TReturnItem, TSubComment } from '~/types';
import { defineStore } from 'pinia';
import type { FetchError } from '~/types/error';

export const useCommentStore = defineStore('comment', () => {
  const state = reactive<TCommentState>({
    page: 1,
    limit: 3,
    comments: {
      items: [],
      total_items: 0,
    },
    replyMainCommentId: null,
    loadingAddCommentRequest: false,
    loadingAddSubCommentRequest: false,
    loadingDeleteCommentRequest: false,
  });

  const { $api } = useNuxtApp();

  const fetchComments = async (clubId: string) => {
    try {
      state.comments = await $api<TReturnItem<TComment[]>>('/club/comment/all', {
        method: 'GET',
        params: {
          clubId,
          skip: state.page && state.limit ? (state.page - 1) * state.limit : 0,
          limit: state.limit || 10,
        },
      });
    } catch {
      state.comments = {
        items: [],
        total_items: 0,
      };

      return {
        total_items: 0,
        items: [],
      };
    }
  };

  const setReplyComment = (_id: string) => {
    state.replyMainCommentId = _id;
  };

  const addComment = async (comment: TNewCommentState) => {
    state.loadingAddCommentRequest = true;
    try {
      await $api('club/comment', {
        method: 'POST',
        body: comment,
      });

      return true;
    } catch (err) {
      const error = err as FetchError;
      console.log(error.message);

      return false;
    } finally {
      state.loadingAddCommentRequest = false;
    }
  };

  const toggleLikeComment = async (commentId: string, commentType: 'comment' | 'subcomment' = 'comment') => {
    try {
      const response = await $api<TLikeResponse>(
        `club/comment/like/${commentType === 'subcomment' ? 'sub/' + commentId : commentId}`,
        {
          method: 'PATCH',
        },
      );

      if (commentType === 'comment') {
        const commentIndex = state.comments.items.findIndex((comment) => comment._id === commentId);

        if (commentIndex !== -1 && response.comment) {
          state.comments.items[commentIndex] = {
            ...state.comments.items[commentIndex],
            usersWhoLiked: response.comment.usersWhoLiked,
          };
        }
      } else if (commentType === 'subcomment') {
        const mainCommentIndex = state.comments.items.findIndex(
          (comment) => comment._id === response.comment.mainComment,
        );

        if (mainCommentIndex !== -1 && response.comment) {
          const subCommentIndex = state.comments.items[mainCommentIndex].subComments.findIndex(
            (subComment) => subComment._id === commentId,
          );

          if (subCommentIndex !== -1) {
            state.comments.items[mainCommentIndex].subComments[subCommentIndex] = {
              ...state.comments.items[mainCommentIndex].subComments[subCommentIndex],
              like: response.comment.like,
              usersWhoLiked: response.comment.usersWhoLiked,
            };
          }
        }
      }

      return true;
    } catch (err) {
      const error = err as FetchError;
      console.log(error.message);

      return false;
    }
  };

  const handleDeleteComment = async (commentId: string, commentType: 'comment' | 'subcomment' = 'comment') => {
    state.loadingDeleteCommentRequest = true;
    try {
      const response = await $api<TComment | TSubComment>(
        `club/comment/${commentType === 'subcomment' ? 'sub/' + commentId : commentId}`,
        {
          method: 'DELETE',
        },
      );

      if (commentType === 'subcomment') {
        const mainCommentIndex = state.comments.items.findIndex((comment) => comment._id === response.mainComment);

        if (mainCommentIndex !== -1) {
          const subCommentIndex = state.comments.items[mainCommentIndex].subComments.findIndex(
            (subComment) => subComment._id === commentId,
          );

          if (subCommentIndex !== -1) {
            state.comments.items[mainCommentIndex].subComments.splice(subCommentIndex, 1);
          }
        }
      }

      return response;
    } catch (err) {
      const error = err as FetchError;
      console.log(error.message);

      return false;
    } finally {
      state.loadingDeleteCommentRequest = false;
    }
  };

  const addSubComment = async (comment: TNewCommentState) => {
    state.loadingAddSubCommentRequest = true;

    try {
      const response = await $api('club/comment/sub', {
        method: 'POST',
        body: comment,
      });

      if (response) {
        const newSubComment = response as TSubComment;

        const mainCommentIndex = state.comments.items.findIndex((item) => item._id === newSubComment.mainComment);

        if (mainCommentIndex !== -1) {
          state.comments.items[mainCommentIndex].subComments.push(newSubComment);
        }
      }

      return true;
    } catch {
      return false;
    } finally {
      state.loadingAddSubCommentRequest = false;
    }
  };

  return {
    state,
    setReplyComment,
    fetchComments,
    addComment,
    addSubComment,
    handleDeleteComment,
    toggleLikeComment,
  };
});
