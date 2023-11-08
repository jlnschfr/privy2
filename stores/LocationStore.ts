import { defineStore } from "pinia";

export const useLocationStore = defineStore("LocationStore", () => {
  const location: Ref<PrivyLocation> = ref();
  const weather: Ref<PrivyWeather> = ref();

  return {
    location,
    weather,
  };
});
