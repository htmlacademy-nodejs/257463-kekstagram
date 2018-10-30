'use strict';
const versionInfo = require(`./version.js`);
const licenseInfo = require(`./license.js`);
const descriptionInfo = require(`./description.js`);
const authorInfo = require(`./author.js`);
const serverInfo = require(`./server`);
const colors = require(`colors/safe`);
module.exports.Command = {
  name: `--help`,
  description: `Shows console programm available commands`,
  execute() {
    console.log(`Доступные команды:\n${colors.grey(this.name)} — ${colors.green(this.description)};\n${colors.grey(versionInfo.Command.name)} — ${colors.green(versionInfo.Command.description)};\n${colors.grey(authorInfo.Command.name)} — ${colors.green(authorInfo.Command.description)};\n${colors.grey(descriptionInfo.Command.name)} — ${colors.green(descriptionInfo.Command.description)};\n${colors.grey(licenseInfo.Command.name)} — ${colors.green(licenseInfo.Command.description)};\n${colors.grey(serverInfo.Command.name)} — ${colors.green(serverInfo.Command.description)};`);
  }
};
