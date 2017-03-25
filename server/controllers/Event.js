'use strict';

const Joi = require('joi');
const UserModel = require('../models/User');
const EventModel = require('../models/Event');
const mongoose = require('mongoose');

exports.getAll = {
	cors: {
		origin: ['*']
	},
	tags: ['api'],
	description: 'Get all events',
	notes: 'Get all events',
    handler: function (request, reply) {
        EventModel.find({}, function (error, data) {
            if (error) {
                reply({
                    statusCode: 503,
                    message: 'Failed to get data',
                    data: error
                });
            } else {
                reply({
                    statusCode: 200,
                    message: 'Events Successfully Fetched',
                    data: data
                });
            }
        }).populate('events');
    }
};

exports.getOne = {
 cors: {
  origin: ['*']
 },
 tags: ['api'],
 description: 'Get specific event',
 notes: 'Get specific event',
 validate: {
            params: {
             id: Joi.string().required()
            }
        },
    handler: function (request, reply) {
        EventModel.findOne({_id: request.params.id}, function (error, data) {
            if (error) {
                reply({
                    statusCode: 503,
                    message: 'Failed to get data',
                    data: error
                });
            } else {
                if (data.length === 0) {
                    reply({
                        statusCode: 200,
                        message: 'Event Not Found',
                        data: data
                    });
                } else {
                    reply({
                        statusCode: 200,
                        message: 'Event Data Successfully Fetched',
                        data: data
                    });
                }
            }
        });
    }
};

exports.save = {
	cors: {
		origin: ['*']
	},
	tags: ['api'],
	description: 'Save event',
	notes: 'Save event and push its id into User events array',
	validate: {
		payload: {
			organizer_id: Joi.string().required(),
			event_name: Joi.string(),
			stuff: Joi.array().items(Joi.object().keys({
				labelName: Joi.string(),
				stuffArray: Joi.array().items(Joi.object().keys({
					stuffName: Joi.string(),
					stuffPrice: Joi.number(),
					stuffAmount: Joi.number()
				}))
			})),
			people: Joi.object({
				peopleMen: Joi.array().items(Joi.object({
					peopleName: Joi.string(),
					peopleNote: Joi.string()
				})
				),
				peopleWomen: Joi.array().items(Joi.object({
					peopleName: Joi.string(),
					peopleNote: Joi.string()
				})
				)
			}),
			place: Joi.object({
				placeName: Joi.string(),
				placeLocation: Joi.string(),
				placePrice: Joi.number(),
				placeMax: Joi.number(),
				placeNote: Joi.string()
			}),
			special_info: Joi.string()
		}
	},
	handler: function (request, reply) {
		var Event = new EventModel(request.payload);
		Event.save(function (error) {
			if (error) {
				reply({
					statusCode: 503,
					message: error
				});
			} else {
				UserModel.findOneAndUpdate({_id: request.payload.organizer_id}, { $push: { events: Event._id } }, function (error, data) {
					if (error) {
						reply({
							statusCode: 503,
							message: 'Failed to get data',
							data: error
						});
					} else {
						reply({
							statusCode: 200,
							message: 'User events array Updated Successfully',
							data: data
						});
					}
				});
			}
		})
	}
};

exports.update = {
	cors: {
		origin: ['*']
	},
	tags: ['api'],
	description: 'Update specific Event data',
	notes: 'Update specific Event data',
	validate: {
		params: {
			id: Joi.string().required()
		},
		payload: {
			organizer_id: Joi.string().required(),
			event_name: Joi.string().required(),
			stuff: Joi.object({
				stuff_label: Joi.string().required(),
				stuff_array: Joi.array().items(Joi.object({
					stuff_name: Joi.string(),
					stuff_price: Joi.number(),
					stuff_amount: Joi.number()
				})
				)
			}),
			people: Joi.object({
				people_men: Joi.array().items(Joi.object({
					men_name: Joi.string(),
					men_note: Joi.string()
				})
				),
				people_women: Joi.array().items(Joi.object({
					women_name: Joi.string(),
					women_note: Joi.string()
				})
				),
				people_number: Joi.number().required()
			}),
			place: Joi.object({
				place_name: Joi.string().required(),
				place_location: Joi.string().required(),
				place_price: Joi.number().required(),
				place_max_people: Joi.number().required(),
				place_note: Joi.string().required()
			}),
			special_info: Joi.string().required()
		}
	},
	handler: function (request, reply) {
		EventModel.findOneAndUpdate({_id: request.params.id}, request.payload, function (error, data) {
			if (error) {
				reply({
					statusCode: 503,
					message: 'Failed to get data',
					data: error
				});
			} else {
				reply({
					statusCode: 200,
					message: 'Event Updated Successfully',
					data: data
				});
			}
		});

	}
};

exports.delete = {
	cors: {
		origin: ['*']
	},
	tags: ['api'],
	description: 'Remove specific Event data',
	notes: 'Remove specific Event data',
	validate: {
		params: {
			id: Joi.string().required()
		}
	},
	handler: function (request, reply) {
		EventModel.findOneAndRemove({_id: request.params.id}, function (error) {
			if (error) {
				reply({
					statusCode: 503,
					message: 'Error in removing Event',
					data: error
				});
			} else {
				reply({
					statusCode: 200,
					message: 'Event Deleted Successfully'
				});
			}
		});
	}
};