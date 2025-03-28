<template>
  <div class="space-y-3">
    <CommentItemWrapper class="odd:bg-[#f9f9f9]">
      <CommentContent :comment="props.comment" comment-type="comment" />
    </CommentItemWrapper>
    <CommentsWrapper v-if="props.comment.subComments?.length" class="ml-6">
      <SubCommentItem
        v-for="comment in props.comment.subComments"
        :key="comment._id"
        :comment="comment"
        class="odd:bg-[#f9f9f9]"
      />
    </CommentsWrapper>
    <slot />
  </div>
</template>

<script setup lang="ts">
import type { ICommentItemProps } from '~/components/club-comments/types';
import CommentsWrapper from '~/components/club-comments/wrapper/comments-wrapper.vue';
import SubCommentItem from '~/components/club-comments/ui/sub-comment-item/index.vue';
import CommentItemWrapper from '~/components/club-comments/wrapper/comment-item-wrapper.vue';
import CommentContent from '~/components/club-comments/features/comment-content.vue';

const props = defineProps<ICommentItemProps>();
</script>
