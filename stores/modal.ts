import type { TModalState } from '~/types/modal';

export const useModalStore = defineStore('modal', () => {
  const state = ref<TModalState>({
    isActivationOpen: false,
    isAuthOpen: false,
    isClubCrudOpen: false,
  });

  const getModalState = (modal: keyof TModalState | `setTimer_${string}`): boolean => {
    return state.value[modal] ?? false;
  };

  const openModal = (modal: keyof TModalState | `setTimer_${string}`): void => {
    if (modal === 'isActivationOpen') {
      state.value.isActivationOpen = true;
    } else if (modal === 'isAuthOpen') {
      state.value.isAuthOpen = true;
    } else if (modal === 'isClubCrudOpen') {
      state.value.isClubCrudOpen = true;
    } else if (modal.startsWith('setTimer_')) {
      state.value[modal] = true;
    }
  };

  const closeModal = (modal: keyof TModalState | `setTimer_${string}`): void => {
    if (modal === 'isActivationOpen') {
      state.value.isActivationOpen = false;
    } else if (modal === 'isAuthOpen') {
      state.value.isAuthOpen = false;
    } else if (modal === 'isClubCrudOpen') {
      state.value.isClubCrudOpen = false;
    } else if (modal.startsWith('setTimer_')) {
      state.value[modal] = false;
    }
  };

  return {
    state,
    openModal,
    closeModal,
    getModalState,
  };
});
