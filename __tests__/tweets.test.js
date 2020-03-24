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

  //GET all tweets
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
 
  //GET tweet by ID
  it('gets a tweet by id', () => {
    return Tweet.create({
      handle: 'my handle',
      text: 'quotes by Ron Swanson'
    })
      .then(tweet => {
        return request(app)
          .get(`/api/v1/tweets/${tweet.id}`);
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

  //PATCH - update a tweet's TEXT only
  it('updates a tweet', () => {
    return Tweet.create({
      handle: 'my handle',
      text: 'quotes by Ron Swanson'
    })
      .then(tweet => {
        return request(app)
          .patch(`/api/v1/tweets/${tweet.id}`)
          .send({ text: 'my updated quote by Ron Swanson' });
      })
      .then(res => {
        expect(res.body).toEqual({
          _id: expect.any(String),
          handle: 'my handle',
          text: 'my updated quote by Ron Swanson',
          __v: 0
        });
      });
  });

});





//DELETE /api/v1/tweets/:id to delete a tweet
