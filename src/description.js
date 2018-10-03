'use strict';
const packageInfo = require(`../package.json`);
const colors = require(`colors/safe`);
module.exports.Command = {
  name: `description`,
  description: `Shows program description`,
  execute() {
    console.log(`${colors.green(packageInfo.description)}`);
  }
};
