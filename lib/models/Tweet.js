const mongoose = require('mongoose');
const getQuotes = require('../services/getQuotes');

const tweetSchema = new mongoose.Schema({
  handle: {
    type: String,
    required: true
  },
  text: {
    type: String,
    //is required needed to be true?
    required: false
  }
});

tweetSchema.pre('save', function(next) {
  if(this.text) return next();
  getQuotes()
    .then(randomQuote => this.text = randomQuote)
    .then(() => next());
});

module.exports = mongoose.model('Tweet', tweetSchema);
