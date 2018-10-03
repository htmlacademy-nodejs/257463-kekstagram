'use strict';
const packageInfo = require(`../package.json`);
const colors = require(`colors/safe`);
module.exports.Command = {
  name: `license`,
  description: `Shows program license`,
  execute() {
    console.log(`${colors.blue(packageInfo.license)}`);
  }
};
