var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var OrganizeSchema = new mongoose.Schema({
  user_id: {
    type: String,
  },
  class_name: {
    type: String
  },
  calendar: [{
  	date_from: { 
  		type: Date
  	},
  	date_to: { 
  		type: Date
  	},
    name: {
      type: String
    },
    note: { 
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
  infromation: [{
    infromation_title: {
      type: String
    },
    infromation: {
      type: String
    },
  }],
});

module.exports = mongoose.model('Organize', OrganizeSchema, 'Organize');