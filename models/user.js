var mongoose = require('mongoose');

var Schema = mongoose.Schema;

// Create the MovieSchema.
var UserSchema = new mongoose.Schema({
  email: {
    type: String,
    required: true,
    unique: true
  },
  password: {
    type: String,
    match: /^[a-zA-Z0-9]{3,30}$/,
    required: true
  },
  name: {
    type: String,
    required: true
  },
  surname: {
    type: String
  },
  avatar: {
  	type: String
  },
  age: {
    type: Number
  },
  events: [{
    type: mongoose.Schema.Types.ObjectId, 
    ref: 'Event'
  }],


});

module.exports = mongoose.model('User', UserSchema, 'User');