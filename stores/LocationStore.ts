import { defineStore } from "pinia";
// import { useLocalStorage } from "@vueuse/core"; // COMMENTED OUT FOR DEBUGGING

export const useLocationStore = defineStore("LocationStore", () => {
  const DURATION = 1800000;
  const user = useSupabaseUser();

  // const location: Ref<PrivyLocation> = useLocalStorage(
  //   `location-${user?.value?.id}`,
  //   {},
  // ); // COMMENTED OUT FOR DEBUGGING
  const location: Ref<PrivyLocation> = ref({}); // TEMPORARY DEBUG: using regular ref instead of localStorage

  const isEmpty: ComputedRef<boolean> = computed(
    () => Object.keys(location.value).length === 0,
  );

  const isOutOfDate: ComputedRef<boolean> = computed(
    () => Date.now() - location.value?.timestamp > DURATION,
  );

  const init = () => {
    if (isEmpty.value || isOutOfDate.value) {
      fetchLocation();
    }

    setInterval(async () => {
      await fetchLocation();
    }, DURATION);
  };

  async function fetchLocation() {
    const url: URL = new URL(
      "https://api.bigdatacloud.net/data/reverse-geocode-client",
    );

    const response: Response = await fetch(url);
    if (response.ok) {
      const json = await response.json();
      location.value = {
        lat: json.latitude,
        long: json.longitude,
        city: json.locality,
        timestamp: Date.now(),
      };
    }
  }

  return {
    location,
    isEmpty,
    init,
  };
});
