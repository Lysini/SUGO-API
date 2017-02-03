var mongoose = require('mongoose');
var Schema = mongoose.Schema;

// Create the MovieSchema.
var EventSchema = new mongoose.Schema({
  login: {
    type: String,
    required: true,
    match: /^(?=.{4,20}$)[A-Za-z0-9]+(?:[ _-][A-Za-z0-9]+)*$/,
    unique: true
  },
  password: {
    type: String,
    match: /^(?=.{4,20}$)[A-Za-z0-9]+(?:[ _-][A-Za-z0-9]+)*$/,
    required: true
  },
  email: {
    type: String,
    required: true,
    lowercase: true
  },
  avatar: {
  	type: String
  }

});

module.exports = mongoose.model('Event', EventSchema, 'Event');