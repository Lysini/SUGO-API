'use strict';

const Joi = require('joi');
const ClassUserModel = require('../models/ClassUser');
const OrganizeModel = require('../models/Organize');
const mongoose = require('mongoose');

exports.getAll = {
	cors: {
		origin: ['*']
	},
	tags: ['api'],
	description: 'Get All User data',
	notes: 'Get All User data',
    handler: function (request, reply) {
        OrganizeModel.find({}, function (error, data) {
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
				date_from: Joi.date(),
				date_to: Joi.date(),
				name: Joi.string(),
				note: Joi.string(),
				
			})),
			collections: Joi.array().items(Joi.object().keys({
				collection_aim: Joi.string(),
				collection_value: Joi.string(),
				
			})),
			infromation: Joi.array().items(Joi.object().keys({
				infromation_title: Joi.string(),
				infromation: Joi.string(),
				
			})),
		}
	},
	handler: function (request, reply) {
		var Organize = new OrganizeModel(request.payload);
		Organize.save(function (error) {
			if (error) {
				reply({
					statusCode: 503,
					message: error
				});
			} else {
				ClassUserModel.findOneAndUpdate({_id: request.payload.user_id}, { $push: { classes: Organize._id } }, function (error, data) {
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
		OrganizeModel.findOneAndRemove({_id: request.params.id}, function (error) {
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