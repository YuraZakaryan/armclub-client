<template>
  <PicturePickerWrapper ref="dropZoneRef" :label="$t('club.picture')" :class="{ 'border-blue-500': isOverDropZone }">
    <PicturePickerClose
      :show="!!props.picture || !!(!props.editPicture && props.picture)"
      :handle-remove="removePicture"
    />
    <PicturePickerChooseFile
      v-if="props.editPicture && !props.picture"
      text="drag_your_picture_here"
      class="flex flex-col items-center justify-center"
    >
      <UButton variant="outline" @click="triggerFileInput">{{ $t('club.select') }}</UButton>
      <Input
        ref="fileInputRef"
        type="file"
        accept="image/jpg, image/jpeg, image/png, image/heic"
        class="hidden"
        @input="handleFileInput"
      />
    </PicturePickerChooseFile>
    <PicturePickerImage v-else :src="imageUrl" />
  </PicturePickerWrapper>
</template>

<script lang="ts" setup>
import { useDropZone } from '@vueuse/core';
import { useCustomToast } from '~/hooks/useCustomToast';
import PicturePickerWrapper from '~/components/wrapper/picture-picker-wrapper.vue';
import PicturePickerClose from '~/components/my-clubs/features/picture-picker-close.vue';
import PicturePickerChooseFile from '~/components/my-clubs/features/picture-picker-choose-file.vue';
import PicturePickerImage from '~/components/my-clubs/features/picture-picker-image.vue';
import type { IClubImagePickerProps } from '~/components/my-clubs/types';

const props = defineProps<IClubImagePickerProps>();
const emit = defineEmits(['update:editPicture', 'update:picture']);

const config = useRuntimeConfig();
const { showToast } = useCustomToast();

const fileInputRef = ref<HTMLInputElement | null>(null);
const dropZoneRef = ref<HTMLElement | null>(null);

const { handleFileInput, files } = useFileStorage({ clearOldFiles: true });

const triggerFileInput = () => {
  if (fileInputRef.value) {
    fileInputRef.value.click();
  }
};

const removePicture = (event: Event) => {
  event.stopPropagation();
  emit('update:editPicture', true);
  emit('update:picture', null);
};

const imageUrl = computed(() => {
  if (props.picture.includes('webp')) {
    return config.public.NUXT_SITE_URL.startsWith('https')
      ? `${config.public.NUXT_SITE_URL}/${props.picture}`
      : `${config.public.NUXT_API_BASE_URL}/${props.picture}`;
  }
  return props.picture;
});

const allowedFileTypes = ['image/jpeg', 'image/png', 'image/jpg', 'image/heic'];

const { isOverDropZone } = useDropZone(dropZoneRef, {
  onDrop,
  dataTypes: ['image/jpeg', 'image/png'],
  preventDefaultForUnhandled: true,
});

function onDrop(files: File[] | null) {
  if (files && files[0]) {
    const file = files[0];

    if (!allowedFileTypes.includes(file.type)) {
      showToast('Նկարի տեսակը չի համապատասխանում', 'error');
      return;
    }

    const reader = new FileReader();

    reader.onload = () => {
      const base64String = reader.result as string;
      emit('update:picture', base64String);
      emit('update:editPicture', false);
    };

    reader.onerror = (error) => {
      console.error('Ошибка при чтении файла:', error);
    };

    reader.readAsDataURL(file);
  }
}

watch(files.value, (newFiles) => {
  if (newFiles.length > 0) {
    const validFiles = newFiles.filter((file) => allowedFileTypes.includes(file.type));

    if (validFiles.length === 0) {
      showToast('Նկարի տեսակը չի համապատսխանում', 'error');
      return;
    }

    emit('update:picture', validFiles[0].content as string);
  }
});
</script>
