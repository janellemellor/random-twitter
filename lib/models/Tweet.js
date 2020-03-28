const mongoose = require('mongoose');
const getQuotes = require('../services/getQuotes');

const tweetSchema = new mongoose.Schema({
  handle: {
    type: String,
    required: true
  },
  text: {
    type: String,
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
