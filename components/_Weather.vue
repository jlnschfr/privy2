<script setup lang="ts">
const locationStore = useLocationStore();

const interval: Ref<any> = ref();
const temperature: Ref<string> = ref("");
const city: Ref<string> = ref("");
const description: Ref<string> = ref("");
const icon: Ref<string> = ref("");
const active: Ref<boolean> = ref(false);

onMounted(() => {
  if (navigator.onLine) {
    interval.value = setInterval(checkWeather, 300000);
    checkWeather();
  }
});

onUnmounted(() => {
  clearInterval(interval.value);
});

async function checkWeather() {
  const location: PrivyLocation = locationStore.location;
  const weather: PrivyWeather = locationStore.weather;

  const offset: number = 1800000;
  const cachedTimestamp: number = weather?.date?.getTime() + offset;
  const nowTimestamp: number = new Date().getTime();

  // check if stored weather is not older then 0.5 hours
  if (location && weather && cachedTimestamp > nowTimestamp) {
    applyLocationAndWeather(location, weather);
  } else {
    try {
      const newLocation: PrivyLocation = await getLocation();
      const newWeatherData: PrivyWeatherData = await getWeather(
        newLocation.lat,
        newLocation.long,
      );

      const newWeather: PrivyWeather = {
        date: new Date(),
        data: newWeatherData,
      };

      locationStore.location = newLocation;
      locationStore.weather = newWeather;

      applyLocationAndWeather(newLocation, newWeather);
    } catch (err) {
      // console.log(err)
    }
  }
}

function getLocation(): Promise<PrivyLocation> {
  return new Promise((resolve, reject) => {
    if (!navigator.geolocation) {
      reject(new Error("Browser doesn't support Geolocation API"));
    } else {
      navigator.geolocation.getCurrentPosition(
        async (position) => {
          const lat: number = position.coords.latitude;
          const long: number = position.coords.longitude;
          const city: string = await getCity(lat, long);
          resolve({ lat, long, city });
        },
        () => {
          reject(new Error("Browser doesn't support Geolocation API"));
        },
      );
    }
  });
}

function getCity(lat: number, long: number): Promise<string> {
  // eslint-disable-next-line no-async-promise-executor
  return new Promise(async (resolve, reject) => {
    const url: URL = new URL("https://nominatim.openstreetmap.org/reverse");
    url.searchParams.set("format", "json");
    url.searchParams.set("lat", String(lat));
    url.searchParams.set("lon", String(long));

    const response: Response = await fetch(url);
    if (response.ok) {
      const json = await response.json();
      resolve(`${json.address?.suburb}, ${json.address?.country}`);
    } else {
      reject(new Error("Can't fetch Location Data"));
    }
  });
}

function getWeather(lat: number, long: number): Promise<PrivyWeatherData> {
  // eslint-disable-next-line no-async-promise-executor
  return new Promise(async (resolve, reject) => {
    const url: URL = new URL("https://api.weatherapi.com/v1/current.json");
    url.searchParams.set("aqi", "no");
    url.searchParams.set("key", "8e53893c18944438bdf142917230811");
    url.searchParams.set("q", `${lat},${long}`);
    const response: Response = await fetch(url);
    if (response.ok) {
      const json: PrivyWeatherData = await response.json();
      resolve(json);
    } else {
      reject(new Error("Can't fetch Weather Data"));
    }
  });
}

function applyLocationAndWeather(
  location: PrivyLocation,
  weather: PrivyWeather,
) {
  const { current } = weather.data;

  temperature.value = current.temp_c;
  description.value = current.condition.text;
  icon.value = getIcon(current.condition.text);
  city.value = location.city;
  active.value = true;
}

function getIcon(icon: string): string {
  const iconMap = {
    Clear: "SvgoWeatherClear",
    Sunny: "SvgoWeatherSunny",
    "Partly cloudy": "SvgoWeatherCloudy",
    Cloudy: "SvgoWeatherCloudy",
    Overcast: "SvgoWeatherCloudy",
    Mist: "SvgoWeatherMist",
    "Patchy rain possible": "SvgoWeatherRain",
    "Patchy snow possible": "SvgoWeatherSnow",
    "Patchy sleet possible": "SvgoWeatherSleet",
    "Patchy freezing drizzle possible": "SvgoWeatherDrizzle",
    "Thundery outbreaks possible": "SvgoWeatherThunder",
    "Blowing snow": "SvgoWeatherSnow",
    Blizzard: "SvgoWeatherBlizzard",
    Fog: "SvgoWeatherFog",
    "Freezing fog": "SvgoWeatherFog",
    "Patchy light drizzle": "SvgoWeatherDrizzle",
    "Light drizzle": "SvgoWeatherDrizzle",
    "Freezing drizzle": "SvgoWeatherDrizzle",
    "Heavy freezing drizzle": "SvgoWeatherDrizzle",
    "Patchy light rain": "SvgoWeatherRain",
    "Light rain": "SvgoWeatherRain",
    "Moderate rain at times": "SvgoWeatherRain",
    "Moderate rain": "SvgoWeatherRain",
    "Heavy rain at times": "SvgoWeatherRain",
    "Heavy rain": "SvgoWeatherRain",
    "Light freezing rain": "SvgoWeatherRain",
    "Moderate or heavy freezing rain": "SvgoWeatherRain",
    "Light sleet": "SvgoWeatherSleet",
    "Moderate or heavy sleet": "SvgoWeatherSleet",
    "Patchy light snow": "SvgoWeatherSnow",
    "Light snow": "SvgoWeatherSnow",
    "Patchy moderate snow": "SvgoWeatherSnow",
    "Moderate snow": "SvgoWeatherSnow",
    "Patchy heavy snow": "SvgoWeatherSnow",
    "Heavy snow": "SvgoWeatherSnow",
    "Ice pellets": "SvgoWeatherIcePellets",
    "Light rain shower": "SvgoWeatherDrizzle",
    "Moderate or heavy rain shower": "SvgoWeatherRain",
    "Torrential rain shower": "SvgoWeatherRain",
    "Light sleet showers": "SvgoWeatherSleet",
    "Moderate or heavy sleet showers": "SvgoWeatherSleet",
    "Light snow showers": "SvgoWeatherSnow",
    "Moderate or heavy snow showers": "SvgoWeatherSnow",
    "Light showers of ice pellets": "SvgoWeatherIcePellets",
    "Moderate or heavy showers of ice pellets": "SvgoWeatherIcePellets",
    "Patchy light rain with thunder": "SvgoWeatherThunder",
    "Moderate or heavy rain with thunder": "SvgoWeatherThunder",
    "Patchy light snow with thunder": "SvgoWeatherThunder",
    "Moderate or heavy snow with thunder": "SvgoWeatherThunder",
  } as any;

  return iconMap[icon];
}
</script>

<template>
  <div v-if="active">
    <div class="w-full">{{ city }}</div>
    <div v-if="temperature !== ''" class="mt-2 flex items-center">
      <component :is="icon" class="w-6 fill-current" />
      <div>
        <p class="text-2xl leading-none">
          {{ Math.round(parseInt(temperature)) }}°
        </p>
        <p>{{ description }}</p>
      </div>
    </div>
  </div>
</template>
