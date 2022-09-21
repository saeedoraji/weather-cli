import got from "got";
import { getWeatherUrl } from "../config/base";

const Command = function (execute, value) {
  this.execute = execute;
  this.value = value;
};
const getWeatherByZipCode = async function ({ zipCode, temp }) {
  return await got.get(getWeatherUrl(temp).zipCode(zipCode)).json();
};

const getWeatherByCityName = async function ({ city, temp }) {
  return await got.get(getWeatherUrl(temp).city(city)).json();
};

export function FetchByZipCodeCommand({ zipCode, temp }) {
  return new Command(getWeatherByZipCode, { zipCode, temp });
}

export function FetchByCityNameCommand({ city, temp }) {
  return new Command(getWeatherByCityName, { city, temp });
}
