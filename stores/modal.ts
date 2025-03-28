import type { TModalState } from '~/types/modal';

export const useModalStore = defineStore('modal', () => {
  const state = ref<TModalState>({
    isActivationOpen: false,
    isAuthOpen: false,
    isClubCrudOpen: false,
  });

  const openModal = (modal: 'activation' | 'auth' | 'club') => {
    if (modal === 'activation') {
      state.value.isActivationOpen = true;
    } else if (modal === 'auth') {
      state.value.isAuthOpen = true;
    } else if (modal === 'club') {
      state.value.isClubCrudOpen = true;
    }
  };

  const closeModal = (modal: 'activation' | 'auth' | 'club') => {
    if (modal === 'activation') {
      state.value.isActivationOpen = false;
    } else if (modal === 'auth') {
      state.value.isAuthOpen = false;
    } else if (modal === 'club') {
      state.value.isClubCrudOpen = false;
    }
  };

  return {
    state,
    openModal,
    closeModal,
  };
});
