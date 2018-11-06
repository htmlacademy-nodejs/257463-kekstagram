'use strict';

const asyncUtil = require(`./async-middleware`);
const parametres = require(`./parametres-config/parametres-config`);
const paramsValidation = require(`./parametres-validation`);
const NotFoundError = require(`../../error/not-found-error`);
const data = require(`../../../data/test.json`).data;
const express = require(`express`);
const jsonParser = express.json();
const multer = require(`multer`);
const upload = multer({storage: multer.memoryStorage()});

module.exports = (postsRouter) => {

  postsRouter.get(``, asyncUtil(async (req, res) => {
    let limit = parseInt(req.query.limit || parametres.LIMIT.DEFAULT_VALUE, 10);
    let skip = parseInt(req.query.skip || parametres.SKIP.DEFAULT_VALUE, 10);
    paramsValidation(req.query);
    const result = data.slice(skip, limit + skip);
    res.status(200).send(result);
  }));

  postsRouter.get(`/:date`, asyncUtil(async (req, res) => {
    const date = parseInt(req.params.date, 10);
    if (!date) {
      throw new Error(`date не указан`);
    }
    const found = data.find((it) => it.date === date);
    if (!found) {
      throw new NotFoundError(`date ${date} не найдена`);
    }
    res.status(200).send(found);
  }));

  postsRouter.post(``, jsonParser, upload.none(), (req, res) => {
    const body = req.body;
    res.send(body);
  });

};
