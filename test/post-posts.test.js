'use strict';

const assert = require(`assert`);
const request = require(`supertest`);
const app = require(`../src/server`).app;
const data = require(`../data/test.json`);

describe(`POST api/posts`, () => {
  it(`it send post as json`, async () => {
    const sent = data[0].date;
    const response = await request(app).
      post(`/api/posts`).
      send(sent).
      set(`Accept`, `application/json`).
      set(`Content-Type`, `application/json`).
      expect(200).
      expect(`Content-Type`, /json/);
    const post = response.body;
    assert(post, sent);
  });

  it(`send post as multipart/form-data`, async () => {

    const sent = data[0].date;
    const response = await request(app).
      post(`/api/posts`).
      field(`date`, sent.date).
      set(`Accept`, `application/json`).
      set(`Content-Type`, `multipart/form-data`).
      expect(200).
      expect(`Content-Type`, /json/);
    const post = response.body;
    assert(post.date, sent.date);
  });
});
