<template>
  <Icon v-if="isCommentAdmin" name="mdi:administrator" size="26" />
  <Icon v-else-if="isOwner" name="mdi:administrator-outline" size="26" />
  <Icon v-else name="mdi:account-circle-outline" size="28" />
  <div class="w-full space-y-1.5 text-xs">
    <div class="relative w-full">
      <div class="flex items-center gap-2">
        <span v-if="isCommentAdmin" class="text-red-600 capitalize">[ {{ $t('profile.site_administrator') }} ]</span>
        <span v-else-if="isOwner" class="text-green-600 capitalize">[ {{ $t('profile.club_administrator') }} ]</span>
        <h5
          v-else
          class="cursor-default text-black capitalize"
          :class="{ 'after:content-[`,`]': !isCommentAdmin || !isOwner }"
        >
          {{ UserService.getFullName(props.comment?.author) }}
        </h5>
        <span class="text-[10px] text-black/90">{{
          DateService.formatDate(props.comment.createdAt).dateWithTime
        }}</span>
      </div>
      <CommentMenu
        :comment="props.comment"
        :comment-type="props.commentType || 'comment'"
        class="absolute top-0 right-0"
      />
    </div>
    <p class="text-slate-700">{{ props.comment.text }}</p>
    <div
      class="flex items-center gap-6 mobile-max-l:justify-between"
      :class="{ 'w-full !justify-end': !localSession?.user || props.hideReply }"
    >
      <button
        v-show="localSession?.user && !props.hideReply"
        class="text-green-500 mobile-min-l:border-b mobile-min-l:border-dashed"
        @click="handleReply(props.comment._id)"
      >
        <Icon name="ic:baseline-reply" size="16" class="mobile-min-l:hidden" />
        <span class="mobile-max-l:hidden">{{ $t('comment.reply') }}</span>
      </button>
      <button
        class="flex items-center gap-1"
        :class="{ 'text-red-700': props.comment.usersWhoLiked.includes(localSession?.user._id ?? '') }"
        :disabled="!localSession?.user"
        @click="toggleLike"
      >
        <Icon name="solar:like-broken" size="16" />
        <span
          class="border-b border-dashed border-green-500 mobile-max-l:hidden"
          :class="{ hidden: !localSession?.user }"
        >
          {{ $t('comment.like') }} ({{ props.comment.usersWhoLiked.length }})
        </span>

        <span class="hidden" :class="{ '!block mobile-min-l:hidden': !localSession?.user }"
          >({{ props.comment.usersWhoLiked.length }})</span
        >
      </button>
    </div>
  </div>
</template>

<script setup lang="ts">
import { DateService } from '~/utils/dateService';
import type { ICommentContentProps } from '~/components/club-comments/types';
import CommentMenu from './../ui/comment-menu/index.vue';
import { UserService } from '~/utils/userService';

const props = defineProps<ICommentContentProps>();
const commentStore = useCommentStore();
const sessionStore = useSessionStore();

const { localSession } = storeToRefs(sessionStore);

const handleReply = (_id: string): void => {
  if (localSession?.value?.user) {
    commentStore.setReplyComment(_id);
  }
};

const toggleLike = async (): Promise<void> => {
  if (localSession?.value?.user) {
    await commentStore.toggleLikeComment(props.comment._id, props.commentType || 'comment');
  }
};

const isCommentAdmin = computed(() => {
  if (!props.comment.author) return false;

  return UserService.isCommentAdmin(props.comment);
});

const isOwner = computed(() => {
  return UserService.isClubOwner(props.comment);
});
</script>
