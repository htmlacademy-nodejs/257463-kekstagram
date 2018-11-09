'use strict';

const assert = require(`assert`);
const request = require(`supertest`);
const express = require(`express`);
const postsStoreMock = require(`./mock/posts-store-mock`);
const imagesStoreMock = require(`./mock/images-store-mock`);
const postsRoute = require(`../src/posts/route`)(postsStoreMock, imagesStoreMock);

const app = express();
app.use(`/api/posts`, postsRoute);

const POSTS_LIMIT_DEFAULT = 50;

describe(`GET api/posts`, () => {
  it(`respond with json`, async () => {
    const response = await request(app).
      get(`/api/posts`).
      set(`Accept`, `application/json`).
      expect(200).
      expect(`Content-Type`, /json/);
    const posts = response.body;
    assert(posts.total < POSTS_LIMIT_DEFAULT && posts.total >= 1);
  });
  it(`get all post?skip=2&limit=20`, async () => {
    const response = await request(app).
      get(`/api/posts?skip=2&limit=20`).
      set(`Accept`, `application/json`).
      expect(200).
      expect(`Content-Type`, /json/);
    const posts = response.body;
    assert(posts.total <= 20);
  });
  it(`get bad request ?ski=2&lim=20`, async () => {
    const response = await request(app).
      get(`/api/posts?ski=2&lim=20`).
      set(`Accept`, `application/json`).
      expect(400).
      expect(`Content-Type`, /json/);
    const posts = response.body;
    assert(posts);
  });
  it(`get page not found`, async () => {
    const response = await request(app).
      get(`/api/postsblablabla`).
      expect(404).
      expect(`Content-Type`, `text/html; charset=utf-8`);
    const posts = response.body;
    assert(Object.keys(posts).length === 0);
  });
  it(`get all posts with / at the end`, async () => {
    const response = await request(app).
      get(`/api/posts/`).
      set(`Accept`, `application/json`).
      expect(200).
      expect(`Content-Type`, /json/);
    const posts = response.body;
    assert(posts.total < POSTS_LIMIT_DEFAULT && posts.total >= 1);
  });
});
describe(`GET api/posts/:date`, () => {
  it(`get post with parameter date`, async () => {
    const response = await request(app).
      get(`/api/posts/${postsStoreMock.data[0].date}`).
      set(`Accept`, `application/json`).
      expect(200).
      expect(`Content-Type`, /json/);
    const post = response.body;
    assert(typeof post, `object`);
    assert(post.date === postsStoreMock.data[0].date);
  });
});
