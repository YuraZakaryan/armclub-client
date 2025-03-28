<template>
  <UForm :state="localCommentState" :validate-on="['blur', 'input']" class="mb-2 space-y-2" @submit.prevent="onSubmit">
    <UFormField name="newComment">
      <UTextarea
        v-model="localCommentState.text"
        :ui="{
          base: 'h-20 resize-none mobile-max-xl:h-16 placeholder:text-xs',
        }"
        class="w-full"
        :placeholder="$t('comment.write_comment') + '...'"
        @click="handleFirstClick"
      />
    </UFormField>
    <UButton type="submit" :loading="props.loading" :disabled="!localCommentState.text || props.loading">{{
      $t('comment.add_comment')
    }}</UButton>

    <CustomModal
      v-model:open="showModal"
      :label="$t('comment.attention')"
      :close-modal="closeModal"
      :ui="{
        body: '!p-0',
      }"
    >
      <div class="p-6">
        <h4 class="mb-4 text-center text-xl font-semibold text-red-600 tablet-max:text-base">
          {{ $t('comment.title') }}
        </h4>

        <ul class="space-y-2">
          <li v-for="(rule, index) in rules" :key="index" class="flex items-start gap-2 text-gray-700">
            <span class="mt-0.5 h-5 w-5 flex-shrink-0">
              <svg class="h-full w-full text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
              </svg>
            </span>
            <span class="text-xs leading-relaxed mobile-max-l:text-[10px]">{{ rule }}</span>
          </li>
        </ul>

        <div class="mt-6 flex justify-center">
          <UButton variant="outline" @click="closeModal">Հասկանալի է</UButton>
        </div>
      </div>
    </CustomModal>
  </UForm>
</template>
<script lang="ts" setup>
import type { FormSubmitEvent } from '#ui/types';
import type { TNewCommentState } from '~/types';
import type { ICommentFormProps } from '~/components/club-comments/types';
import { useLocalStorage } from '@vueuse/core';
import CustomModal from '~/components/wrapper/custom-modal.vue';

const props = defineProps<ICommentFormProps>();
const commentStore = useCommentStore();
const { t } = useI18n();
const hasClickedTextarea = useLocalStorage('hasClickedCommentTextarea', false);

const rules = [t('comment.rules', 0), t('comment.rules', 1), t('comment.rules', 2)];

const localCommentState = ref({
  text: '',
});
const showModal = ref(false);

const fetchComments = async () => {
  await commentStore.fetchComments(props.clubId);
};

const closeModal = () => {
  showModal.value = false;
};

const handleFirstClick = () => {
  if (!hasClickedTextarea.value) {
    showModal.value = true;
    hasClickedTextarea.value = true;
  }
};

const onSubmit = async (event: FormSubmitEvent<TNewCommentState>) => {
  if (props.clubId) {
    switch (props.commentType) {
      case 'comment': {
        const created = await commentStore.addComment({
          text: event.data.text,
          clubId: props.clubId,
        });

        if (created) {
          await fetchComments();
          localCommentState.value.text = '';
        }
        break;
      }
      case 'subcomment': {
        if (props.replyMainCommentId) {
          const created = await commentStore.addSubComment({
            text: event.data.text,
            mainCommentId: props.replyMainCommentId,
          });

          if (created) {
            localCommentState.value.text = '';
          }
        }
        break;
      }
    }
  }
};
</script>
