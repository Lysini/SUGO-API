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
	description: 'Get All User data',
	notes: 'Get All User data',
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
                    message: 'User Data Successfully Fetched',
                    data: data
                });
            }
        }).populate('events');
    }
};

exports.save = {
	cors: {
		origin: ['*']
	},
	tags: ['api'],
	description: 'Save event data',
	notes: 'Save event data',
	validate: {
		payload: {
			organizer_id: Joi.string().required(),
			event_name: Joi.string().required(),
			stuff: Joi.array(),
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
				people_number: Joi.number()
			}),
			place: Joi.object({
				place_name: Joi.string(),
				place_location: Joi.string(),
				place_price: Joi.number(),
				place_max_people: Joi.number(),
				place_note: Joi.string()
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
							message: 'User Updated Successfully',
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
	description: 'Update specific user data',
	notes: 'Update specific user data',
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
					message: 'User Updated Successfully',
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
	description: 'Remove specific user data',
	notes: 'Remove specific user data',
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
					message: 'Error in removing User',
					data: error
				});
			} else {
				reply({
					statusCode: 200,
					message: 'User Deleted Successfully'
				});
			}
		});
	}
};