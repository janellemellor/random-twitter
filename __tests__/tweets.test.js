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

});





//POST /api/v1/tweets to create a new tweet

//GET /api/v1/tweets to get all tweets

//GET /api/v1/tweets/:id to get tweet by ID

//PATCH /api/v1/tweets/:id to update a tweet's TEXT only

//DELETE /api/v1/tweets/:id to delete a tweet