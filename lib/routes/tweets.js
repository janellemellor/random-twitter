const { Router } = require('express');
const Tweet = require('../models/Tweet');

module.exports = Router()
//POST /api/v1/tweets to create a new tweet
  .post('/', (req, res, next) => {
    Tweet 
      .create(req.body)
      .then(tweet => {
        res.send(tweet);
      })
      .catch(next);

        
  });

//GET /api/v1/tweets to get all tweets

//GET /api/v1/tweets/:id to get tweet by ID

//PATCH /api/v1/tweets/:id to update a tweet's TEXT only

//DELETE /api/v1/tweets/:id to delete a tweet
