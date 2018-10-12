'use strict';

function Entity(url, scale, effect, hashtags, description, likes, comments, date) {
  this.url = url;
  this.scale = scale;
  this.effect = effect;
  this.hashtags = hashtags;
  this.description = description;
  this.likes = likes;
  this.comments = comments;
  this.date = date;
}

function generateEntity() {
  const data = new Entity(
      `https://picsum.photos/600/?random`,
      56,
      `none`,
      [`#hashtag`],
      `description`,
      999,
      [`comment`],
      new Date().getTime()
  );
  return data;
}

module.exports.generateEntity = generateEntity;
