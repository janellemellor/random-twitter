require('dotenv').config();

const request = require('supertest');
const app = require('../lib/app');
const connect = require('../lib/utils/connect');
const mongoose = require('mongoose');
const Tweet = require('../lib/models/Tweet');


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

  //POST - new tweet
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

  //GET /api/v1/tweets to get all tweets
  it('gets all tweets', () => {
    const tweets = [
      { handle: 'my handle',
        text: 'quotes by Ron Swanson' },
      { handle: 'my handle',
        text: 'more quotes by Ron Swanson' },
      { handle: 'my handle',
        text: 'even more quotes by Ron Swanson' },  
    ];

    return Tweet.create(tweets)
      .then(() => {
        return request(app)
          .get('/api/v1/tweets');
      })
      .then(res => {
        tweets.forEach(tweet => {
          expect(res.body).toContainEqual(
            { _id: expect.any(String),
              ...tweet,
              __v: 0
            }); 
        });
      });
  });
});









//GET /api/v1/tweets/:id to get tweet by ID

//PATCH /api/v1/tweets/:id to update a tweet's TEXT only

//DELETE /api/v1/tweets/:id to delete a tweet
