#! /usr/bin/env node
import { showImportPrompt, showPrompt } from "../services/prompt";
import {
  parseFlags,
  config,
  readStoredCitiesFile,
  writeToStdout,
  setQueryResult,
} from "../services/util";
import { FetchByCityNameCommand, FetchByZipCodeCommand } from "./command";

const Weather = function () {
  let current = {};
  let help = `
oweather a tools to disply weather based on place 1.0
USAGE: oweather [OPTIONS]
Options:
  -h,  --help            show this help message
  -c,  --city            get weather by city name, e.g. paris
  -z, --zip-code         get weather by zipcode, e.g. <zipcode>,<country_code> = 75015,fr
  -t,  --temp            set temprature f|c
  -i,  --import          set file path to get weather for all cities in the file, file format should be in yaml
  -l,  --last-config     load last query run
  `;
  return {
    async execute(command) {
      current = await command.execute(command.value);
      return current;
    },
    getCurrentValue() {
      return current;
    },
    getHelp() {
      return help;
    },
  };
};

function runCommand(weatherQuery) {
  const weather = Weather();
  if (weatherQuery.city) {
    return weather.execute(
      FetchByCityNameCommand({
        city: weatherQuery.city,
        temp: weatherQuery.temp,
      })
    );
  } else {
    return weather.execute(
      FetchByZipCodeCommand({
        zipCode: weatherQuery.zipCode,
        temp: weatherQuery.temp,
      })
    );
  }
}

async function bulkRunCommand(cities) {
  Promise.all(cities.map((city) => runCommand(city))).then((data) => {
    const citiesWeather = [];
    data.forEach((item) => {
      citiesWeather.push(JSON.stringify(setQueryResult(item)));
    });
    writeToStdout(citiesWeather);
  });
}

async function loadLastConfig(lastConfig: boolean) {
  if (lastConfig) {
    const weatherQuery = config().load();
    const data = await runCommand(weatherQuery);
    writeToStdout(JSON.stringify(setQueryResult(data)));
  }
}

async function importFile(isImport: boolean, parsedFlags) {
  if (isImport) {
    showImportPrompt(parsedFlags, async (weatherQuery) => {
      const cities = readStoredCitiesFile(weatherQuery.import);
      await bulkRunCommand(cities);
    });
  }
}

async function runQuery(parsedFlags) {
  if (!parsedFlags.import && !parsedFlags.lastConfig) {
    showPrompt(parsedFlags, async (weatherQuery) => {
      config().store(weatherQuery);
      const data = await runCommand(weatherQuery);
      writeToStdout(JSON.stringify(setQueryResult(data)));
    });
  }
}

async function displayHelp(help: boolean) {
  if (help) {
    const weather = Weather();
    writeToStdout(weather.getHelp());
    process.exit(0);
  }
}

async function run() {
  const parsedFlags = parseFlags(process.argv.slice(2));
  displayHelp(parsedFlags.help);
  loadLastConfig(parsedFlags.lastConfig);
  importFile(parsedFlags.import, parsedFlags);
  runQuery(parsedFlags);
}

run();
