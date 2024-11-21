var config = {};
config.rootUrl = "https://badaro.github.io/validator/";
config.transformUrl = "https://api.scryfall.com/cards/search?order=cmc&q=%28is%3Aflip+or+is%3Adfc+or+is%3Aadventure%29+-is%3Aextra+-is%3Adigital+is%3Afirstprint";
config.formats = [
  { "name": "2015 Modern", "key": "2015modern", "datafile":"formats/2015modern.json" },
  { "name": "Pre FIRE Modern", "key": "prefiremodern", "datafile":"formats/prefiremodern.json" }
];
console.log("Configuration set successfully");
console.log(config);