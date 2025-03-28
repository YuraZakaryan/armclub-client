<template>
  <PicturePickerWrapper ref="dropZoneRef" :label="$t('club.images')" :class="{ 'border-blue-500': isOverDropZone }">
    <PicturePickerChooseFile text="drag_your_pictures_here" class="flex flex-col items-center justify-center">
      <UButton variant="outline" @click="triggerFileInput">{{ $t('club.select') }}</UButton>
      <Input
        ref="fileInputRef"
        type="file"
        accept="image/jpg, image/jpeg, image/png, image/heic"
        class="hidden"
        multiple
        @input="handleFileInput"
      />
    </PicturePickerChooseFile>

    <draggable
      v-if="props.pictures.length > 0"
      :list="props.pictures"
      class="mobile-max:grid-cols-2 grid grid-cols-3 gap-2 pt-4"
      tag="transition-group"
      ghost-class="opacity-50"
      animation="200"
      @end="updatePictureIndexes"
    >
      <div v-for="(picture, index) in props.pictures" :key="index" class="list-group-item flex flex-col justify-start">
        <button class="self-end">
          <Icon
            name="mdi:trash"
            size="20"
            class="text-red-600"
            @click="
              (event: Event) => {
                event.preventDefault();
                removePicture(index);
              }
            "
          />
        </button>
        <NuxtImg
          :src="
            picture.path.includes('webp')
              ? config.public.NUXT_SITE_URL.startsWith('https')
                ? `${config.public.NUXT_SITE_URL}/${picture.path}`
                : `${config.public.NUXT_API_BASE_URL}/${picture.path}`
              : picture.path
          "
          alt="Selected Picture"
          class="w-44 rounded-lg p-2 shadow-xl"
        />
      </div>
    </draggable>
  </PicturePickerWrapper>
</template>

<script lang="ts" setup>
import { useDropZone } from '@vueuse/core';
import { ref, watch } from 'vue';
import { useCustomToast } from '~/hooks/useCustomToast';
import PicturePickerWrapper from '~/components/wrapper/picture-picker-wrapper.vue';
import PicturePickerChooseFile from '~/components/my-clubs/features/picture-picker-choose-file.vue';
import type { IClubImagePickerMultipleProps } from '~/components/my-clubs/types';
import type { TPicture } from '~/components/types';

const props = defineProps<IClubImagePickerMultipleProps>();
const emit = defineEmits(['update:pictures']);

const config = useRuntimeConfig();
const { showToast } = useCustomToast();

const fileInputRef = ref<HTMLInputElement | null>(null);
const dropZoneRef = ref<HTMLElement | null>(null);

const { handleFileInput, files } = useFileStorage({ clearOldFiles: true });

const allowedFileTypes = ['image/jpeg', 'image/png', 'image/jpg', 'image/heic'];

const { isOverDropZone } = useDropZone(dropZoneRef, {
  onDrop,
  dataTypes: ['image/jpeg', 'image/png'],
  preventDefaultForUnhandled: true,
});

const triggerFileInput = () => {
  if (fileInputRef.value) {
    fileInputRef.value.click();
  }
};

const removePicture = (index: number) => {
  const updatedPictures = [...props.pictures];
  updatedPictures.splice(index, 1);
  emit('update:pictures', updatedPictures);
};

function onDrop(files: File[] | null) {
  if (files) {
    const newImages: TPicture[] = [];

    files.forEach((file) => {
      if (!allowedFileTypes.includes(file.type)) {
        showToast('Նկարի տեսակը չի համապատասխանում', 'error');
        return;
      }

      const reader = new FileReader();
      reader.onload = () => {
        const base64String = reader.result as string;
        const newImage: TPicture = {
          index: props.pictures.length + newImages.length,
          path: base64String,
        };
        if (!props.pictures.some((picture) => picture.path === newImage.path)) {
          newImages.push(newImage);
        }
        if (newImages.length === files.length) {
          emit('update:pictures', [...props.pictures, ...newImages]);
        }
      };
      reader.onerror = (error) => console.error('Error reading file:', error);
      reader.readAsDataURL(file);
    });
  }
}

const updatePictureIndexes = () => {
  const updatedPictures = props.pictures.map((picture, index) => ({
    ...picture,
    index,
  }));
  emit('update:pictures', updatedPictures);
};

watch(files.value, (newFiles) => {
  if (newFiles.length > 0) {
    const validFiles = newFiles.filter((file) => allowedFileTypes.includes(file.type));

    if (validFiles.length === 0) {
      showToast('Նկարի տեսակը չի համապատսխանում', 'error');
      return;
    }

    const newImages = validFiles.map((file, index) => ({
      index: props.pictures.length + index,
      path: file.content as string,
    }));

    const existingPaths = new Set(props.pictures.map((picture) => picture.path));

    const uniqueImages = newImages.filter((image) => !existingPaths.has(image.path));

    emit('update:pictures', [...props.pictures, ...uniqueImages]);
  }
});
</script>
