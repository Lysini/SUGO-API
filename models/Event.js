var mongoose = require('mongoose');
var Schema = mongoose.Schema;

// Create the MovieSchema.
var EventSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true
  },
  surname: {
    type: String
  },

});

module.exports = mongoose.model('Event', EventSchema, 'Event');