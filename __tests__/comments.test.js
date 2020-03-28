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

  it('gets a comment by id', async() => {
    const tweet = await Tweet.create({
      handle: 'my handle',
      text: 'quotes by Ron Swanson'
    });

    const comment = await Comment.create({
      tweetId: tweet._id,
      handle: 'commentsRfun',
      text: 'I like to comment comment'
    });

    return request(app)
      .get(`/api/v1/comments/${comment._id}`)
      .then(res => {
        expect(res.body).toEqual({
          _id: expect.any(String),
          tweetId: {
            ...tweet.toJSON(),
            _id: tweet.id 
          },
          handle: 'commentsRfun',
          text: 'I like to comment comment',
          __v: 0
        });
      });
  });


  it('updates a comment by id', async() => {
    const tweet = await Tweet.create({
      handle: 'my handle',
      text: 'quotes by Ron Swanson'
    });

    const comment = await Comment.create({
      tweetId: tweet._id,
      handle: 'commentsRfun',
      text: 'I like to comment comment'
    });

    return request(app)
      .patch(`/api/v1/comments/${comment._id}`)
      .send({ text: 'I do not like to comment anymore' })
      .then(res => {
        expect(res.body).toEqual({
          _id: expect.any(String),
          tweetId: tweet.id,
          handle: 'commentsRfun',
          text: 'I do not like to comment anymore',
          __v: 0
        });
      });
  });



});
