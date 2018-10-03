'use strict';
process.stdin.setEncoding(`utf8`);

const version = require(`./src/version.js`).Command;
const help = require(`./src/help.js`).Command;
const empty = require(`./src/empty.js`).Command;
const author = require(`./src/author.js`).Command;
const license = require(`./src/license.js`).Command;
const description = require(`./src/description.js`).Command;

const commands = [version, help, empty, author, license, description];

process.stdin.on(`data`, (chunk) => {
  const str = chunk.trim();
  commands.forEach((item) => {
    if (item.name === str) {
      item.execute();
      process.exit(0);
    }
  });
  console.error(`Неизвестная команда ` + chunk + `\nЧтобы прочитать правила использования приложения, наберите \"help\"\n`);
  process.exit(1);
});

process.on(`exit`, (code) => {
  console.log(`Exit with code: ` + code);
});
