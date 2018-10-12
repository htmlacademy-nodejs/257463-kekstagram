'use strict';

const assert = require(`assert`);
const data = require(`../src/generateData.js`).generateEntity();

describe(`GenerateData`, () => {
  describe(`#url`, () => {
    it(`адрес изображения 600x600, например https://picsum.photos/600/?random`, () => {
      checkUrl(data.url);
    });
  });
  describe(`#scale`, () => {
    it(`число, в пределах от 0 до 100`, () => {
      checkNumberInInterval(data.scale, 0, 100);
    });
  });
  describe(`#effect`, () => {
    it(`строка, одно из предустановленных значений: 'none', 'chrome', 'sepia', 'marvin', 'phobos', 'heat'`, () => {
      checkEffect(data.effect);
    });
  });
  describe(`#hashtags`, () => {
    it(`массив строк — не более 5 элементов, каждая строка начинается с символа '#', должно содержать одно слово без пробелов, слова не должны повторяться (регистр не учитывается), длина одного слова не превышает 20 символов`, () => {
      checkHashtags(data.hashtags);
    });
  });
  describe(`#description`, () => {
    it(`строка — не более 140 символов, содержит произвольный текст`, () => {
      checkString(data.description, 140);
    });
  });
  describe(`#likes`, () => {
    it(`число, в пределах от 0 до 1000`, () => {
      checkNumberInInterval(data.likes, 0, 1000);
    });
  });
  describe(`#comments`, () => {
    it(`массив произвольных строк, каждая строка не должна превышать 140 символов`, () => {
      checkComments(data.comments);
    });
  });
  describe(`#date`, () => {
    it(`число, дата размещения, представляет собой timestamp в формате UNIX. Представляет собой случайное число в интервале от сейчас минус 7 дней`, () => {
      checkDate(data.date);
    });
  });
});

// адрес(строка) изображения 600x600, например https://picsum.photos/600/?random
// P.S.: Не уверен что написал правильно эту функцию...
function checkUrl(string) {
  let correct = true;
  let messages = [``];

  if (typeof string !== `string`) {
    correct = false;
    messages.push(`Это не строка`);
    sendAssert(correct, messages);
  }
  if (!isValidURL(string)) {
    correct = false;
    messages.push(`Некорректный адрес`);
  }
  if (string.indexOf(`600/600`) === -1 && string.indexOf(`600/?random`) === -1) {
    correct = false;
    messages.push(`Некорректный размер изображения`);
  }
  sendAssert(correct, messages);
}

// число, дата размещения, представляет собой timestamp в формате UNIX. Представляет собой случайное число в интервале от сейчас минус 7 дней
function checkDate(date) {
  let correct = true;
  let messages = [``];
  if (typeof date !== `number`) {
    correct = false;
    messages.push(`Это не число`);
    sendAssert(correct, messages);
  }
  if (date > new Date().getTime() || date < new Date().getTime() - new Date().getDay() * 7) {
    correct = false;
    messages.push(`число не в допустимом интервале`);
  }
  sendAssert(correct, messages);
}

// массив произвольных строк, каждая строка не должна превышать 140 символов
function checkComments(array) {
  let correct = true;
  let messages = [``];
  if (!isArrayOfStrings(array)) {
    correct = false;
    messages.push(`Это не массив строк`);
    sendAssert(correct, messages);
  }
  if (array.some((e) => e.length > 140)) {
    correct = false;
    messages.push(`Длина строк превышает допустимую норму`);
  }
  sendAssert(correct, messages);
}

// строка, не более length символов
function checkString(string, length) {
  let correct = true;
  let messages = [``];

  if (typeof string !== `string`) {
    correct = false;
    messages.push(`Это не строка`);
    sendAssert(correct, messages);
  }

  if (string.length > length) {
    correct = false;
    messages.push(`Строка имеет более${length}символов`);
  }

  sendAssert(correct, messages);
}

// число, в пределах от begin до end
function checkNumberInInterval(number, begin, end) {
  let correct = true;
  let messages = [``];

  if (typeof number !== `number`) {
    correct = false;
    messages.push(`Это не число`);
    sendAssert(correct, messages);
  }

  if (number < begin || number > end) {
    correct = false;
    messages.push(`Число не соответствует промежуточным значениям[${begin},${end}]`);
  }

  sendAssert(correct, messages);
}

// строка, одно из предустановленных значений: 'none', 'chrome', 'sepia', 'marvin', 'phobos', 'heat'
function checkEffect(string) {
  let correct = true;
  let messages = [``];

  if (typeof string !== `string`) {
    correct = false;
    messages.push(`Это не строка`);
    sendAssert(correct, messages);
  }

  const checkArray = [`none`, `chrome`, `sepia`, `marvin`, `phobos`, `heat`];
  if (!checkArray.some((e) => e === string)) {
    correct = false;
    messages.push(`Строка не соответствует предусмотренным значениям`);
  }

  sendAssert(correct, messages);
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
    sendAssert(correct, messages);
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

  sendAssert(correct, messages);
}

// ------------------- ВСПОМОГАТЕЛЬНЫЕ ФУНКЦИИ

// отформатированная отправка assert
function sendAssert(correct, messages) {
  messages = messages.join(`\n        `);
  assert(correct, messages);
}

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
  const res = string.match(/(http(s)?:\/\/.)?(www\.)?[-a-zA-Z0-9@:%._\+~#=]{2,256}\.[a-z]{2,6}\b([-a-zA-Z0-9@:%_\+.~#?&//=]*)/g);
  if (res === null) {
    return false;
  } else {
    return true;
  }
}
