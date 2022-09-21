import readline from "readline";

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout,
});

const getZipCode = (weatherQuery, cb) => {
  if (weatherQuery.zipCode || weatherQuery.city) {
    return cb(weatherQuery.zipCode);
  }
  rl.question("What is zipcode? ", function (zipcode) {
    cb(zipcode);
  });
};

const getCity = (weatherQuery, cb) => {
  if (weatherQuery.city || weatherQuery.zipCode) {
    return cb(weatherQuery.city);
  }
  rl.question("What is city name? ", function (name) {
    cb(name);
  });
};

const getTemp = (weatherQuery, cb) => {
  if (weatherQuery.temp) {
    return cb(weatherQuery.temp);
  }
  rl.question("What is temp(c/f)? ", function (temp) {
    cb(temp);
  });
};

const getImportFilePath = (weatherQuery, cb) => {
  if (weatherQuery.import) {
    return cb(weatherQuery.import);
  }
  rl.question("What is file path? ", function (filePath) {
    cb(filePath);
  });
};

export const showPrompt = (parsedFlags, cb) => {
  const weatherQuery = parsedFlags;

  getZipCode(weatherQuery, (zipCode) => {
    weatherQuery.zipCode = zipCode;
    getCity(weatherQuery, (city) => {
      weatherQuery.city = city;
      getTemp(weatherQuery, (temp) => {
        weatherQuery.temp = temp;
        cb(weatherQuery);
        rl.close();
      });
    });
  });
};

export const showImportPrompt = (parsedFlags, cb) => {
  const weatherQuery = parsedFlags;
  getImportFilePath(weatherQuery, (filePath) => {
    weatherQuery.import = filePath;
    cb(weatherQuery);
    rl.close();
  });
};
