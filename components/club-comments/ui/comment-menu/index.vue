<template>
  <UDropdownMenu v-if="!!items.length" :items="items" :ui="{ content: 'w-20' }" size="xs">
    <UButton color="neutral" variant="ghost" size="xs" icon="mdi:dots-vertical" />
  </UDropdownMenu>
</template>

<script setup lang="ts">
import type { ICommentMenuProps } from '~/components/club-comments/types';
import { UserService } from '~/utils/userService';

const props = defineProps<ICommentMenuProps>();
const commentStore = useCommentStore();
const sessionStore = useSessionStore();
const { t } = useI18n();

const { localSession } = storeToRefs(sessionStore);
const { state } = storeToRefs(commentStore);

const fetchComments = async (clubId: string): Promise<void> => {
  await commentStore.fetchComments(clubId);
};

const handleDelete = async (): Promise<void> => {
  if (props.commentType && props.comment._id) {
    const deleted = await commentStore.handleDeleteComment(props.comment._id, props.commentType);

    if (deleted && props.commentType === 'comment') {
      await fetchComments(deleted.club._id);
    }
  }
};

const canDelete = computed(() => {
  const user = localSession.value?.user;
  if (!user) return false;

  const authorId = props.comment.author?._id ?? null;
  return UserService.checkAccess(user, authorId);
});

const items = computed(() => {
  if (!canDelete.value) return [];

  return [
    [
      {
        label: t('table.delete'),
        color: 'error' as const,
        icon: 'mdi:delete-outline',
        loading: state.value.loadingDeleteCommentRequest,
        disabled: state.value.loadingDeleteCommentRequest || !props.comment._id,
        onSelect: () => handleDelete(),
      },
    ],
  ];
});
</script>
