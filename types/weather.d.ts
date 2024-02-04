declare interface PrivyWeather {
  timestamp?: number;
  location?: PrivyLocation;
  data?: PrivyWeatherData;
}

declare interface PrivyWeatherData {
  current: {
    temp_c: string;
    condition: {
      text: string;
    };
  };
}
