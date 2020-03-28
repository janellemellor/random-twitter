const { Router } = require('express');
const Comment = require('../models/Comment');

module.exports = Router()
  .post('/', (req, res, next) => {
    Comment
      .create(req.body)
      .then(comment => res.send(comment))
      .catch(next);
  })

  .get('/:id', (req, res, next) => {
    Comment
      .findById(req.params.id)
      .populate('tweetId')
      .then(comment => res.send(comment))
      .catch(next);  
  });



// GET /api/v1/comments/:id get a comment by id and populate tweet
// PATCH /api/v1/comments/:id update a comment
// DELETE /api/v1/comments/:id delete a comment
