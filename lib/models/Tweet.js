const mongoose = require('mongoose');
const getQuotes = require('../services/getQuotes');

const tweetSchema = new mongoose.Schema({
  handle: {
    type: String,
    required: true
  },
  text: {
    type: String,
    required: true
  }
}, {
  toJSON: {
    virtuals: true, 
    transform: (doc, ret) => {
      delete ret.id;
    }
  }
});

tweetSchema.pre('save', function(next) {
  if(this.text) return next();
  getQuotes()
    .then(randomQuote => this.text = randomQuote)
    .then(() => next());
});

tweetSchema.virtual('comments', {
  ref: 'Comment',
  localField: '_id',
  foreignField: 'tweetId'
});

module.exports = mongoose.model('Tweet', tweetSchema);
