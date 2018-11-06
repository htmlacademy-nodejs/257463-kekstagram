'use strict';

const colors = require(`colors/safe`);
const express = require(`express`);
const postsRouter = require(`./posts/route`);

const app = express();

const data = {
  POSTS: require(`../data/test.json`).data,
  HOST: `127.0.0.1`,
  PORT: 3000,
  PORT_MIN_VALUE: 2000,
  PORT_MAX_VALUE: 65535
};

app.use(`/api/posts`, postsRouter);

app.use(express.static(`static`));

app.use((err, req, res, next) => {
  if (err) {
    console.error(err);
    res.status(500).send(`Something broke!`);
  }
  next();
});

app.use((req, res) => {
  res.status(404).send(`Page not Found`);
});

module.exports.app = app; // для теста

module.exports.Command = {
  name: `--server`,
  description: `Start server on your ${colors.blue(`port`)}(default: ${colors.blue(data.PORT)}`,
  execute(port) {
    if (port === undefined) {
      startServer(data.PORT);
    } else {
      port = port.trim();
      if (/^[0-9]+$/.test(port)) {
        port = parseInt(port, 10);
        if (port <= data.PORT_MAX_VALUE && port >= data.PORT_MIN_VALUE) {
          startServer(port);
        } else {
          console.error(`Ошибка, число должно быть от ${data.PORT_MIN_VALUE} до ${data.PORT_MAX_VALUE}, сервер запустится на порте ${data.PORT}`);
          startServer(data.PORT);
        }
      } else {
        console.error(`Вы ввели некорректное значение, сервер запустится на порте ${data.PORT}`);
        startServer(data.PORT);
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

// if (require.main === module) {
// startServer({host: data.DEFAULT_HOST, port: data.DEFAULT_PORT});
// }
