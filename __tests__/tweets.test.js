require('dotenv').config();

const request = require('supertest');
const app = require('../lib/app');
const connect = require('../lib/utils/connect');
const mongoose = require('mongoose');
const Tweet = require('../lib/models/Tweet');
const Comment = require('../lib/models/Comment');


describe('Tweet routes', () => {
  beforeAll(() => {
    connect();
  });

  beforeEach(() => {
    return mongoose.connection.dropDatabase();
  });

  afterAll(() => {
    return mongoose.connection.close();
  });

  it('creates a new tweet', () => {
    return request(app)
      .post('/api/v1/tweets')
      .send({
        handle: 'my handle',
        text: 'quotes by Ron Swanson'
      })
      .then(res => {
        expect(res.body).toEqual({
          _id: expect.any(String),
          handle: expect.any(String),
          text: expect.any(String),
          __v: 0
        });
      });
  });


  it('gets all tweets', async() => {
    const tweets = await Tweet.create([
      { handle: 'my handle',
        text: 'quotes by Ron Swanson' },
      { handle: 'my handle',
        text: 'more quotes by Ron Swanson' },
      { handle: 'my handle',
        text: 'even more quotes by Ron Swanson' },  
    ]);

    return request(app)
      .get('/api/v1/tweets')
      .then(res => {
        tweets.forEach(tweet => {
          expect(res.body).toContainEqual(
            { _id: tweet._id.toString(),
              handle: tweet.handle, 
              text: tweet.text,
              __v: 0
            }); 
        });
      });
  });
 
  it('gets a tweet by id', async() => {
    const tweet = await Tweet.create({
      handle: 'my handle',
      text: 'quotes by Ron Swanson'
    });

    await Comment.create([{
      tweetId: tweet._id,
      handle: 'commentsRfun',
      text: 'I like to comment comment'
    }]);

    return request(app)
      .get(`/api/v1/tweets/${tweet._id}`)
      .then(res => {
        expect(res.body).toEqual({
          _id: expect.any(String),
          handle: 'my handle',
          text: 'quotes by Ron Swanson',
          comments: expect.any(Array),
          __v: 0
        });
      });
  });

  it('updates a tweet', async() => {
    const tweet = await Tweet.create({
      handle: 'my handle',
      text: 'quotes by Ron Swanson'
    });
      
    return request(app)
      .patch(`/api/v1/tweets/${tweet.id}`)
      .send({ text: 'my updated quote by Ron Swanson' })
      .then(res => {
        expect(res.body).toEqual({
          _id: expect.any(String),
          handle: 'my handle',
          text: 'my updated quote by Ron Swanson',
          __v: 0
        });
      });
  });

  it('deletes a tweet', async() => {
    const tweet = await Tweet.create({
      handle: 'my handle',
      text: 'quotes by Ron Swanson'
    });
     
    return request(app)
      .delete(`/api/v1/tweets/${tweet.id}`)
      .then(res => {
        expect(res.body).toEqual({
          _id: expect.any(String),
          handle: 'my handle',
          text: expect.any(String),
          __v: 0
        });
      });
  });
});

