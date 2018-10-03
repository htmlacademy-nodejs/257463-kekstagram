'use strict';
const packageInfo = require(`../package.json`);
const colors = require(`colors/safe`);
module.exports.Command = {
  name: ``,
  description: `Shows greatings message of console programm`,
  execute() {
    console.log(`Привет пользователь!\nЭта программа будет запускать сервер \"${colors.blue(packageInfo.name)}\".\nАвтор: ${colors.grey(packageInfo.author)}.\n`);
  }
};
