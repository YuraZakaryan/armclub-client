<template>
  <CommentItemWrapper
    class="w-full border-l-2 border-dashed border-gray-400"
    :class="{
      '!border-red-400': isCommentAdmin,
      '!border-green-400': isOwner && !isCommentAdmin,
    }"
  >
    <CommentContent :comment="props.comment" comment-type="subcomment" hide-reply />
  </CommentItemWrapper>
</template>

<script setup lang="ts">
import type { ISubCommentItemProps } from '~/components/club-comments/types';
import CommentItemWrapper from '~/components/club-comments/wrapper/comment-item-wrapper.vue';
import CommentContent from '~/components/club-comments/features/comment-content.vue';
import { UserService } from '~/utils/userService';

const props = defineProps<ISubCommentItemProps>();

const isCommentAdmin = computed(() => {
  if (!props.comment.author) return false;

  return UserService.isCommentAdmin(props.comment);
});

const isOwner = computed(() => {
  return UserService.isClubOwner(props.comment);
});
</script>
