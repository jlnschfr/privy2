import { defineStore } from "pinia";

export const useSnackbarStore = defineStore("SnackbarStore", () => {
  const snackbar: Ref<Snackbar> = ref();
  const snackbarIsActive: Ref<boolean> = ref(false);

  const showSnackbar = (payload: Snackbar) => {
    snackbarIsActive.value = false;

    setTimeout(() => {
      snackbar.value = payload;
      snackbarIsActive.value = true;
    }, 100);
  };

  const hideSnackbar = () => {
    snackbarIsActive.value = false;
  };

  return {
    snackbar,
    snackbarIsActive,
    showSnackbar,
    hideSnackbar,
  };
});
