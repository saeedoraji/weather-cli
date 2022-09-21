const apiKey = "553ff3999031073dd03eccd9f85939db";
const openWeatherMapUrl = "http://api.openweathermap.org";
const getApiKey = () => `appid=${apiKey}`;
const temperature = {
  f: "imperial",
  c: "metric",
};
export const getWeatherUrl = (tempType) => {
  const weatherPath = `${openWeatherMapUrl}/data/2.5/weather?${getApiKey()}&units=${
    temperature[tempType]
  }&`;
  return {
    latlon: (lat, lon) => `${weatherPath}&lat=${lat}&lon=${lon}`,
    /**
     * @param {string} city - paris
     */
    city: (city) => `${weatherPath}&q=${city}`,
    /**
     * @param {string} zipCode - 75015,fr
     */
    zipCode: (zipCode) => `${weatherPath}&q=${zipCode}`,
  };
};
