const { Router } = require('express');
const Tweet = require('../models/Tweet');
const Comment = require('../models/Comment');
const getQuotes = require('../services/getQuotes');

module.exports = Router()
//POST /api/v1/tweets to create a new tweet UPDATE to add in random quote
  .post('/', (req, res, next) => {
    Tweet 
      .create(req.body)
      .then(tweet => res.send(tweet))
      .catch(next);
  }) 

//GET /api/v1/tweets to get all tweets
  .get('/', (req, res, next) => {
    Tweet
      .find()
      .then(tweets => res.send(tweets))
      .catch(next);
  })
        
//GET /api/v1/tweets/:id to get tweet by ID
  .get('/:id', (req, res, next) => {
    Promise.all([
      Tweet 
        .findById(req.params.id),
      Comment
        .find({ tweetId: req.params.id }) 
    ]) 
      .then(([tweet, comments]) => {
        res.send({...tweet.toJSON(), comments });
      })
      .catch(next);  
  })

//PATCH /api/v1/tweets/:id to update a tweet's TEXT only
  .patch('/:id', (req, res, next) => {
    Tweet 
      .findByIdAndUpdate(req.params.id, req.body, { new: true })
      .then(tweet => res.send(tweet))
      .catch(next); 
  })

//DELETE /api/v1/tweets/:id to delete a tweet
  .delete('/:id', (req, res, next) => {
    Tweet
      .findByIdAndDelete(req.params.id)
      .then(tweet => res.send(tweet))
      .catch(next);
  });

