'use strict';
const colors = require(`colors/safe`);
const express = require(`express`);
const app = express();

const data = {
  POSTS: require(`../data/test.json`).data,
  NOT_FOUND_CODE: 404,
  BAD_REQUEST_CODE: 400,
  HOST: `127.0.0.1`,
  DEFAULT_PORT: 3000,
  PORT_MIN_VALUE: 2000,
  PORT_MAX_VALUE: 65535,
  SKIP_DEFAULT: 0,
  LIMIT_DEFAULT: 50
};

const NOT_FOUND_HANDLER = (req, res) => {
  res.status(data.NOT_FOUND_CODE).send(`Page was not found!`);
};

const ERROR_HANDLER = (err, req, res, next) => {
  if (err) {
    console.error(err);
    res.status(err.code || 500).send(err.message);
  }
  next();
};

const asyncUtil = (fn) => (req, res, next) => fn(req, res, next).catch(next);

app.get(`/api/posts`, asyncUtil(async (req, res) => {
  let limit = parseInt(req.query.limit || data.LIMIT_DEFAULT, 10);
  let skip = parseInt(req.query.skip || data.SKIP_DEFAULT, 10);
  if (Object.keys(req.query).length >= 1 && Object.keys(req.query).indexOf(`limit`) === -1 || Object.keys(req.query).indexOf(`skip`) === -1) {
    throw new ParamsError(`Неправильно указаны параметры`);
  }
  const result = data.POSTS.slice(skip, limit + skip);
  res.status(200).send(result);
}));

app.get(`/api/posts/:date`, asyncUtil(async (req, res) => {
  const date = parseInt(req.params.date, 10);
  if (!date) {
    throw new Error(`date не указан`);
  }
  const found = data.POSTS.find((it) => it.date === date);
  if (!found) {
    throw new NotFoundError(`date ${date} не найдена`);
  }
  res.status(200).send(found);
}));

app.use(express.static(`static`));

class NotFoundError extends Error {
  constructor(message) {
    super(message);
    this.code = data.NOT_FOUND_CODE;
  }
}

class ParamsError extends Error {
  constructor(message) {
    super(message);
    this.code = data.BAD_REQUEST_CODE;
  }
}

app.use(ERROR_HANDLER);

app.use(NOT_FOUND_HANDLER);

module.exports.app = app;
module.exports.Command = {
  name: `--server`,
  description: `Start server on your ${colors.blue(`port`)}(default: ${colors.blue(data.DEFAULT_PORT)}`,
  execute(port) {
    if (port === undefined) {
      startServer(data.DEFAULT_PORT);
    } else {
      port = port.trim();
      if (/^[0-9]+$/.test(port)) {
        port = parseInt(port, 10);
        if (port <= data.PORT_MAX_VALUE && port >= data.PORT_MIN_VALUE) {
          startServer(port);
        } else {
          console.error(`Ошибка, число должно быть от ${data.PORT_MIN_VALUE} до ${data.PORT_MAX_VALUE}, сервер запустится на порте ${data.DEFAULT_PORT}`);
          startServer(data.DEFAULT_PORT);
        }
      } else {
        console.error(`Вы ввели некорректное значение, сервер запустится на порте ${data.DEFAULT_PORT}`);
        startServer(data.DEFAULT_PORT);
      }
    }
  }
};

const startServer = (port) => {
  app.listen(port, data.HOST, (err) => {
    if (err) {
      console.error(err);
      return;
    }
    console.log(`server running at http://${data.HOST}:${port}/`);
  });
};
