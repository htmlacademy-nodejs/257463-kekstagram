'use strict';

class NotFoundError extends Error {
  constructor(message) {
    super(message);
    this.code = 404;
  }
}

module.exports = NotFoundError;
