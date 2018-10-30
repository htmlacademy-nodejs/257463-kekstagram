'use strict';
process.stdin.setEncoding(`utf8`);

const version = require(`./src/version.js`).Command;
const help = require(`./src/help.js`).Command;
const empty = require(`./src/empty.js`).Command;
const author = require(`./src/author.js`).Command;
const license = require(`./src/license.js`).Command;
const server = require(`./src/server.js`).Command;
const description = require(`./src/description.js`).Command;
const colors = require(`colors/safe`);

const commands = [version, help, empty, author, license, description, server];
const args = process.argv.slice(2);

if (args.length === 0) {
  empty.execute();
} else {
  const matches = commands.filter((e) => e.name === args[0]);
  if (matches.length >= 1) {
    if (args.length > 1) {
      matches[0].execute(args[1]);
    } else {
      matches[0].execute();
    }
  } else {
    console.error(colors.red(`Неизвестная команда `) + colors.blue(args) + colors.red(`\nЧтобы прочитать правила использования приложения, наберите \"${colors.blue(help.name)}\"\n`));
    process.exit(1);
  }
}

process.on(`exit`, (code) => {
  console.log(`Exit with code: ` + code);
});
