'use strict';
const colors = require(`colors/safe`);
const http = require(`http`);
const server = http.createServer();
const url = require(`url`);
const fs = require(`fs`);
const path = require(`path`);

const mimeType = {
  '.ico': `image/x-icon`,
  '.html': `text/html`,
  '.css': `text/css`,
  '.png': `image/png`,
  '.jpg': `image/jpeg`,
  '.gif': `image/gif`
};

const data = {
  HOST: `127.0.0.1`,
  DEFAULT_PORT: 3000,
  PORT_MIN_VALUE: 2000,
  PORT_MAX_VALUE: 65535
};

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

const handler = (req, res) => {
  const reqUrl = req.url;
  const parsedUrl = url.parse(reqUrl, true);
  let pathname = path.join(`static`, parsedUrl.pathname);
  fs.access(pathname, function (error) {
    if (error) {
      console.error(error);
      return;
    }
    if (fs.statSync(pathname).isDirectory()) {
      pathname += `/index.html`;
    }
    fs.readFile(pathname, function (err, datafile) {
      if (err) {
        res.statusCode = 500;
        res.end(`Error getting the file: ${err}.`);
      } else {
        const ext = path.extname(pathname);
        res.setHeader(`Content-type`, mimeType[ext] || `text/plain`);
        res.end(datafile);
      }
    });
  });
};

const startServer = (port) => {
  server.on(`request`, handler);
  server.listen(port, data.HOST, (err) => {
    if (err) {
      console.error(err);
      return;
    }
    console.log(`server running at http://${data.HOST}:${port}/`);
  });
};
