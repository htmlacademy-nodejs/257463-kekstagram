'use strict';
const packageInfo = require(`../package.json`);
const colors = require(`colors/safe`);
module.exports.Command = {
  name: `--version`,
  description: `Shows program version`,
  execute() {
    let buffer = ``;
    let string = packageInfo.version.split(`.`);
    for (let i = 0; i < string.length; i++) {
      switch (i) {
        case 0: // major
          string[i] = colors.red(string[i]);
          buffer = string[i];
          break;
        case 1: // minor
          string[i] = colors.green(string[i]);
          buffer = buffer.concat(`.`, string[i]);
          break;
        case 2: // patch
          string[i] = colors.blue(string[i]);
          buffer = buffer.concat(`.`, string[i]);
          break;
      }
    }
    console.log(`v${buffer}`);
  }
};
