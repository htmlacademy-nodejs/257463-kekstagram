'use strict';

module.exports = (postsRouter) => {

  const NOT_FOUND_HANDLER = (req, res) => {
    res.status(404).send(`Page was not found!`);
  };

  const ERROR_HANDLER = (err, req, res, next) => {
    if (err) {
      console.error(err);
      res.status(err.code || 500).send(err.message);
    }
    next();
  };

  postsRouter.use(ERROR_HANDLER);
  postsRouter.use(NOT_FOUND_HANDLER);
};
