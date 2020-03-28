require('dotenv').config();

const request = require('supertest');
const app = require('../lib/app');
const connect = require('../lib/utils/connect');
const mongoose = require('mongoose');
const Comment = require('../lib/models/Comment');
const Tweet = require('../lib/models/Tweet');

describe('comment routes', () => {
  beforeAll(() => {
    connect();
  });

  beforeEach(() => {
    return mongoose.connection.dropDatabase();
  });

  afterAll(() => {
    return mongoose.connection.close();
  });

  it('creates a new comment', () => {
    return request(app)
      .post('/api/v1/comments')
      .send({
        tweetId: new mongoose.Types.ObjectId(),
        handle: 'my fake handle',
        text: 'hello!'
      })
      .then(res => {
        expect(res.body).toEqual({
          _id: expect.any(String),
          tweetId: expect.any(String),
          handle: expect.any(String),
          text: expect.any(String),
          __v: 0
        });
      });
  });

 
});
