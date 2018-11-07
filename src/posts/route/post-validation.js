'use strict';

// const BadRequestError = require(`../../error/bad-request-error`);

const postValidation = (query) => {
  let messages = [];

  if (!checkFilename(query.filename).correct) {
    messages.push({url: checkFilename(query.filename).messages});
  }
  if (!checkNumberInInterval(query.scale, 0, 100).correct) {
    messages.push({scale: checkNumberInInterval(query.scale, 0, 100).messages});
  }
  if (!checkEffect(query.effect).correct) {
    messages.push({effect: checkEffect(query.effect).messages});
  }
  if (!checkHashtags(query.hashtags).correct) {
    messages.push({hashtags: checkHashtags(query.hashtags).messages});
  }
  if (!checkString(query.description).correct) {
    messages.push({description: checkString(query.description).messages});
  }
  return messages;
};

module.exports = postValidation;

// имя файла
function checkFilename(string) {
  let correct = true;
  let messages = [];

  if (typeof string !== `string`) {
    correct = false;
    messages.push(`Value must be a string`);
    return {correct, messages};
  }
  if (!isValidFilename(string)) {
    correct = false;
    messages.push(`invalid name of file`);
  }
  return {correct, messages};
}

// строка, не более length символов
function checkString(string, length) {
  let correct = true;
  let messages = [];
  if (typeof string !== `string`) {
    correct = false;
    messages.push(`Value must be a string`);
    return {correct, messages};
  }
  if (string.length > length) {
    correct = false;
    messages.push(`string has too many characters. max length is: ${length}`);
  }
  return {correct, messages};
}

// число, в пределах от begin до end
function checkNumberInInterval(number, begin, end) {
  let correct = true;
  let messages = [];
  if (!/^-?[0-9]+$/.test(number)) {
    correct = false;
    messages.push(`this is not a number`);
    return {correct, messages};
  }
  number = parseInt(number, 10);
  if (number < begin || number > end) {
    correct = false;
    messages.push(`number does not match the intermediate value[${begin},${end}]`);
  }
  return {correct, messages};
}

// строка, одно из предустановленных значений: 'none', 'chrome', 'sepia', 'marvin', 'phobos', 'heat'
function checkEffect(string) {
  let correct = true;
  let messages = [];
  if (typeof string !== `string`) {
    correct = false;
    messages.push(`Value must be a string`);
    return {correct, messages};
  }
  const checkArray = [`none`, `chrome`, `sepia`, `marvin`, `phobos`, `heat`];
  if (!checkArray.some((e) => e === string)) {
    correct = false;
    messages.push(`The string does not match the specified values.`);
  }
  return {correct, messages};
}

function checkHashtags(string) {
  let correct = true;
  let messages = [];
  if (typeof string !== `string`) {
    correct = false;
    messages.push(`Value must be a string`);
    return {correct, messages};
  }
  const array = string.split(` `);
  if (array.length > 5) {
    correct = false;
    messages.push(`number of elements more than 5`);
  }
  if (array.some((e) => e[0] !== `#`)) {
    correct = false;
    messages.push(`Not all lines begin with #`);
  }
  if (array.some((e) => e.indexOf(` `) !== -1)) {
    correct = false;
    messages.push(`Lines must not contain spaces`);
  }
  if (array.some((e) => e.length > 20)) {
    correct = false;
    messages.push(`Word length is over 20 characters`);
  }

  // P.S.: Долго мучался как это написать в одну строчку, в итоге сдался..
  // P.S.: Есть идеи?
  for (let i = 0; i < array.length; i++) {
    for (let j = i + 1; j < array.length; j++) {
      if (array[i] === array[j]) {
        correct = false;
        messages.push(`strings are repeating:${array[i]}[${i}] и ${array[j]}[${j}]`);
        break;
      }
    }
  }
  return {correct, messages};
}

// ------------------- ВСПОМОГАТЕЛЬНЫЕ ФУНКЦИИ

function isValidFilename(string) {
  const regex = new RegExp(/^[\w,\s-]+\.[A-Za-z]{3}$/gm);
  return regex.test(string);
}
