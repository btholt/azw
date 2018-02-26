const { generateCombination: uuid } = require("gfycat-style-urls");

module.exports = {
  name: uuid(2, "")
    .replace("-", "")
    .toLowerCase(),
  version: "1.0.0",
  scripts: {
    start: "serve -s -n ."
  },
  dependencies: {
    serve: "^6.4.0"
  }
};
