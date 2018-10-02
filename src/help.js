'use strict';
const versionInfo = require(`./version.js`);
module.exports.Command = {
  name: `help`,
  description: `Shows console programm available commands`,
  execute() {
    console.log(`Доступные команды:\n${this.name} — ${this.description};\n${versionInfo.Command.name} — ${versionInfo.Command.description};`);
  }
};
