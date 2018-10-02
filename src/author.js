'use strict';
const packageInfo = require(`../package.json`);
module.exports.Command = {
  name: `author`,
  description: `Shows program author`,
  execute() {
    console.log(`${packageInfo.author}`);
  }
};
