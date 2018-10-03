'use strict';
const versionInfo = require(`./version.js`);
const licenseInfo = require(`./license.js`);
const descriptionInfo = require(`./description.js`);
const authorInfo = require(`./author.js`);
module.exports.Command = {
  name: `help`,
  description: `Shows console programm available commands`,
  execute() {
    console.log(`Доступные команды:\n${this.name} — ${this.description};\n${versionInfo.Command.name} — ${versionInfo.Command.description};\n${authorInfo.Command.name} — ${authorInfo.Command.description};\n${descriptionInfo.Command.name} — ${descriptionInfo.Command.description};\n${licenseInfo.Command.name} — ${licenseInfo.Command.description};`);
  }
};
