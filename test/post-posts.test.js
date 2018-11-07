'use strict';

const assert = require(`assert`);
const request = require(`supertest`);
const app = require(`../src/server`).app;
const data = require(`../data/test.json`);

describe(`POST api/posts`, async () => {
  await it(`it send post as json`, async () => {
    const sent = data.data[0];
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

  await it(`send post as multipart/form-data`, async () => {

    const sent = data.data[0];
    const response = await request(app).
      post(`/api/posts`).
      field(`url`, sent.url).
      field(`scale`, sent.scale).
      field(`effect`, sent.effect).
      field(`hashtags`, sent.hashtags).
      field(`description`, sent.description).
      field(`likes`, sent.likes).
      field(`comments`, sent.comments).
      field(`date`, sent.date).
      set(`Accept`, `application/json`).
      set(`Content-Type`, `multipart/form-data`).
      expect(200).
      expect(`Content-Type`, /json/);
    const post = response.body;
    assert(post, sent);
  });

  await it(`send wrong post as application/json`, async () => {

    let wrongSent = {
      url: -999,
      scale: -999,
      effect: -999,
      hashtags: -999,
      description: -999,
      likes: -999,
      comments: -999,
      date: -999
    };
    const response = await request(app).
      post(`/api/posts`).
      send(wrongSent).
      set(`Accept`, `application/json`).
      set(`Content-Type`, `application/json`).
      expect(400).
      expect(`Content-Type`, /json/);
    const post = response.body;
    assert(post);
  });

  await it(`send wrong post as multipart/form-data`, async () => {

    const wrongSent = {
      url: -999,
      scale: -999,
      effect: -999,
      hashtags: -999,
      description: -999,
      likes: -999,
      comments: -999,
      date: -999
    };
    const response = await request(app).
      post(`/api/posts`).
      field(`url`, wrongSent.url).
      field(`scale`, wrongSent.scale).
      field(`effect`, wrongSent.effect).
      field(`hashtags`, wrongSent.hashtags).
      field(`description`, wrongSent.description).
      field(`likes`, wrongSent.likes).
      field(`comments`, wrongSent.comments).
      field(`date`, wrongSent.date).
      set(`Accept`, `application/json`).
      set(`Content-Type`, `multipart/form-data`).
      expect(400).
      expect(`Content-Type`, /json/);
    const post = response.body;
    assert(post);
  });
});
