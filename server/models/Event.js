var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var EventSchema = new mongoose.Schema({
  organizer_id: {
    type: String,
  },
  event_name: {
    type: String,
    required: true,
  },
  stuff: {
    stuff_label: {
      type: String,
      required: true,
    },
    stuff_array: [{
      stuff_name: {
        type: String,
        required: true
      },
      stuff_price: {
        type: Number,
        required:true
      },
      stuff_amount: {
        type: Number,
        required:true
      }
    }],
  },
  people: {
    people_men: [{
      men_name: {
        type: String,
        required: true
      },
      men_note: {
        type: String,
        required:true
      },
    }],
    people_women: [{
      women_name: {
        type: String,
        required: true
      },
      women_note: {
        type: String,
        required:true
      },
    }],
    people_number:{
      type: Number,
      required: true
    }
  },
  place: {
    place_name: {
      type: String,
      required: true,
    },
    place_location: {
      type: String,
      required: true,
    },
    place_price: {
      type: Number,
      required: true,
    },
    place_max_people: {
      type: Number,
      required: true,
    },
    place_note: {
      type: String,
      required: true,
    },
  },
  special_info: {
    type: String,
    required: true
  }
});

module.exports = mongoose.model('Event', EventSchema, 'Event');