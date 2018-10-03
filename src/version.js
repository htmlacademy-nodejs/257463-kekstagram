'use strict';
const packageInfo = require(`../package.json`);
module.exports.Command = {
  name: `version`,
  description: `Shows program version`,
  execute() {
    console.log(`v${packageInfo.version}`);
  }
};
