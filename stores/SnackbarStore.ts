import { defineStore } from "pinia";

export const useSnackbarStore = defineStore("SnackbarStore", () => {
  const snackbar: Ref<Snackbar> = ref();
  const isActive: Ref<boolean> = ref(false);

  const show = (payload: Snackbar) => {
    isActive.value = false;

    setTimeout(() => {
      snackbar.value = payload;
      isActive.value = true;
    }, 100);
  };

  const hide = () => {
    isActive.value = false;
  };

  return {
    snackbar,
    isActive,
    show,
    hide,
  };
});
