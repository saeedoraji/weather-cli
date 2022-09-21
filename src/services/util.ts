import os from "os";
import fs from "fs";
import yaml from "js-yaml";

const getIndex = function (argv, short, full) {
  const shortIndex = argv.indexOf(short);
  const fullIndex = argv.indexOf(full);
  return shortIndex > -1 ? shortIndex : fullIndex;
};

function getCityIndex(argv) {
  return getIndex(argv, "-c", "--city");
}

function getZipCodeIndex(argv) {
  return getIndex(argv, "-z", "--zip-code");
}

function getTempIndex(argv) {
  return getIndex(argv, "-t", "--temp");
}

function getLastConfigIndex(argv) {
  return getIndex(argv, "-l", "--last-config");
}

function getImportFileIndex(argv) {
  return getIndex(argv, "-i", "--import");
}

function getHelpIndex(argv) {
  return getIndex(argv, "-h", "--help");
}

export const parseFlags = (argv) => {
  if (!argv.length) {
    return { city: null, zipCode: null, temp: null };
  }

  const helpIndex = getHelpIndex(argv);
  if (helpIndex > -1) {
    return { help: true };
  }

  const lastConfigIndex = getLastConfigIndex(argv);
  if (lastConfigIndex > -1) {
    return { lastConfig: true };
  }

  const importIndex = getImportFileIndex(argv);
  if (importIndex > -1) {
    return { import: importIndex > -1 ? argv[importIndex + 1] : null };
  }

  const cityIndex = getCityIndex(argv);
  const zipCodeIndex = getZipCodeIndex(argv);
  const tempIndex = getTempIndex(argv);
  return {
    city: cityIndex > -1 ? argv[cityIndex + 1] : null,
    zipCode: zipCodeIndex > -1 ? argv[zipCodeIndex + 1] : null,
    temp: tempIndex > -1 ? argv[tempIndex + 1] : null,
  };
};

export const config = () => {
  const userHomeDirectory = os.homedir();
  return {
    store(weatherQuery) {
      fs.writeFile(
        `${userHomeDirectory}/.oweather`,
        JSON.stringify(weatherQuery),
        (err) => {
          if (err) {
            console.error(err);
          }
        }
      );
    },
    load() {
      try {
        const data = fs.readFileSync(`${userHomeDirectory}/.oweather`, "utf-8");
        return JSON.parse(data);
      } catch (err) {
        console.log(err);
        process.exit(0);
      }
    },
  };
};

export const readStoredCitiesFile = (filePath) => {
  try {
    const fileContents = fs.readFileSync(filePath, "utf-8");
    const data = yaml.load(fileContents);
    return data;
  } catch (err) {
    console.log(err);
    process.exit(0);
  }
};

export const writeToStdout = (data) => {
  console.log(data);
};

export const setQueryResult = (data) => {
  if (!data) {
    return { temp: null, weatherDescription: null, humidity: null };
  }
  return {
    temp: data.main.temp,
    weatherDescription: data.weather[0]?.description ?? "",
    humidity: data.main.humidity,
  };
};
