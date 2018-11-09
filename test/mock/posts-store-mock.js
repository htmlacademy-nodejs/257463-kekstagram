'use strict';

const Cursor = require(`./cursor-mock`);
const generateData = require(`../../src/generate-data/generate-data`).generateEntity;

class PostStoreMock {
  constructor(data) {
    this.data = data;
  }

  async getPost(date) {
    date = parseInt(date, 10);
    return this.data.filter((it) => it.date === date)[0];
  }

  async getAllPosts() {
    return new Cursor(this.data);
  }

  async save() {
    return {
      insertedId: 42
    };
  }

}

module.exports = new PostStoreMock([generateData()]);
