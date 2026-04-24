import { defineStore } from "pinia";

export const useWeatherStore = defineStore("WeatherStore", () => {
  const DURATION = 1800000;

  const locationStore = useLocationStore();
  const weather: Ref<PrivyWeather> = ref({});

  locationStore.$subscribe(async (_, state) => {
    await fetchWeather(state.location);
  });

  // Does a weather object for the current location exist?
  const isValid: ComputedRef<boolean> = computed(
    () =>
      weather.value?.location?.lat === locationStore.location.lat &&
      weather.value?.location?.long === locationStore.location.long,
  );

  // Is the weather out of date and older than 30 min?
  const isOutOfDate: ComputedRef<boolean> = computed(
    () => Date.now() - weather.value?.timestamp > DURATION,
  );

  const init = async () => {
    if (locationStore.isEmpty) return;

    if (!isValid.value || isOutOfDate.value) {
      await fetchWeather(locationStore.location);
    }
  };

  const fetchWeather = async (location: PrivyLocation) => {
    const url: URL = new URL(
      "/.netlify/functions/weather",
      window.location.origin,
    );
    url.searchParams.set("lat", String(location.lat));
    url.searchParams.set("long", String(location.long));
    const response: Response = await fetch(url);
    if (response.ok) {
      const json: PrivyWeatherData = await response.json();
      weather.value = {
        timestamp: Date.now(),
        location,
        data: json,
      };
    }
  };

  return {
    weather,
    isValid,
    init,
  };
});
