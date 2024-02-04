import { defineStore } from "pinia";
import { useLocalStorage } from "@vueuse/core";

export const useLocationStore = defineStore("LocationStore", () => {
  const user = useSupabaseUser();

  const location: Ref<PrivyLocation> = useLocalStorage(
    `location-${user?.value?.id}`,
    {},
  );

  const isEmpty: ComputedRef<boolean> = computed(
    () => Object.keys(location.value).length === 0,
  );

  const isOlderThanHalfAnHour: ComputedRef<boolean> = computed(
    () => Date.now() - location.value?.timestamp > 1800000,
  );

  const init = () => {
    if (isEmpty.value) {
      fetchLocation();
    } else if (isOlderThanHalfAnHour.value) {
      fetchLocation();
    }

    // Todo: Interval 30min
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
