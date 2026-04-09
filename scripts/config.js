var config = {};
config.rootUrl = "https://badaro.github.io/validator/";
config.formats = [
  { "name": "2015 Modern", "key": "2015modern", "datafile":"formats/2015modern.json" },
  { "name": "Pre FIRE Modern", "key": "prefiremodern", "datafile":"formats/prefiremodern.json" },
  { "name": "Premodern", "key": "premodern", "datafile":"formats/premodern.json" },
  { "name": "Classic Legacy", "key": "classiclegacy", "datafile":"formats/classiclegacy.json" }
];
console.log("Configuration set successfully");
console.log(config);