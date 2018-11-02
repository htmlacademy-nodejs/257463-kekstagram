'use strict';

const express = require(`express`);

const corsRoute = require(`./cors`);
// const defaultRoute = require(`./default`);
const errorRoute = require(`./error`);
const postRoute = require(`./post`);

const postsRouter = new express.Router();

corsRoute(postsRouter);
// defaultRoute(postsRouter);
postRoute(postsRouter);
errorRoute(postsRouter);

module.exports = postsRouter;
