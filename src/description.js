'use strict';
const packageInfo = require(`../package.json`);
module.exports.Command = {
  name: `description`,
  description: `Shows program description`,
  execute() {
    console.log(`${packageInfo.description}`);
  }
};
