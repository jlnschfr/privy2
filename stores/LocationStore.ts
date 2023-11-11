import { defineStore } from "pinia";

export const useLocationStore = defineStore("LocationStore", () => {
  const location: Ref<PrivyLocation> = ref();
  const weather: Ref<PrivyWeather> = ref();

  // add functionality to store to local storage

  return {
    location,
    weather,
  };
});
