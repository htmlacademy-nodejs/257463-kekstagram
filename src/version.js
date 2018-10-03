'use strict';
const packageInfo = require(`../package.json`);
const colors = require(`colors/safe`);
module.exports.Command = {
  name: `version`,
  description: `Shows program version`,
  execute() {
    let buffer = ``;
    for (let i = 0; i < packageInfo.version.length; i++) {
      switch (i) {
        case 0:
          buffer += colors.red(packageInfo.version[i]);
          break;
        case 2:
          buffer += colors.green(packageInfo.version[i]);
          break;
        case 4:
          buffer += colors.blue(packageInfo.version[i]);
          break;
        default:
          buffer += packageInfo.version[i];
      }
    }
    console.log(`v${buffer}`);
  }
};
