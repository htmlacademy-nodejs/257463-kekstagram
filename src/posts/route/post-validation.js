'use strict';

// const BadRequestError = require(`../../error/bad-request-error`);

const postValidation = (query) => {
  let messages = [];

  if (!checkUrl(query.url).correct) {
    messages.push({url: checkUrl(query.url).messages});
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
  if (!checkNumberInInterval(query.likes, 0, 1000).correct) {
    messages.push({likes: checkNumberInInterval(query.likes, 0, 1000).messages});
  }
  if (!checkComments(query.comments).correct) {
    messages.push({comments: checkComments(query.comments).messages});
  }
  if (!checkDate(query.date).correct) {
    messages.push({date: checkDate(query.date).messages});
  }
  return messages;
};

module.exports = postValidation;

// адрес(строка) изображения 600x600, например https://picsum.photos/600/?random
// P.S.: Не уверен что написал правильно эту функцию...
function checkUrl(string) {
  let correct = true;
  let messages = [``];

  if (typeof string !== `string`) {
    correct = false;
    messages.push(`Это не строка`);
    return {correct, messages};
  }
  if (!isValidURL(string)) {
    correct = false;
    messages.push(`Некорректный адрес`);
  }
  if (string.indexOf(`600/600`) === -1 && string.indexOf(`600/?random`) === -1) {
    correct = false;
    messages.push(`Некорректный размер изображения`);
  }
  return {correct, messages};
}

// число, дата размещения, представляет собой timestamp в формате UNIX. Представляет собой случайное число в интервале от сейчас минус 7 дней
function checkDate(date) {
  let correct = true;
  let messages = [``];
  if (!/^-?[0-9]+$/.test(date)) {
    correct = false;
    messages.push(`Это не число`);
    return {correct, messages};
  }
  if (date > Date.now() || date > Date.now() - 7 * 24 * 3600 * 1000) {
    correct = false;
    messages.push(`число не в допустимом интервале`);
  }
  return {correct, messages};
}

// массив произвольных строк, каждая строка не должна превышать 140 символов
function checkComments(array) {
  let correct = true;
  let messages = [``];
  if (!isArrayOfStrings(array)) {
    correct = false;
    messages.push(`Это не массив строк`);
    return {correct, messages};
  }
  if (array.some((e) => e.length > 140)) {
    correct = false;
    messages.push(`Длина строк превышает допустимую норму`);
  }
  return {correct, messages};
}

// строка, не более length символов
function checkString(string, length) {
  let correct = true;
  let messages = [``];
  if (typeof string !== `string`) {
    correct = false;
    messages.push(`Это не строка`);
    return {correct, messages};
  }
  if (string.length > length) {
    correct = false;
    messages.push(`Строка имеет более${length}символов`);
  }
  return {correct, messages};
}

// число, в пределах от begin до end
function checkNumberInInterval(number, begin, end) {
  let correct = true;
  let messages = [``];
  if (!/^-?[0-9]+$/.test(number)) {
    correct = false;
    messages.push(`Это не число`);
    return {correct, messages};
  }
  number = parseInt(number, 10);
  if (number < begin || number > end) {
    correct = false;
    messages.push(`Число не соответствует промежуточным значениям[${begin},${end}]`);
  }
  return {correct, messages};
}

// строка, одно из предустановленных значений: 'none', 'chrome', 'sepia', 'marvin', 'phobos', 'heat'
function checkEffect(string) {
  let correct = true;
  let messages = [``];
  if (typeof string !== `string`) {
    correct = false;
    messages.push(`Это не строка`);
    return {correct, messages};
  }
  const checkArray = [`none`, `chrome`, `sepia`, `marvin`, `phobos`, `heat`];
  if (!checkArray.some((e) => e === string)) {
    correct = false;
    messages.push(`Строка не соответствует предусмотренным значениям`);
  }
  return {correct, messages};
}

//  массив строк — не более 5 элементов, каждая строка начинается с символа '#',
//  должно содержать одно слово без пробелов, слова не должны повторяться(регистр не учитывается),
//  длина одного слова не превышает 20 символов
function checkHashtags(array) {
  let correct = true;
  let messages = [``];
  if (!isArrayOfStrings(array)) {
    correct = false;
    messages.push(`Это не массив строк`);
    return {correct, messages};
  }
  if (array.length > 5) {
    correct = false;
    messages.push(`Кол-во элементов больше 5`);
  }
  if (array.some((e) => e[0] !== `#`)) {
    correct = false;
    messages.push(`Не все строки начинаются с #`);
  }
  if (array.some((e) => e.indexOf(` `) !== -1)) {
    correct = false;
    messages.push(`Строки содержат пробелы:`);
  }
  if (array.some((e) => e.length > 20)) {
    correct = false;
    messages.push(`Длина слова превышает 20 символов`);
  }

  // P.S.: Долго мучался как это написать в одну строчку, в итоге сдался..
  // P.S.: Есть идеи?
  for (let i = 0; i < array.length; i++) {
    for (let j = i + 1; j < array.length; j++) {
      if (array[i] === array[j]) {
        correct = false;
        messages.push(`Строки повторяются:${array[i]}[${i}] и ${array[j]}[${j}]`);
        break;
      }
    }
  }
  return {correct, messages};
}

// ------------------- ВСПОМОГАТЕЛЬНЫЕ ФУНКЦИИ

// проверка массива строк, является ли этот массив массивом, и состоит ли он из строк :D
function isArrayOfStrings(array) {
  if (!Array.isArray(array)) {
    return false;
  }
  let correct = true;
  array.forEach((val) => {
    if (typeof val !== `string`) {
      correct = false;
    }
  });
  if (correct) {
    return true;
  } else {
    return false;
  }
}

function isValidURL(string) {
  const regex = new RegExp(/^(?:http(s)?:\/\/)?[\w.-]+(?:\.[\w\.-]+)+[\w\-\._~:/?#[\]@!\$&'\(\)\*\+,;=.]+$/gm);
  return regex.test(string);
}
