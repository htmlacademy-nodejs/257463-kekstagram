'use strict';

function Entity(url, scale, effect, hashtags, description, likes, comments, date) {
  this.url = url;
  this.scale = scale;
  this.effect = effect;
  this.hashtags = hashtags;
  this.description = description;
  this.likes = likes;
  this.comments = comments;
  this.date = date;
}

function generateEntity() {
  let data = new Entity();
  data.url = generateUrl(600);
  data.scale = generateNumber(100);
  data.likes = generateNumber(1000);
  data.description = generateText(140);
  data.date = Math.floor(Math.random() * (Date.now() - 7 * 24 * 3600 * 1000) + 7 * 24 * 3600 * 1000);
  const correctEffects = [`none`, `chrome`, `sepia`, `marvin`, `phobos`, `heat`];
  data.effect = correctEffects[generateNumber(correctEffects.length - 1)];
  data.comments = generateArrayOfStrings(generateNumber(10), 140); // В задании не сказано об ограничении количества комментов, поэтому пускай будет 10 для скорости и наглядности
  data.hashtags = generateHashtags();
  return data;
}

// генерация адресной строки
function generateUrl(size) {
  let url = ``;
  url += Math.round(Math.random()) === 1 ? `https` : `http`;
  url += `://`;
  url += Math.round(Math.random()) === 1 ? `www.` : ``;
  url += generateText(generateNumber(63, 2)).toLowerCase().replace(/[0-9]/g, ``).replace(/\s/g, ``);
  url += `.`;
  url += generateText(generateNumber(5, 2)).toLowerCase().replace(/[0-9]/g, ``).replace(/\s/g, ``);
  url += `/${size}/${size}`;
  console.log(url);
  return url;
}

// генерация Массива строк с заданой длиной массива и макс длиной каждой строки в нем
function generateArrayOfStrings(length, stringMaxLength) {
  let array = [];
  for (let i = 0; i < length; i++) {
    array.push(generateText(generateNumber(stringMaxLength)));
  }
  return array;
}

// Генерация hashtags
function generateHashtags() {
  let hashtags = generateArrayOfStrings(5, 19); // 19 или 20 в зависимости от того, считается # за символ строки или нет
  hashtags = hashtags.map((e) => `#` + e.replace(/\s/g, ``)); // добавляем # и убираем пробелы
  hashtags = hashtags.filter((val, i, arr) => arr.indexOf(val) === i); // убираем одинаковые хештеги
  return hashtags;
}

// генерация произвольной строки с заданной длиной
function generateText(length) {
  let text = [];
  const possibleChars = [` `, `A`, `B`, `C`, `D`, `E`, `F`, `G`, `H`, `I`, `J`, `K`, `L`, `M`, `N`, `O`, `P`, `Q`, `R`, `S`, `T`, `U`, `V`, `W`, `X`, `Y`, `Z`, `a`, `b`, `c`, `d`, `e`, `f`, `g`, `h`, `i`, `j`, `k`, `l`, `m`, `n`, `o`, `p`, `q`, `r`, `s`, `t`, `u`, `v`, `w`, `x`, `y`, `z`, `0`, `1`, `2`, `3`, `4`, `5`, `6`, `7`, `8`, `9`];
  for (let i = 0; i < length; i++) {
    text.push(possibleChars[generateNumber(possibleChars.length - 1)]);
  }
  text = text.join(``);
  return text;
}

// генерация числа, где length макс значение
function generateNumber(max, min) {
  min = min === undefined ? 0 : min;
  return Math.round(Math.random() * (max - min) + min);
}

module.exports.generateEntity = generateEntity;
