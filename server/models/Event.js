var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var peopleMen = new mongoose.Schema({
      peopleName: {
        type: String
      },
      peopleNote: {
        type: String
      },
});

var EventSchema = new mongoose.Schema({
  event_name: {
    type: String
  },
  stuff: [{
    labelName: {
      type: String,
    },
    stuffArray: [{
      stuffAmount: {
        type: Number
      },
      stuffName: {
        type: String
      },
      stuffPrice: {
        type: Number
      },
      _id: false
    }],
      _id: false
  }],
  people: {
    peopleMen: [{
      peopleName: {
        type: String
      },
      peopleNote: {
        type: String
      },
      _id: false
    }],
    peopleWomen: [{
      peopleName: {
        type: String
      },
      peopleNote: {
        type: String
      },
      _id: false
    }]
  },
  place: {
    placeName: {
      type: String,
    },
    placeLocation: {
      type: String,
    },
    placePrice: {
      type: Number,
    },
    placeMax: {
      type: Number,
    },
    placeNote: {
      type: String,
    },
  },
  special_info: {
    type: String
  }
});

module.exports = mongoose.model('Event', EventSchema, 'Event');