var mongoose = require('mongoose');
var Schema = mongoose.Schema;

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
      }
    }],
  }],
  people: {
    peopleMen: [{
      peopleName: {
        type: String
      },
      peopleNote: {
        type: String
      },
    }],
    peopleWomen: [{
      peopleName: {
        type: String
      },
      peopleNote: {
        type: String
      },
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