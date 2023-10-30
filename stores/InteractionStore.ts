import { defineStore } from "pinia";

export const useInteractionStore = defineStore("InteractionStore", {
  state: () => {
    return {
      snackbar: null,
      weather: null,
      location: null,
    };
  },
  // actions
  // getters
});
