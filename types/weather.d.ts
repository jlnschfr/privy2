declare interface PrivyWeather {
  date: Date;
  data: PrivyWeatherData;
}

declare interface PrivyWeatherData {
  current: {
    temp_c: string;
    condition: {
      text: string;
    };
  };
}
