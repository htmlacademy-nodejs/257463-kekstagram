'use strict';

const asyncUtil = require(`./async-middleware`);
const NotFoundError = require(`../../error/not-found-error`);
const BadRequestError = require(`../../error/bad-request-error`);
const logger = require(`../../logger`);

module.exports = (postsRouter) => {
  postsRouter.get(`/:date`, asyncUtil(async (req, res) => {
    const postDate = req.params.date;
    if (!postDate) {
      throw new BadRequestError(`В запросе не указано date`);
    }
    const found = await postsRouter.postsStore.getPost(postDate);
    if (!found) {
      throw new NotFoundError(`date с именем "${postDate}" не найден`);
    }
    res.send(found);
  }));

  postsRouter.get(`/:date/image`, asyncUtil(async (req, res) => {
    const postName = req.params.name;
    if (!postName) {
      throw new BadRequestError(`В запросе не указано имя`);
    }

    const found = await postsRouter.postsStore.getPost(postName);
    if (!found) {
      throw new NotFoundError(`Пост с date "${postName}" не найден`);
    }

    const result = await postsRouter.imageStore.get(found._id);
    if (!result) {
      throw new NotFoundError(`Аватар для пользователя "${postName}" не найден`);
    }

    res.header(`Content-Type`, `image/jpg`);
    res.header(`Content-Length`, result.info.length);

    res.on(`error`, (e) => logger.error(e));
    res.on(`end`, () => res.end());

    const stream = result.stream;

    stream.on(`error`, (e) => logger.error(e));
    stream.on(`end`, () => res.end());

    stream.pipe(res);
  }));
};
