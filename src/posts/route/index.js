'use strict';

const express = require(`express`);

const corsRoute = require(`./cors`);
const defaultRoute = require(`./default`);
const postRoute = require(`./post`);
const errorRoute = require(`./error`);


const postsRouter = new express.Router();

corsRoute(postsRouter);
defaultRoute(postsRouter);
postRoute(postsRouter);
errorRoute(postsRouter);

module.exports = (postsStore, imageStore) => {
  postsRouter.postsStore = postsStore;
  postsRouter.imageStore = imageStore;
  return postsRouter;
};
