'use strict';
const packageInfo = require(`../package.json`);
const colors = require(`colors/safe`);
module.exports.Command = {
  name: `author`,
  description: `Shows program author`,
  execute() {
    console.log(colors.grey(`${packageInfo.author}`));
  }
};
