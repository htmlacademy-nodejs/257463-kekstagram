'use strict';
const packageInfo = require(`../package.json`);

module.exports.Command = {
  name: ``,
  description: `Shows greatings message of console programm`,
  execute() {
    console.log(`Привет пользователь!\nЭта программа будет запускать сервер \"${packageInfo.name}\".\nАвтор: ${packageInfo.author}.\n`);
  }
};
