<script setup lang="ts">
const weatherStore = useWeatherStore();

const temperature: ComputedRef<string> = computed(
  () => weatherStore.weather?.data?.current?.temp_c,
);
const description: ComputedRef<string> = computed(
  () => weatherStore.weather?.data?.current?.condition?.text,
);
const city: ComputedRef<string> = computed(
  () => weatherStore.weather.location?.city,
);
const icon: ComputedRef<string> = computed(() =>
  getIcon(weatherStore.weather?.data?.current?.condition?.text),
);
const isValid: ComputedRef<boolean> = computed(() => weatherStore.isValid);

function getIcon(icon: string): string {
  const fallbackIcon = "SvgoWeatherClear";

  if (!icon) return fallbackIcon;
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
    Fog: "SvgoWeatherMist",
    "Freezing fog": "SvgoWeatherMist",
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

  return iconMap[icon] || fallbackIcon;
}
</script>

<template>
  <div v-if="isValid">
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
