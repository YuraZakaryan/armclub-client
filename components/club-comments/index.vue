<template>
  <section ref="commentSection" class="mt-6 space-y-2">
    <CommentForm
      v-if="localSession?.user"
      :club-id="props.clubId"
      :loading="state.loadingAddCommentRequest"
      comment-type="comment"
    />
    <UAlert
      v-else
      variant="subtle"
      color="neutral"
      orientation="horizontal"
      icon="mdi:user-outline"
      :description="$t('profile.register_to_leave_comment')"
      :ui="{
        root: 'py-2',
        wrapper: 'px-0',
        icon: 'mobile-max-xl:hidden',
        description: 'text-xs font-semibold mobile-max-l:text-[10px]',
      }"
      :actions="[
        {
          label: $t('header.sign_in'),
          variant: 'subtle',
          onClick: () => modalStore.openModal('auth'),
        },
      ]"
    />
    <CommentLoader v-if="isLoading && state.comments.items.length === 0" />
    <CommentsWrapper v-show="!!state.comments.total_items">
      <CommentItem v-for="comment in state.comments.items" :key="comment._id" :comment="comment">
        <CommentForm
          v-show="comment._id === state.replyMainCommentId"
          :club-id="props.clubId"
          :reply-main-comment-id="state.replyMainCommentId"
          :loading="state.loadingAddSubCommentRequest"
          class="ml-6"
          comment-type="subcomment"
        />
      </CommentItem>
    </CommentsWrapper>
  </section>
  <section v-show="state.comments.total_items > state.limit" class="flex w-full justify-end pr-2">
    <UPagination
      v-model:page="state.page"
      :total="state.comments.total_items"
      :items-per-page="state.limit"
      size="xs"
      show-edges
      show-last
      show-first
    />
  </section>
</template>

<script setup lang="ts">
import type { IClubComments } from '~/components/club-comments/types';
import { useCommentStore } from '~/stores/comment';
import CommentsWrapper from '~/components/club-comments/wrapper/comments-wrapper.vue';
import CommentItem from '~/components/club-comments/ui/comment-item/index.vue';
import CommentForm from '~/components/club-comments/ui/comment-form/index.vue';
import CommentLoader from '~/components/club-comments/features/comment-loader.vue';

const props = defineProps<IClubComments>();
const commentStore = useCommentStore();
const sessionStore = useSessionStore();
const modalStore = useModalStore();

const { state } = storeToRefs(commentStore);
const { localSession } = storeToRefs(sessionStore);

const commentSection = ref<HTMLElement | null>(null);
const isLoading = ref(false);

const loadComments = async () => {
  if (isLoading.value) return;

  isLoading.value = true;
  await commentStore.fetchComments(props.clubId);
  isLoading.value = false;
};

onMounted(() => {
  const observer = new IntersectionObserver(
    (entries) => {
      if (entries[0].isIntersecting) {
        loadComments();
        observer.disconnect();
      }
    },
    {
      root: null,
      rootMargin: '0px',
      threshold: 0.1,
    },
  );

  if (commentSection.value) {
    observer.observe(commentSection.value);
  }

  onUnmounted(() => {
    observer.disconnect();
  });
});

watch(
  () => state.value.page,
  () => {
    loadComments();
  },
);
</script>
