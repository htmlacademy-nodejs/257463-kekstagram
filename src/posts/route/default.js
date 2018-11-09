'use strict';

const express = require(`express`);
const multer = require(`multer`);
const asyncUtil = require(`./async-middleware`);
const parametres = require(`./parametres-config/parametres-config`);
const paramsValidation = require(`./parametres-validation`);
const validate = require(`./post-validation`);
const jsonParser = express.json();
const upload = multer({storage: multer.memoryStorage()});

const toPage = async (cursor, skip = parametres.SKIP, limit = parametres.LIMIT) => {
  const packet = await cursor.skip(skip).limit(limit).toArray();
  return {
    data: packet,
    skip,
    limit,
    total: await cursor.count()
  };
};

module.exports = (postsRouter) => {
  postsRouter.get(``, asyncUtil(async (req, res) => {
    const limit = parseInt(req.query.limit || parametres.LIMIT.DEFAULT_VALUE, 10);
    const skip = parseInt(req.query.skip || parametres.SKIP.DEFAULT_VALUE, 10);
    const validResult = paramsValidation(req.query);
    if (validResult.length === 0) {
      res.status(200).send(await toPage(await postsRouter.postsStore.getAllPosts(), skip, limit));
    } else {
      res.status(400).send(validResult);
    }
  }));

  postsRouter.post(``, jsonParser, upload.none(), asyncUtil(async (req, res) => {
    const body = req.body;
    let validated = validate(body);
    if (validated.length === 0) {
      body.hashtags = body.hashtags.split(` `);
      body.date = Date.now();
      await postsRouter.postsStore.save(body);
      res.status(200).send(body);
    } else {
      res.status(400).send(validated);
    }
  }));
};
