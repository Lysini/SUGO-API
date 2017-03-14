'use strict';

const Joi = require('joi');
const ClassUserModel = require('../models/ClassUser');
const ClassModel = require('../models/Class');
const mongoose = require('mongoose');

exports.getAll = {
	cors: {
		origin: ['*']
	},
	tags: ['api'],
	description: 'Get All User data',
	notes: 'Get All User data',
    handler: function (request, reply) {
        ClassModel.find({}, function (error, data) {
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
        }).populate('classes');
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
			user_id: Joi.string().required(),
			class_name: Joi.string(),
			calendar: Joi.array().items(Joi.object().keys({
				title: Joi.string(),
				start: Joi.date(),
				end: Joi.date(),
				desc: Joi.string(),
				
			})),
			collections: Joi.array().items(Joi.object().keys({
				collection_aim: Joi.string(),
				collection_value: Joi.number(),
				
			})),
			information: Joi.array().items(Joi.object().keys({
				information_title: Joi.string(),
				information: Joi.string(),
				
			})),
		}
	},
	handler: function (request, reply) {
		var Class = new ClassModel(request.payload);
		Class.save(function (error) {
			if (error) {
				reply({
					statusCode: 503,
					message: error
				});
			} else {
				ClassUserModel.findOneAndUpdate({_id: request.payload.user_id}, { $push: { classes: Class._id } }, function (error, data) {
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
			id: Joi.string().required(),
			content: Joi.string()
		},
		payload: {
			calendar: Joi.object().keys({
				title: Joi.string(),
				start: Joi.date(),
				end: Joi.date(),
				desc: Joi.string(),
			}),
			collections: Joi.object().keys({
				collection_aim: Joi.string(),
				collection_value: Joi.number(),
			}),
			information: Joi.object().keys({
				information_title: Joi.string(),
				information: Joi.string(),
			}),
		}
	},
	handler: function (request, reply) {
		if(request.params.content === 'collections') { 
			ClassModel.findOneAndUpdate({_id: request.params.id}, { $push: { collections: request.payload.collections } }, function (error, data) {
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
		if(request.params.content === 'information') { 
			ClassModel.findOneAndUpdate({_id: request.params.id}, request.payload, function (error, data) {
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
		if(request.params.content === 'calendar') { 
			ClassModel.findOneAndUpdate({_id: request.params.id}, request.payload, function (error, data) {
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
		ClassModel.findOneAndRemove({_id: request.params.id}, function (error) {
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