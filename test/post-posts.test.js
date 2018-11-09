'use strict';

const request = require(`supertest`);
const assert = require(`assert`);
const express = require(`express`);
const imagesStoreMock = require(`./mock/images-store-mock`);
const postsStoreMock = require(`./mock/posts-store-mock`);
const postsRoute = require(`../src/posts/route`)(postsStoreMock, imagesStoreMock);

const app = express();

app.use(`/api/posts`, postsRoute);

describe(`POST api/posts`, () => {
  it(`it send good post as json`, async () => {
    const sent = {
      filename: `keks.jpg`,
      scale: 50,
      effect: `chrome`,
      hashtags: `#goodnews #relax`,
      description: `it is a test object`
    };
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
    const sent = {
      filename: `keks.jpg`,
      scale: 50,
      effect: `chrome`,
      hashtags: `#goodnews #relax`,
      description: `it is a test object`
    };
    const response = await request(app).
      post(`/api/posts`).
      field(`filename`, sent.filename).
      field(`scale`, sent.scale).
      field(`effect`, sent.effect).
      field(`hashtags`, sent.hashtags).
      field(`description`, sent.description).
      set(`Accept`, `application/json`).
      set(`Content-Type`, `multipart/form-data`).
      expect(200).
      expect(`Content-Type`, /json/);
    const post = response.body;
    assert(post, sent);
  });

  it(`send wrong post as application/json`, async () => {
    const wrongSent = {
      filename: -999,
      scale: -999,
      effect: -999,
      hashtags: -999,
      description: -999
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

  it(`send wrong post as multipart/form-data`, async () => {
    const wrongSent = {
      filename: -999,
      scale: -999,
      effect: -999,
      hashtags: -999,
      description: -999
    };
    const response = await request(app).
      post(`/api/posts`).
      field(`filename`, wrongSent.filename).
      field(`scale`, wrongSent.scale).
      field(`effect`, wrongSent.effect).
      field(`hashtags`, wrongSent.hashtags).
      field(`description`, wrongSent.description).
      set(`Accept`, `application/json`).
      set(`Content-Type`, `multipart/form-data`).
      expect(400).
      expect(`Content-Type`, /json/);
    const post = response.body;
    assert(post);
  });
});
