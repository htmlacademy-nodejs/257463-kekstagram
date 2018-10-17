'use strict';
const packageInfo = require(`../package.json`);
const colors = require(`colors/safe`);
const fs = require(`fs`);
const path = require(`path`);
const generateData = require(`../src/generateData.js`).generateEntity;

module.exports.Command = {
  name: ``,
  description: `Shows greatings message of console programm`,
  execute() {
    console.log(`Привет пользователь!\nЭта программа будет запускать сервер \"${colors.blue(packageInfo.name)}\".\nАвтор: ${colors.grey(packageInfo.author)}.\nХотите сгенерировать данные ? (${colors.blue(`Y`)} / ${colors.blue(`N`)})`);
    readData();
  }
};

const data = {
  MIN_NUMBER_OF_ELEMENTS: 1,
  MAX_NUMBER_OF_ELEMENTS: 10,
  MAX_PATH_LENGTH: 100,
  FILE_FORMAT: {
    table: []
  }
};

let answers = {
  numberOfElements: 0,
  path: ``
};

// Реализация конечного автомата (вроде как автомат Мура) для перехода состояний при вводе в консоль
const finalStateMachine = {
  state: `doGenerate`,
  transitions: {
    'doGenerate': function (answer) {
      if (answer.length > 3) {
        console.error(colors.red(`Неизвестная команда: ${answer}`));
        process.exit(1);
      } else {
        if (answer.slice(0, 3).toLowerCase() === `yes` || answer.slice(0, 3).toLowerCase() === `y`) {
          console.log(`${colors.blue(`сколько`)} элементов нужно создать?`);
          console.error(`Введите ${colors.blue(`число`)} от ${colors.blue(data.MIN_NUMBER_OF_ELEMENTS)} до ${colors.blue(data.MAX_NUMBER_OF_ELEMENTS)}`);
          finalStateMachine.changeState(`numberOfGeneratedObjects`);
        } else if (answer.slice(0, 2).toLowerCase() === `no` || answer.slice(0, 2).toLowerCase() === `n`) {
          console.log(`okay...`);
          process.exit(0);
        } else {
          console.error(colors.red(`Неизвестная команда: ${answer}`));
          process.exit(1);
        }
      }
    },
    'numberOfGeneratedObjects': function (answer) {
      answer = parseInt(answer, 10);
      if (typeof answer === `number`) {
        if (answer > data.MAX_NUMBER_OF_ELEMENTS || answer <= 0) {
          console.error(colors.red(`Нужно ввести ${colors.blue(`число`)} от ${colors.blue(data.MIN_NUMBER_OF_ELEMENTS)} до ${colors.blue(data.MAX_NUMBER_OF_ELEMENTS)}`));
          process.exit(1);
        }
        answers.numberOfElements = answer;
        console.log(`укажите ${colors.blue(`путь`)}(относительный)`);
        console.log(`Ваш абсолютный путь: ${__dirname}`);
        finalStateMachine.changeState(`path`);
      } else {
        console.error(colors.red(`Нужно ввести ${colors.blue(`число`)}`));
        process.exit(1);
      }
    },
    'path': function (answer) {
      fs.open(path.join(__dirname, answer + `.json`), `wx`, function (err, fd) {
        if (err) {
          if (err.code === `EEXIST`) {
            console.error(`Файл существует, перезаписать? (${colors.blue(`Y`)} / ${colors.blue(`N`)})`);
            answers.path = answer;
            finalStateMachine.changeState(`doRewrite`);
            return;
          }
          throw err;
        }
        let buffer = data.FILE_FORMAT;
        for (let i = 0; i < answers.numberOfElements; i++) {
          buffer.table.push(generateData());
        }
        buffer = new Buffer(JSON.stringify(buffer), `utf8`);
        fs.write(fd, buffer, 0, buffer.length, null, function (_err) {
          if (err) {
            console.error(err.message);
            return;
          }
          fs.close(fd, function () {
            console.log(`${colors.blue(`file`)} created`);
            process.exit(0);
          });
        });
      });
    },
    'doRewrite': function (answer) {
      if (answer.length > 3) {
        console.error(colors.red(`Неизвестная команда: ${answer}`));
        process.exit(1);
      } else {
        if (answer.slice(0, 3).toLowerCase() === `yes` || answer.slice(0, 3).toLowerCase() === `y`) {
          fs.open(path.join(__dirname, answers.path + `.json`), `w`, function (err, fd) {
            if (err) {
              console.error(err.message);
              throw err;
            }
            let buffer = data.FILE_FORMAT;
            for (let i = 0; i < answers.numberOfElements; i++) {
              buffer.table.push(generateData());
            }
            buffer = new Buffer(JSON.stringify(buffer), `utf8`);
            fs.write(fd, buffer, 0, buffer.length, null, function (_err) {
              if (err) {
                console.error(err.message);
                return;
              }
              fs.close(fd, function () {
                console.log(`${colors.blue(`file`)} created`);
                process.exit(0);
              });
            });
          });
        } else if (answer.slice(0, 2).toLowerCase() === `no` || answer.slice(0, 2).toLowerCase() === `n`) {
          console.log(`okay...`);
          process.exit(0);
        } else {
          console.error(colors.red(`Неизвестная команда: ${answer}`));
          process.exit(1);
        }
      }
    }
  },
  changeState(state) {
    this.state = state;
  },
  action(answer) {
    this.transitions[this.state](answer);
  }
};

function readData() {
  process.stdin.on(`data`, function (chunk) {
    const answer = chunk.trim();
    finalStateMachine.action(answer);
  });
}

module.exports.readData = readData;
