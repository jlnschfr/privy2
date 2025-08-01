import { defineStore } from "pinia";
import { useLocalStorage } from "@vueuse/core";

export const useLocationStore = defineStore("LocationStore", () => {
  const DURATION = 1800000;
  const user = useSupabaseUser();

  const location: Ref<PrivyLocation> = useLocalStorage(
    `location-${user?.value?.id}`,
    {},
  );

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

    // Store interval ID for cleanup
    const intervalId = setInterval(async () => {
      await fetchLocation();
    }, DURATION);

    // Return cleanup function
    return () => clearInterval(intervalId);
  };

  async function fetchLocation() {
    try {
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
    } catch (error) {
      console.warn("Failed to fetch location:", error);
      // Don't update location on error, keep existing data
    }
  }

  return {
    location,
    isEmpty,
    init,
  };
});
