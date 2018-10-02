'use strict';
const packageInfo = require(`../package.json`);
module.exports.Command = {
  name: `license`,
  description: `Shows program license`,
  execute() {
    console.log(`${packageInfo.license}`);
  }
};
