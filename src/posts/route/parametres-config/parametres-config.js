'use strict';

const parametres = {
  LIMIT: {
    DEFAULT_VALUE: 50,
    TYPE: `number`,
    NAME: `limit`,
    MAX_VALUE: 999
  },
  SKIP: {
    DEFAULT_VALUE: 0,
    TYPE: `number`,
    NAME: `skip`,
    MAX_VALUE: 999
  }
};

module.exports = parametres;
