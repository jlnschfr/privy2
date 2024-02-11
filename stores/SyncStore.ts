import { defineStore } from "pinia";

export const useSyncStore = defineStore("SyncStore", () => {
  const isSyncing: Ref<boolean> = ref(false);

  const setIsSyncing = (value: boolean, delay: number = 0) => {
    setTimeout(() => {
      isSyncing.value = value;
    }, delay);
  };

  return {
    isSyncing,
    setIsSyncing,
  };
});
