'use strict';

const ParamsError = require(`../../error/bad-request-error`);
const parametres = require(`./parametres-config/parametres-config`);

const paramsValidation = (query) => {
  let params = Object.keys(parametres).map((key) => parametres[key]);
  query = Object.keys(query).map((key) => {
    let object = {};
    object.name = key;
    object.value = query[key];
    return object;
  });
  if (query.length !== 0) {
    if (query.length > params.length) {
      throw new ParamsError(`параметров недопустимо много`);
    }
    for (let i = 0; i < query.length; i++) {
      for (let j = 0; j < params.length; j++) {
        if (query[i].name === params[j].NAME) {
          if (params[j].TYPE === `number`) {
            if (/^-?[0-9]+$/.test(query[i].value)) {
              query[i].value = parseInt(query[i].value, 10);
              if (query[i].value > params[i].MAX_VALUE) {
                throw new ParamsError(`Значение параметра ${query[i].name} превышает допустимую норму ${params[i].MAX_VALUE}`);
              }
              if (query[i].value < 0) {
                throw new ParamsError(`Значение параметра не может быть отрицательным`);
              }
            }
          }
          query[i] = `correctParametre`;
          break;
        }
      }
    }
    query = query.filter((e) => e !== `correctParametre`);
    if (query.length > 0) {
      throw new ParamsError(`Неправильно указаны параметры: ${query.map((e) => e.name)}`);
    }
  }
};

module.exports = paramsValidation;
