var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var ClassSchema = new mongoose.Schema({
  user_id: {
    type: String,
  },
  class_name: {
    type: String
  },
  calendar: [{
    title: {
      type: String
    },
  	start: { 
  		type: Date
  	},
  	end: { 
  		type: Date
  	},
    desc: { 
  		type: String
  	},
  }],
  collections: [{
    collection_aim: {
      type: String
    },
    collection_value: {
      type: Number
    },
  }],
  information: [{
    information_title: {
      type: String
    },
    information_message: {
      type: String
    },
  }],
});

module.exports = mongoose.model('Class', ClassSchema, 'Class');