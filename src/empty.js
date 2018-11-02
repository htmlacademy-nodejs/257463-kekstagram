'use strict';
const packageInfo = require(`../package.json`);
const colors = require(`colors/safe`);
const fs = require(`fs`);
const path = require(`path`);
const generateData = require(`../src/generate-data/generate-data`).generateEntity;

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
  DATA_DIR: path.join(path.dirname(require.main.filename), `data`),
  FILE_FORMAT: {
    data: []
  }
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
      if (/^-?[0-9]+$/.test(answer)) {
        answer = parseInt(answer, 10);
        if (answer > data.MAX_NUMBER_OF_ELEMENTS || answer <= 0) {
          console.error(colors.red(`Нужно ввести ${colors.blue(`число`)} от ${colors.blue(data.MIN_NUMBER_OF_ELEMENTS)} до ${colors.blue(data.MAX_NUMBER_OF_ELEMENTS)}`));
          process.exit(1);
        }
        finalStateMachine.answers.numberOfElements = answer;
        console.log(`укажите ${colors.blue(`путь`)}(относительный)`);
        console.log(`Ваш абсолютный путь: ${__dirname}`);
        finalStateMachine.changeState(`path`);
      } else {
        console.error(colors.red(`Нужно ввести ${colors.blue(`число`)}`));
        process.exit(1);
      }
    },
    'path': function (answer) {
      if (answer.length < data.MAX_PATH_LENGTH) {
        // mkDirByPathSync(path.join(path.dirname(require.main.filename), `data`)); // создание папки data, если ее нет
        fs.open(path.join(data.DATA_DIR, answer + `.json`), `wx`, function (err, fd) {
          if (err) {
            if (err.code === `EEXIST`) {
              console.error(`Файл существует, перезаписать? (${colors.blue(`Y`)} / ${colors.blue(`N`)})`);
              finalStateMachine.answers.path = answer;
              finalStateMachine.changeState(`doRewrite`);
              return;
            }
            if (err.code === `ENOENT`) {
              console.error(colors.red(`Папка ${colors.blue(`data`)} не найдена`));
              process.exit(1);
            }
            throw err;
          }
          let buffer = data.FILE_FORMAT;
          for (let i = 0; i < finalStateMachine.answers.numberOfElements; i++) {
            buffer.data.push(generateData());
          }
          buffer = new Buffer(JSON.stringify(buffer), `utf8`);
          fs.write(fd, buffer, 0, buffer.length, null, function (_err) {
            if (err) {
              console.error(err.message);
              return;
            }
            console.log(`${colors.blue(`file`)} created`);
            fs.close(fd, process.exit(0));
          });
        });
      } else {
        console.error(colors.red(`Вы превысили максимальную длину пути`));
        process.exit(1);
      }
    },
    'doRewrite': function (answer) {
      if (answer.length > 3) {
        console.error(colors.red(`Неизвестная команда: ${answer}`));
        process.exit(1);
      } else {
        if (answer.slice(0, 3).toLowerCase() === `yes` || answer.slice(0, 3).toLowerCase() === `y`) {
          fs.open(path.join(data.DATA_DIR, finalStateMachine.answers.path + `.json`), `w`, function (err, fd) {
            if (err) {
              console.error(err.message, err.code);
              throw err;
            }
            let buffer = data.FILE_FORMAT;
            for (let i = 0; i < finalStateMachine.answers.numberOfElements; i++) {
              buffer.data.push(generateData());
            }
            buffer = new Buffer(JSON.stringify(buffer), `utf8`);
            fs.write(fd, buffer, 0, buffer.length, null, function (_err) {
              if (err) {
                console.error(err.message, err.code);
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
  },
  answers: {
    doGenerate: null,
    numberOfElements: null,
    path: null,
    doRewrite: null
  }
};

//  функция для создания папки, если ее нет (не нужна, но я ее закоментил, вдруг пригодится)
//  function mkDirByPathSync(targetDir, isRelativeToScript) {
//  const sep = path.sep;
//  const initDir = path.isAbsolute(targetDir) ? sep : ``;
//  const baseDir = isRelativeToScript === true ? __dirname : `.`;

//  return targetDir.split(sep).reduce((parentDir, childDir) => {
//    const curDir = path.resolve(baseDir, parentDir, childDir);
//    try {
//      fs.mkdirSync(curDir);
//    } catch (err) {
//      if (err.code === `EEXIST`) { // curDir already exists!
//        return curDir;
//      }
//      // To avoid `EISDIR` error on Mac and `EACCES`-->`ENOENT` and `EPERM` on Windows.
//      if (err.code === `ENOENT`) { // Throw the original parentDir error on curDir `ENOENT` failure.
//        throw new Error(`EACCES: permission denied, mkdir '${parentDir}'`);
//      }
//      const caughtErr = [`EACCES`, `EPERM`, `EISDIR`].indexOf(err.code) > -1;
//      if (!caughtErr || caughtErr && curDir === path.resolve(targetDir)) {
//        throw err; // Throw if it's just the last created dir.
//      }
//    }
//    return curDir;
//  }, initDir);
//  }

const readData = () => {
  process.stdin.on(`data`, (chunk) => {
    const answer = chunk.trim();
    finalStateMachine.action(answer);
  });
};

module.exports.finalStateMachine = finalStateMachine;
