<script setup lang="ts">
const locationStore = useLocationStore();

const interval: Ref<any> = ref();
const temperature: Ref<string> = ref("");
const city: Ref<string> = ref("");
const description: Ref<string> = ref("");
const icon: Ref<string> = ref("");
const active: Ref<boolean> = ref(false);

onMounted(() => {
  interval.value = setInterval(checkWeather, 300000);
  checkWeather();
});

onUnmounted(() => {
  clearInterval(interval.value);
});

async function checkWeather() {
  // check if stored weather is not older then 0.5 hours
  const location: PrivyLocation = locationStore.location;
  const weather = locationStore.weather;
  const offset = 1800000;

  if (location && weather && weather.date?.getTime() + offset > new Date()) {
    applyLocationAndWeather(location, weather.data);
  } else {
    try {
      const location: PrivyLocation = await getLocation();
      const weather = await getWeather(location.lat, location.long);
      console.log(location);
      console.log(weather);

      locationStore.location = location;
      locationStore.weather = weather;

      applyLocationAndWeather(location, weather);
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
          const lat = position.coords.latitude;
          const long = position.coords.longitude;
          const city = await getCity(lat, long);
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

function getWeather(lat: number, long: number): Promise<any> {
  // eslint-disable-next-line no-async-promise-executor
  return new Promise(async (resolve, reject) => {
    const url = new URL("http://api.weatherapi.com/v1/current.json");
    url.searchParams.set("aqi", "no");
    url.searchParams.set("key", "8e53893c18944438bdf142917230811");
    url.searchParams.set("q", `${lat},${long}`);
    const response = await fetch(url);
    if (response.ok) {
      const json = await response.json();
      resolve(json);
    } else {
      reject(new Error("Can't fetch Weather Data"));
    }
  });
}

function applyLocationAndWeather(location: PrivyLocation, weather: any) {
  const isNight = !weather.current.is_day;
  const iconMap = generateIconMap(isNight);

  temperature.value = weather.current.temp_c;
  description.value = weather.current.condition.text;
  icon.value = iconMap[weather.current.condition.text];
  city.value = location.city;
  active.value = true;
}

function generateIconMap(isNight: boolean) {
  return {
    freezing_rain_heavy: "SvgoWeatherSleetWiSleet",
    freezing_rain: "SvgoWeatherSleetWiSleet",
    freezing_rain_light: "SvgoWeatherSleetWiSleet",
    freezing_drizzle: "SvgoWeatherSleetWiSleet",
    ice_pellets_heavy: "SvgoWeatherSleetWiHail",
    ice_pellets: "SvgoWeatherSleetWiHail",
    ice_pellets_light: "SvgoWeatherSleetWiHail",
    snow_heavy: "SvgoWeatherSleetWiSnow",
    snow: "SvgoWeatherSleetWiSnow",
    snow_light: "SvgoWeatherSleetWiSnow",
    flurries: "SvgoWeatherSleetWiCloudyGusts",
    tstorm: "SvgoWeatherSleetWiThunderstorm",
    rain_heavy: "SvgoWeatherSleetWiRain",
    rain: "SvgoWeatherSleetWiRain",
    rain_light: "SvgoWeatherSleetWiRain",
    drizzle: "SvgoWeatherSleetWiSprinkle",
    fog_light: "SvgoWeatherSleetWiFog",
    fog: "SvgoWeatherSleetWiFog",
    cloudy: "SvgoWeatherSleetWiCloudy",
    mostly_cloudy: "SvgoWeatherSleetWiCloudy",
    partly_cloudy: "SvgoWeatherSleetWiCloudy",
    mostly_clear: "SvgoWeatherSleetWiCloudy",
    clear: isNight
      ? "SvgoWeatherSleetWiNightClear"
      : "SvgoWeatherSleetWiDaySunny",
  } as any;
}
</script>

<template>
  <div v-if="active">
    <div class="w-full">{{ city }}</div>
    <div v-if="temperature !== ''" class="mt-2 flex items-center">
      <component :is="icon" class="w-6 fill-current" />
      <div>
        <p class="text-2xl leading-none">{{ Math.round(temperature) }}°</p>
        <p>{{ description }}</p>
      </div>
    </div>
  </div>
</template>

<!-- <script>
export default {
  components: {
    CloudlyGustsIcon: () => import("@/assets/svg/weather/wi-cloudy-gusts.svg"),
    CloudlyIcon: () => import("@/assets/svg/weather/wi-cloudy.svg"),
    DaySunnyOvercastIcon: () =>
      import("@/assets/svg/weather/wi-day-sunny-overcast.svg"),
    DaySunnyIcon: () => import("@/assets/svg/weather/wi-day-sunny.svg"),
    FogIcon: () => import("@/assets/svg/weather/wi-fog.svg"),
    HailIcon: () => import("@/assets/svg/weather/wi-hail.svg"),
    NightClearIcon: () => import("@/assets/svg/weather/wi-night-clear.svg"),
    NightCloudyIcon: () => import("@/assets/svg/weather/wi-night-cloudy.svg"),
    RainIcon: () => import("@/assets/svg/weather/wi-rain.svg"),
    SleetIcon: () => import("@/assets/svg/weather/wi-sleet.svg"),
    SnowIcon: () => import("@/assets/svg/weather/wi-snow.svg"),
    SprinkleIcon: () => import("@/assets/svg/weather/wi-sprinkle.svg"),
    ThunderstormIcon: () => import("@/assets/svg/weather/wi-thunderstorm.svg"),
  },
  data() {
    return {
      temperature: "",
      city: "",
      description: "",
      icon: "",
      active: false,
    };
  },
  mounted() {
    this.interval = setInterval(this.checkWeather.bind(this), 300000);
    this.checkWeather();
  },

  unmounted() {
    clearInterval(this.interval);
  },

  methods: {
    async checkWeather() {
      // check if stored weather is not older then 0.5 hours
      const location = this.$store.getters.getLocation();
      const weather = this.$store.getters.getWeather();
      const offset = 1800000;

      if (
        location &&
        weather &&
        weather.date?.getTime() + offset > new Date()
      ) {
        this.applyLocationAndWeather(location, weather.data);
      } else {
        try {
          const location = await this.getLocation();
          const weather = await this.getWeather(location.lat, location.lon);

          this.$store.dispatch("setLocation", location);
          this.$store.dispatch("setWeather", weather);

          this.applyLocationAndWeather(location, weather);
        } catch (err) {
          // console.log(err)
        }
      }
    },

    getLocation() {
      return new Promise((resolve, reject) => {
        if (!navigator.geolocation) {
          reject(new Error("Browser doesn't support Geolocation API"));
        } else {
          navigator.geolocation.getCurrentPosition(
            async (position) => {
              const lat = position.coords.latitude;
              const lon = position.coords.longitude;
              const city = await this.getCity(lat, lon);
              resolve({ lat, lon, city });
            },
            () => {
              reject(new Error("Browser doesn't support Geolocation API"));
            },
          );
        }
      });
    },

    getCity(lat, lon) {
      // eslint-disable-next-line no-async-promise-executor
      return new Promise(async (resolve, reject) => {
        const url = new URL("https://nominatim.openstreetmap.org/reverse");
        url.searchParams.set("format", "json");
        url.searchParams.set("lat", lat);
        url.searchParams.set("lon", lon);
        const response = await fetch(url);
        if (response.ok) {
          const json = await response.json();
          resolve(`${json.address?.suburb}, ${json.address?.country}`);
        } else {
          reject(new Error("Can't fetch Location Data"));
        }
      });
    },

    getWeather(lat, lon) {
      // eslint-disable-next-line no-async-promise-executor
      return new Promise(async (resolve, reject) => {
        const url = new URL("https://api.climacell.co/v3/weather/realtime");
        url.searchParams.set("unit_system", "si");
        url.searchParams.set("apikey", "Kp2il3y21251KTFaYzh82Dmq63h6YmTW");
        url.searchParams.set("lat", lat);
        url.searchParams.set("lon", lon);
        url.searchParams.set("fields", "temp,weather_code,sunset");
        const response = await fetch(url);
        if (response.ok) {
          const json = await response.json();
          resolve(json);
        } else {
          reject(new Error("Can't fetch Weather Data"));
        }
      });
    },

    applyLocationAndWeather(location, weather) {
      const isNight = new Date(weather.sunset.value) < new Date();
      const iconMap = this.generateIconMap(isNight);

      this.temperature = weather.temp.value;
      this.description = weather.weather_code.value.replace("_", " ");
      this.icon = iconMap[weather.weather_code.value];
      this.city = location.city;
      this.active = true;
    },

    generateIconMap(isNight) {
      return {
        freezing_rain_heavy: "SleetIcon",
        freezing_rain: "SleetIcon",
        freezing_rain_light: "SleetIcon",
        freezing_drizzle: "SleetIcon",
        ice_pellets_heavy: "HailIcon",
        ice_pellets: "HailIcon",
        ice_pellets_light: "HailIcon",
        snow_heavy: "SnowIcon",
        snow: "SnowIcon",
        snow_light: "SnowIcon",
        flurries: "CloudlyGustsIcon",
        tstorm: "ThunderstormIcon",
        rain_heavy: "RainIcon",
        rain: "RainIcon",
        rain_light: "RainIcon",
        drizzle: "SprinkleIcon",
        fog_light: "FogIcon",
        fog: "FogIcon",
        cloudy: "CloudlyIcon",
        mostly_cloudy: "CloudlyIcon",
        partly_cloudy: "CloudlyIcon",
        mostly_clear: "CloudlyIcon",
        clear: isNight ? "NightClearIcon" : "DaySunnyIcon",
      };
    },
  },
};
</script> -->
